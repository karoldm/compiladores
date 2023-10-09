import {useState, useEffect} from 'react';
import styled from "styled-components";


const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 16px;
  height: 180px;
  border: 1px solid black;
`;

const Textarea = styled.textarea`
  flex: 1;
  width: 100%;
  overflow-y: scroll;
  border: 1px solid #ccc;
  font-size: .8rem;
  padding: 1rem;
  line-height: 1.4rem;
`;

interface Props {
  errors: string[];
}

export const Errors =  ({ errors }: Props) => {
  const [errorString, setErrorString] = useState("");

  useEffect(() => {
    let str = '';
    errors.forEach(error => {
      str += error + "\n";
    });
    setErrorString(str);
  }, [errors]);

  return (
    <Container style={{borderColor: errorString ? "red" : "green"}} >
      <Textarea 
      style={{color: errorString ? "red" : "green"}} 
      value= { errorString || "Nenhum erro encontrado :)" } 
      disabled 
    />
    </Container>
  );
}