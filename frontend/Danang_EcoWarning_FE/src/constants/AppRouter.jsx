import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import MainLayout from "../layout/MainLayout";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import MapPage from "../pages/Map/MapPage";
import AlertsPage from "../pages/Alerts/AlertsPage";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.MAP} element={<MapPage />} />
          <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
