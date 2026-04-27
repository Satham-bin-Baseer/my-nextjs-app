"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Modal, Row, Col, Form, Select, Input } from "antd";
import { Switch } from "antd";
import type { TableProps } from "antd";
import { CustomCardHeader } from "../components/customCardHeader";
import toast from "react-hot-toast";
import ReturnChild from "../components/ReturnChild";
import { Axios } from "../utilities/axiosConfig";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  TablePaginationSize,
  InputElement,
  PharmaciesInterf,
  generateSerialNumber,
  today,
  momentDate,
  getQueryParam,
} from "../utilities";

interface DataType {
  _id: number;
  emp_name: string;
  emp_dob: string;
  emp_gender: string;
  emp_contact: string;
  emp_join_date: string;
  emp_role: number;
  emp_designation: string;
  emp_pharmacy: number;
  emp_pharmacy_name: number;
  pharmacy_code: number;
  status: number;
}

const EmployeesMenu = () => {
  const [dataList, setDataList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [pharmacyList, setPharmacyList] = useState<PharmaciesInterf[]>([]);
  const [pagi, setPagination] = useState(TablePaginationSize);
  const [paramObj, setParamObj] = useState({});
  const [editData, setEditData] = useState<Partial<DataType>>({});
  const performEdit = editData._id ? true : false;

  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
    fetchPharmacies();
  }, []);

  useEffect(() => {
    const tO = setTimeout(() => {
      getData(1, TablePaginationSize.pageSize);
    }, 400);
    return () => clearTimeout(tO);
  }, [JSON.stringify(paramObj)]);

  const fetchRoles = () => {
    const URL = `api/roles/list_roles?status=1`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setRolesList(res["data"].data);
      }
    });
  };

  const fetchPharmacies = () => {
    const URL = `api/pharmacies/list_pharmacies?status=1`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setPharmacyList(res["data"].data);
      }
    });
  };

  const getData = (current: number, pageSize: number) => {
    setDataList([]);
    setLoader(true);
    const api_param = getQueryParam({
      ...paramObj,
      page: current,
      limit: pageSize,
    });
    const URL = `api/employees/list_employees?${api_param}`;
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
    const URL = `api/employees/delete_employee`;
    Axios.post(URL, { _id }).then((res) => {
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
    {
      title: "Employee Name",
      dataIndex: "emp_name",
      render: (text, item) => {
        if (item.emp_gender == "male") {
          return "Mr." + text;
        } else {
          return "Ms." + text;
        }
      },
    },
    { title: "Designation", dataIndex: "emp_designation" },
    {
      title: "Store Name",
      width: 250,
      render: (_t, item) => {
        if (item.emp_pharmacy) {
          return `${item.emp_pharmacy_name} (Store code: ${item.pharmacy_code})`;
        }
        return "";
      },
    },
    { title: "Contact", dataIndex: "emp_contact", align: "center", width: 10 },
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
      width: 10,
      render: (_t, item) => (
        <>
          <ReturnChild menu_key={3} action_id={4}>
            <EditOutlined
              title="Edit"
              onClick={() => {
                setEditModal(true);
                setEditData(item);
                form.setFieldsValue(item);
              }}
            />
          </ReturnChild>
          <ReturnChild menu_key={3} action_id={5}>
            &nbsp;&nbsp;&nbsp;
            <DeleteOutlined
              title="Remove"
              onClick={() => handleRemoveConfirm(item._id)}
            />
          </ReturnChild>
        </>
      ),
    },
  ];

  const addNewStaff = async () => {
    const values = await form.validateFields();
    if (!/^\d{10}$/.test(values.emp_contact)) {
      toast.error(`Enter valid mobile number`);
      return;
    }
    setLoader(true);
    const URL = `api/employees/add_employee`;
    Axios.post(URL, values).then((res) => {
      if (res["data"].status == 1) {
        toast.success(res["data"].message);
        form.resetFields();
        setAddModal(false);
        getData(pagi.current, pagi.pageSize);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
  };

  const editStaff = async () => {
    const values = await form.validateFields();
    if (!/^\d{10}$/.test(values.emp_contact)) {
      toast.error(`Enter valid mobile number`);
      return;
    }
    if (!window.confirm("Do you want to update?")) return;
    setLoader(true);
    const payload = { ...editData, ...values };
    const URL = `api/employees/update_employee`;
    Axios.post(URL, payload).then((res) => {
      if (res["data"].status === 1) {
        toast.success(res["data"].message);
        setEditModal(false);
        getData(pagi.current, pagi.pageSize);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
  };

  const generatePharmaciesList = () => {
    const result = pharmacyList.map((item) => ({
      value: item._id,
      label: `${item.pharmacy_name} (${item.area} - ${item.district} - Store code: ${item.pharmacy_code})`,
    }));
    return result;
  };

  const getForm = () => {
    return (
      <Card>
        <Row>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              className="compact-form"
              size="small"
            >
              <Row>
                {InputElement("Staff Name", "emp_name", " ", 11)}
                <Col md={1} />
                {InputElement("Mobile No", "emp_contact", " ", 12)}
                <Col md={performEdit ? 4 : 7} className="mt-2">
                  <Form.Item
                    label="Gender"
                    name="emp_gender"
                    rules={[{ required: true, message: "Select this" }]}
                  >
                    <Select>
                      <Select.Option value="malee">Male</Select.Option>
                      <Select.Option value="female">Female</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={1} />
                <Col md={performEdit ? 6 : 7} className="mt-2">
                  <Form.Item
                    label="Date of Birth"
                    name="emp_dob"
                    rules={[{ required: true, message: "Fill this" }]}
                  >
                    <Input type="date" max={momentDate(today, "YYYY-MM-DD")} />
                  </Form.Item>
                </Col>
                <Col md={1} />
                {InputElement(
                  "Joining Date",
                  "emp_join_date",
                  "mt-2",
                  performEdit ? 6 : 8,
                  "date",
                )}
                {performEdit && (
                  <>
                    <Col md={1} />
                    <Col md={5} className="mt-2">
                      <Form.Item label="Active Status" name="is_active">
                        <Select>
                          <Select.Option value={true}>Active</Select.Option>
                          <Select.Option value={false}>In-active</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                )}
                <Col md={10} className="mt-2">
                  <Form.Item
                    label="Designation"
                    name="emp_role"
                    rules={[{ required: true, message: "Select this" }]}
                  >
                    <Select
                      showSearch={{ optionFilterProp: "label" }}
                      options={rolesList.map(({ _id, role_name }) => ({
                        value: _id,
                        label: role_name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col md={2} />
                <Col md={12} className="mt-2">
                  <Form.Item label="Store Name" name="emp_pharmacy">
                    <Select
                      showSearch={{ optionFilterProp: "label" }}
                      options={generatePharmaciesList()}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <ReturnChild menu_key={3} action_id={1}>
      <CustomCardHeader
        title="Employees CRUD"
        menu_key={3}
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
          <>
            <Row className="mt-5">
              <Col md={6}>
                <Input.Search
                  placeholder="Search by staff name, contact no..."
                  onChange={(e) => {
                    const search_str = e.target.value;
                    setParamObj((prev) => ({ ...prev, search_str }));
                  }}
                />
              </Col>
              <Col md={1} />
              <Col md={7}>
                <Form.Item label="Designation">
                  <Select
                    style={{ width: "100%" }}
                    showSearch={{ optionFilterProp: "children" }}
                    onChange={(emp_role) => {
                      setParamObj((prev) => ({ ...prev, emp_role }));
                    }}
                  >
                    <Select.Option value="">--All--</Select.Option>
                    {rolesList.map(({ _id, role_name }) => (
                      <Select.Option key={_id} value={_id}>
                        {role_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={1} />
              <Col md={9}>
                <Form.Item label="Pharmacy">
                  <Select
                    style={{ width: "100%" }}
                    showSearch={{ optionFilterProp: "children" }}
                    onChange={(emp_pharmacy) => {
                      setParamObj((prev) => ({ ...prev, emp_pharmacy }));
                    }}
                  >
                    <Select.Option value="">--All--</Select.Option>
                    {pharmacyList.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {`${item.pharmacy_name} (${item.area} - ${item.district} - Store code: ${item.pharmacy_code})`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        }
      >
        <p className="text-right mb-2">
          Staff Count: <b>{pagi.total}</b>
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
      <Modal
        title="Add new staff"
        open={addModal}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
        }}
        okText="Save"
        onOk={addNewStaff}
        confirmLoading={loader}
        maskClosable={false}
        width={700}
      >
        {getForm()}
      </Modal>
      <Modal
        title="Edit staff detail"
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          form.resetFields();
        }}
        okText="Update"
        onOk={editStaff}
        confirmLoading={loader}
        maskClosable={false}
        width={700}
      >
        {getForm()}
      </Modal>
    </ReturnChild>
  );
};

export default EmployeesMenu;
