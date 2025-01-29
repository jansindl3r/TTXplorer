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
    paddingLeft: 10,
  },
});

const expandableTableRule = () => ({
  gridColumn: "1 / -1",
  width: "100%",
});

function Row({ child, columnsKeys, level, pathKeys }) {
  const [expanded, setExpanded] = useState(false);
  const { css } = useFela({ level });
  const key = Object.keys(child)[0];

  return (
    <>
      <div className={css(cellRule, rowLegendRule)}>
        {"children" in child[key] ? (
          <i
            className={css(clickableRule)}
            onClick={() => setExpanded(!expanded)}
          >
            {`${expanded ? "▲" : "▼"} ${key}`}
          </i>
        ) : columnsKeys.length ? (
          <i>{key}</i>
        ) : (
          <i className={css(attributesWrapperRule)}>
            <span>{key}</span>
            <Attributes data={child[key]} pathKeys={[...pathKeys]} />
          </i>
        )}
      </div>
      {columnsKeys.map((uniqueKey, index) => (
        <div className={css(cellRule)}>
          {child?.[key]?.[uniqueKey] && (
            <Input
              type={
                key === "assembly" && uniqueKey === "content"
                  ? "textarea"
                  : "text"
              }
              value={child[key][uniqueKey]}
              pathKeys={pathKeys}
              lastKey={uniqueKey}
            />
          )}
        </div>
      ))}
      
      <div className={css(expandableTableRule)}>
        {expanded && (
          <Table
            data={child}
            level={level}
            pathKeys={[...pathKeys]}
            expanded={expanded}
          />
        )}
      </div>
    </>
  );
}

export default Row;
