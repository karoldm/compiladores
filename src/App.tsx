import { useEffect, useState } from 'react';
import { styled } from "styled-components";
import { Button } from "./components/Button";
import { CodeEditor } from "./components/CodeEditor";
import { Errors } from "./components/Errors";
import { FileInput } from './components/FileInput';
import { Table } from "./components/Table";
import { Lexer } from './functions/lexer';
import { Parser } from './functions/parser';
import { ITokens } from './interfaces/table';
import Tabs from './components/Errors/TabComponent';
import FirstTab from './components/Errors/AllTabs/FirstTab';
import SecondTab from './components/Errors/AllTabs/SecondTab';

const Container = styled.main`
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr;
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
  gap: 1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: start;
  padding-bottom: 1rem;
  flex-wrap: wrap;
`;

function App() {
  const [code, setCode] = useState("");
  const [file, setFile] = useState("");
  
  const [tableData, setTableData] = useState<ITokens[]>([]);
  const [activeTab, setActiveTab] = useState<string>("lexer");
  const [errorsDataLexer, setErrorsDataLexer] = useState<string[]>([]);
  const [errorsDataParser, setErrorsDataParser] = useState<string[]>([]);


  const handleCompile = () => {
    const lexer = new Lexer(code);
    const {table, errors} = lexer.compile();
    setTableData(table);
    setErrorsDataLexer(errors);
    
    const parser = new Parser(table);
    const parserErrors = parser.parse();
    setErrorsDataParser(parserErrors);
  }

  useEffect(() => {
    setCode(file);
  }, [file]);

  return (
    <>
    <Container>
      <div style={{display: 'flex', width: '100%', flexDirection: 'column'}}>
        <ButtonsContainer>
          <FileInput setFile={setFile} />
          <div style={{display: 'flex', gap: '1rem'}}>
            <Button onClick={handleCompile} background="blue" title="compilar" />
            <Button onClick={() => {}} background="#04AA6D" title="salvar arquivo" />
          </div>
        </ButtonsContainer>
        <CodeEditor code={code} setCode={setCode} />
      </div>
      <Table columns={["lexema", "token", "linha", "coluna_inicial", "coluna_final"]} datas={tableData} />
      {/* <Errors errors={errorsData} /> */}
      <Tabs setActiveTab={setActiveTab} activeTab={activeTab}/>
      {activeTab === 'lexer' ? <FirstTab errors={errorsDataLexer} /> : 
      <SecondTab errors={errorsDataParser} />}  
    </Container>
    </>
  );
}


export default App;
