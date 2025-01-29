import React, { useContext, useState } from "react";
import Row from "./Row";
import { useFela } from "react-fela";
import { cellRule, rowLegendRule } from "./commonRules";

const INDENT = 1;

const tableRule = ({ level, columnsKeysLength }) => ({
  paddingLeft: `${level * INDENT}ch`,
  extend: [
    {
      condition: columnsKeysLength === 0,
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
      },
    },
    {
      condition: columnsKeysLength > 0,
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${columnsKeysLength + 1}, max-content)`,
      },
    },
  ],
});

function getColumnsKeys(data) {
  const key = Object.keys(data)[0];
  const columnsKeys = [
    ...Object.values(data[key]).reduce((acc, child) => {
      const key = Object.keys(child)[0];
      const childData = child[key];
      for (const childKey of Object.keys(childData)) {
        acc.add(childKey);
      }
      return acc;
    }, new Set()),
  ];
  return columnsKeys;
}

function Table({ data, level, pathKeys }) {
  const key = Object.keys(data)[0];
  const { children } = data[key];
  const columnsKeys =
    Object.values(data[key]).length === 1
      ? getColumnsKeys(data[key]).filter((key) => key !== "children")
      : [];
  const { css } = useFela({
    level,
    columnsKeysLength: columnsKeys.length,
  });
  return (
    <div className={css(tableRule)}>
      {columnsKeys.length ? (
        <div className={css(cellRule, rowLegendRule)}></div>
      ) : null}
      {columnsKeys.map((uniqueKey) => (
        <strong className={css(cellRule)}>{uniqueKey}</strong>
      ))}
      {children?.map((child, index) => (
        <>
          <Row
            child={child}
            columnsKeys={columnsKeys}
            level={level + 1}
            pathKeys={[...pathKeys, index]}
          ></Row>
        </>
      ))}
    </div>
  );
}

export default Table;
