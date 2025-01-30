import { useState } from "react";
import { useFela } from "react-fela";
import Input from "./Input";
import { cellRule, clickableRule, rowLegendRule } from "./commonRules";
import Table from "./Table";
import Attributes from "./Attributes";

const attributesWrapperRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    marginLeft: 10,
  },
});

const expandableTableRule = () => ({
  gridColumn: "1 / -1",
  width: "100%",
});

function Row({ child, columnKeys, level, pathKeys }) {
  const [expanded, setExpanded] = useState(false);
  const { css } = useFela({ level });
  const tag = child.tagName;

  return (
    <>
      <div className={css(cellRule, rowLegendRule)}>
        {child.children.length ? (
          <i
            className={css(clickableRule)}
            onClick={() => setExpanded(!expanded)}
          >
            {`${expanded ? "▲" : "▼"} ${tag}`}
          </i>
        ) : columnKeys.length ? (
          <i>{tag}</i>
        ) : (
          // This could be a table as well, sometimes?
          // update: maybe it is already?? 🤔
          <i className={css(attributesWrapperRule)}>
            <span>{tag}</span>
            <Attributes data={child} pathKeys={[...pathKeys]} />
          </i>
        )}
      </div>
      {columnKeys.map((columnKey, index) => (
        <div key={columnKey + index} className={css(cellRule)}>
          {(child.getAttribute(columnKey) || (columnKey === "textContent")) && (
            <Input
              type={
                child.tagName === "assembly" && columnKey === "textContent"
                  ? "textarea"
                  : "text"
              }
              value={child.getAttribute(columnKey) || child.textContent.trim()}
              pathKeys={pathKeys}
              lastKey={columnKey}
            />
          )}
        </div>
      ))}
      <div className={css(expandableTableRule)}>
        {expanded && (
          <Table
            data={child}
            level={level}
            pathKeys={pathKeys}
          />
        )}
      </div>
    </>
  );
}

export default Row;
