from collections import deque

from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from folders.models import Folder
from folders.serializers import FolderSerializer
from storage.models import StoredFile
from storage.serializers import StoredFileSerializer


class FolderViewSet(viewsets.ModelViewSet):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Folder.objects.filter(owner=self.request.user, is_deleted=False)

        if self.action == "list":
            parent = self.request.query_params.get("parent")
            if parent in (None, "", "null", "None"):
                queryset = queryset.filter(parent_folder__isnull=True)
            else:
                queryset = queryset.filter(parent_folder_id=parent)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        self._soft_delete_folder(instance)

    def _soft_delete_folder(self, folder):
        deleted_at = timezone.now()
        queue = deque([(folder, deleted_at)])

        while queue:
            current, dt = queue.popleft()
            current.is_deleted = True
            current.deleted_at = dt
            current.save(update_fields=["is_deleted", "deleted_at"])

            current.stored_files.filter(is_deleted=False).update(is_deleted=True, deleted_at=dt)

            for child in current.subfolders.filter(is_deleted=False):
                queue.append((child, dt))

    @action(detail=True, methods=["get"], url_path="contents")
    def contents(self, request, pk=None):
        folder = self.get_object()
        folders = folder.subfolders.filter(is_deleted=False)
        files = folder.stored_files.filter(is_deleted=False)

        folder_data = FolderSerializer(folders, many=True).data
        file_data = StoredFileSerializer(files, many=True, context={"request": request}).data

        for item in folder_data:
            item["is_folder"] = True
            item["type"] = "folder"
            item["size"] = 0
            item["mime_type"] = ""
            item["is_favorite"] = False

        for item in file_data:
            item["is_folder"] = False
            item["type"] = "file"

        return Response({"folders": folder_data, "files": file_data})

    @action(detail=True, methods=["get"], url_path="breadcrumb")
    def breadcrumb(self, request, pk=None):
        folder = self.get_object()
        breadcrumb = []
        current = folder
        while current:
            breadcrumb.insert(0, current)
            current = current.parent_folder

        serializer = FolderSerializer(breadcrumb, many=True)
        return Response(serializer.data)
