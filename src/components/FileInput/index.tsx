import React from 'react';
import { styled } from "styled-components";

const StyledInputFile = styled.input`
  border: none;
  color: #ddd;
  font-size: 1rem;
  font-weight: 500;
  padding: 1rem 0;

  &:hover {
    cursor: pointer;
    filter: brightness(0.8);
  }

  margin-right: auto;
`;

const LabelOpenFile = styled.label`
  font-size: 1rem;
  color: #000;
  margin-right: 1rem;
`;

interface Props {
  setFile: React.Dispatch<string>;
}

export const FileInput = ({setFile}: Props) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type === 'text/plain') {
        const reader = new FileReader();

        reader.onload = function (e: ProgressEvent<FileReader>) {
          const content = e.target?.result as string;
          setFile(content);
        };

        reader.readAsText(selectedFile);
      } else {
        alert('Please select a .txt file.');
        event.target.value = ''; // Clear the file input
      }
    }
  };

  return(
    <>
      <LabelOpenFile htmlFor="file-input">Abrir um arquivo</LabelOpenFile>
      <StyledInputFile accept=".txt" onChange={handleFileChange} id="file-input" type="file" />
    </>
  );
}