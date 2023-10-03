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
  border: 1px solid rgba(200, 50, 50, .5);
`;

const Textarea = styled.textarea`
  flex: 1;
  width: 100%;
  overflow-y: scroll;
  border: 1px solid #ccc;
  font-size: .8rem;
  color: rgb(200, 50, 50);;
  padding: 1rem;
  line-height: 1.4rem;
`;

const Erros = styled.p`
  width: 100%;
  font-size: 1rem;
  color: rgb(200, 50, 50);;
  padding: 0.6rem;
  font-style: bold;
`;

const Divider = styled.ul`
  width: 100%;
  font-size: .8rem;

`;

const Tabs = styled.li`
  width: 9%;
  border-radius: 3px 3px 0px 0px;
  font-size: .8rem;
  display: inline-block;
  color: rgb(200, 50, 50);;
  margin-left: 3%;
  padding-top: 8px;
  text-align: center;
  cursor: pointer;
  &:active, &:hover{
    border-top:  3px solid rgba(200, 50, 50, .5);;
    background-color: white;
  }
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
    <>
    <Container>
    <Erros>Erros</Erros>
    <Divider>
      <Tabs value = {1}>Análise léxica</Tabs>
      <Tabs value = {2}>Análise sintática</Tabs>
    </Divider>
    <Textarea value= { errorString } disabled />
    </Container>
    </>
  );
}