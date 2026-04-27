"use client";

import Sidebar from "./sidebar";
import Header from "./header";
import { useContext } from "react";
import LoginPage from "./loginPage";
import { AppContext } from "../context/AppContext";
import { ChildrenReactNode } from "../utilities";

const MainLayout = (props: ChildrenReactNode) => {
  const context = useContext(AppContext);

  if (!context?.isAuthReady) {
    return (
      <div
        className="vh100 d-flex align-center"
        style={{
          width: "100vw",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: "35px",
            height: "35px",
            border: "3px solid #4d7af4",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!context?.isLogged) return <LoginPage />;

  return (
    <>
      <Sidebar />
      <main
        className="vh100"
        style={{
          flex: 1,
          background: "#f9fafb",
          overflowY: "auto",
        }}
      >
        <Header />
        {props.children}
      </main>
    </>
  );
};

export default MainLayout;
