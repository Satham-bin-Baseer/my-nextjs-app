"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Modal, Row, Col } from "antd";
import { Form, Select, Switch, Input } from "antd";
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
  momentDate,
  generateSerialNumber,
  genColLeft,
  genColCenter,
  getQueryParam,
} from "../utilities";

const StoresMenu = () => {
  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [pagi, setPagination] = useState(TablePaginationSize);
  const [paramObj, setParamObj] = useState({});
  const [editData, setEditData] = useState<Partial<PharmaciesInterf>>({});
  const performEdit = editData._id ? true : false;

  const [form] = Form.useForm();

  useEffect(() => {
    const tO = setTimeout(() => {
      getData(1, TablePaginationSize.pageSize);
    }, 400);
    return () => clearTimeout(tO);
  }, [JSON.stringify(paramObj)]);

  const getData = (current: number, pageSize: number) => {
    setDataList([]);
    setLoader(true);

    const api_param = getQueryParam({
      ...paramObj,
      page: current,
      limit: pageSize,
    });
    const URL = `api/pharmacies/list_pharmacies?${api_param}`;
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
    const URL = `api/pharmacies/delete_pharmacy`;
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

  const columns: TableProps<PharmaciesInterf>["columns"] = [
    generateSerialNumber(pagi),
    genColCenter("Store Code", "pharmacy_code", 80),
    genColLeft("Store Name", "pharmacy_name", 170),
    genColLeft("Area", "area", 100),
    {
      title: "Place",
      width: 140,
      render: (_t, item) => {
        return `${item.district}, ${item.state}`;
      },
    },
    {
      title: "Opened on",
      width: 85,
      dataIndex: "opening_date",
      render: (val) => momentDate(val),
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
      width: 10,
      render: (_t, item) => (
        <>
          <ReturnChild menu_key={4} action_id={4}>
            <EditOutlined
              title="Edit"
              onClick={() => {
                setEditModal(true);
                setEditData(item);
                form.setFieldsValue(item);
              }}
            />
          </ReturnChild>
          <ReturnChild menu_key={4} action_id={5}>
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

  const addNewPharmacy = async () => {
    const values = await form.validateFields();
    setLoader(true);
    const URL = `api/pharmacies/add_pharmacy`;
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

  const editPharmacy = async () => {
    const values = await form.validateFields();
    if (!window.confirm("Do you want to update?")) return;
    setLoader(true);
    const payload = { ...editData, ...values };
    const URL = `api/pharmacies/update_pharmacy`;
    Axios.post(URL, payload).then((res) => {
      if (res["data"].status === 1) {
        toast.success(res["data"].message);
        setEditModal(false);
        setEditData({});
        getData(pagi.current, pagi.pageSize);
      } else {
        toast.error(res["data"].message);
        setLoader(false);
      }
    });
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
              initialValues={{ state: "Tamil Nadu" }}
            >
              <Row>
                {InputElement("Store Name", "pharmacy_name", " ", 24)}
                {InputElement(
                  "Store Code",
                  "pharmacy_code",
                  "mt-2",
                  6,
                  "text",
                  performEdit ? { backgroundColor: "#ede7e7ff" } : {},
                  performEdit ? true : false,
                )}
                <Col md={1} />
                {InputElement("Opening Date", "", "mt-2", 7, "date")}
                <Col md={1} />
                {InputElement("Area", "", "mt-2", 9)}
                {performEdit && (
                  <>
                    <Col md={6} className="mt-2">
                      <Form.Item label="Active Status" name="is_active">
                        <Select>
                          <Select.Option value={true}>Active</Select.Option>
                          <Select.Option value={false}>In-active</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={1} />
                  </>
                )}
                {InputElement("District", "", "mt-2", performEdit ? 7 : 14)}
                <Col md={1} />
                {InputElement("State", "", "mt-2", 9)}
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <ReturnChild menu_key={4} action_id={1}>
      <CustomCardHeader
        title="Stores CRUD"
        menu_key={4}
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
              <Col md={10}>
                <Input.Search
                  placeholder="Search by store name, store code, area, place..."
                  onChange={(e) => {
                    const search_str = e.target.value;
                    setParamObj((prev) => ({ ...prev, search_str }));
                  }}
                />
              </Col>
              <Col md={1} />
              <Col md={5}>
                <Form.Item label="Active Status">
                  <Select
                    style={{ width: "100%" }}
                    onChange={(is_active) => {
                      setParamObj((prev) => ({ ...prev, is_active }));
                    }}
                  >
                    <Select.Option value="">--Both--</Select.Option>
                    <Select.Option value="1">Active</Select.Option>
                    <Select.Option value="0">In-active</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        }
      >
        <p className="text-right mb-2">
          Stores Count: <b>{pagi.total}</b>
        </p>
        <Table<PharmaciesInterf>
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
        title="Add new store"
        open={addModal}
        onCancel={() => {
          setAddModal(false);
          setEditData({});
          form.resetFields();
        }}
        okText="Save"
        onOk={addNewPharmacy}
        confirmLoading={loader}
        maskClosable={false}
      >
        {getForm()}
      </Modal>
      <Modal
        title="Edit store"
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          setEditData({});
          form.resetFields();
        }}
        okText="Update"
        onOk={editPharmacy}
        confirmLoading={loader}
        maskClosable={false}
      >
        {getForm()}
      </Modal>
    </ReturnChild>
  );
};

export default StoresMenu;
