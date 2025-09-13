import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UploadModal.css';

const UploadModal = ({ isOpen, onClose, onTranslationSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('vi');
    const [style, setStyle] = useState('general');
    const [domain, setDomain] = useState('general');
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = 'http://127.0.0.1:8000';

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const handleTranslate = async () => {
        if (!selectedFile) {
            toast.warn('Vui lòng chọn một file để dịch.');
            return;
        }

        const formData = new FormData();
        formData.append('files', selectedFile);
        formData.append('source_language', sourceLang);
        formData.append('target_language', targetLang);
        formData.append('style', style);
        formData.append('domain', domain);

        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error('Không tìm thấy token. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/api/translator/translate/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Yêu cầu dịch đã được gửi thành công!');
            onTranslationSuccess(response.data.results);
        } catch (error) {
            toast.error('Có lỗi xảy ra trong quá trình dịch.');
            console.error('Translation Error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Tải lên & Dịch</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="file-drop-zone">
                        <input type="file" id="translation-file-upload-input" onChange={handleFileChange} accept=".txt,.docx,.pdf,.jpg,.jpeg,.png" />
                        <label htmlFor="translation-file-upload-input" className="file-upload-label">
                            <p>Kéo thả file hoặc nhấn để chọn</p>
                        </label>
                    </div>
                    {selectedFile && (
                        <div className="file-list-modal">
                            <div className="file-list-item-modal">
                                <span>{selectedFile.name}</span>
                                <button onClick={handleRemoveFile} className="remove-btn">
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="config-grid">
                        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                            <option value="en">Tiếng Anh</option>
                            <option value="vi">Tiếng Việt</option>
                            <option value="zh">Tiếng Trung</option>
                        </select>
                        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">Tiếng Anh</option>
                            <option value="zh">Tiếng Trung</option>
                        </select>
                        <select value={style} onChange={(e) => setStyle(e.target.value)}>
                            <option value="general">Phong cách chung</option>
                            <option value="formal">Trang trọng</option>
                            <option value="casual">Thân mật</option>
                        </select>
                        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
                            <option value="general">Chủ đề chung</option>
                            <option value="finance">Tài chính</option>
                            <option value="legal">Pháp lý</option>
                            <option value="medical">Y tế</option>
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Hủy</button>
                    <button className="confirm-btn" onClick={handleTranslate} disabled={!selectedFile || loading}>
                        {loading ? 'Đang dịch...' : `Dịch`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;