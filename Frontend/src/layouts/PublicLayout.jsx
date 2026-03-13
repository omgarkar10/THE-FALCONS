import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const PublicLayout = () => {
    const { pathname } = useLocation();
    const isLanding = pathname === '/';
    const isAuth = pathname === '/login' || pathname === '/signup';

    return (
        <>
            {!isAuth && <Navbar />}
            <main style={{ paddingTop: isLanding || isAuth ? 0 : 'var(--header-height)' }}>
                <Outlet />
            </main>
            {!isAuth && <Footer />}
        </>
    );
};

export default PublicLayout;
