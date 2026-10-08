from collections import deque
from html import escape

from django.db.models import Q, Sum
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from folders.models import Folder
from folders.serializers import FolderSerializer
from .models import StoredFile
from .serializers import StoredFileSerializer, StoredFileShareSerializer


class StoredFileViewSet(viewsets.ModelViewSet):
    queryset = StoredFile.objects.all()
    serializer_class = StoredFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action == "list":
            return StoredFile.objects.filter(owner=self.request.user, is_deleted=False)

        return StoredFile.objects.filter(
            Q(owner=self.request.user) | Q(shared_with=self.request.user),
            is_deleted=False,
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        if instance.owner == self.request.user:
            instance.is_deleted = True
            instance.deleted_at = timezone.now()
            instance.save(update_fields=["is_deleted", "deleted_at"])
        elif self.request.user in instance.shared_with.all():
            instance.shared_with.remove(self.request.user)
        else:
            raise PermissionError("Not permitted to delete this file.")

    @action(detail=False, methods=["post"], url_path="upload")
    def upload(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        query = request.query_params.get("q", "").strip()
        folder_id = request.query_params.get("folder")

        file_queryset = StoredFile.objects.filter(
            Q(owner=request.user) | Q(shared_with=request.user),
            is_deleted=False,
        )
        folder_queryset = Folder.objects.filter(owner=request.user, is_deleted=False)

        if folder_id is not None:
            if folder_id in ("null", "None", ""):
                file_queryset = file_queryset.filter(folder__isnull=True)
                folder_queryset = folder_queryset.filter(parent_folder__isnull=True)
            else:
                file_queryset = file_queryset.filter(folder_id=folder_id)
                folder_queryset = folder_queryset.filter(parent_folder_id=folder_id)

        if query:
            file_queryset = file_queryset.filter(
                Q(original_name__icontains=query) | Q(content_type__icontains=query)
            )
            folder_queryset = folder_queryset.filter(name__icontains=query)

        file_data = StoredFileSerializer(file_queryset, many=True, context={"request": request}).data
        folder_data = FolderSerializer(folder_queryset, many=True).data

        for item in folder_data:
            item["is_folder"] = True
            item["type"] = "folder"
            item["size"] = 0
            item["mime_type"] = ""
            item["is_favorite"] = False

        for item in file_data:
            item["is_folder"] = False
            item["type"] = "file"

        results = list(folder_data) + list(file_data)
        results.sort(key=lambda item: item.get("created_at", ""), reverse=True)
        return Response(results)

    @action(detail=False, methods=["get"], url_path="recent")
    def recent(self, request):
        files = self.get_queryset().filter(owner=request.user).order_by("-updated_at")
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="favorites")
    def favorites(self, request):
        files = self.get_queryset().filter(owner=request.user, is_favorite=True).order_by("-updated_at")
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="shared")
    def shared(self, request):
        files = StoredFile.objects.filter(shared_with=request.user, is_deleted=False).order_by("-updated_at")
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="favorite")
    def favorite(self, request, pk=None):
        stored_file = self.get_object()
        if stored_file.owner != request.user:
            return Response({"detail": "Only the owner can favorite this file."}, status=status.HTTP_403_FORBIDDEN)
        stored_file.is_favorite = True
        stored_file.save(update_fields=["is_favorite"])
        serializer = self.get_serializer(stored_file)
        return Response(serializer.data)

    @action(detail=True, methods=["delete"], url_path="favorite")
    def remove_favorite(self, request, pk=None):
        stored_file = self.get_object()
        if stored_file.owner != request.user:
            return Response({"detail": "Only the owner can remove favorites."}, status=status.HTTP_403_FORBIDDEN)
        stored_file.is_favorite = False
        stored_file.save(update_fields=["is_favorite"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="share")
    def share(self, request, pk=None):
        stored_file = self.get_object()
        if stored_file.owner != request.user:
            return Response({"detail": "Only the owner can share this file."}, status=status.HTTP_403_FORBIDDEN)

        serializer = StoredFileShareSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        target_user = serializer.validated_data["target_email"]
        stored_file.shared_with.add(target_user)
        return Response({"detail": f"Shared with {target_user.email}"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="download")
    def download(self, request, pk=None):
        stored_file = self.get_object()
        safe_name = escape(stored_file.original_name, quote=True)
        response = HttpResponse(stored_file.file.read(), content_type=stored_file.content_type or "application/octet-stream")
        response["Content-Disposition"] = f'attachment; filename="{safe_name}"'
        return response


class StorageUsageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        files = StoredFile.objects.filter(owner=request.user, is_deleted=False)
        folders = Folder.objects.filter(owner=request.user, is_deleted=False)
        used_bytes = files.aggregate(total=Sum("size"))["total"] or 0

        return Response(
            {
                "used_bytes": used_bytes,
                "file_count": files.count(),
                "folder_count": folders.count(),
                "total_bytes": 10 * 1024 * 1024 * 1024,
            }
        )


class TrashViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        deleted_files = StoredFile.objects.filter(owner=request.user, is_deleted=True)
        deleted_folders = Folder.objects.filter(owner=request.user, is_deleted=True)

        items = []

        for folder in deleted_folders:
            items.append(
                {
                    "id": folder.id,
                    "name": folder.name,
                    "is_folder": True,
                    "type": "folder",
                    "deleted_at": folder.deleted_at,
                    "size": 0,
                }
            )

        for stored_file in deleted_files:
            items.append(
                {
                    "id": stored_file.id,
                    "name": stored_file.original_name,
                    "is_folder": False,
                    "type": "file",
                    "deleted_at": stored_file.deleted_at,
                    "size": stored_file.size,
                    "is_favorite": stored_file.is_favorite,
                }
            )

        items.sort(key=lambda item: item.get("deleted_at") or timezone.now(), reverse=True)
        return Response(items)

    def _find_deleted_item(self, request, pk):
        file_item = StoredFile.objects.filter(pk=pk, owner=request.user, is_deleted=True).first()
        if file_item:
            return file_item, "file"

        folder_item = Folder.objects.filter(pk=pk, owner=request.user, is_deleted=True).first()
        if folder_item:
            return folder_item, "folder"

        return None, None

    @action(detail=True, methods=["post"], url_path="restore")
    def restore(self, request, pk=None):
        item, kind = self._find_deleted_item(request, pk)
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if kind == "file":
            item.is_deleted = False
            item.deleted_at = None
            item.save(update_fields=["is_deleted", "deleted_at"])
        else:
            self._restore_folder(item)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def _restore_folder(self, folder):
        base_name = folder.name
        name = base_name
        suffix = 1
        while Folder.objects.filter(
            owner=folder.owner,
            parent_folder=folder.parent_folder,
            name=name,
            is_deleted=False,
        ).exclude(pk=folder.pk).exists():
            name = f"{base_name} ({suffix})"
            suffix += 1
        folder.name = name

        folder.is_deleted = False
        folder.deleted_at = None
        folder.save(update_fields=["is_deleted", "deleted_at", "name"])

        for stored_file in folder.stored_files.filter(is_deleted=True):
            stored_file.is_deleted = False
            stored_file.deleted_at = None
            stored_file.save(update_fields=["is_deleted", "deleted_at"])

        for child in folder.subfolders.filter(is_deleted=True):
            self._restore_folder(child)

    @action(detail=True, methods=["delete"], url_path="permanent")
    def permanent(self, request, pk=None):
        item, kind = self._find_deleted_item(request, pk)
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if kind == "file":
            item.file.delete(save=False)
            item.delete()
        else:
            self._permanent_delete_folder(item)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def _permanent_delete_folder(self, folder):
        queue = deque([folder])

        while queue:
            current = queue.popleft()

            for stored_file in current.stored_files.all():
                stored_file.file.delete(save=False)
                stored_file.delete()

            for child in current.subfolders.all():
                queue.append(child)

            current.delete()

    @action(detail=False, methods=["post"], url_path="empty")
    def empty(self, request):
        StoredFile.objects.filter(owner=request.user, is_deleted=True).delete()

        deleted_folders = Folder.objects.filter(
            owner=request.user, is_deleted=True, parent_folder__isnull=True
        )
        for folder in deleted_folders:
            self._permanent_delete_folder(folder)

        return Response(status=status.HTTP_204_NO_CONTENT)
