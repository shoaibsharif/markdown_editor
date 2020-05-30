import { Editor, Editor, Editor, Editor } from "codemirror";

declare module "codemirror" {
  interface CommandActions {
    autoUnindentMarkdownList(cm: Editor): void;
    autoIndentMarkdownList(cm: Editor): void;
    tableFormatAll(cm: Editor): void;
    tableFormat(cm: Editor): void;
    tableEscape(cm: Editor): void;
    tableAlignLeft(cm: Editor): void;
    tableAlignRight(cm: Editor): void;
    tableAlignCenter(cm: Editor): void;
    tableAlignNone(cm: Editor): void;
    tableSelectCell(cm: Editor): void;
    tableMoveLeft(cm: Editor): void;
    tableMoveRight(cm: Editor): void;
    tableMoveUp(cm: Editor): void;
    tableMoveDown(cm: Editor): void;
    tableNextCell(cm: Editor): void;
    tablePreviousCell(cm: Editor): void;
    tableNextRow(cm: Editor): void;
    tableInsertRow(cm: Editor): void;
    tableDeleteRow(cm: Editor): void;
    tableMoveRowUp(cm: Editor): void;
    tableMoveRowDown(cm: Editor): void;
    tableMoveColumnLeft(cm: Editor): void;
    tableInsertColumn(cm: Editor): void;
    tableDeleteColumn(cm: Editor): void;
    tableMoveColumnRight(cm: Editor): void;
  }
}
