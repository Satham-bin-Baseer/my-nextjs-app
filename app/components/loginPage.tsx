"use client";

import { Spin } from "antd";
import { useState, FormEvent, useContext } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { Axios } from "../utilities/axiosConfig";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const context = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Enter password");
      return;
    }
    if (!username.trim()) {
      toast.error("Enter username");
      return;
    }
    setLoader(true);
    Axios.post(`/api/auth/login`, { username, password }).then((res) => {
      if (res["data"].status == 1) {
        context?.login(res["data"].data);
      } else {
        toast.error(res["data"].message);
      }
      setLoader(false);
    });
  };

  const verifyResponse = async (cre) => {
    try {
      const URL = `/api/auth/google-login`;
      const { access_token } = cre;
      const res = await Axios.post(URL, { access_token });
      // console.log(res["data"]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (credentials) => verifyResponse(credentials),
    onError: () => console.log("Error!"),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Spin spinning={loader}>
        <form onSubmit={handleSubmit} className="login-form">
          <h3 className="text-center mb-4">Login</h3>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLocaleLowerCase())}
            placeholder="Enter username..."
          />
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="login-form-button color-white p-3 fw-bold w100"
          >
            Login
          </button>
          <button
            type="button"
            className="login-form-button color-white p-3 fw-bold w100 mt-2"
            onClick={() => handleGoogleLogin()}
          >
            <i className="fa-brands fa-google mx-2" />
            Continue with Google
          </button>
        </form>
      </Spin>
    </div>
  );
}
