import { useState, useEffect } from 'react';
import styled from "styled-components";
import { Errors } from "../../Errors";


interface Props {
    errors: string[];
}

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


const FirstTab = (errors: any) => {
    return (
        <>
            <div className="FirstTab">
            <Textarea value={errors} disabled />
            </div>
        </>
    );
}


export default FirstTab;