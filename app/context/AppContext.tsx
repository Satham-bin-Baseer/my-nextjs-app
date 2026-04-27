"use client";

import { createContext } from "react";
import type { PermissionIF } from "../utilities";

interface AppContextInterface {
  isLogged: boolean;
  isAuthReady: boolean;
  modPermissions: PermissionIF[];
  logout: () => void;
  login: (user: string) => void;
  setIsAuthReady: (ready: boolean) => void;
}

export const AppContext = createContext<AppContextInterface | null>(null);
