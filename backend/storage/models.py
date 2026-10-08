import os

from django.conf import settings
from django.db import models


def user_upload_path(instance, filename):
    safe_name = filename.replace("/", "_").replace("\\", "_").replace("\0", "_")
    return f"uploads/{instance.owner_id}/{safe_name}"


class StoredFile(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="stored_files",
    )
    folder = models.ForeignKey(
        "folders.Folder",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="stored_files",
    )
    file = models.FileField(upload_to=user_upload_path)
    original_name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=255, blank=True)
    size = models.PositiveBigIntegerField()
    is_favorite = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    shared_with = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name="shared_files",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "is_deleted"]),
            models.Index(fields=["owner", "is_favorite"]),
            models.Index(fields=["is_deleted"]),
        ]

    def __str__(self):
        return f"{self.original_name} ({self.owner})"
