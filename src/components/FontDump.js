import React, { useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";
import { clickableRule } from "./commonRules";
import Table from "./Table";


const tableListEntryRule = () => ({
  background: "#F2F2F2",
  padding: 20,
  borderRadius: 10,
  "& + *": {
    marginTop: 5,
  },
  "& > * + *": {
    marginTop: 10,
  },
});

const mainRule = () => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

function TableListEntry({ data }) {
  const key = Object.keys(data)[0];
  const [expanded, setExpanded] = useState();
  const { css } = useFela();

  function handleOnClick() {
    setExpanded(!expanded);
  }
  return (
    <div className={css(tableListEntryRule)}>
      <strong onClick={handleOnClick} className={css(clickableRule)}>{`${
        expanded ? "▲" : "▼"
      } ${key}`}</strong>
      {expanded && <Table data={data} level={0} pathKeys={["&"]} />}
    </div>
  );
}

function FontDump({ src }) {
  const json = convertXML(src);
  const key = Object.keys(json)[0];
  const { css } = useFela();
  return (
    <div className={css(mainRule)}>
      {json[key].children.map((child) => (
        <TableListEntry key={key} data={child} />
      ))}
    </div>
  );
}

export default FontDump;
