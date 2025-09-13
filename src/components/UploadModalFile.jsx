import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UploadModal.css';

const UploadModalFile = ({ isOpen, onClose, onUploadSuccess }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = 'http://127.0.0.1:8000';

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...newFiles]);
    };

    const handleRemoveFile = (fileToRemove) => {
        setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.warn('Vui lòng chọn ít nhất một file để tải lên.');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error('Không tìm thấy token. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            await axios.post(`${API_BASE_URL}/api/translator/upload/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Tải lên thành công!');
            setSelectedFiles([]);
            onUploadSuccess();
        } catch (error) {
            toast.error('Tải lên thất bại. Vui lòng thử lại.');
            console.error('Upload Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Tải lên tài liệu</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="file-drop-zone">
                        <input type="file" multiple id="file-upload-input" onChange={handleFileChange} accept=".txt,.docx,.pdf,.jpg,.jpeg,.png" />
                        <label htmlFor="file-upload-input" className="file-upload-label">
                            <p>Kéo thả file hoặc nhấn để chọn</p>
                        </label>
                    </div>
                    {selectedFiles.length > 0 && (
                        <ul className="file-list-modal">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="file-list-item-modal">
                                    <span>{file.name}</span>
                                    <button onClick={() => handleRemoveFile(file)} className="remove-btn">
                                        &times;
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Hủy</button>
                    <button className="confirm-btn" onClick={handleUpload} disabled={loading}>
                        {loading ? 'Đang tải...' : `Xác nhận tải lên (${selectedFiles.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModalFile;