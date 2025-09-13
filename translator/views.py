from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.serializers import ModelSerializer
import google.generativeai as genai
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import FileResponse, Http404
from django.core.files.base import ContentFile
import docx
import os
import uuid
import io
import PyPDF2
from PIL import Image
import pytesseract
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from .models import TranslationJob

# Cấu hình đường dẫn tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Đăng ký font Unicode cho tiếng Việt
try:
    pdfmetrics.registerFont(TTFont('DejaVuSans', os.path.join(settings.BASE_DIR, 'fonts', 'DejaVuSans.ttf')))
except Exception as e:
    print(f"Không thể đăng ký font: {e}")

# Cấu hình Gemini API
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
except Exception as e:
    print(f"Lỗi khi cấu hình Gemini: {e}")
    model = None

# Hàm trợ giúp để trích xuất văn bản từ nhiều loại file
def extract_text_from_file_object(file_obj, filename):
    extension = os.path.splitext(filename)[1].lower()
    if extension == '.txt':
        return file_obj.read().decode('utf-8')
    elif extension == '.docx':
        doc = docx.Document(file_obj)
        full_text = [para.text for para in doc.paragraphs]
        return '\n'.join(full_text)
    elif extension == '.pdf':
        reader = PyPDF2.PdfReader(file_obj)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        return text
    elif extension in ['.jpg', '.jpeg', '.png']:
        img = Image.open(file_obj)
        text = pytesseract.image_to_string(img, lang='vie+eng')
        return text
    else:
        return ""

# Hàm trợ giúp để tạo file PDF
def create_pdf_from_text(text):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setFont('DejaVuSans', 12)
    lines = text.split('\n')
    y_position = 750
    for line in lines:
        if y_position < 50:
            c.showPage()
            c.setFont('DejaVuSans', 12)
            y_position = 750
        c.drawString(50, y_position, line)
        y_position -= 15
    c.save()
    buffer.seek(0)
    return buffer

class TranslationAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('files')
        source_lang = request.data.get('source_language', 'vi')
        target_lang = request.data.get('target_language', 'en')
        style = request.data.get('style', 'general')
        domain = request.data.get('domain', 'general')

        if not model:
            return Response({"error": "Không thể kết nối đến Gemini API."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        if not files:
            return Response({"error": "Không có file nào được tải lên."}, status=status.HTTP_400_BAD_REQUEST)

        results = []
        for file_obj in files:
            try:
                input_text = extract_text_from_file_object(file_obj, file_obj.name)
                
                job = TranslationJob.objects.create(
                    user=request.user,
                    original_filename=file_obj.name,
                    status='Mới tạo',
                    source_language=source_lang,
                    target_language=target_lang,
                    style=style,
                    domain=domain
                )

                prompt = (f"Dịch văn bản sau từ {source_lang} sang {target_lang} với phong cách {style} và chuyên ngành {domain}. "
                          f"Giữ nguyên định dạng gốc nếu có thể. Văn bản:\n\n{input_text}")
                
                response = model.generate_content(prompt)
                translated_text = response.text

                unique_id = uuid.uuid4().hex
                original_extension = os.path.splitext(file_obj.name)[1].lower()
                
                if original_extension in ['.pdf', '.jpg', '.jpeg', '.png']:
                    translated_filename = f"translated_{unique_id}.pdf"
                    fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'translated'))
                    buffer = create_pdf_from_text(translated_text)
                    fs.save(translated_filename, buffer)
                else:
                    translated_filename = f"translated_{unique_id}{original_extension}"
                    fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'translated'))
                    content_file = ContentFile(translated_text.encode('utf-8'))
                    fs.save(translated_filename, content_file)
                
                job.translated_filename = translated_filename
                job.status = 'Hoàn thành'
                job.save()
                
                results.append({
                    'id': job.id,
                    'status': job.status,
                    'original_filename': job.original_filename,
                    'translated_filename': job.translated_filename,
                })

            except Exception as e:
                print(f"Lỗi khi xử lý hoặc gọi API cho file {file_obj.name}: {e}")
                try:
                    job.status = 'Lỗi'
                    job.error_message = f"Có lỗi xảy ra trong quá trình dịch file này: {e}"
                    job.save()
                    results.append({
                        'id': job.id,
                        'status': job.status,
                        'original_filename': job.original_filename,
                        'translated_filename': None,
                        'error': job.error_message,
                    })
                except Exception as ex:
                    print(f"Lỗi khi lưu trạng thái lỗi: {ex}")
                    results.append({
                        'original_filename': file_obj.name,
                        'status': 'Lỗi',
                        'error': "Không thể lưu trạng thái lỗi."
                    })

        return Response({"results": results}, status=status.HTTP_200_OK)

class FileUploadAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('files')
        if not files:
            return Response({"error": "Không có file nào được tải lên."}, status=status.HTTP_400_BAD_REQUEST)

        results = []
        for file_obj in files:
            try:
                fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'uploads'))
                original_filename = fs.save(file_obj.name, file_obj)

                # Tạo một bản ghi công việc mới với trạng thái "Mới tạo"
                job = TranslationJob.objects.create(
                    user=request.user,
                    original_filename=file_obj.name,
                    status='Mới tạo'
                )

                results.append({
                    'id': job.id,
                    'original_filename': job.original_filename,
                    'status': job.status,
                })
            except Exception as e:
                results.append({
                    'original_filename': file_obj.name,
                    'status': 'Lỗi',
                    'error': str(e),
                })
        
        return Response(results, status=status.HTTP_201_CREATED)

def download_translated_file(request, filename):
    fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'translated'))
    if fs.exists(filename):
        file_path = fs.path(filename)
        as_attachment = request.GET.get('as_attachment', 'true').lower() == 'true'
        content_type_map = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.txt': 'text/plain',
        }
        extension = os.path.splitext(filename)[1].lower()
        content_type = content_type_map.get(extension, 'application/octet-stream')

        return FileResponse(open(file_path, 'rb'), as_attachment=as_attachment, filename=filename, content_type=content_type)
    else:
        raise Http404("File does not exist")

class TranslationJobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = TranslationJob.objects.filter(user=request.user).order_by('-uploaded_at')
        serializer = TranslationJobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# --- Serializer để chuyển đổi Model thành JSON ---
class TranslationJobSerializer(ModelSerializer):
    class Meta:
        model = TranslationJob
        fields = '__all__'