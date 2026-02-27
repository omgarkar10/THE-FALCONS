import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Warehouse Pages
import WarehouseDashboard from './pages/warehouse/Dashboard';
import WarehouseInventory from './pages/warehouse/Inventory';
import WarehouseStorage from './pages/warehouse/Storage';
import WarehouseAnalytics from './pages/warehouse/Analytics';
import WarehouseAlerts from './pages/warehouse/Alerts';
import WarehouseSettings from './pages/warehouse/Settings';

// Consumer Pages
import ConsumerDashboard from './pages/consumer/Dashboard';
import ConsumerInventory from './pages/consumer/Inventory';
import ConsumerShipments from './pages/consumer/Shipments';
import ConsumerQuality from './pages/consumer/Quality';
import ConsumerAlerts from './pages/consumer/Alerts';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Auth Routes (no layout — standalone pages) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Warehouse Dashboard Routes */}
          <Route element={<DashboardLayout role="warehouse" />}>
            <Route path="/warehouse/dashboard" element={<WarehouseDashboard />} />
            <Route path="/warehouse/inventory" element={<WarehouseInventory />} />
            <Route path="/warehouse/storage" element={<WarehouseStorage />} />
            <Route path="/warehouse/analytics" element={<WarehouseAnalytics />} />
            <Route path="/warehouse/alerts" element={<WarehouseAlerts />} />
            <Route path="/warehouse/settings" element={<WarehouseSettings />} />
            <Route path="/warehouse" element={<Navigate to="/warehouse/dashboard" replace />} />
          </Route>

          {/* Consumer Dashboard Routes */}
          <Route element={<DashboardLayout role="consumer" />}>
            <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
            <Route path="/consumer/inventory" element={<ConsumerInventory />} />
            <Route path="/consumer/shipments" element={<ConsumerShipments />} />
            <Route path="/consumer/quality" element={<ConsumerQuality />} />
            <Route path="/consumer/alerts" element={<ConsumerAlerts />} />
            <Route path="/consumer" element={<Navigate to="/consumer/dashboard" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
