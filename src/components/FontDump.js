import React, { useState } from "react";
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

function TableListEntry({ data, pathKeys }) {
  const key = data.tagName
  const [expanded, setExpanded] = useState();
  const { css } = useFela();
  
  function handleOnClick() {
    setExpanded(!expanded);
  }
  return (
    <div className={css(tableListEntryRule)}>
       <strong onClick={handleOnClick} className={css(clickableRule)}>{`${
        data.children.length ? expanded ? "▲" : "▼" : ""
      } ${key}`}</strong>
      {expanded && <Table data={data} level={0} pathKeys={pathKeys} />}
    </div>
  );
}

function FontDump({ src }) {
  const parsedXml =  new DOMParser().parseFromString(src, "application/xml");
  const { css } = useFela();
  return (
    <div className={css(mainRule)}>
      {[...parsedXml.children[0].children].map((child) => (
          <TableListEntry key={child.tagName} data={child} pathKeys={["&", child.tagName]} />
      ))}
    </div>
  );
}

export default FontDump;
