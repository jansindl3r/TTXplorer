import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { useFela } from "react-fela";
import FontDump from "@/components/FontDump";
import Button from "@/components/Button";
import FileInput from "@/components/FileInput";

const buttonWrapperRule = {
  display: "flex",
  "& > * + *": {
    marginLeft: 5,
  },
  marginBottom: 20,
};

const loadingRule = {
  color: "white"
}

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

function Index() {
  const { css } = useFela();
  const [output, setOutput] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loadingPyodide, setLoadingPyodide] = useState(true);
  const rawXmlFont = useRef(null);

  function handleOnChange(e) {
    return e.target.files[0].arrayBuffer()
      .then((arrayBuffer) => processFont(arrayBuffer))
      .then((fontXml) => {
        setOutput(fontXml);
        const parser = new DOMParser();
        const xmlData = parser.parseFromString(fontXml, "application/xml");
        rawXmlFont.current = xmlData;
      })
      .catch((error) => {
        console.error("Error processing font:", error);
      })
      .finally((response) => {
        console.log(response)
        setFileName(e.target.files[0].name);
      })
  }

  function handleOnExport(e) {
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

  useEffect(() => {

    loadPyodide().then((pyodide) => {
      window.pyodide = pyodide;
      window.pyodide.loadPackage("fonttools").then(() => {
        setLoadingPyodide(false);
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
      <TTXContext.Provider value={{ rawXmlFont }}>
        <div>
          <div className={css(buttonWrapperRule)}>
            <FileInput
              onChange={handleOnChange}
              label="Choose File"
              accept=".ttf,.otf"
              disabled={loadingPyodide}
            ></FileInput>
            <Button tag="button" onClick={handleOnExport} disabled={!output}>
              Export
            </Button>
          </div>
          {loadingPyodide && <span className={css(loadingRule)}>Loading Libraries...</span>}
          {output && <FontDump src={filterAllXmlComments(output)} />}
        </div>
      </TTXContext.Provider>
    </>
  );
}

export default Index;
