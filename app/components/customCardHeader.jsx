import CardFixedTop from "./cardFixedTop";
import ReturnChild from "./ReturnChild";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

export const CustomCardHeader = (props) => {
  return (
    <CardFixedTop title={props.title}>
      <ul>
        <ReturnChild menu_key={props.menu_key} action_id={2}>
          <li onClick={props.onClickNew}>
            <button>
              <PlusOutlined /> New
            </button>
          </li>
        </ReturnChild>
        <li onClick={props.onClickRefresh}>
          <button>
            <ReloadOutlined /> Refresh
          </button>
        </li>
      </ul>
    </CardFixedTop>
  );
};
