"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Modal, Row, Col, Input, Drawer } from "antd";
import type { TableProps } from "antd";
import { CustomCardHeader } from "../components/customCardHeader";
import toast from "react-hot-toast";
import UserPermissions from "./userPermissions";
import ReturnChild from "../components/ReturnChild";
import { Axios } from "../utilities/axiosConfig";
import {
  generateSerialNumber,
  getQueryParam,
  TablePaginationSize,
} from "../utilities";
import {
  EditOutlined,
  DeleteOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

interface DataType {
  _id: number;
  menuname_key: string;
  status: number;
}

interface DataType2 {
  _id: number;
  role_name: string;
  status: number;
}

const UserRolesMenu = () => {
  const [roles, setRoles] = useState([]);
  const [loader, setLoader] = useState(false);
  const [menuKeys, setMenuKeys] = useState<DataType[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [showPermission, setShowPermission] = useState(false);
  const [pagi, setPagination] = useState(TablePaginationSize);
  const [paramObj, setParamObj] = useState({});
  const [editData, setEditData] = useState<DataType2 | null>(null);

  useEffect(() => {
    listMenukeys();
  }, []);

  const listMenukeys = () => {
    const URL = `api/user-menus/list_menus?status=1`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setMenuKeys(res["data"].data);
      }
    });
  };

  useEffect(() => {
    const tO = setTimeout(() => {
      getData(1, TablePaginationSize.pageSize);
    }, 400);
    return () => clearTimeout(tO);
  }, [JSON.stringify(paramObj)]);

  const getData = (current: number, pageSize: number) => {
    setRoles([]);
    setLoader(true);

    const api_param = getQueryParam({
      ...paramObj,
      page: current,
      limit: pageSize,
    });
    const URL = `api/roles/list_roles?${api_param}`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setRoles(res["data"].data);
        setPagination({ current, pageSize, total: res["data"].total });
      } else {
        toast.error(res["data"].message);
      }
      setLoader(false);
    });
  };

  const handleRemoveConfirm = (_id: number) => {
    Modal.confirm({
      title: "Do you want to delete?",
      onOk: () => handleRemove(_id),
    });
  };

  const handleRemove = (_id: number) => {
    setLoader(true);
    Axios.post(`api/roles/delete_role`, { _id }).then((res) => {
      if (res["data"].status == 1) {
        toast.success(res["data"].message);
        getData(pagi.current, pagi.pageSize);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
  };

  const columns: TableProps<DataType2>["columns"] = [
    generateSerialNumber(pagi),
    { title: "Role Name", dataIndex: "role_name" },
    {
      title: "Manage",
      align: "center",
      render: (_t, item) => (
        <>
          <ReturnChild menu_key={2} action_id={4}>
            <EditOutlined
              title="Edit"
              onClick={() => {
                setEditData(item);
                setEditModal(true);
              }}
            />
          </ReturnChild>
          <ReturnChild menu_key={2} action_id={5}>
            &nbsp;&nbsp;&nbsp;
            <DeleteOutlined
              title="Remove"
              onClick={() => handleRemoveConfirm(item._id)}
            />
          </ReturnChild>
          <ReturnChild menu_key={2} action_id={4}>
            &nbsp;&nbsp;&nbsp;
            <ProfileOutlined
              title="Edit Permission"
              onClick={() => {
                setEditData(item);
                setShowPermission(true);
              }}
            />
          </ReturnChild>
        </>
      ),
      width: 100,
    },
  ];

  const addRole = () => {
    if (roleInput.trim()) {
      setRoleInput((prev) => {
        let d: string[] | string = prev.split(" ");
        d = d.join("_");
        return d;
      });
      setLoader(true);
      const URL = `api/roles/add_role`;
      Axios.post(URL, { role_name: roleInput }).then((res) => {
        if (res["data"].status == 1) {
          toast.success(res["data"].message);
          setRoleInput("");
          getData(pagi.current, pagi.pageSize);
        } else {
          toast.error(res["data"].message);
          setLoader(false);
        }
      });
    } else {
      toast.error("Please fill the field");
    }
  };

  const editRole = () => {
    if (!editData?.role_name.trim()) {
      toast.error("Please fill the field");
      return;
    }
    if (!window.confirm("Do you want to update?")) {
      return;
    }
    setLoader(true);
    Axios.post(`api/roles/update_role`, editData).then((res) => {
      if (res["data"].status == 1) {
        toast.success(res["data"].message);
        getData(pagi.current, pagi.pageSize);
        setEditModal(false);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
  };

  return (
    <>
      <ReturnChild menu_key={2} action_id={1}>
        <CustomCardHeader
          title="Designation CRUD"
          menu_key={2}
          onClickNew={() => setAddModal(true)}
          onClickRefresh={() => {
            setPagination((item) => ({ ...item, total: 0 }));
            getData(1, TablePaginationSize.pageSize);
          }}
        />
        <Card
          className="mx-1"
          styles={{
            header: {
              backgroundColor: "#f0f2f5",
            },
          }}
          title={
            <Input.Search
              style={{ width: "40%" }}
              placeholder="Search by designation..."
              onChange={(e) => {
                const search_str = e.target.value;
                setParamObj((prev) => ({ ...prev, search_str }));
              }}
            />
          }
        >
          <p className="text-right mb-2">
            Count: <b>{pagi.total}</b>
          </p>
          <Table<DataType2>
            size="small"
            columns={columns}
            dataSource={roles}
            rowKey="_id"
            pagination={pagi}
            loading={loader}
            onChange={(pagi) => getData(pagi.current!, pagi.pageSize!)}
          />
        </Card>
      </ReturnChild>
      <Modal
        title="Add new user role"
        open={addModal}
        onCancel={() => {
          setAddModal(false);
          setRoleInput("");
        }}
        okText="Save"
        onOk={addRole}
        confirmLoading={loader}
        maskClosable={false}
      >
        <Card>
          <Row>
            <Col span={24}>
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                style={{ width: "100%" }}
                placeholder="Ex. Sales Representative"
              />
            </Col>
          </Row>
        </Card>
      </Modal>
      <Modal
        title="Edit user role"
        open={editModal}
        onCancel={() => setEditModal(false)}
        okText="Update"
        onOk={editRole}
        confirmLoading={loader}
        maskClosable={false}
      >
        <Card>
          <Row>
            <Col span={24}>
              <Input
                defaultValue={editData?.role_name}
                onChange={(e) => {
                  const role_name = e.target.value;
                  setEditData((item) => {
                    return item ? { ...item, role_name } : null;
                  });
                }}
                style={{ width: "100%" }}
                placeholder="Ex. Sales Representative"
              />
            </Col>
          </Row>
        </Card>
      </Modal>
      <Drawer
        title={"Edit Access: " + editData?.role_name}
        open={showPermission}
        onClose={() => setShowPermission(false)}
        size="large"
        destroyOnClose
      >
        <UserPermissions
          menuKeys={menuKeys}
          role_id={editData?._id as number}
          closeDrawer={() => setShowPermission(false)}
        />
      </Drawer>
    </>
  );
};

export default UserRolesMenu;
