"use client";
// InitializedMDXEditor.tsx
import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  InsertImage,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  codeMirrorPlugin,
  codeBlockPlugin,
  imagePlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import "./dark-editor.css";
import "@mdxeditor/editor/style.css";
import { useTheme } from "next-themes";
import { Separator } from "@radix-ui/react-dropdown-menu";
// Only import this to the next file

interface Props {
  value: string;
  fieldChange: (value: string) => void;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
}

const Editor = ({ value, editorRef, fieldChange, ...props }: Props) => {
  // define the theme for cm6-theme-basic-dark
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? [basicDark] : [];
  return (
    <MDXEditor
      key={resolvedTheme} // Ensure the editor re-renders on theme change
      className="border background-light800_dark200 light-border-2 markdown-editor w-full grid dark-editor"
      markdown={value}
      onChange={fieldChange}
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            plaintext: "plaintext",
            css: "css",
            javascript: "javascript",
            typescript: "typescript",
            python: "python",
            java: "java",
            c: "c",
            cpp: "cpp",
            sql: "sql",
            html: "html",
            xml: "xml",
            json: "json",
            bash: "bash",
            shell: "shell",
            scss: "scss",
            sass: "sass",
            yaml: "yaml",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        // Add a toolbar plugin if you want to use the toolbar
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "markdown",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />

                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
};

export default Editor;
