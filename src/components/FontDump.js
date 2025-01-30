import React, { useState } from "react";
import { useFela } from "react-fela";
import { clickableRule } from "./commonRules";
import Table from "./Table";

const tableListEntryRule = () => ({
  background: "#F2F2F2",
  display: "flex",
  flexDirection: "column",
  justifySelf: "flex-start",
  padding: 20,
  borderRadius: 10,
  "& > * + *": {
    marginTop: 10,
  },
});

function TableListEntry({ data, pathKeys, gridColumn }) {
  const key = data.tagName;
  const [expanded, setExpanded] = useState();
  const { css } = useFela();

  function handleOnClick() {
    setExpanded(!expanded);
  }
  return (
    <div className={css(tableListEntryRule)} style={{ gridRow: data.tagName, gridColumn }}>
      <strong onClick={handleOnClick} className={css(clickableRule)}>{`${
        data.children.length ? (expanded ? "▲" : "▼") : ""
      } ${key}`}</strong>
      {expanded && <Table data={data} level={0} pathKeys={pathKeys} />}
    </div>
  );
}

function FontDump({ src, gridColumn }) {
  const parsedXml = new DOMParser().parseFromString(src, "application/xml");
  return [...parsedXml.children[0].children].map((child) => (
    <TableListEntry
      key={child.tagName}
      data={child}
      pathKeys={["&", child.tagName]}
      gridColumn={gridColumn}
    />
  ));
}

export default FontDump;
