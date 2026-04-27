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
  generateSerialNumber,
  genColLeft,
  genColCenter,
  ItemsInterface,
  getQueryParam,
} from "../utilities";

const ItemsMenu = () => {
  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [pagi, setPagination] = useState(TablePaginationSize);
  const [paramObj, setParamObj] = useState({});
  const [editData, setEditData] = useState<Partial<ItemsInterface>>({});

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
    const URL = `api/items/list_items?${api_param}`;
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
    const URL = `api/items/delete_item`;
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

  const columns: TableProps<ItemsInterface>["columns"] = [
    generateSerialNumber(pagi),
    genColLeft("Item Name", "item_name", 5000),
    genColCenter("Type", "item_type"),
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
          <ReturnChild menu_key={7} action_id={4}>
            <EditOutlined
              title="Edit"
              onClick={() => {
                setEditModal(true);
                setEditData(item);
                form.setFieldsValue(item);
              }}
            />
          </ReturnChild>
          <ReturnChild menu_key={7} action_id={5}>
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

  const addNewItem = async () => {
    const values = await form.validateFields();
    setLoader(true);
    const URL = `api/items/add_item`;
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

  const editItem = async () => {
    const values = await form.validateFields();
    if (!window.confirm("Do you want to update?")) return;
    setLoader(true);
    const payload = { ...editData, ...values };
    const URL = `api/items/update_item`;
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

  const getTypes = () => {
    const t = ["Tablet", "Syrup", "Capsule", "Sachet", "Vial", "Ampoule"];
    const res = t.map((item) => (
      <Select.Option value={item}>{item}</Select.Option>
    ));
    return res;
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
              initialValues={{ is_active: true }}
            >
              <Row>
                {InputElement("", "is_active", " ", 0, "", {}, false, "", true)}
                {InputElement("Item Name", "", " ")}
                <Col md={10} className="mt-2">
                  <Form.Item
                    label="Type"
                    name="item_type"
                    rules={[{ required: true, message: "Select this" }]}
                  >
                    <Select>{getTypes()}</Select>
                  </Form.Item>
                </Col>
                <Col md={4} />
                {editData._id && (
                  <Col md={10} className="mt-2">
                    <Form.Item label="Active Status" name="is_active">
                      <Select>
                        <Select.Option value={true}>Active</Select.Option>
                        <Select.Option value={false}>In-active</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <ReturnChild menu_key={7} action_id={1}>
      <CustomCardHeader
        title="Items CRUD"
        menu_key={7}
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
                  placeholder="Search by item name..."
                  onChange={(e) => {
                    const item_name = e.target.value;
                    setParamObj((prev) => ({ ...prev, item_name }));
                  }}
                />
              </Col>
              <Col md={1} />
              <Col md={5}>
                <Form.Item label="Item Type">
                  <Select
                    style={{ width: "100%" }}
                    onChange={(item_type) => {
                      setParamObj((prev) => ({ ...prev, item_type }));
                    }}
                  >
                    <Select.Option value="">--All--</Select.Option>
                    {getTypes()}
                  </Select>
                </Form.Item>
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
          Items Count: <b>{pagi.total}</b>
        </p>
        <Table<ItemsInterface>
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
        title="Add new item"
        open={addModal}
        onCancel={() => {
          setAddModal(false);
          setEditData({});
          form.resetFields();
        }}
        okText="Save"
        onOk={addNewItem}
        confirmLoading={loader}
        maskClosable={false}
        width={450}
      >
        {getForm()}
      </Modal>
      <Modal
        title="Edit item"
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          setEditData({});
          form.resetFields();
        }}
        okText="Update"
        onOk={editItem}
        confirmLoading={loader}
        maskClosable={false}
      >
        {getForm()}
      </Modal>
    </ReturnChild>
  );
};

export default ItemsMenu;
