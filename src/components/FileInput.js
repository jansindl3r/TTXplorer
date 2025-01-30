import React, { useState } from "react";
import Button from "./Button";

function FileInput({ onChange, label: initialLabel }) {
  const [label, setLabel] = useState(initialLabel);
  function handleOnChange(e) {
    if (e.target.files.length === 0) {
      setLabel(initialLabel);
    } else {
      const { name } = e.target.files[0];
      setLabel(name);
      if (onChange) {
        onChange(e);
      }
    }
  }
  return (
    <Button tag="label">
      <span>{label}</span>
      <input type="file" hidden onChange={handleOnChange}></input>
    </Button>
  );
}

export default FileInput;
