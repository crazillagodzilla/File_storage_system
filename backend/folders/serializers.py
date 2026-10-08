from rest_framework import serializers

from .models import Folder


class FolderSerializer(serializers.ModelSerializer):
    parent = serializers.PrimaryKeyRelatedField(
        source="parent_folder",
        queryset=Folder.objects.all(),
        allow_null=True,
        required=False,
    )
    is_folder = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ["id", "owner", "parent", "name", "is_folder", "created_at", "updated_at"]
        read_only_fields = ["id", "owner", "created_at", "updated_at", "is_folder"]

    def get_is_folder(self, obj):
        return True

    def validate(self, attrs):
        owner = self.context["request"].user
        parent_folder = attrs.get("parent_folder") or None
        name = attrs.get("name")

        if self.instance:
            owner = self.instance.owner
            parent_folder = attrs.get("parent_folder", self.instance.parent_folder)
            name = attrs.get("name", self.instance.name)

        if Folder.objects.filter(owner=owner, parent_folder=parent_folder, name__iexact=name).exclude(pk=getattr(self.instance, "pk", None)).exists():
            raise serializers.ValidationError({"name": "A folder with this name already exists in this location."})

        if parent_folder and parent_folder.owner != owner:
            raise serializers.ValidationError({"parent": "Parent folder must belong to the same user."})

        if parent_folder and parent_folder.is_deleted:
            raise serializers.ValidationError({"parent": "Cannot use a deleted folder as the parent."})

        return attrs

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
