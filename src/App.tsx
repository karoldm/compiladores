import { useEffect, useState } from 'react';
import { styled } from "styled-components";
import { Button } from "./components/Button";
import { CodeEditor } from "./components/CodeEditor";
import { Errors } from "./components/Errors";
import { FileInput } from './components/FileInput';
import { Table } from "./components/Table";
import { compileLexer } from './functions/lexer';
import { Parser } from './functions/parser';
import { ITokens } from './interfaces/table';

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
  const [errorsData, setErrorsData] = useState<string[]>([]);

  const handleCompile = () => {
    console.log('handle compile')
    const {table, errors} = compileLexer(code);
    console.log(errors)
    setTableData(table);
    setErrorsData(errors);
    //const parser = new Parser(table);
    //const parserErrors = parser.parse();
    //console.log(parserErrors);
  }

  useEffect(() => {
    setCode(file);
  }, [file]);

  return (
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
      <Errors errors={errorsData} />
    </Container>
  );
}


export default App;
