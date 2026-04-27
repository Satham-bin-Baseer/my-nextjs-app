"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppContext } from "../context/AppContext";
import type { userJWT } from "../utilities";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const context = useContext(AppContext);
  const pathname = usePathname();

  const lc_user_token = localStorage.getItem("user_details");
  let userJWT = jwtDecode<userJWT>(lc_user_token as string);

  const naviMenus = [
    {
      href: "/",
      label: "Users",
      active: pathname == "/",
      menukey: 1,
    },
    {
      href: "/roles",
      label: "Designation",
      active: pathname == "/roles",
      menukey: 2,
    },
    {
      href: "/stores",
      label: "Stores",
      active: pathname == "/stores",
      menukey: 4,
    },
    {
      href: "/staff",
      label: "Employees",
      active: pathname == "/staff",
      menukey: 3,
    },
    {
      href: "/items",
      label: "Items",
      active: pathname == "/items",
      menukey: 7,
    },
    {
      href: "/stock",
      label: "Stock Request",
      active: pathname == "/stock",
      menukey: 6, // 7 is the last manukey number
    },
    {
      href: "/user-menus",
      label: "User Menus",
      active: pathname == "/user-menus",
      menukey: 0,
    },
  ];

  const hasAccess = (menuKey: number) => {
    return (
      userJWT?.role_name === "Developer" ||
      context?.modPermissions.some(
        (mp) => mp.action_id === 1 && mp.menu_key === menuKey,
      )
    );
  };

  const renderMenus = () => {
    const res = naviMenus
      .filter((item) => hasAccess(item.menukey))
      .map((item, index) => (
        <MenuLink
          key={index}
          href={item.href}
          label={item.label}
          active={item.active}
        />
      ));
    return res;
  };

  return (
    <aside
      className="sidebar vh100"
      style={{
        width: "210px",
        background: "linear-gradient(180deg, #17316b, #6378a5)",
        padding: "24px 16px",
        borderRight: "5px solid #d0dcf5",
      }}
    >
      <h2
        style={{
          letterSpacing: "0.1em",
          color: "#c7d2fe",
          marginBottom: "20px",
        }}
      >
        NAVIGATION
      </h2>
      <nav className="d-flex" style={{ flexDirection: "column", gap: "6px" }}>
        {renderMenus()}
      </nav>
    </aside>
  );
};

interface MenuLinkProps {
  href: string;
  label: string;
  active: boolean;
}

const MenuLink = ({ href, label, active }: MenuLinkProps) => {
  return (
    <Link
      href={href}
      className={`p-3 fw-bold menu-link ${active ? "active" : ""}`}
    >
      {label}
    </Link>
  );
};

export default Sidebar;
