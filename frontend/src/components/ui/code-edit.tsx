
import Editor from '@monaco-editor/react';

type Props = {}

const CodeEditor = (props: Props) => {

  


  return (
    <Editor 
      height="100vh" 
      defaultLanguage="javascript" 
      defaultValue="// some comment" 
      theme="vs-dark"
    />
  )
}

export default CodeEditor