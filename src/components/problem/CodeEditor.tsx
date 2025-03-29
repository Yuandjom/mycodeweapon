import Editor from "@monaco-editor/react";
import { Play, Loader2, Code, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { AvailLanguage } from "@/types/judge0";
import { judge0ToMonacoMap } from "@/constants/judge0";
import { submitCodeParams } from "@/hooks/useJudge0";
import Timer from "@/components/utils/Timer";
import { cn } from "@/lib/utils";

type Props = {
  languages: AvailLanguage[];
  code: string;
  languageId: string;

  // functions
  onLanguageIdChange: (langId: string) => void;
  onCodeChange: (value: string) => void;
  onSubmitCode: ({ source_code, language_id }: submitCodeParams) => void;
  isSubmitting: boolean;
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
    <div className="w-full h-full flex flex-col">
      <div className="border border-teal-500/20 rounded-md overflow-hidden relative shadow-md shadow-teal-500/10 h-full">
        {/* Integrated header bar with controls */}
        <div className="w-full bg-gradient-to-r from-teal-600 to-green-600 flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Code className="h-4 w-4 text-white/90 mr-2" />
              <div className="w-48">
                <Combobox
                  keyword={"language"}
                  selections={props.languages.map((lang) => {
                    return { value: lang.id, label: lang.name };
                  })}
                  defaultValue={props.languageId}
                  onSelectChange={props.onLanguageIdChange}
                  className="border-white/20 focus-within:ring-white/30 backdrop-blur-sm bg-white/10 text-white hover:bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-white/20 backdrop-blur-sm bg-white/10">
              <Clock className="h-3.5 w-3.5 text-white/80" />
              <Timer className="text-white/90 font-mono text-xs" />
            </div>
          </div>

          <div>
            <Button
              onClick={handleCodeSubmit}
              className={cn(
                "h-8 transition-all border-none shadow-md shadow-green-600/30 rounded px-3 py-1 group relative overflow-hidden",
                props.isSubmitting
                  ? "bg-slate-700/80"
                  : "bg-green-400/25 hover:bg-green-300/50"
              )}
              disabled={props.isSubmitting}
            >
              <div className="flex items-center gap-1.5 relative z-10">
                {props.isSubmitting ? (
                  <Loader2 className="text-white h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="text-white h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-medium text-white text-sm">
                  {props.isSubmitting ? "Running..." : "Run"}
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Editor wrapper with decorative elements */}
        <div className="relative h-[calc(100%-2.5rem)]">
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
