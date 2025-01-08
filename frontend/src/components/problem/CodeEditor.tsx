
import Editor from '@monaco-editor/react';
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
  onCodeChange: (value: string|undefined) => void;
  onSubmitCode: () => void;
}

const CodeEditor = (props: Props) => {
  const { theme } = useTheme();

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <Combobox
          keyword={"language"}
          selections={props.languages.map((lang)=> {
            return {value: lang.id, label: lang.name}})}
          defaultValue={props.languageId}
          onSelectChange={props.onLanguageIdChange}  
        />
        <Button
          onClick={props.onSubmitCode}
        >
          Run
        </Button>
      </div>
      <Editor 
        height="100vh" 
        defaultLanguage={judge0ToMonacoMap[props.languageId]}
        defaultValue="# your code"
        onChange={props.onCodeChange}
        theme={`${theme === "light" ? "" : "vs-dark"}`}
      />
    </div>
  )
}

export default CodeEditor