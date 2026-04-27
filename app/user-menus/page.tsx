"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Modal, Row, Col, Input } from "antd";
import type { TableProps } from "antd";
import CardFixedTop from "../components/cardFixedTop";
import toast from "react-hot-toast";
import { PlusOutlined } from "@ant-design/icons";
import ReturnChild from "../components/ReturnChild";
import { generateSerialNumber, TablePaginationSize } from "../utilities";
import { Axios } from "../utilities/axiosConfig";

interface DataType {
  _id: number;
  menuname_key: string;
  status: number;
}

const UserMenus = () => {
  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [menuKey, setMenuKey] = useState("");
  const [pagi, setPagination] = useState(TablePaginationSize);

  useEffect(() => {
    getData(pagi.current, pagi.pageSize);
  }, []);

  const getData = (current: number, pageSize: number) => {
    setDataList([]);
    setLoader(true);
    const URL = `api/user-menus/list_menus?page=${current}&limit=${pageSize}`;
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

  const columns: TableProps<DataType>["columns"] = [
    generateSerialNumber(pagi),
    { title: "Menu Key", dataIndex: "menuname_key" },
    { title: "Menu Key ID", dataIndex: "_id", width: 130, align: "center" },
  ];

  const addMenuKey = () => {
    if (menuKey.trim()) {
      const formattedKey = menuKey.split(" ").join("_");
      setLoader(true);
      const URL = `api/user-menus/add_menu`;
      Axios.post(URL, { menuname_key: formattedKey }).then((res) => {
        if (res["data"].status == 1) {
          toast.success(res["data"].message);
          getData(pagi.current, pagi.pageSize);
          setMenuKey("");
          setAddModal(false);
        } else {
          toast.error(res["data"].message);
          setLoader(false);
        }
      });
    } else {
      toast.error("Enter key name");
    }
  };

  return (
    <>
      <ReturnChild menu_key={0} action_id={1}>
        <CardFixedTop title="User Menu CRUD">
          <ul>
            <ReturnChild menu_key={0} action_id={2}>
              <li onClick={() => setAddModal(true)}>
                <button>
                  <PlusOutlined /> New
                </button>
              </li>
            </ReturnChild>
          </ul>
        </CardFixedTop>
        <Card className="mx-1">
          <p className="text-right mb-2">
            Menus Count: <b>{pagi.total}</b>
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
        title="Add new menu key"
        open={addModal}
        onCancel={() => {
          setAddModal(false);
          setMenuKey("");
        }}
        okText="Add"
        onOk={addMenuKey}
        confirmLoading={loader}
        maskClosable={false}
      >
        <Card>
          <Row>
            <Col span={24}>
              <Input
                value={menuKey}
                onChange={(e) => setMenuKey(e.target.value.toLowerCase())}
                style={{ width: "100%" }}
                placeholder="Ex. user_access_playlist"
              />
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  );
};

export default UserMenus;
