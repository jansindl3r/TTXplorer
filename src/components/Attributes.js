import React from "react";
import { useFela } from "react-fela";


const attributesRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    paddingLeft: 10,
  },
});

function Attributes({ data, pathKeys }) {
  const { css } = useFela();

  return Object.entries(data).map(([key, value]) => (
    <span key={key} className={css(attributesRule)}>
      <span>{key}</span>
      <Input pathKeys={pathKeys} lastKey={key} value={value.trim()} />
    </span>
  ));
}

export default Attributes;
