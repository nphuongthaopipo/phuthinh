from django.db import models
from django.conf import settings

class TranslationJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    original_filename = models.CharField(max_length=255)
    translated_filename = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, default='Hoàn thành')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    translated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.original_filename} - {self.status}"