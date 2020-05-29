/**@jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useState } from "react";
import "codemirror/addon/runmode/runmode";
import "codemirror/mode/meta";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/css/css";
import "codemirror/mode/gfm/gfm";
import "codemirror/mode/python/python";
import "codemirror/mode/nginx/nginx";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/shell/shell";
import "codemirror/addon/edit/continuelist";
import "codemirror/addon/dialog/dialog";
import "./intentlist.js";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror";
import "codemirror/mode/htmlmixed/htmlmixed";
import { Controlled as CodeMirror, ICodeMirror } from "react-codemirror2";
import { Markdown } from "./Markdown";
function App() {
  const [value, setValue] = useState(
    "```shell\n$ sudo su\n$ apt-get upgrade\n```\n\n* I am trying \n  * dfdf \n\n`code`\n\n# dfd fd"
  );
  const handleDrop = (editor: ICodeMirror, event: DragEvent) => {
    if (!event.dataTransfer) return;

    const files = event.dataTransfer.files;
    if (files.length) {
      event.preventDefault();
      const file = files[0];
      console.log(file);
    }
  };

  const handlePaste = (editor: ICodeMirror, event: ClipboardEvent) => {
    console.log(event);
    if (event?.clipboardData?.files.length) {
      event.preventDefault();
      const file = event.clipboardData.files[0];
      console.log(file);
    }
  };
  return (
    <div
      className="App"
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin: 0 auto;
        min-width: 70vh;
        grid-column-gap: 20px;
      `}
    >
      <CodeMirror
        value={value}
        options={{
          mode: "gfm",
          theme: "solarized light",
          fencedCodeBlockHighlighting: true,
          indentUnit: 2,
          indentWithTabs: false,
          autoCloseBrackets: true,
          highlightFormatting: true,
          fencedCodeBlockDefaultMode: true,
          extraKeys: {
            Enter: "newlineAndIndentContinueMarkdownList",
            Tab: "autoIndentMarkdownList",
            "Shift-Tab": "autoUnindentMarkdownList",
          },
          lineWrapping: true,
        }}
        onBeforeChange={(editor, data, value) => setValue(value)}
        onDrop={handleDrop}
        onPaste={handlePaste}
      />
      <div
        css={css`
          font-family: "Nunito";
          overflow-y: scroll;
          height: 800px;
        `}
      >
        <Markdown source={value} />
        {/* <RMarkdown source={value} renderers={{ code: higlight }} /> */}
      </div>
    </div>
  );
}

export default App;
