"use client";

import type { PermissionIF, userJWT } from "../utilities";
import React, { useState, ReactNode, useEffect } from "react";
import { Axios } from "../utilities/axiosConfig";
import { AppContext } from "./AppContext";
import { jwtDecode } from "jwt-decode";

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [modPermissions, setModPermissions] = useState<PermissionIF[]>([]);
  const [user, setUser] = useState<userJWT | null>(null);

  useEffect(() => {
    const lc_user_token = localStorage.getItem("user_details");
    if (lc_user_token) {
      Axios.defaults.headers.common["Api-Token"] = lc_user_token;
      let jwtDecodedUser = jwtDecode<userJWT>(lc_user_token);
      setUser(jwtDecodedUser);
      setIsLogged(true);
    }
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (user && user.role_name !== "Developer") {
      getPermissions(user);
    }
  }, [user]);

  const getPermissions = (USER: userJWT) => {
    const URL = `api/auth/list_user_permissions?role_id=${USER.emp_role}`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == "1") {
        setModPermissions(res["data"].data);
      }
    });
  };

  const login = (USER: string) => {
    localStorage.setItem("user_details", USER);
    Axios.defaults.headers.common["Api-Token"] = USER;
    let jwtDecodedUser = jwtDecode<userJWT>(USER);
    // console.log(jwtDecodedUser)
    setUser(jwtDecodedUser);
    setIsLogged(true);
  };

  const logout = () => {
    localStorage.removeItem("user_details");
    delete Axios.defaults.headers.common["Api-Token"];
    setUser(null);
    setIsLogged(false);
    setModPermissions([]);
  };

  return (
    <AppContext.Provider
      value={{
        isLogged,
        isAuthReady,
        modPermissions,
        login,
        logout,
        setIsAuthReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
