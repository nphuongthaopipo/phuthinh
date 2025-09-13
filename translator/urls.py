from django.urls import path
from .views import TranslationAPIView, download_translated_file, TranslationJobListView, FileUploadAPIView

urlpatterns = [
    path('translate/', TranslationAPIView.as_view(), name='translate_api'),
    path('download/<str:filename>/', download_translated_file, name='download_file'),
    path('jobs/', TranslationJobListView.as_view(), name='translation_job_list'),
    path('upload/', FileUploadAPIView.as_view(), name='file_upload'), # URL mới cho chức năng tải lên file
]