# translator/admin.py

from django.contrib import admin
from .models import TranslationJob

@admin.register(TranslationJob)
class TranslationJobAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'status') # Removed the 'created_at' and 'updated_at' fields
    list_filter = ('status',)
    search_fields = ('original_filename',)