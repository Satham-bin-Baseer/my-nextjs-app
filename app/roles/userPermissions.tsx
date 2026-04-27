"use client";

import { Checkbox, Spin, Button } from "antd";
import React, { useState, useEffect } from "react";
import { type PermissionIF } from "../utilities";
import { CheckOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { Axios } from "../utilities/axiosConfig";

const UserPermissions = (props: any) => {
  const [loader, setLoader] = useState(false);
  const [actions, setActions] = useState([1, 2, 3, 4, 5]);
  const [permissions, setPermissions] = useState<PermissionIF[]>([]);
  const [changes, setChanges] = useState<PermissionIF[]>([]);

  useEffect(() => {
    getMarkedData();
  }, []);

  const getMarkedData = async () => {
    setLoader(true);
    const [res] = await Promise.all([
      Axios.post(`api/auth/list_user_permissions?role_id=${props.role_id}`),
    ]);
    setPermissions(res["data"].data);
    setLoader(false);
  };

  const getOverallChecked = (menuKey: number) => {
    return actions.every((actionId) => getChecked(menuKey, actionId));
  };

  const getChecked = (menuKey: number, actionId: number) => {
    const changed = changes.find(
      (p) => p.menu_key === menuKey && p.action_id === actionId,
    );

    if (changed) return changed.status === 1;

    return permissions.some(
      (p) =>
        p.menu_key === menuKey && p.action_id === actionId && p.status === 1,
    );
  };

  const isExist = (menuKey: number, actionId: number) => {
    const isAlreadyExist = permissions.some(
      (p) =>
        p.menu_key === menuKey && p.action_id === actionId && p.status === 1,
    );
    return isAlreadyExist ? 1 : 0;
  };

  const handleAllCheckBoxChange = (checked: boolean, menuKey: number) => {
    actions.forEach((actionId) => {
      handleCheckboxChange(checked, menuKey, actionId);
    });
  };

  const handleCheckboxChange = (
    checked: boolean,
    menu_key: number,
    action_id: number,
  ) => {
    const status = checked ? 1 : 0;
    const isDataExist = isExist(menu_key, action_id);

    setChanges((prev) => {
      const filtered = prev.filter(
        (p) => !(p.menu_key === menu_key && p.action_id === action_id),
      );

      if (status === isDataExist) return filtered;

      return [
        ...filtered,
        { _id: 0, role_id: props.role_id, menu_key, action_id, status },
      ]; // I think _id:0 usage is deprecated
    });
  };

  const updatePermissions = () => {
    if (changes.length < 1) {
      toast.error("No changes made");
      return;
    }
    if (!window.confirm("Do you want to update?")) {
      return;
    }
    setLoader(true);
    const URL = `api/auth/update_user_permissions`;
    Axios.post(URL, { changes }).then((res) => {
      if (res["data"].status == 1) {
        toast.success(res["data"].message);
        props.closeDrawer();
        setLoader(false);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
  };

  return (
    <Spin spinning={loader}>
      <table className="permission-table w100">
        <thead>
          <tr>
            <th align="left">Menu Key</th>
            <th>Check All</th>
            <th>List</th>
            <th>Create</th>
            <th>Read</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {props.menuKeys.map((item, index) => (
            <tr key={index}>
              <td className="menu-name">{item.menuname_key}</td>
              <td align="center">
                <Checkbox
                  className="chbx-border"
                  checked={getOverallChecked(item._id)}
                  onChange={(e) =>
                    handleAllCheckBoxChange(e.target.checked, item._id)
                  }
                />
              </td>
              {actions.map((action, index) => (
                <td key={index} align="center">
                  <Checkbox
                    className="chbx-border"
                    checked={getChecked(item._id, action)}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, item._id, action)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-right">
        <Button
          size="small"
          type="primary"
          className="p-3"
          loading={loader}
          icon={<CheckOutlined />}
          onClick={updatePermissions}
        >
          Update
        </Button>
      </p>
    </Spin>
  );
};

export default UserPermissions;
