from django.contrib import admin

from .models import Folder


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "parent_folder", "created_at", "updated_at"]
    list_filter = ["owner", "parent_folder"]
    search_fields = ["name", "owner__username"]
    ordering = ["name"]
