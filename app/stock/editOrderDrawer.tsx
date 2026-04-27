"use client";

import React, { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { Button, Input, Modal, Select, Spin } from "antd";
import { jwtDecode } from "jwt-decode";
import { StockReqItem, userJWT } from "../utilities";
import { Axios } from "../utilities/axiosConfig";

const EditOrderDrawer = (props: any) => {
  const [loader, setLoader] = useState(false);
  const [rows, setRows] = useState(1);
  const [dataList, setDataList] = useState<StockReqItem[]>([]);
  const [dataView, setDataView] = useState<StockReqItem[]>([]);

  useEffect(() => {
    getOrderByOrderId();
  }, []);

  const getOrderByOrderId = () => {
    setLoader(true);
    const URL = `api/orders/list_orders_by_order_id?order_id=${props.editDataOrder._id}`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
        setLoader(false);
      }
    });
  };

  const handleRemoveRow = (INDEX: number, editObj) => {
    if (editObj.item_id) {
      if (dataList.length < 2) {
        toast.error("Perform Overall Delete");
        return;
      }
      Modal.confirm({
        title: "Do you want to delete?",
        onOk: () => handleRemove(INDEX, editObj),
      });
    } else {
      setDataList((prev) => prev.filter((_, index) => index !== INDEX));
    }
  };

  const handleRemove = (INDEX, editOBJ) => {
    setLoader(true);
    const URL = `api/orders/delete_order_by_order_id?_id=${editOBJ._id}`;
    Axios.post(URL).then((res) => {
      if (res["data"].status == 1) {
        setDataList((prev) => prev.filter((_, index) => index !== INDEX));
        toast.success(res["data"].message);
      } else {
        toast.error(res["data"].message);
      }
      setLoader(false);
    });
  };

  const rowObj = (index: number): StockReqItem => {
    return {
      _id: Date.now() + index,
      item_id: null,
      quantity: 1,
      order_id: props.editDataOrder._id,
      status: 0,
    };
  };

  const handleRowChange = (KEY: string, VALUE: number, INDEX: number) => {
    if (VALUE > 0) {
      const dd = [...dataList];
      if (KEY == "item_id") {
        const existingIndex = dd.findIndex(
          (o, i) => o.item_id === VALUE && i !== INDEX,
        );
        if (existingIndex > -1) {
          toast.error(`Item already added in the row ${existingIndex + 1}`);
          return;
        }
      }
      dd[INDEX] = { ...dd[INDEX], [KEY]: VALUE };
      setDataList(dd);
    } else {
      toast.error("Minimum quantity is 1");
    }
  };

  const clearEmptyRows = () => {
    setDataList((prev) => prev.filter(({ item_id }) => Boolean(item_id)));
  };

  const getTotalQty = () => {
    const res = [...dataList].reduce((prev, curr) => prev + curr.quantity, 0);
    return res;
  };

  const updateOrders = () => {
    const formattedData = dataList.filter(({ item_id }) => Boolean(item_id));
    const data = formattedData.filter((dl) => {
      const found = dataView.find(
        (dv) => dv.item_id == dl.item_id && dv.quantity == dl.quantity,
      );
      if (found?.item_id) return false;
      else return true;
    });
    if (data.length < 1) {
      toast.error("No changes made");
      return;
    }
    if (!window.confirm("Do you want to update?")) return;
    setLoader(true);
    const URL = `api/orders/update_orders_by_order_ids`;
    Axios.post(URL, { data }).then((res) => {
      if (res["data"].status === 1) {
        toast.success(res["data"].message);
        props.onSuccess();
      } else {
        toast.error(res["data"].message);
      }
      setLoader(false);
    });
  };

  return (
    <Spin spinning={loader}>
      <div className="mx-4">
        <p
          className="text-right sticky-position m-0"
          style={{
            top: "0",
            zIndex: "10",
            background: "rgba(240, 233, 233, 1)",
            padding: "4px 0",
          }}
        >
          <Button
            size="small"
            className="mx-4 p-2"
            type="primary"
            onClick={clearEmptyRows}
          >
            Clear Empty Rows
          </Button>
          <Input
            size="small"
            value={rows}
            style={{ width: 70 }}
            onChange={(e) => setRows(Number(e.target.value))}
          />
          <Button
            className="p-2 mx-2"
            size="small"
            type="text"
            onClick={() => {
              if (rows && typeof rows == "number") {
                const newRows = Array(rows)
                  .fill("")
                  .map((_, i) => rowObj(i));
                setDataList((prev) => [...prev, ...newRows]);
                setRows(1);
              } else {
                setDataList((prev) => [...prev, rowObj(prev.length)]);
              }
            }}
          >
            <PlusOutlined /> Add
          </Button>
          <Button
            size="small"
            className="mx-2 p-2"
            color="green"
            variant="solid"
            onClick={updateOrders}
          >
            <CheckOutlined />
            Update Order
          </Button>
        </p>
        <table className="permission-table w100 mt-2">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>S.No</th>
              <th align="left">Item Name</th>
              <th style={{ width: "120px" }}>Quantity</th>
              <th style={{ width: "80px" }}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={item._id}>
                <td className="text-center">{index + 1}.</td>
                <td>
                  <Select
                    className="w100"
                    showSearch={{ optionFilterProp: "label" }}
                    defaultValue={item.item_id}
                    onChange={(val) => handleRowChange("item_id", val, index)}
                    options={props.itemsList.map((item: any) => ({
                      value: item._id,
                      label: `${item.item_name} (${item.item_type})`,
                    }))}
                  />
                </td>
                <td>
                  <input
                    style={{ width: 70 }}
                    value={item.quantity}
                    onChange={(e) =>
                      handleRowChange(
                        "quantity",
                        parseInt(e.target.value),
                        index,
                      )
                    }
                  />
                </td>
                <th>
                  <DeleteOutlined
                    title="Remove"
                    onClick={() => handleRemoveRow(index, item)}
                  />
                </th>
              </tr>
            ))}
          </tbody>
          {dataList.length > 0 && (
            <tfoot>
              <tr>
                <td></td>
                <td className="text-right">
                  Total Items: <b>{dataList.length}</b>
                </td>
                <td>
                  Qty: <b>{getTotalQty()}</b>
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Spin>
  );
};

export default EditOrderDrawer;
