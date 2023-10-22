
import { styled } from "styled-components";

const TextAreaCode = styled.textarea`
  height: 100%;
  font-size: .8rem;
  padding: 1rem;
  width: 99%;
  outline: none;
  line-height: 1.4rem;
  overflow: hidden;
  border: none;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: start;
  overflow-y: scroll;
  border: 1px solid #ddd;
`;

const LinesCount = styled.div`
  height: 100%;
  font-size: .8rem;
  color: #ccc;
  width: 1.4rem;
  padding: 1rem .4rem;
  line-height: 1.4rem;
`;

interface Props {
  code:string;
  setCode: React.Dispatch<string>;
}

export const CodeEditor = ({code, setCode}: Props) => {

  const updateLineNumbers = () => {
    const lineCount = code.split('\n').length;
    return Array.from({ length: lineCount }, (_, index) => `${index + 1}`).join('\n');
  };

  return (
    <Container>
      <LinesCount><p>{updateLineNumbers()}</p></LinesCount>
      <TextAreaCode value={code} onChange={(e) => setCode(e.target.value)} />
    </Container>
  );
}