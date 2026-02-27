import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Monitoring from "./pages/Monitoring";
import AlertsPage from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Dispatch from "./pages/Dispatch";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/consumer" element={<ConsumerDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
