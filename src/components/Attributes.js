import React from "react";
import { useFela } from "react-fela";
import Input from "./Input";


const attributesRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    marginLeft: 10,
  },
});

function Attributes({ data, pathKeys }) {
  const { css } = useFela();
  let entries = [...data.attributes].filter(attribute => attribute.specified).map(attribute => [attribute.name, attribute.value])
  if (data.textContent) {
    entries.push(["value", data.textContent])
  }
  return entries.map(([key, value]) => (
    <span key={key} className={css(attributesRule)}>
      <span>{key}</span>
      <Input pathKeys={pathKeys} lastKey={key} value={value.trim()} />
    </span>
  ));
}

export default Attributes;
