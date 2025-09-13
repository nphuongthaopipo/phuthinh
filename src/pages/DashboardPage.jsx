import React from 'react';
import './DashboardPage.css';

// Component Icon với SVG
const Icon = ({ path }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="dashboard-card-icon">
        <path d={path} />
    </svg>
);

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Trang tổng quan</h1>
            <div className="dashboard-grid">
                {/* Đây là các card ví dụ, bạn có thể thay đổi sau */}
                <div className="dashboard-card">
                    <Icon path="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                    <div className="card-content">
                        <h3>Dự án đang thực hiện</h3>
                        <p className="card-value">12</p>
                    </div>
                </div>
                <div className="dashboard-card">
                    <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    <div className="card-content">
                        <h3>Nhiệm vụ cần xử lý</h3>
                        <p className="card-value">5</p>
                    </div>
                </div>
                <div className="dashboard-card">
                    <Icon path="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
                    <div className="card-content">
                        <h3>Tài liệu đã dịch</h3>
                        <p className="card-value">152</p>
                    </div>
                </div>
                <div className="dashboard-card">
                    <Icon path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    <div className="card-content">
                        <h3>Khách hàng</h3>
                        <p className="card-value">48</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
