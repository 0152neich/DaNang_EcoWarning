import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./Sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faMapLocationDot,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar__header">
        <h3>Đà Nẵng - GIS</h3>
        <span>(OLP 2025)</span>
      </div>
      <ul className="sidebar__menu">
        <li>
          <NavLink
            to={ROUTES.DASHBOARD}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FontAwesomeIcon icon={faChartLine} />
            <span>Tổng quan (Dashboard)</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={ROUTES.MAP}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FontAwesomeIcon icon={faMapLocationDot} />
            <span>Bản đồ Dữ liệu</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={ROUTES.ALERTS}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>Cảnh báo Thiên tai</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
