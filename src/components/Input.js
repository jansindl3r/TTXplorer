import React, { useContext, useEffect, useRef, useState } from "react";
import { TTXContext } from "@/pages";
import { useFela } from "react-fela";

const inputRule = {
  border: "none",
  width: "100%",
  minWidth: "2ch",
  paddingHorizontal: 4,
  borderRadius: 4,
  fontFamily: "monospace",
};

const textAreaRule = {
  width: "70ch",
  fontSize: "inherit",
};

function buildQuerySelectorPath(keys) {
    return keys.reduce((acc, key, index) => {
      if (typeof key === "number") {
        return `${acc} > *:nth-child(${key + 1})`;
      }
      if (index === 0) {
        return key;
      } else {
        return `${acc} > ${key}`;
      }
    }, "");
  }

function Input({ type, value, pathKeys, lastKey }) {
  const { rawXmlFont } = useContext(TTXContext);
  const [size, setSize] = useState(Math.max(value?.length ?? 1, 5));
  const [rows, setRows] = useState(20);
  const textareaRef = useRef()
  const { css } = useFela();
  value = value?.trim();

  function handleOnChange(e) {
    const { value } = e.target
    const path = buildQuerySelectorPath(pathKeys);
    let originalValue;
    try {
      if (lastKey === "textContent") {
        originalValue = rawXmlFont.current.querySelector(path).textContent;
        rawXmlFont.current.querySelector(path).textContent = value;
      } else {
        originalValue = rawXmlFont.current
        .querySelector(path)
        .getAttribute(lastKey);
        rawXmlFont.current.querySelector(path).setAttribute(lastKey, value);
      }
      console.log({ originalValue });
      setSize(Math.max(value.length, 4));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 0
      const height = textareaRef.current.scrollHeight
      const fontSize = parseFloat(window.getComputedStyle(textareaRef.current).fontSize)
      setRows(Math.min(Math.floor(height / fontSize), 20))
      textareaRef.current.style.removeProperty("height")

    }

  }, [value]);

  if (type === "textarea" || value.trim().length > 40) {
    return (
      <textarea
        className={css(inputRule, textAreaRule)}
        rows={rows}
        onChange={handleOnChange}
        ref={textareaRef}
      >
        {value}
      </textarea>
    );
  } else {
    return (
      <input
        type="text"
        size={size}
        className={css(inputRule)}
        defaultValue={value}
        onChange={handleOnChange}
      />
    );
  }
}

export default Input;
