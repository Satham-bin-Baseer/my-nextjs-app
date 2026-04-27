"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Input, Row, Col, Form, Select, Drawer } from "antd";
import { Modal } from "antd";
import type { TableProps } from "antd";
import toast from "react-hot-toast";
import ReturnChild from "../components/ReturnChild";
import { Axios } from "../utilities/axiosConfig";
import AddOrderDrawer from "./addOrderDrawer";
import EditOrderDrawer from "./editOrderDrawer";
import { jwtDecode } from "jwt-decode";
import { CustomCardHeader } from "../components/customCardHeader";
import { ProfileOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  TablePaginationSize,
  generateSerialNumber,
  genColCenter,
  genColLeft,
  momentDate,
  userJWT,
  getQueryParam,
  today,
} from "../utilities";

interface StockReqOrder {
  _id: number;
  pharmacy_code: number;
  pharmacy_name: string;
  ordered_date: string;
  editable: boolean;
  emp_name: string;
  emp_gender: string;
  emp_designation: string;
  status: number;
}

const StockRequest = () => {
  const [dataList, setDataList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showAddOrders, setShowAddOrder] = useState(false);
  const [showEditOrders, setShowEditOrder] = useState(false);
  const [itemsList, setItemsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [empList, setEmpList] = useState([]);
  const [pagi, setPagination] = useState(TablePaginationSize);
  const [paramObj, setParamObj] = useState({});
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [editDataOrder, setEditDataOrder] = useState<Partial<StockReqOrder>>(
    {},
  );

  const lc_user_token = localStorage.getItem("user_details");
  let ud = jwtDecode<userJWT>(lc_user_token as string);

  useEffect(() => {
    getItemsList();
    fetchRoles();
    loadStaff();
  }, []);

  useEffect(() => {
    const tO = setTimeout(() => {
      getData(1, TablePaginationSize.pageSize);
    }, 400);
    return () => clearTimeout(tO);
  }, [JSON.stringify(paramObj)]);

  useEffect(() => {
    if (fromDate && toDate) {
      if (fromDate > toDate) {
        toast.error("Incorrect Date Input");
      } else {
        setParamObj((prev) => ({
          ...prev,
          from_date: fromDate,
          to_date: toDate,
        }));
      }
    }
    if (!fromDate || !toDate) {
      setParamObj((prev) => ({
        ...prev,
        from_date: null,
        to_date: null,
      }));
    }
  }, [fromDate, toDate]);

  const getItemsList = () => {
    const URL = `api/items/list_items?status=1`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setItemsList(res["data"].data);
      }
    });
  };

  const fetchRoles = () => {
    const URL = `api/roles/list_roles?status=1`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setRolesList(res["data"].data);
      }
    });
  };

  const loadStaff = () => {
    const URL = `api/employees/list_employees?status=1`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setEmpList(res["data"].data);
      }
    });
  };

  const getData = (current: number, pageSize: number) => {
    if (ud.pharmacy_id || ud.role_name == "Developer") {
      setDataList([]);
      setLoader(true);
      const api_param = getQueryParam({
        ...paramObj,
        page: current,
        limit: pageSize,
      });
      const URL = `api/orders/list_orders?${api_param}`;
      Axios.post(URL, { pharmacy_id: ud.pharmacy_id }).then((res) => {
        if (res["data"].status == 1) {
          setDataList(res["data"].data);
          setPagination({ current, pageSize, total: res["data"].total });
        } else {
          toast.error(res["data"].message);
        }
        setLoader(false);
      });
    } else {
      toast.error("Link pharmacy details to the user");
    }
  };

  const handleRemove = (_id: number) => {
    setLoader(true);
    const URL = `api/orders/delete_order`;
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

  const handleRemoveConfirm = (_id: number) => {
    Modal.confirm({
      title: "Do you want to delete? It has the data inside...",
      onOk: () => handleRemove(_id),
    });
  };

  const columns: TableProps<StockReqOrder>["columns"] = [
    generateSerialNumber(pagi),
    genColCenter("Store Code", "pharmacy_code", 100),
    genColLeft("Store Name", "pharmacy_name", 250),
    {
      title: "Date & Time",
      width: 200,
      dataIndex: "ordered_date",
      render: (val) =>
        momentDate(val, "DD-MM-YYYY hh:mm A", "YYYY-MM-DD hh:mm A"),
    },
    {
      title: "Requester",
      render: (_t, item) => {
        const salutation = item.emp_gender == "male" ? "Mr." : "Ms.";
        const name = `${item.emp_name} (${item.emp_designation})`;
        return salutation + name;
      },
    },
    {
      title: "Manage",
      align: "center",
      width: 10,
      render: (_t, item) => (
        <>
          <ReturnChild menu_key={6} action_id={4}>
            <ProfileOutlined
              title="Edit Order"
              onClick={() => {
                setEditDataOrder(item);
                setShowEditOrder(true);
              }}
            />
          </ReturnChild>
          <ReturnChild menu_key={6} action_id={5}>
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

  return (
    <ReturnChild menu_key={6} action_id={1}>
      <CustomCardHeader
        title="Request Stock"
        menu_key={6}
        onClickNew={() => setShowAddOrder(true)}
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
              <Col md={5}>
                <Input.Search
                  placeholder="Search by store code..."
                  onChange={(e) => {
                    const search_str = e.target.value;
                    setParamObj((prev) => ({ ...prev, search_str }));
                  }}
                />
              </Col>
              <Col md={1} />
              <Col md={5}>
                <Form.Item label="From">
                  <Input
                    type="date"
                    max={momentDate(today, "YYYY-MM-DD")}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col md={1} />
              <Col md={4}>
                <Form.Item label="To">
                  <Input
                    type="date"
                    max={momentDate(today, "YYYY-MM-DD")}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col md={1} />
              <Col md={7}>
                <Form.Item label="Employee">
                  <Select
                    style={{ width: "100%" }}
                    showSearch={{ optionFilterProp: "children" }}
                    onChange={(emp_id) => {
                      setParamObj((prev) => ({ ...prev, emp_id }));
                    }}
                  >
                    <Select.Option value="">--All--</Select.Option>
                    {empList.map(({ _id, emp_name }) => (
                      <Select.Option key={_id} value={_id}>
                        {emp_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={14} />
              <Col md={10}>
                <Form.Item label="Designation">
                  <Select
                    style={{ width: "100%" }}
                    showSearch={{ optionFilterProp: "children" }}
                    onChange={(emp_designation) => {
                      setParamObj((prev) => ({ ...prev, emp_designation }));
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
            </Row>
          </>
        }
      >
        <p className="text-right mb-2">
          Total Requests for Invoice: <b>{pagi.total}</b>
        </p>
        <Table<StockReqOrder>
          size="small"
          columns={columns}
          dataSource={dataList}
          rowKey="_id"
          pagination={pagi}
          loading={loader}
          onChange={(pagi) => getData(pagi.current!, pagi.pageSize!)}
        />
      </Card>
      <Drawer
        title={`Create Order`}
        open={showAddOrders}
        onClose={() => setShowAddOrder(false)}
        size="large"
        destroyOnClose
        maskClosable={false}
        bodyStyle={{ padding: 0 }}
      >
        <AddOrderDrawer
          itemsList={itemsList}
          onSuccess={() => {
            setShowAddOrder(false);
            getData(1, TablePaginationSize.pageSize);
          }}
        />
      </Drawer>
      <Drawer
        title={`Edit Order: ${editDataOrder?.pharmacy_code} - ${editDataOrder?.pharmacy_name} (${momentDate(editDataOrder?.ordered_date, "DD-MM-YYYY hh:mm A", "YYYY-MM-DD hh:mm A")})`}
        open={showEditOrders}
        onClose={() => setShowEditOrder(false)}
        width={700}
        destroyOnClose
        maskClosable={false}
        bodyStyle={{ padding: 0 }}
      >
        <EditOrderDrawer
          itemsList={itemsList}
          editDataOrder={editDataOrder}
          onSuccess={() => setShowEditOrder(false)}
        />
      </Drawer>
    </ReturnChild>
  );
};

export default StockRequest;
