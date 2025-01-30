import React, { useContext, useEffect, useRef, useState } from "react";
import { useFela } from "react-fela";
import FontDump from "@/components/FontDump";
import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import { IndexContext } from "@/pages";

const buttonWrapperRule = {
  gridRow: "__buttons__",
  display: "flex",
  "& > * + *": {
    marginLeft: 10,
  },
  marginBottom: 10,
};

async function processFont(file) {
  const processFontPython = window.pyodide.globals.get("process_font");
  const fileContent = new Uint8Array(file);
  const result = processFontPython(fileContent);
  return result;
}

async function exportFont(fontXml) {
  const exportFontPython = window.pyodide.globals.get("export_font");
  const result = exportFontPython(fontXml);
  return result;
}

function filterAllXmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, "");
}

export const TTXContext = React.createContext();

function FontColumn({gridColumn}) {
  const { css } = useFela({gridColumn});
  const { rows, setRows } = useContext(IndexContext);
  const [output, setOutput] = useState(null);
  const [fileName, setFileName] = useState(null);
  const rawXmlFont = useRef(null);

  async function handleOnChange(e) {
    setFileName(e.target.files[0].name);
    const arrayBuffer = await e.target.files[0].arrayBuffer();
    const fontXml = await processFont(arrayBuffer);
    setOutput(fontXml);
    const parser = new DOMParser();
    const xmlData = parser.parseFromString(fontXml, "application/xml");
    rawXmlFont.current = xmlData;
    setRows([...xmlData.firstChild.children].map((child) => child.tagName));
  }

  async function handleOnExport(e) {
    const rawXmlFontString = new XMLSerializer().serializeToString(
      rawXmlFont.current
    );
    exportFont(rawXmlFontString)
      .then((base64Data) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${base64Data}`;
        link.download = `TTXplorer_${fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      <TTXContext.Provider value={{ rawXmlFont }}>
        <div className={css(buttonWrapperRule)} style={{ gridColumn}}>
          <FileInput
            onChange={handleOnChange}
            label="1. Choose File"
          ></FileInput>
          <Button type="button" onClick={handleOnExport}>
            Export
          </Button>
        </div>
        {output && <FontDump src={filterAllXmlComments(output)} gridColumn={gridColumn}/>}
        <div
          style={{
            border: "1px solid red",
            margin: -10,
            gridColumn,
            gridRowStart: 1,
            gridRowEnd: -1,
            pointerEvents: "none",
            borderRadius: 10,
          }}
        >
        </div>
      </TTXContext.Provider>
    </>
  );
}

export default FontColumn;
