import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email_or_phone: '',
        password: '',
        confirm_password: '',
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
            const dataToSubmit = {
                full_name: formData.full_name,
                email: formData.email_or_phone.includes('@') ? formData.email_or_phone : null,
                phone_number: !formData.email_or_phone.includes('@') ? formData.email_or_phone : null,
                password: formData.password,
                confirm_password: formData.confirm_password,
            };

            // Register the user
            await axios.post('http://127.0.0.1:8000/api/auth/register/', dataToSubmit);
            toast.success('Đăng ký thành công! Đang tự động đăng nhập...');

            // Automatically log in after successful registration
            const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                email_or_phone: formData.email_or_phone,
                password: formData.password,
            });

            const { access, refresh, user_info, role } = loginResponse.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_info', JSON.stringify(user_info));
            localStorage.setItem('user_role', role);

            toast.success('Đăng nhập thành công!');
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Đăng Ký Tài Khoản</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="full_name">Họ Tên</label>
                        <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email_or_phone">Email hoặc Số điện thoại</label>
                        <input type="text" id="email_or_phone" name="email_or_phone" value={formData.email_or_phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_password">Xác nhận Mật khẩu</label>
                        <input type="password" id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="auth-button">Đăng Ký</button>
                </form>
                <div className="auth-footer">
                    Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;