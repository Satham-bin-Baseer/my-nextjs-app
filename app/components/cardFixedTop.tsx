import React from "react";

interface CardFixedTopProps {
  title: string;
  children?: React.ReactNode;
}

const CardFixedTop = (props: CardFixedTopProps) => {
  return (
    <div
      className="d-flex sticky-position"
      style={{
        justifyContent: "space-between",
        padding: "8px 15px",
        background: "#e6e1e1",
        top: 34.5,
        zIndex: 10,
      }}
    >
      <p className="fw-bold m-0">{props.title}</p>
      <div className="card-fixed-top-actions align-center">
        {props.children}
      </div>
    </div>
  );
};

export default CardFixedTop;
