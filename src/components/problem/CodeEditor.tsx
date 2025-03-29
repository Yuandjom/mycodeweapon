import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { AvailLanguage } from "@/types/judge0";
import { judge0ToMonacoMap } from "@/constants/judge0";
import { submitCodeParams } from "@/hooks/useJudge0";

type Props = {
  languages: AvailLanguage[];
  code: string;
  languageId: string;

  // functions
  onLanguageIdChange: (langId: string) => void;
  onCodeChange: (value: string) => void;
  onSubmitCode: ({ source_code, language_id }: submitCodeParams) => void;
  isSubmitting: boolean;
  showHeader?: boolean; // Optional prop to control header visibility
};

const CodeEditor = (props: Props) => {
  const { theme } = useTheme();

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      props.onCodeChange(value);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="border border-teal-500/20 rounded-md overflow-hidden relative shadow-md shadow-teal-500/10 h-full">
        {/* Editor wrapper with decorative elements */}
        <div className="relative h-full">
          <Editor
            height="100%"
            defaultLanguage={judge0ToMonacoMap[props.languageId]}
            value={props.code}
            onChange={handleCodeChange}
            theme={theme === "light" ? "light" : "vs-dark"}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 4,
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
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
            }}
            saveViewState={true}
            loading={
              <div className="flex items-center justify-center h-full bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
                  <p className="text-sm text-teal-600 dark:text-teal-400 animate-pulse">
                    Loading editor...
                  </p>
                </div>
              </div>
            }
          />

          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-500/30" />
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
