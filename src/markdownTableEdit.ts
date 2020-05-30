import {
  TableEditor,
  options,
  Alignment,
  FormatType,
  HeaderAlignment,
} from "@susisu/mte-kernel/dist/mte-kernel.js";
import { TextEditorInterface } from "./TextEditorInterface";
import CodeMirror from "codemirror";

export class Editor {
  private readonly cm: CodeMirror.Editor;
  originalTableHelpers: any;
  tableEditor: any;
  cursorActivityListener: () => void;
  editorinf: TextEditorInterface;
  constructor(cm: CodeMirror.Editor) {
    this.cm = cm;
    this.editorinf = new TextEditorInterface(this.cm);
    this.tableEditor = new TableEditor(this.editorinf);

    this.cursorActivityListener = () => this.update();
    this.cm.on("cursorActivity", this.cursorActivityListener);
    this.cm.on("changes", () => {
      if (!this.editorinf.transaction) this.cursorActivityListener();
    });
    this.editorinf.onDidFinishTransaction = () => {
      this.cursorActivityListener();
    };
  }

  update() {
    const keyMap = CodeMirror.normalizeKeyMap({
      Tab: () => {
        this.tableEditor.nextCell(this.getOptions());
      },
      "Shift-Tab": () => {
        this.tableEditor.previousCell(this.getOptions());
      },
      Enter: () => {
        this.tableEditor.nextRow(this.getOptions());
      },
      "Ctrl-Enter": () => {
        this.tableEditor.escape(this.getOptions());
      },
      "Cmd-Enter": () => {
        this.tableEditor.escape(this.getOptions());
      },
      "Shift-Ctrl-Left": () => {
        this.tableEditor.alignColumn(Alignment.LEFT, this.getOptions());
      },
      "Shift-Cmd-Left": () => {
        this.tableEditor.alignColumn(Alignment.LEFT, this.getOptions());
      },
      "Shift-Ctrl-Right": () => {
        this.tableEditor.alignColumn(Alignment.RIGHT, this.getOptions());
      },
      "Shift-Cmd-Right": () => {
        this.tableEditor.alignColumn(Alignment.RIGHT, this.getOptions());
      },
      "Shift-Ctrl-Up": () => {
        this.tableEditor.alignColumn(Alignment.CENTER, this.getOptions());
      },
      "Shift-Cmd-Up": () => {
        this.tableEditor.alignColumn(Alignment.CENTER, this.getOptions());
      },
      "Shift-Ctrl-Down": () => {
        this.tableEditor.alignColumn(Alignment.NONE, this.getOptions());
      },
      "Shift-Cmd-Down": () => {
        this.tableEditor.alignColumn(Alignment.NONE, this.getOptions());
      },
      "Ctrl-Left": () => {
        this.tableEditor.moveFocus(0, -1, this.getOptions());
      },
      "Cmd-Left": () => {
        this.tableEditor.moveFocus(0, -1, this.getOptions());
      },
      "Ctrl-Right": () => {
        this.tableEditor.moveFocus(0, 1, this.getOptions());
      },
      "Cmd-Right": () => {
        this.tableEditor.moveFocus(0, 1, this.getOptions());
      },
      "Ctrl-Up": () => {
        this.tableEditor.moveFocus(-1, 0, this.getOptions());
      },
      "Cmd-Up": () => {
        this.tableEditor.moveFocus(-1, 0, this.getOptions());
      },
      "Ctrl-Down": () => {
        this.tableEditor.moveFocus(1, 0, this.getOptions());
      },
      "Cmd-Down": () => {
        this.tableEditor.moveFocus(1, 0, this.getOptions());
      },
      "Ctrl-K Ctrl-I": () => {
        this.tableEditor.insertRow(this.getOptions());
      },
      "Cmd-K Cmd-I": () => {
        this.tableEditor.insertRow(this.getOptions());
      },
      "Ctrl-L Ctrl-I": () => {
        this.tableEditor.deleteRow(this.getOptions());
      },
      "Cmd-L Cmd-I": () => {
        this.tableEditor.deleteRow(this.getOptions());
      },
      "Ctrl-K Ctrl-J": () => {
        this.tableEditor.insertColumn(this.getOptions());
      },
      "Cmd-K Cmd-J": () => {
        this.tableEditor.insertColumn(this.getOptions());
      },
      "Ctrl-L Ctrl-J": () => {
        this.tableEditor.deleteColumn(this.getOptions());
      },
      "Cmd-L Cmd-J": () => {
        this.tableEditor.deleteColumn(this.getOptions());
      },
      "Alt-Shift-Ctrl-Left": () => {
        this.tableEditor.moveColumn(-1, this.getOptions());
      },
      "Alt-Shift-Cmd-Left": () => {
        this.tableEditor.moveColumn(-1, this.getOptions());
      },
      "Alt-Shift-Ctrl-Right": () => {
        this.tableEditor.moveColumn(1, this.getOptions());
      },
      "Alt-Shift-Cmd-Right": () => {
        this.tableEditor.moveColumn(1, this.getOptions());
      },
      "Alt-Shift-Ctrl-Up": () => {
        this.tableEditor.moveRow(-1, this.getOptions());
      },
      "Alt-Shift-Cmd-Up": () => {
        this.tableEditor.moveRow(-1, this.getOptions());
      },
      "Alt-Shift-Ctrl-Down": () => {
        this.tableEditor.moveRow(1, this.getOptions());
      },
      "Alt-Shift-Cmd-Down": () => {
        this.tableEditor.moveRow(1, this.getOptions());
      },
    });
    const isInTable = this.tableEditor.cursorIsInTable(this.getOptions());

    if (isInTable) {
      this.cm.setOption("extraKeys", keyMap);
    } else {
      this.cm.setOption("extraKeys", null);
      this.tableEditor.resetSmartCursor();
    }
  }
  getOptions() {
    return options({
      formatType: FormatType.NORMAL,
      headerAlignment: HeaderAlignment.FOLLOW,
      smartCursor: true,
    });
  }
}

// CodeMirror.commands = {
//   ...CodeMirror.commands,
//   tableFormatAll: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.formatAll();
//   },

//   tableFormat: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.format();
//   },
//   tableEscape: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.escape();
//   },
//   tableAlignLeft: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.align(Alignment.LEFT);
//   },
//   tableAlignRight: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.align(Alignment.RIGHT);
//   },
//   tableAlignCenter: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.align(Alignment.CENTER);
//   },
//   tableAlignNone: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.align(Alignment.NONE);
//   },
//   tableSelectCell: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.selectCell();
//   },
//   tableMoveLeft: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveFocus(0, -1);
//   },
//   tableMoveRight: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveFocus(0, 1);
//   },
//   tableMoveUp: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveFocus(-1, 0);
//   },

//   tableMoveDown: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveFocus(1, 0);
//   },
//   tableNextCell: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.nextCell();
//   },
//   tablePreviousCell: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.previousCell();
//   },
//   tableNextRow: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.nextRow();
//   },
//   tableInsertRow: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.insertRow();
//   },
//   tableDeleteRow: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.deleteRow();
//   },
//   tableMoveRowUp: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveRow(-1);
//   },
//   tableMoveRowDown: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveRow(1);
//   },
//   tableInsertColumn: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.insertColumn();
//   },
//   tableDeleteColumn: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.deleteColumn();
//   },

//   tableMoveColumnLeft: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveColumn(-1);
//   },
//   tableMoveColumnRight: (cm: CodeMirror.Editor) => {
//     const tableEditor = new Editor(cm);
//     tableEditor.moveColumn(1);
//   },
// };
