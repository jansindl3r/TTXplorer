import React from "react";
import { useFela } from "react-fela";

const buttonRule = {
  border: "none",
  padding: 10,
  borderRadius: 4,
  backgroundColor: "#F2F2F2",
  cursor: "pointer",
  display: "inline-block",
};

function Button({ tag="div", children }) {
  const { css } = useFela();
  return React.createElement(tag, { className: css(buttonRule) }, children);
}

export default Button;
