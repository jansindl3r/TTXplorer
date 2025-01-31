import React, { useState } from "react";
import { useFela } from "react-fela";
import { clickableRule } from "./commonRules";
import Table from "./Table";


const tableListEntryRule = ({theme}) => ({
  background: theme.background,
  ...theme.buttonPadding,
  borderRadius: theme.borderRadius,
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
       <span onClick={handleOnClick} className={css(clickableRule)}>{`${
        data.children.length ? expanded ? "▲" : "▼" : ""
      } ${key}`}</span>
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
