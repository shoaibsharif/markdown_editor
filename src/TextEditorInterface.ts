import { Point, ITextEditor } from "@susisu/mte-kernel";

// See https://doc.esdoc.org/github.com/susisu/mte-kernel/class/lib/text-editor.js~ITextEditor.html

export class TextEditorInterface extends ITextEditor {
  editor: CodeMirror.Editor;
  doc: CodeMirror.Doc;
  transaction: boolean;
  onDidFinishTransaction: any;
  constructor(editor: CodeMirror.Editor) {
    super();
    this.editor = editor;
    this.doc = editor.getDoc();
    this.transaction = false;
    this.onDidFinishTransaction = null;
  }

  getCursorPosition() {
    const { line, ch } = this.doc.getCursor();
    return new Point(line, ch);
  }

  setCursorPosition(pos) {
    this.doc.setCursor({ line: pos.row, ch: pos.column });
  }

  setSelectionRange(range) {
    this.doc.setSelection(
      { line: range.start.row, ch: range.start.column },
      { line: range.end.row, ch: range.end.column }
    );
  }

  getLastRow() {
    return this.doc.lineCount() - 1;
  }

  acceptsTableEdit() {
    return true;
  }

  getLine(row) {
    return this.doc.getLine(row);
  }

  insertLine(row, line) {
    const lastRow = this.getLastRow();
    if (row > lastRow) {
      const lastLine = this.getLine(lastRow);
      this.doc.replaceRange(
        "\n" + line,
        { line: lastRow, ch: lastLine.length },
        { line: lastRow, ch: lastLine.length }
      );
    } else {
      this.doc.replaceRange(
        line + "\n",
        { line: row, ch: 0 },
        { line: row, ch: 0 }
      );
    }
  }

  deleteLine(row: number) {
    const lastRow = this.getLastRow();
    if (row >= lastRow) {
      if (lastRow > 0) {
        const preLastLine = this.getLine(lastRow - 1);
        const lastLine = this.getLine(lastRow);
        this.doc.replaceRange(
          "",
          { line: lastRow - 1, ch: preLastLine.length },
          { line: lastRow, ch: lastLine.length }
        );
      } else {
        const lastLine = this.getLine(lastRow);
        this.doc.replaceRange(
          "",
          { line: lastRow, ch: 0 },
          { line: lastRow, ch: lastLine.length }
        );
      }
    } else {
      this.doc.replaceRange("", { line: row, ch: 0 }, { line: row + 1, ch: 0 });
    }
  }

  replaceLines(startRow: number, endRow: number, lines: string[]) {
    const lastRow = this.getLastRow();
    if (endRow > lastRow) {
      const lastLine = this.getLine(lastRow);
      this.doc.replaceRange(
        lines.join("\n"),
        { line: startRow, ch: 0 },
        { line: lastRow, ch: lastLine.length }
      );
    } else {
      this.doc.replaceRange(
        lines.join("\n") + "\n",
        { line: startRow, ch: 0 },
        { line: endRow, ch: 0 }
      );
    }
  }

  transact(func: Function) {
    this.transaction = true;
    func();
    this.transaction = false;
    if (this.onDidFinishTransaction) {
      this.onDidFinishTransaction.call(undefined);
    }
  }
}

// export class CodeMirrorTextEditor {
//   private cm: CodeMirror.Editor;
//   constructor(cm: CodeMirror.Editor) {
//     this.cm = cm;
//   }

//   public getCursorPosition() {
//     const cursor = this.cm.getCursor();
//     return new Point(cursor.line, cursor.ch);
//   }

//   /**
//    * Sets the cursor position to a specified one.
//    *
//    * @param {Point} pos - A point object which the cursor position is set to.
//    * @returns {undefined}
//    */
//   setCursorPosition(pos: CodeMirror.Position): void {
//     this.cm.setCursor(this.pointToPos(pos));
//   }

//   /**
//    * Sets the selection range.
//    * This method also expects the cursor position to be moved as the end of the selection range.
//    *
//    * @param {Range} range - A range object that describes a selection range.
//    * @returns {undefined}
//    */
//   setSelectionRange(range): void {
//     this.cm.setSelection(
//       this.pointToPos(range.start),
//       this.pointToPos(range.end)
//     );
//   }

//   /**
//    * Gets the last row index of the text editor.
//    *
//    * @returns {number} The last row index.
//    */
//   getLastRow(): number {
//     return this.cm.lastLine() + 1;
//   }

//   /**
//    * Checks if the editor accepts a table at a row to be editted.
//    * It should return `false` if, for example, the row is in a code block (not Markdown).
//    *
//    * @param {number} row - A row index in the text editor.
//    * @returns {boolean} `true` if the table at the row can be editted.
//    */
//   acceptsTableEdit(): boolean {
//     return true;
//   }

//   /**
//    * Gets a line string at a row.
//    *
//    * @param {number} row - Row index, starts from `0`.
//    * @returns {string} The line at the specified row.
//    * The line must not contain an EOL like `"\n"` or `"\r"`.
//    */
//   getLine(row: number): string {
//     return this.cm.getLine(row);
//   }

//   /**
//    * Inserts a line at a specified row.
//    *
//    * @param {number} row - Row index, starts from `0`.
//    * @param {string} line - A string to be inserted.
//    * This must not contain an EOL like `"\n"` or `"\r"`.
//    * @return {undefined}
//    */
//   insertLine(row: number, line: string): void {
//     if (row < this.getLastRow()) {
//       this.cm.replaceRange(line + "\n", new Pos(row, 0));
//     } else {
//       this.cm.replaceRange("\n" + line, new Pos(row));
//     }
//   }

//   /**
//    * Deletes a line at a specified row.
//    *
//    * @param {number} row - Row index, starts from `0`.
//    * @returns {undefined}
//    */
//   deleteLine(row: number): void {
//     this.cm.replaceRange("", new Pos(row, 0), new Pos(row + 1, 0));
//   }

//   /**
//    * Replace lines in a specified range.
//    *
//    * @param {number} startRow - Start row index, starts from `0`.
//    * @param {number} endRow - End row index.
//    * Lines from `startRow` to `endRow - 1` is replaced.
//    * @param {Array<string>} lines - An array of string.
//    * Each strings must not contain an EOL like `"\n"` or `"\r"`.
//    * @returns {undefined}
//    */
//   replaceLines(startRow: number, endRow: number, lines: string[]): void {
//     for (let i = startRow; i < endRow; i++) {
//       this.cm.replaceRange(
//         lines[i - startRow],
//         new Pos(i, 0),
//         new Pos(i, this.getLine(i).length)
//       );
//     }
//   }

//   /**
//    * Batches multiple operations as a single undo/redo step.
//    *
//    * @param {Function} func - A callback function that executes some operations on the text editor.
//    * @returns {undefined}
//    */
//   transact(func: Function): void {
//     this.cm.operation(() => func());
//   }

//   /**
//    * Converts a Point object into a CodeMirror Pos object.
//    *
//    * @param {Point} point - A point to convert.
//    * @returns {Pos} The pos the point is converted to.
//    */
//   pointToPos(point) {
//     return new Pos(point.row, point.column);
//   }
// }
