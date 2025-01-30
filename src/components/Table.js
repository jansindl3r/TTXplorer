import React, { useContext, useState } from "react";
import Row from "./Row";
import { useFela } from "react-fela";
import { cellRule, rowLegendRule } from "./commonRules";
import { getColumnsKeys } from "@/misc";
const INDENT = 1;

const tableRule = ({ level, columnKeysLength }) => ({
  paddingLeft: `${level * INDENT}ch`,
  extend: [
    {
      condition: columnKeysLength === 0,
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
      },
    },
    {
      condition: columnKeysLength > 0,
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${columnKeysLength + 1}, max-content)`,
      },
    },
  ],
});

function Table({ data, level, pathKeys }) {
  const columnKeys = getColumnsKeys(data);
  console.log(columnKeys)
  const { css } = useFela({
    level,
    columnKeysLength: columnKeys.length,
  });
  return (
    <div className={css(tableRule)}>
      {columnKeys.length ? (
        <div className={css(cellRule, rowLegendRule)}></div>
      ) : null}
      {columnKeys.map((columnKey) => (
        <strong className={css(cellRule)}>{columnKey}</strong>
      ))}
      {[...data.children]?.map((child, index) => (
        <Row
          child={child}
          columnKeys={columnKeys}
          level={level + 1}
          pathKeys={[...pathKeys, index]}
        ></Row>
      ))}
    </div>
  );
}

export default Table;
