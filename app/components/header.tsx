"use client";

import React, { useContext } from "react";
import { Tooltip, Popover } from "antd";
import HeaderProfilePopup from "./headerProfilePopup";
import {
  LogoutOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Header = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  const handleLogout = () => {
    toast(
      (t) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Confirm logout?</span>
          <Tooltip title="Logout">
            <CheckOutlined
              style={{ color: "#52c41a" }}
              onClick={() => {
                toast.dismiss(t.id);
                context?.logout();
                router.push("/");
              }}
            />
          </Tooltip>
          <Tooltip title="Cancel">
            <CloseOutlined onClick={() => toast.dismiss(t.id)} />
          </Tooltip>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  return (
    <div
      className="d-flex p-3 sticky-position"
      style={{
        color: "white",
        background: "#17316b",
        justifyContent: "space-between",
        top: 0,
        zIndex: 10,
      }}
    >
      <p className="main-header-title fw-bold m-0">Web Application</p>
      <div className="main-header-actions align-center">
        <ul>
          <li>
            <Popover
              content={<HeaderProfilePopup />}
              trigger="click"
              placement="bottomRight"
            >
              <UserOutlined className="main-header-icons" />
            </Popover>
          </li>
          <li>
            <button
              className="main-header-icons"
              onClick={handleLogout}
              style={{ color: "white" }}
            >
              <LogoutOutlined />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
