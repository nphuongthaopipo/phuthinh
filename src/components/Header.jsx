import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

// Component Icon với SVG
const Icon = ({ path, className = '' }) => (
    <svg className={`header-icon ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
    </svg>
);

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("Guest");
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            setIsLoggedIn(true);
            setUserName(JSON.parse(userInfo).full_name);
        } else {
            setIsLoggedIn(false);
            setUserName("Guest");
        }
    }, []);

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('user_role');
        setIsLoggedIn(false);
        setUserName("Guest");
        setDropdownOpen(false);
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                {/* Bạn có thể thêm các thành phần khác tại đây nếu muốn */}
            </div>

            <div className="header-right">
                {isLoggedIn ? (
                    <>
                        <button className="icon-button">
                            <Icon path="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                        </button>
                        
                        <div className="user-profile" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                            <img 
                                src={`https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=0f43b7&color=fff`} 
                                alt="User Avatar" 
                                className="user-avatar"
                            />
                            <span className="user-name">{userName}</span>
                            <Icon path="M7 10l5 5 5-5z" className="dropdown-arrow" />

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <a href="#" className="dropdown-item">Tài khoản</a>
                                    <a href="#" className="dropdown-item" onClick={handleLogout}>Đăng xuất</a>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="auth-buttons">
                        <button className="auth-btn" onClick={() => navigate('/login')}>Đăng nhập</button>
                        <button className="auth-btn" onClick={() => navigate('/register')}>Đăng ký</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;