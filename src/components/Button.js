import { changeColor } from "@/misc";
import React from "react";
import { useFela } from "react-fela";

const buttonRule = ({ theme, disabled }) => {
  const bgColor = disabled ? "#FDFDFD" : "#F2F2F2";
  return {
    border: "none",
    ...theme.buttonPadding,
    borderRadius: theme.borderRadius,
    backgroundColor: bgColor,
    cursor: "pointer",
    display: "inline-block",
    width: "auto",
    fontSize: "inherit",
    fontFamily: "inherit",
    extend: [
      {
        condition: disabled,
        style: {
          cursor: "not-allowed",
          color: "silver"
        },
      },
      {
        condition: !disabled,
        style: {
          ":hover": {
            backgroundColor: changeColor(bgColor, 0.1),
          },
        },
      },
    ],
  };
};

function Button({ tag = "div", onClick, children, disabled, ...kwargs }) {
  const { css } = useFela({ disabled });
  return React.createElement(
    tag,
    {
      className: css(buttonRule),
      ...(onClick ? { onClick } : {}),
      disabled,
      ...kwargs,
    },
    children
  );
}

export default Button;
