import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email_or_phone: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);
            const { access, refresh, user_info, role } = response.data;
            
            // Lưu token và thông tin người dùng vào Local Storage hoặc Redux
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_info', JSON.stringify(user_info));
            localStorage.setItem('user_role', role);

            toast.success('Đăng nhập thành công!');
            navigate('/dashboard'); // Chuyển hướng đến trang Dashboard sau khi đăng nhập thành công
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Thông tin đăng nhập không hợp lệ.';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email_or_phone">Email hoặc Số điện thoại</label>
                        <input type="text" id="email_or_phone" name="email_or_phone" value={formData.email_or_phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="auth-button">Đăng Nhập</button>
                </form>
                <div className="auth-footer">
                    Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;