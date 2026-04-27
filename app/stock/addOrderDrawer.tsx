"use client";

import React, { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { Button, Input, Select, Spin } from "antd";
import { momentDate, userJWT } from "../utilities";
import { Axios } from "../utilities/axiosConfig";
import { jwtDecode } from "jwt-decode";

interface OrderInterface {
  id: number;
  item_id: number;
  quantity: number;
}

const AddOrderDrawer = (props: any) => {
  const [loader, setLoader] = useState(false);
  const [rows, setRows] = useState(1);
  const [orders, setOrders] = useState<OrderInterface[]>([]);

  const lc_user_token = localStorage.getItem("user_details");
  let ud = jwtDecode<userJWT>(lc_user_token as string);

  const rowObj = (index: number): OrderInterface => {
    return { id: Date.now() + index, item_id: 0, quantity: 1 };
  };

  const clearEmptyRows = () => {
    setOrders((prev) => prev.filter(({ item_id }) => Boolean(item_id)));
  };

  const handleRemoveRow = (INDEX: number) => {
    setOrders((prev) => prev.filter((_, index) => index !== INDEX));
  };

  const handleRowChange = (KEY: string, VALUE: number, INDEX: number) => {
    if (VALUE > 0) {
      const dd = [...orders];
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
      setOrders(dd);
    } else {
      toast.error("Minimum quantity is 1");
    }
  };

  const getTotalQty = () => {
    const res = [...orders].reduce((prev, curr) => prev + curr.quantity, 0);
    return res;
  };

  // console.log(ud.emp_id);

  const saveOrders = () => {
    const payload: Record<string, any> = {};
    payload["data"] = orders.filter(({ item_id }) => Boolean(item_id));
    payload["pharmacy_id"] = ud.pharmacy_id;
    payload["pharmacy_code"] = ud.pharmacy_code;
    payload["ordered_date"] = momentDate(new Date(), "YYYY-MM-DD hh:mm A");
    payload["emp_id"] = ud._id;

    if (payload["data"].length < 1) {
      toast.error("Create order first");
      return;
    }
    setLoader(true);
    const URL = `api/orders/create_order`;
    Axios.post(URL, payload).then((res) => {
      if (res["data"].status == 1) {
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
                  .fill(null)
                  .map((_, i) => rowObj(i));
                setOrders((prev) => [...prev, ...newRows]);
                setRows(1);
              } else {
                setOrders((prev) => [...prev, rowObj(prev.length)]);
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
            onClick={saveOrders}
          >
            <CheckOutlined />
            Save Order
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
            {orders.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">{index + 1}.</td>
                <td>
                  <Select
                    className="w100"
                    showSearch={{ optionFilterProp: "label" }}
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
                    onClick={() => handleRemoveRow(index)}
                  />
                </th>
              </tr>
            ))}
          </tbody>
          {orders.length > 0 && (
            <tfoot>
              <tr>
                <td></td>
                <td className="text-right">
                  Total Items: <b>{orders.length}</b>
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

export default AddOrderDrawer;
