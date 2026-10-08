from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import StoredFile
from folders.models import Folder

User = get_user_model()


class StoredFileSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True, required=False)
    name = serializers.CharField(source="original_name", required=False)
    mime_type = serializers.CharField(source="content_type", read_only=True)
    is_folder = serializers.SerializerMethodField()
    folder = serializers.PrimaryKeyRelatedField(
        queryset=Folder.objects.none(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = StoredFile
        fields = [
            "id",
            "owner",
            "folder",
            "file",
            "name",
            "mime_type",
            "size",
            "is_favorite",
            "created_at",
            "updated_at",
            "is_folder",
        ]
        read_only_fields = [
            "id",
            "owner",
            "size",
            "created_at",
            "updated_at",
            "mime_type",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["folder"].queryset = Folder.objects.filter(
                owner=request.user, is_deleted=False
            )

    def get_is_folder(self, obj):
        return False

    def validate_folder(self, value):
        if value is not None and value.owner != self.context["request"].user:
            raise serializers.ValidationError("Folder must belong to the authenticated user.")
        if value is not None and value.is_deleted:
            raise serializers.ValidationError("Cannot upload to a deleted folder.")
        return value

    def create(self, validated_data):
        file_obj = validated_data.pop("file")
        validated_data["owner"] = self.context["request"].user
        validated_data["original_name"] = file_obj.name
        validated_data["content_type"] = getattr(file_obj, "content_type", "")
        validated_data["size"] = file_obj.size
        stored_file = StoredFile.objects.create(file=file_obj, **validated_data)
        return stored_file


class StoredFileShareSerializer(serializers.Serializer):
    target_email = serializers.EmailField()

    def validate_target_email(self, value):
        user = User.objects.filter(email__iexact=value).first()
        if not user:
            raise serializers.ValidationError("No user found with that email.")
        return user

    def validate(self, attrs):
        target_user = attrs["target_email"]
        if target_user == self.context["request"].user:
            raise serializers.ValidationError("Cannot share a file with yourself.")
        return attrs
