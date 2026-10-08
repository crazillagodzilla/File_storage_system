from django.conf import settings
from django.db import models


class Folder(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="folders",
    )
    parent_folder = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subfolders",
    )
    name = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "parent_folder", "name"],
                name="unique_folder_name_per_parent",
            )
        ]
        ordering = ["name"]
        indexes = [
            models.Index(fields=["owner", "is_deleted"]),
            models.Index(fields=["owner", "parent_folder"]),
            models.Index(fields=["is_deleted"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.owner})"
