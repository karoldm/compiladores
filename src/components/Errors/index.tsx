import {useState, useEffect} from 'react';
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;

const ContainerTextArea = styled.div`
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

const Title = styled.p`
  font-size: 1rem;
  font-weight: bolder;
  color: black;
  margin-bottom: .8rem;
`;

interface Props {
  errors: string[];
  title: string;
}

export const Errors =  ({ errors, title }: Props) => {
  const [errorString, setErrorString] = useState("");

  useEffect(() => {
    let str = '';
    errors.forEach(error => {
      str += error + "\n";
    });
    setErrorString(str);
  }, [errors]);

  return (
     <Container>
      <Title>{title}</Title>
      <ContainerTextArea style={{borderColor: errorString ? "red" : "green"}} >
        <Textarea 
        style={{color: errorString ? "red" : "green"}} 
        value= { errorString || "Nenhum erro encontrado :)" } 
        disabled 
      />
      </ContainerTextArea>
    </Container>
  );
}