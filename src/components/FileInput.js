import React, { useState } from "react";
import Button from "./Button";
import { useFela } from "react-fela";

const labelRule = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}

function FileInput({ onChange, label: initialLabel, disabled, ...kwargs }) {
  const [label, setLabel] = useState(initialLabel);
  const {css} = useFela();
  function handleOnChange(e) {
    if (e.target.files.length === 0) {
      setLabel(initialLabel);
    } else {
      const { name } = e.target.files[0];
      setLabel("Processing...");
      if (onChange) {
        onChange(e).then(() => {
          setLabel(name);
        }).catch(() => {
          setLabel(initialLabel);
        })
      }
    }
  }
  return (
    <Button tag="label" disabled={disabled}>
      <span className={css(labelRule)}>{label}</span>
      <input type="file" hidden onChange={handleOnChange} {...kwargs}></input>
    </Button>
  );
}

export default FileInput;
