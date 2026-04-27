import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { userJWT } from "../utilities";
import { jwtDecode } from "jwt-decode";

export default function HeaderProfilePopup() {
  const lc_user_token = localStorage.getItem("user_details");
  let ud = jwtDecode<userJWT>(lc_user_token as string);
  return (
    <div style={{ minWidth: 180 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <Avatar icon={<UserOutlined />} />
        <div>
          <p style={{ fontWeight: 500 }}>{ud.emp_name}</p>
          <p style={{ fontSize: 12 }}>
            <b>Designation:</b> <span>{ud.role_name}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
