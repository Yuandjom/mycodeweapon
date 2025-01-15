
import Editor from '@monaco-editor/react';
import { Play, Loader2 } from "lucide-react";
import { useTheme } from 'next-themes'
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { AvailLanguage } from '@/types/judge0';
import { judge0ToMonacoMap } from '@/constants/judge0';

type Props = {
  languages: AvailLanguage[]
  code: string;
  languageId: string;

  // functions
  onLanguageIdChange: (langId:string) => void;
  onCodeChange: (value: string) => void;
  onSubmitCode: () => void;
  isSubmitting: boolean;
}

const CodeEditor = (props: Props) => {
  const { theme } = useTheme();

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      props.onCodeChange(value);
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex justify-start items-center gap-2">
        <Combobox
          keyword={"language"}
          selections={props.languages.map((lang)=> {
            return {value: lang.id, label: lang.name}})}
          defaultValue={props.languageId}
          onSelectChange={props.onLanguageIdChange}  
        />
        <Button
          onClick={props.onSubmitCode}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          disabled={props.isSubmitting}
        >
          <div className="flex_center gap-1.5">
            {props.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{props.isSubmitting ? "Submitting..." : "Submit"}</span>
          </div>
        </Button>
      </div>
      <div className="border rounded-md">
        <Editor 
          height="100vh"
          defaultLanguage={judge0ToMonacoMap[props.languageId]}
          defaultValue={props.code}
          onChange={handleCodeChange}
          theme={theme === "light" ? "light" : "vs-dark"}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor