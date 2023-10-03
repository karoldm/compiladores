import { useState, useEffect } from 'react';
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
  padding-left: 1.5rem;
  line-height: 1.4rem;
`;


interface Props {
  errors: string[];
}

const Errors = ({ errors }: Props) => {
  const [errorString, setErrorString] = useState("");

  useEffect(() => {
    let str = '';
    errors.forEach(error => {
      str += error + "\n";
    });
    setErrorString(str);
  }, [errors]);



  return (
    <></>
    // <Container>
    //   <Textarea value={errorString} disabled />
    // </Container>
  );
}

export default Errors;