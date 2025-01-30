import React, { createContext, useEffect, useState } from "react";
import Button from "@/components/Button";
import FontColumn from "@/components/FontColumn";
import Head from "next/head";
import { useFela } from "react-fela";

const fontGridRule = ({ rows }) => ({
  display: "grid",
  gridTemplateRows: rows.map((row) => `[${row}] auto`).join(" "),
  gridAutoFlow: "column",
  gridRowGap: 10,
  gap: `${5}px ${25}px`,
  justifyContent: "start",
});

const layoutRule = () => ({
  display: "flex",
  flexDirection: "column",
  padding: 20,
  gap: 10,
});

export const IndexContext = createContext();

function Index() {
  const [numberOfFonts, setNumberOfFonts] = useState([0]);
  const [rows, setRowsOriginal] = useState(["__buttons__"]);

  function setRows(rows) {
    setRowsOriginal([
      "__buttons__",
      ...rows.filter((row) => rows.includes(row)),
    ]);
  }

  const { css } = useFela({ rows });

  function handleOnAddFontClick(e) {
    setNumberOfFonts([...numberOfFonts, e.timeStamp]);
  }

  useEffect(() => {
    loadPyodide().then((pyodide) => {
      window.pyodide = pyodide;
      window.pyodide.loadPackage("fonttools").then(() => {
        window.pyodide.runPythonAsync(`
          import io
          import base64
          from fontTools.ttLib import TTFont
      
          def process_font(file_content):
            try:
              bytes_data = bytes(file_content)
              bytes_io = io.BytesIO(bytes_data)
              tt_font = TTFont(bytes_io)
              string_output = io.StringIO()
              xml = tt_font.saveXML(string_output)
              tt_font.close()
              return string_output.getvalue()
            except Exception as e:
              return str(e)
            
          def export_font(font_xml):
            xml = io.StringIO(font_xml)
            tt_font = TTFont()
            tt_font.importXML(xml)
            bytes_output = io.BytesIO()
            tt_font.save(bytes_output)
            base64_output = base64.b64encode(bytes_output.getvalue())
            return base64_output.decode('utf-8')
        `);
      });
    });
  }, []);

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js"></script>
      </Head>
      <IndexContext.Provider value={{ rows, setRows }}>
        <div className={css(fontGridRule)}>
          {numberOfFonts.map((font, index) => (
            <FontColumn key={index} gridColumn={index + 1} />
          ))}
          <div
            style={{
              gridRowStart: 1,
              gridRowEnd: -1,
              position: "relative",
              // display: "flex",
            }}
          >
            <div
              style={{
                pointerEvents: "none",
                border: "1px dashed red",
                margin: -10,
                borderRadius: 10,
                // display: "flex",
                // alignItems: "center",
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            ></div>
            <Button
              onClick={handleOnAddFontClick}
            >
              Add Font
            </Button>
          </div>
        </div>
      </IndexContext.Provider>
    </>
  );
}

export default Index;
