import Editor from "@monaco-editor/react";
import { Play, Loader2, Save } from "lucide-react";
import { useTheme } from "next-themes";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { AvailLanguage } from "@/types/judge0";
import { judge0ToMonacoMap } from "@/constants/judge0";
import { submitCodeParams } from "@/hooks/useJudge0";
import { useEffect } from "react";

type Props = {
  languages: AvailLanguage[];
  code: string;
  languageId: string;

  // functions
  onLanguageIdChange: (langId: string) => void;
  onCodeChange: (value: string) => void;
  onSubmitCode: ({ source_code, language_id }: submitCodeParams) => void;
  isSubmitting: boolean;
  onSaveProblem: () => void;
  isSaving: boolean;
};

const CodeEditor = (props: Props) => {
  const { theme } = useTheme();

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      props.onCodeChange(value);
    }
  };

  const handleCodeSubmit = async () => {
    await props.onSubmitCode({
      source_code: props.code,
      language_id: props.languageId,
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex justify-start items-center gap-2">
        <Combobox
          keyword={"language"}
          selections={props.languages.map((lang) => {
            return { value: lang.id, label: lang.name };
          })}
          defaultValue={props.languageId}
          onSelectChange={props.onLanguageIdChange}
        />
        <Button
          onClick={handleCodeSubmit}
          className="bg-secondary hover:bg-secondary/80"
          disabled={props.isSubmitting}
        >
          <div className="flex_center gap-1.5">
            {props.isSubmitting ? (
              <Loader2 className="text-blue-600 hover:text-blue-500 h-4 w-4 animate-spin" />
            ) : (
              <Play className="text-green-600 hover:text-green-500 h-4 w-4" />
            )}
            <span className="font-semibold text-green-600 hover:text-green-500">
              {props.isSubmitting ? "Running..." : "Run Code"}
            </span>
          </div>
        </Button>
        <Button
          onClick={props.onSaveProblem}
          className="bg-secondary hover:bg-secondary/80"
          disabled={props.isSaving}
        >
          <div className="flex_center gap-1.5">
            {props.isSaving ? (
              <Loader2 className="text-blue-600 hover:text-blue-500 h-4 w-4 animate-spin" />
            ) : (
              <Save className="text-blue-600 hover:text-blue-500 h-4 w-4" />
            )}
            <span className="font-semibold text-blue-600 hover:text-blue-500">
              {props.isSaving ? "Saving..." : "Save Problem"}
            </span>
          </div>
        </Button>
      </div>
      <div className="border rounded-md">
        <Editor
          height="100vh"
          defaultLanguage={judge0ToMonacoMap[props.languageId]}
          value={props.code}
          onChange={handleCodeChange}
          theme={theme === "light" ? "light" : "vs-dark"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            automaticLayout: true,
            overviewRulerBorder: false,
            lineNumbers: "on",
            roundedSelection: false,
            selectOnLineNumbers: true,
            quickSuggestions: true,
            ariaLabel: "code editor",
            renderLineHighlight: "line",
            contextmenu: true,
          }}
          saveViewState={true}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
