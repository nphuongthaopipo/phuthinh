import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './TranslationManagementPage.css';
import UploadModalFile from '../components/UploadModalFile'; // Thay đổi import thành UploadModalFile

const API_BASE_URL = 'http://127.0.0.1:8000';

const VisibilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const TranslationManagementPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchTranslationJobs();
    }, []);

    const fetchTranslationJobs = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error('Không tìm thấy token. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/api/translator/jobs/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setJobs(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Không thể tải danh sách tài liệu. Vui lòng đăng nhập lại.');
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.original_filename.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status.toLowerCase().replace(' ', '-') === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleFileUploadSuccess = () => {
        setIsModalOpen(false);
        fetchTranslationJobs(); // Tải lại danh sách sau khi tải lên thành công
    };

    const handleAction = (filename, action) => {
        let url = `${API_BASE_URL}/api/translator/download/${filename}/`;
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            return;
        }

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
        <div className="management-container">
            <div className="management-header">
                <h1 className="page-title">Danh sách</h1>
                <div className="header-actions">
                    <button className="action-button primary" onClick={() => setIsModalOpen(true)}>
                        <svg className="action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        Tải lên
                    </button>
                </div>
            </div>

            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="mới tạo">Mới tạo</option>
                    <option value="đang xử lý">Đang xử lý</option>
                    <option value="hoàn thành">Hoàn thành</option>
                    <option value="lỗi">Lỗi</option>
                </select>
                <button className="filter-button">Lọc</button>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Tên file</th>
                                <th>Trạng thái</th>
                                <th>Ngày tải lên</th>
                                <th>Ngày dịch</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map((job) => (
                                <tr key={job.id}>
                                    <td>{job.original_filename}</td>
                                    <td><span className={`status-tag ${job.status.toLowerCase().replace(' ', '-')}`}>{job.status}</span></td>
                                    <td>{new Date(job.uploaded_at).toLocaleString()}</td>
                                    <td>{job.translated_at ? new Date(job.translated_at).toLocaleString() : '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleAction(job.translated_filename, 'view')} title="Xem" disabled={job.status === 'Lỗi' || job.status === 'Mới tạo' || job.status === 'Đang xử lý'} className="action-button icon-btn">
                                                <VisibilityIcon />
                                            </button>
                                            <button onClick={() => handleAction(job.translated_filename, 'download')} title="Tải về" disabled={job.status === 'Lỗi' || job.status === 'Mới tạo' || job.status === 'Đang xử lý'} className="action-button icon-btn">
                                                <DownloadIcon />
                                            </button>
                                            <button onClick={() => handleAction(job.translated_filename, 'review')} title="Sửa" disabled={job.status === 'Lỗi' || job.status === 'Mới tạo' || job.status === 'Đang xử lý'} className="action-button icon-btn">
                                                <EditIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <UploadModalFile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={handleFileUploadSuccess} />
        </div>
    );
};

export default TranslationManagementPage;