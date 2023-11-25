import { useEffect, useState } from 'react';
import { styled } from "styled-components";
import { Button } from "./components/Button";
import { CodeEditor } from "./components/CodeEditor";
import { Errors } from "./components/Errors";
import { FileInput } from './components/FileInput';
import { Table } from "./components/Table";
import { Lexer } from './functions/lexer';
import { Parser } from './functions/parser';
import { Semantic } from './functions/semantic';
import { IToken } from './interfaces/token';

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

const ErrorsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

function App() {
  const [code, setCode] = useState("");
  const [file, setFile] = useState("");
  
  const [tableData, setTableData] = useState<IToken[]>([]);
  const [lexerErrorsData, setLexerErrorsData] = useState<string[]>([]);
  const [parserErrorsData, setParserErrorsData] = useState<string[]>([]);
  const [semanticErrorsData, setSemanticErrorsData] = useState<string[]>([]);

  const handleCompile = () => {
    const lexer = new Lexer(code);
    const {table, errors} = lexer.compile();
    setTableData(table);
    setLexerErrorsData(errors);
    if(errors.length === 0){
      const parser = new Parser(table);
      const parserErrors = parser.parse();
      setParserErrorsData(parserErrors);
      console.log(table);

      if(parserErrors.length === 0){
        const semantic = new Semantic(table);
        const semanticErrors = semantic.semantic(table);
        setSemanticErrorsData(semanticErrors);
      }
    }
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
      <ErrorsContainer>
        <Errors title={'Erros léxicos'} errors={lexerErrorsData} />
        <Errors title={'Erros sintáticos'} errors={parserErrorsData} />
        <Errors title={'Erros semânticos'} errors={semanticErrorsData}/> 
      </ErrorsContainer>
    </Container>
  );
}


export default App;