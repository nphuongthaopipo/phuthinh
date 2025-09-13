import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './TranslationPage.css';

const VisibilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5l-2.5 2.5"></path></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.6"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

function TranslationPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('vi');
    const [style, setStyle] = useState('general');
    const [domain, setDomain] = useState('general');
    const [loading, setLoading] = useState(false);
    const [jobResults, setJobResults] = useState([]);
    const [error, setError] = useState('');
    const API_BASE_URL = 'http://127.0.0.1:8000';

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
        setJobResults([]);
        setError('');
    };

    const handleRemoveFile = (fileToRemove) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    const handleTranslate = async () => {
        if (selectedFiles.length === 0) {
            toast.warn('Vui lòng chọn ít nhất một file để dịch.');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        formData.append('source_language', sourceLang);
        formData.append('target_language', targetLang);
        formData.append('style', style);
        formData.append('domain', domain);

        try {
            setLoading(true);
            setJobResults([]);
            setError('');
            
            const response = await axios.post(`${API_BASE_URL}/api/translator/translate/`, formData);
            
            setJobResults(response.data.results); 
            
            const hasError = response.data.results.some(job => job.status === 'Error');
            if (hasError) {
                toast.error('Có một số file đã xảy ra lỗi trong quá trình dịch.');
            } else {
                toast.success('Dịch tài liệu thành công!');
            }

        } catch (err) {
            console.error("Translation Error:", err);
            const errorMessage = err.response?.data?.error || 'Đã xảy ra lỗi khi dịch. Vui lòng kiểm tra backend server và thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAction = (filename, action) => {
        let url = `${API_BASE_URL}/api/translator/download/${filename}/`;
        
        if (action === 'view') {
            url += '?as_attachment=false';
            window.open(url, '_blank');
        } else if (action === 'download') {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (action === 'review') {
            toast.info(`Chức năng "Xét duyệt" cho file ${filename} đang được phát triển.`);
        }
    };

    return (
        <div className="translation-page">
            <h2>1. Tải lên & Cấu hình</h2>
            <div className="top-section">
                {/* --- Thanh bên trái: Tải lên --- */}
                <div className="upload-bar">
                    <div className="bar-header">
                        <h3>Tải lên</h3>
                    </div>
                    <div className="bar-content">
                        <div className="file-drop-zone">
                            <input type="file" id="file-upload" multiple onChange={handleFileChange} accept=".txt,.docx,.pdf,.jpg,.jpeg,.png" />
                            <label htmlFor="file-upload" className="file-upload-label">
                                <CloudUploadIcon />
                                <p>Kéo thả file hoặc nhấn để chọn (.txt, .docx, .pdf, .jpg, .png)</p>
                            </label>
                        </div>
                        {selectedFiles.length > 0 && (
                            <ul className="file-list">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="file-list-item">
                                        <span>{file.name}</span>
                                        <button onClick={() => handleRemoveFile(file)}><TrashIcon /></button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* --- Thanh bên phải: Cấu hình --- */}
                <div className="config-bar">
                    <div className="bar-header">
                        <h3>Cấu hình dịch</h3>
                    </div>
                    <div className="bar-content">
                        <div className="config-grid">
                            <div className="config-item">
                                <label>Từ ngôn ngữ</label>
                                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                                    <option value="en">Tiếng Anh</option>
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="ja">Tiếng Nhật</option>
                                </select>
                            </div>
                            <div className="config-item">
                                <label>Dịch sang</label>
                                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">Tiếng Anh</option>
                                    <option value="ja">Tiếng Nhật</option>
                                </select>
                            </div>
                            <div className="config-item">
                                <label>Kiểu dịch</label>
                                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                                    <option value="general">Thông thường</option>
                                    <option value="formal">Trang trọng</option>
                                    <option value="notary">Công chứng</option>
                                </select>
                            </div>
                            <div className="config-item">
                                <label>Lĩnh vực</label>
                                <select value={domain} onChange={(e) => setDomain(e.target.value)}>
                                    <option value="general">Tổng hợp</option>
                                    <option value="legal">Pháp lý</option>
                                    <option value="medical">Y tế</option>
                                    <option value="technical">Kỹ thuật</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="translate-button-container">
                        <button className="translate-button" onClick={handleTranslate} disabled={loading}>
                            {loading ? 'Đang dịch...' : `Dịch (${selectedFiles.length}) File`}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* --- KHU VỰC HIỂN THỊ KẾT QUẢ DẠNG BẢNG --- */}
            <div className="results-container">
                <h2>2. Kết quả từ AI</h2>
                <div className="result-box">
                    {loading && <div className="loading-spinner"></div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    {jobResults.length > 0 && (
                        <div className="results-table-container">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>Tên File</th>
                                        <th>Trạng thái</th>
                                        <th>Lỗi chi tiết</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobResults.map((job, index) => (
                                        <tr key={index}>
                                            <td>{job.original_filename}</td>
                                            <td>
                                                <span className={`status-tag ${job.status.toLowerCase()}`}>
                                                    {job.status === 'Completed' ? 'Hoàn thành' : 'Lỗi'}
                                                </span>
                                            </td>
                                            <td>
                                                {job.status === 'Error' ? job.error : '-'}
                                            </td>
                                            <td>
                                                <div className="job-actions">
                                                    <button onClick={() => handleAction(job.translated_filename, 'view')} title="Xem" disabled={job.status === 'Error'}><VisibilityIcon /></button>
                                                    <button onClick={() => handleAction(job.translated_filename, 'download')} title="Tải về" disabled={job.status === 'Error'}><DownloadIcon /></button>
                                                    <button onClick={() => handleAction(job.translated_filename, 'review')} title="Xét duyệt" disabled={job.status === 'Error'}><EditIcon /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {!loading && jobResults.length === 0 && !error && <p className="placeholder">Kết quả dịch sẽ được hiển thị ở đây.</p>}
                </div>
            </div>
        </div>
    );
}

export default TranslationPage;