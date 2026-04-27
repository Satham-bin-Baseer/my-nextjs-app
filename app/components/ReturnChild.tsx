import { ReactNode, useContext } from "react";
import { AppContext } from "../context/AppContext";
import type { userJWT } from "../utilities";
import { jwtDecode } from "jwt-decode";

interface ReturnChildProps {
  menu_key: number;
  action_id: number;
  children?: ReactNode;
}

const ReturnChild = (props: ReturnChildProps) => {
  const context = useContext(AppContext);

  const lc_user_token = localStorage.getItem("user_details");
  let userJWT = jwtDecode<userJWT>(lc_user_token as string);

  const res = context?.modPermissions.filter(
    (mp) => mp.menu_key == props.menu_key && mp.action_id == props.action_id,
  );

  if (userJWT.role_name == "Developer" || res?.length == 1) {
    return <>{props.children}</>;
  }

  return null;
};

export default ReturnChild;
