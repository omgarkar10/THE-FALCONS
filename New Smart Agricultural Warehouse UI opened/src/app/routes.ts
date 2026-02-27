import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { StorageMonitoring } from "./pages/StorageMonitoring";
import { IoTSensors } from "./pages/IoTSensors";
import { Logistics } from "./pages/Logistics";
import { QualityControl } from "./pages/QualityControl";
import { Analytics } from "./pages/Analytics";
import { Alerts } from "./pages/Alerts";
import { Users } from "./pages/Users";
import { Settings } from "./pages/Settings";
import { CatchAll } from "./pages/CatchAll";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
    errorElement: null,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "storage", Component: StorageMonitoring },
      { path: "sensors", Component: IoTSensors },
      { path: "logistics", Component: Logistics },
      { path: "quality", Component: QualityControl },
      { path: "analytics", Component: Analytics },
      { path: "alerts", Component: Alerts },
      { path: "users", Component: Users },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    Component: CatchAll,
  },
]);
