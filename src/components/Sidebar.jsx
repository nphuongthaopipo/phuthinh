import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Component Icon với SVG để trông chuyên nghiệp hơn
const Icon = ({ path, className = '' }) => (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
    </svg>
);

// Dữ liệu cho các menu item
const menuItems = [
    { name: 'Trang chủ', path: '/dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    {
        name: 'Quản lý',
        icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
        subItems: [
            { name: 'Upload tài liệu', path: '/management/upload' },
            { name: 'Tạo đơn hàng', path: '/management/create-order' },
            { name: 'Thanh toán', path: '/management/payments' },
            { name: 'Theo dõi trạng thái đơn hàng', path: '/management/order-status' },
        ],
    },
    {
        name: 'Hệ thống dịch AI',
        icon: 'M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17c-.47 2.72-1.88 5.25-3.72 7.12l-5.3-5.29L1 14.12l6.01 6.01 2.87-2.87-.01-.02z',
        subItems: [
            { name: 'Tải lên', path: '/translation' },
            { name: 'Quản lý', path: '/translation/manage' },
        ],
    },
    {
        name: 'Quản lý nhiệm vụ',
        icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z',
        subItems: [
            { name: 'Tạo nhiệm vụ', path: '/task-management/create' },
            { name: 'Kiểm tra và chỉnh sửa', path: '/task-management/review-edit' },
            { name: 'Ký số tài liệu đã dịch', path: '/task-management/digital-sign' },
            { name: 'Theo dõi trạng thái', path: '/task-management/status' },
            { name: 'Cập nhật trạng thái', path: '/task-management/update-status' },
            { name: 'Lịch sử', path: '/task-management/history' },
        ],
    },
    {
        name: 'Kết nối cổng HHC',
        icon: 'M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z',
        subItems: [
            { name: 'Gửi tài liệu', path: '/government-connect/send' },
            { name: 'Kết quả', path: '/government-connect/results' },
        ],
    },
    {
        name: 'Quản lý nhân viên',
        path: '/employees',
        icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'
    },
    {
        name: 'Quản lý khách hàng',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
        subItems: [
            { name: 'Danh sách khách hàng', path: '/customers/list' },
            { name: 'Lịch sử', path: '/customers/history' },
        ],
    },
    {
        name: 'Kế toán',
        icon: 'M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM4 20h16V4H4v16zm12-4H8v-2h8v2zm0-4H8v-2h8v2z',
        subItems: [
            { name: 'Tổng quan', path: '/accounting/overview' },
            { name: 'Nhiệm vụ', path: '/accounting/tasks' },
        ],
    },
    {
        name: 'Người dùng',
        icon: 'M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z',
        subItems: [
            { name: 'Danh sách', path: '/users/list' },
        ],
    },
    {
        name: 'Quản lý ký số',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z',
        subItems: [
            { name: 'Tạo chữ ký số', path: '/digital-signature/create' },
            { name: 'Kết nối bên thứ 3', path: '/digital-signature/connect-3rd-party' },
        ],
    },
    {
        name: 'Sản Phẩm/ Dịch Vụ',
        icon: 'M18 10H6V6h12v4zm2-2V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4h-2V8h2z',
        subItems: [
            { name: 'Danh sách', path: '/products-services/list' },
        ],
    },
];

const Sidebar = ({ isOpen, setSidebarOpen }) => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    // Logic để mở menu cha tương ứng khi refresh trang
    // Điều này sẽ kiểm tra URL hiện tại và tự động mở menu con
    useState(() => {
        const currentPath = location.pathname;
        const initialOpenMenus = {};
        menuItems.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(subItem => currentPath.startsWith(subItem.path));
                if (isActive) {
                    initialOpenMenus[item.name] = true;
                }
            }
        });
        setOpenMenus(initialOpenMenus);
    }, [location.pathname]);

    const toggleSubMenu = (itemName) => {
        setOpenMenus(prev => {
            const newOpenMenus = {};
            // Đóng tất cả các menu khác
            Object.keys(prev).forEach(key => {
                newOpenMenus[key] = false;
            });
            // Mở hoặc đóng menu được click
            newOpenMenus[itemName] = !prev[itemName];
            return newOpenMenus;
        });
    };

    const handleLinkClick = (path, isParent) => {
        if (!isParent) {
            // Đóng tất cả các menu con khi một link con được click
            setOpenMenus({});
        }
    };

    return (
        <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                {isOpen && <span className="logo">Phú Thịnh</span>}
                <button className="toggle-btn" onClick={() => setSidebarOpen(!isOpen)}>
                    <Icon path="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </button>
            </div>
            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        {item.subItems ? (
                            <a href="#" className={`parent-link ${openMenus[item.name] ? 'active' : ''}`} onClick={() => toggleSubMenu(item.name)}>
                                <Icon path={item.icon} />
                                {isOpen && <span className="menu-name">{item.name}</span>}
                                {isOpen && (
                                    <span className={`arrow ${openMenus[item.name] ? 'open' : ''}`}>
                                        <Icon path="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                                    </span>
                                )}
                            </a>
                        ) : (
                            <Link 
                                to={item.path} 
                                className={location.pathname === item.path ? 'active' : ''}
                                onClick={() => handleLinkClick(item.path, false)}
                            >
                                <Icon path={item.icon} />
                                {isOpen && <span className="menu-name">{item.name}</span>}
                            </Link>
                        )}
                        {isOpen && item.subItems && (
                            <ul className={`sub-menu ${openMenus[item.name] ? 'open' : ''}`}>
                                {item.subItems.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <Link 
                                            to={subItem.path} 
                                            className={location.pathname === subItem.path ? 'active' : ''}
                                            onClick={() => handleLinkClick(subItem.path, false)}
                                        >
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;