import {
  acceptCompletion,
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldKeymap,
  indentOnInput,
  indentUnit,
  StreamLanguage,
  syntaxHighlighting,
} from "@codemirror/language";
import { r } from "@codemirror/legacy-modes/mode/r";
import { lintGutter, lintKeymap } from "@codemirror/lint";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { EditorState, Extension } from "@codemirror/state";
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";

export function getExtensions(
  opts: { lineNumbers?: boolean } = { lineNumbers: true }
): Extension {
  const extensions = [
    // lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    // foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    indentUnit.of("    "),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    // highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      autocompleteWithTab,
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
  ];

  if (opts.lineNumbers) {
    extensions.push(lineNumbers(), lintGutterWithCustomTheme());
  }

  return extensions;
}

const autocompleteWithTab = { key: "Tab", run: acceptCompletion };

export function getBinaryFileExtensions(): Extension {
  return [EditorView.editable.of(false)];
}

const LANG_EXTENSIONS: Record<string, () => Extension> = {
  python: python,
  javascript: javascript,
  html: html,
  css: css,
  r: () => StreamLanguage.define(r),
};

export function getLanguageExtension(filetype: string | null): Extension {
  if (filetype === null) return [];
  if (!(filetype in LANG_EXTENSIONS)) return [];

  return LANG_EXTENSIONS[filetype]();
}

function lintGutterWithCustomTheme() {
  // lintGutter() returns an Extension[], but it's marked as Extension.
  let extensions = lintGutter() as Extension[];

  // Remove the original theme. Filter by iterating over the Extensions and
  // checking each one if it is of the same class as our custom theme. This may
  // be fragile if, for example, lintGutter() changes in the future to nest
  // Extensions differently.
  extensions = extensions.filter(
    // Compare .constructor to see if the classes match.
    (ext) => ext.constructor !== lintGutterCustomTheme.constructor
  );
  extensions.push(lintGutterCustomTheme);

  return extensions;
}

const lintGutterCustomTheme = EditorView.baseTheme({
  ".cm-gutter-lint": {
    width: "0.3em",
    "& .cm-gutterElement": {
      padding: "0 0 0 0.1em",
    },
  },
  ".cm-lint-marker": {
    opacity: "0.6",
    height: "100%",
  },
  ".cm-lint-marker-info": {
    "background-color": "#999",
  },
  ".cm-lint-marker-warning": {
    "background-color": "orange",
  },
  ".cm-lint-marker-error": {
    "background-color": "#d11",
  },
});
