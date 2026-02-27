import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Chatbot from '../components/common/Chatbot';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar role={role} />
            <main className="dashboard-main">
                <Outlet />
            </main>
            <Chatbot />
        </div>
    );
};

export default DashboardLayout;
