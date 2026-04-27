"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Modal, Row, Col } from "antd";
import { Input, Select, Form, Switch } from "antd";
import type { TableProps } from "antd";
import toast from "react-hot-toast";
import { Axios } from "./utilities/axiosConfig";
import ReturnChild from "./components/ReturnChild";
import { CustomCardHeader } from "./components/customCardHeader";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  TablePaginationSize,
  InputElement,
  generateSerialNumber,
  getQueryParam,
} from "./utilities";

interface DataType {
  _id: number;
  username: string;
  password: string;
  emp_id: number;
  role_id: number;
  emp_name: string;
  emp_gender: string;
  emp_designation: string;
  status: number;
}

interface EmpListInterface {
  _id: number;
  emp_name: string;
  emp_role: number;
  emp_designation: string;
}

const App = () => {
  const [dataList, setDataList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [empList, setEmpList] = useState<EmpListInterface[]>([]);
  const [selStaff, setSelStaff] = useState<number | null>(null);
  const [pagi, setPagination] = useState(TablePaginationSize);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const loadStaff = () => {
    const URL = `api/employees/list_employees?status=1`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setEmpList(res["data"].data);
      }
    });
  };

  useEffect(() => {
    loadStaff();
    getData(pagi.current, pagi.pageSize);
  }, []);

  useEffect(() => {
    const tO = setTimeout(() => {
      getData(1, TablePaginationSize.pageSize);
    }, 700);
    return () => clearTimeout(tO);
  }, [search]);

  const generateParam = (current: number, pageSize: number) => {
    const obj = {
      page: current,
      limit: pageSize,
      search,
    };
    return getQueryParam(obj);
  };

  const getData = (current: number, pageSize: number) => {
    setDataList([]);
    setLoader(true);

    const URL = `api/users/list_users?${generateParam(current, pageSize)}`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setDataList(res["data"].data);
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
    Axios.post(`api/users/delete_user`, { _id }).then((res) => {
      if (res["data"].status == 1) {
        toast.success(res["data"].message);
        getData(pagi.current, pagi.pageSize);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    generateSerialNumber(pagi),
    { title: "Username", dataIndex: "username" },
    {
      title: "Actual User",
      dataIndex: "emp_name",
      render: (text, item) => {
        if (item.emp_gender == "male") {
          return "Mr." + text;
        } else {
          return "Ms." + text;
        }
      },
    },
    { title: "User Designation", dataIndex: "emp_designation" },
    {
      title: "Password",
      dataIndex: "password",
      width: 170,
      render: (text) => {
        if (text.length > 25) {
          return text.slice(0, 25) + ".....";
        }
        return text;
      },
    },
    {
      title: "Active",
      align: "center",
      width: 10,
      dataIndex: "is_active",
      render: (val) => <Switch checked={val} disabled />,
    },
    {
      title: "Manage",
      align: "center",
      render: (_t, item) => (
        <>
          <ReturnChild menu_key={1} action_id={4}>
            <EditOutlined
              title="Edit"
              onClick={() => {
                setEditModal(true);
                setEditData(item);
                editForm.setFieldsValue(item);
              }}
            />
          </ReturnChild>
          <ReturnChild menu_key={1} action_id={5}>
            &nbsp;&nbsp;&nbsp;
            <DeleteOutlined
              title="Remove"
              onClick={() => handleRemoveConfirm(item._id)}
            />
          </ReturnChild>
        </>
      ),
      width: 80,
    },
  ];

  const addUser = async () => {
    const values = await addForm.validateFields();
    setLoader(true);
    Axios.post(`api/users/add_user`, values).then((res) => {
      if (res["data"].status == 1) {
        toast.success(res["data"].message);
        addForm.resetFields();
        setAddModal(false);
        setSelStaff(null);
        getData(pagi.current, pagi.pageSize);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
  };

  const editUser = async () => {
    const values = await editForm.validateFields();
    if (!window.confirm("Do you want to update?")) {
      return;
    }
    setLoader(true);
    const payload = { ...editData, ...values };
    Axios.post(`api/users/update_user`, payload).then((res) => {
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

  const getSelEmployeeDesignation = () => {
    const res = [...empList].find(({ _id }) => _id == selStaff);
    return res?.emp_designation;
  };

  return (
    <>
      <ReturnChild menu_key={1} action_id={1}>
        <CustomCardHeader
          title="Users CRUD"
          menu_key={1}
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
              placeholder="Search by username, staff name, designation..."
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        >
          <p className="text-right mb-2">
            Users Count: <b>{pagi.total}</b>
          </p>
          <Table<DataType>
            size="small"
            columns={columns}
            dataSource={dataList}
            rowKey="_id"
            pagination={pagi}
            loading={loader}
            onChange={(pagi) => getData(pagi.current!, pagi.pageSize!)}
          />
        </Card>
      </ReturnChild>
      <Modal
        title="Create new username"
        open={addModal}
        onCancel={() => {
          addForm.resetFields();
          setAddModal(false);
          setSelStaff(null);
        }}
        okText="Create"
        onOk={addUser}
        confirmLoading={loader}
        maskClosable={false}
      >
        <Card>
          <Row>
            <Col span={24}>
              <Form
                form={addForm}
                layout="vertical"
                className="compact-form"
                size="small"
              >
                <Row>
                  {InputElement("Username", "", " ", 11)}
                  <Col md={2}></Col>
                  <Col md={11}>{InputElement("Password", "", " ", 11)}</Col>
                  <Col md={24} className="mt-2">
                    <Form.Item
                      label="Select Staff"
                      name="emp_id"
                      rules={[{ required: true, message: "Select this" }]}
                    >
                      <Select
                        onChange={(val) => setSelStaff(val)}
                        showSearch={{ optionFilterProp: "label" }}
                        options={empList.map(({ _id, emp_name }) => ({
                          value: _id,
                          label: emp_name,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={24} className="mt-2">
                    <label>Staff Designation</label>
                    <Input
                      readOnly
                      value={getSelEmployeeDesignation()}
                      style={{ width: "100%", backgroundColor: "#ede7e7ff" }}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Modal>
      <Modal
        title="Edit staff detail"
        open={editModal}
        onCancel={() => setEditModal(false)}
        okText="Update"
        onOk={editUser}
        confirmLoading={loader}
        maskClosable={false}
      >
        <Card>
          <Row>
            <Col span={24}>
              <Form
                form={editForm}
                layout="vertical"
                className="compact-form"
                size="small"
              >
                <Row>
                  {InputElement("Username", "", " ")}
                  {InputElement(
                    "Linked Staff Name",
                    "emp_name",
                    "mt-2",
                    11,
                    "text",
                    { backgroundColor: "#ede7e7ff" },
                    true,
                  )}
                  <Col md={2} />
                  <Col md={11} className="mt-2">
                    <Form.Item label="Active Status" name="is_active">
                      <Select>
                        <Select.Option value={true}>Active</Select.Option>
                        <Select.Option value={false}>In-active</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {InputElement(
                    "Staff Designation",
                    "emp_designation",
                    "mt-2",
                    24,
                    "text",
                    { backgroundColor: "#ede7e7ff" },
                    true,
                  )}
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  );
};

export default App;
