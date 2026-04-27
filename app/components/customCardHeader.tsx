import CardFixedTop from "./cardFixedTop";
import ReturnChild from "./ReturnChild";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

interface CardHeaderProps {
  title: string;
  menu_key: number;
  onClickNew: () => void;
  onClickRefresh: () => void;
}

export const CustomCardHeader = (props: CardHeaderProps) => {
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
