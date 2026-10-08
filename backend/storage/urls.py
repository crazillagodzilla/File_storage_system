from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import StoredFileViewSet, StorageUsageView, TrashViewSet

router = DefaultRouter()
router.register(r"files", StoredFileViewSet, basename="storedfile")
router.register(r"trash", TrashViewSet, basename="trash")

urlpatterns = [
    path("", include(router.urls)),
    path("storage/", StorageUsageView.as_view(), name="storage_usage"),
]
