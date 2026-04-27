"use client";

import axios from "axios";

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Axios does not send cookies by default so we have to enable it
});
