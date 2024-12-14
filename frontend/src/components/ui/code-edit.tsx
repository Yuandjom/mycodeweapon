
import Editor from '@monaco-editor/react';
import {Combobox, comboBoxSelection} from '@/components/ui/combobox';
import { AvailLanguage } from '@/types/judge0';

type Props = {
  languages: AvailLanguage[]
}

const CodeEditor = (props: Props) => {



  return (
    <div className="w-full h-full flex flex-col">
      <Combobox keyword={"language"} selections={props.languages.map((lang)=> {
        return {value: lang.name, label: lang.name}
      })}/>
      <Editor 
        height="100vh" 
        defaultLanguage="javascript" 
        defaultValue="// some comment" 
        theme="vs-dark"
      />
    </div>
  )
}

export default CodeEditor