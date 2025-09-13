import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="layout-container">
            <Sidebar isOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Header />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;