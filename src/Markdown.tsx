import React, { useEffect } from "react";
import markdownIt from "markdown-it";
import * as prism from "prismjs";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "./prism/shades-of-purple.css";
import loadPrismLanguage from "./prism/loadPrismLangage";

const md = markdownIt({
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    const esc = md.utils.escapeHtml;
    try {
      loadPrismLanguage(esc(lang.toLowerCase()));
      return (
        `<pre class="line-numbers language-${esc(
          lang.toLowerCase()
        )}" data-language="${esc(lang.toLowerCase())}" >` +
        `<code class="language-${esc(lang.toLowerCase())}" >` +
        str +
        "</code>" +
        "</pre>"
      );
    } catch (error) {
      return (
        `<pre class="line-numbers language-${esc(
          lang.toLowerCase()
        )}" data-language="${esc(lang.toLowerCase())}" >` +
        `<code class="language-${esc(lang.toLowerCase())}" >` +
        str +
        "</code>" +
        "</pre>"
      );
    }
  },
});

md.use(require("markdown-it-anchor").default, {
  permalink: true,
})
  .use(require("markdown-it-table-of-contents"))
  .use(require("markdown-it-sub"))
  .use(require("markdown-it-sup"))
  .use(require("markdown-it-footnote"))
  .use(require("markdown-it-abbr"))
  .use(require("markdown-it-multimd-table"));

md.renderer.rules.table_open = function () {
  return '<table class="table table-striped">\n';
};
export const Markdown = ({ source }: { source: string }) => {
  useEffect(() => {
    prism.highlightAll();
    const anchors = document.getElementsByClassName("header-anchor");
    for (let i = 0; i < anchors.length; i++) {
      anchors[i].innerHTML =
        '<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>';
    }
  }, [source]);
  return <div dangerouslySetInnerHTML={{ __html: md.render(source) }} />;
};
