import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Chatbot from '../components/common/Chatbot';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
            <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />
            <main className="dashboard-main">
                <Outlet />
            </main>
            <Chatbot />
        </div>
    );
};

export default DashboardLayout;
