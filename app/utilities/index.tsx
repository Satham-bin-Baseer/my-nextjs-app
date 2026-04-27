import { Form, Input, Col } from "antd";
import { ColumnType } from "antd/es/table";
import moment from "moment";
import qs from "qs";

export const getQueryParam = (obj: Record<string, any>): string => {
  return qs.stringify(obj, {
    skipNulls: true,
    filter: (_key: any, value: any) => (value === "" ? undefined : value),
  });
};

export const today = new Date();

export const momentDate = (
  dt: any,
  format = "DD-MM-YYYY",
  initial?: string,
) => {
  if (dt) {
    return initial
      ? moment(dt, initial).format(format)
      : moment(dt).format(format);
  }
  return "";
};

export const generateSerialNumber = (pagination): ColumnType<any> => {
  return {
    title: "S.No",
    width: 10,
    align: "center",
    render: (_t, _i, index) =>
      (pagination.current - 1) * pagination.pageSize + index + 1,
  };
};

export const genColLeft = (title, dataIndex, width = 10): ColumnType<any> => {
  return {
    title,
    dataIndex,
    width,
  };
};

export const genColCenter = (title, dataIndex, width = 10): ColumnType<any> => {
  return {
    title,
    dataIndex,
    width,
    align: "center",
  };
};

export interface PermissionIF {
  _id: number;
  role_id: number;
  menu_key: number;
  action_id: number;
  status: number;
}

export interface userJWT {
  _id: number;
  emp_name: string;
  emp_dob: string;
  emp_gender: string;
  emp_join_date: string;
  emp_role: number;
  status: number;
  role_name: string;
  pharmacy_id: number;
  pharmacy_code: number;
  pharmacy_name: string;
}

export interface PharmaciesInterf {
  _id: number;
  pharmacy_name: string;
  area: string;
  pharmacy_code: number;
  opening_date: string;
  is_active: boolean;
  district: string;
  state: string;
  status: number;
}

export interface ItemsInterface {
  _id: number;
  item_name: string;
  item_type: string;
  is_active: boolean;
  status: number;
}

export interface StockReqItem {
  _id: number;
  item_id: number | null;
  quantity: number;
  order_id: number;
  status: number;
}

export const TablePaginationSize = {
  current: 1,
  pageSize: 10,
  total: 0,
};

export const InputElement = (
  label: string,
  name: string,
  className: string = "mt-2",
  md: number = 24,
  type = "text",
  style = {},
  readOnly = false,
  message = "Fill this",
  hidden = false,
) => {
  if (!name) name = label.split(" ").join("_").toLowerCase();
  return (
    <Col md={md} className={className}>
      <Form.Item
        label={label}
        name={name}
        rules={[{ required: true, message }]}
        hidden={hidden}
      >
        <Input type={type} style={{ ...style }} readOnly={readOnly} />
      </Form.Item>
    </Col>
  );
};
