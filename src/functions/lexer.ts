import { reservedSymbols, reservedWords } from "../constants/reserved";
import { ITable } from "../interfaces/table";
import { isReserved, isValidIdentifier, isValidInt, isValidFloat, isReservedSymbol } from "./is";


let table: ITable[] = [];
let errors: string[] = [];
let initialColumn = 0;
let text = "";
let current = "";
let line = 0;
let i = 0;

function populateTable(
  lexema: string, 
  token: string, 
  line: number, 
  initialColumn: number, 
  finalColumn: number,
  ) {
  table.push({
    lexema: lexema, 
    token: token,
    linha: line, 
    coluna_inicial: initialColumn,
    coluna_final: finalColumn
  });

  if (token === "INVALID TOKEN" || token === "INVALID IDENTIFIER"){
    errors.push("Erro na linha " + line+1 + " coluna inicial " + initialColumn + " coluna final " + finalColumn);
  }
}

function handleNewLine() {
  line++;
}

function handleLineComment() {
  while (i < text.length && text[i] !== "\n") {
    i++;
  }
  line++;
}

function handleBlockComment(){
  while (i < text.length && text[i] !== "}") {
    if (text[i] === "\n") {
      line++;
    }
    i++;
  }
}

function getReserved(input: string) {
  return reservedSymbols.get(input) || reservedWords.get(input);
}

function handleValidIdentifier(){
  let char = text[i];
  while (i < text.length && !isReservedSymbol(char) && char !== " " && char !== "/" && char !== "{" && char !== "\n") {
    i++;
    if (i < text.length) {
      char = text[i];
      current += char;
    } else {
      break;
    }
  }
  let substr = current;
  if (i < text.length) {
    i--;
    substr = substr.substring(0, substr.length - 1);
  }
  const finalColumn = initialColumn + substr.length - 1;
  if (getReserved(substr)) {
    populateTable(substr, getReserved(substr), line, initialColumn, finalColumn);
  } else if (isValidIdentifier(substr) && substr.length >= 3 && substr.length <= 10) {
    populateTable(substr, "IDENTIFICADOR", line, initialColumn, finalColumn);
  } else {
    populateTable(substr, "INVALID IDENTIFIER", line, initialColumn, finalColumn);
  }
}

function handleValidNumber(){
  let canPopulate = true;
  let currentChar = " ";
  while (isValidInt(current) || isValidFloat(current) || current === ".") {
    i++;
    if (i < text.length) {
      currentChar = text[i];
      if (currentChar === ".") {
        if (i + 1 < text.length && isValidInt(text[i + 1])) {
          current += currentChar;
          current += text[i + 1];
          i++;
        } else {
          current += currentChar;
          i--;
          populateTable(current, "INVALID TOKEN", line, initialColumn, initialColumn + current.length - 1);
          canPopulate = false;
          break;
        }
      } else {
        current += currentChar;
      }
    } else {
      break;
    }
  }
  if (isValidIdentifier(currentChar)) {
    let invalidIdentifier = currentChar;
    while (isValidIdentifier(invalidIdentifier)) {
      i++;
      if (i < text.length) {
        currentChar = text[i];
        invalidIdentifier += currentChar;
      } else {
        break;
      }
    }
    let substr = current + invalidIdentifier;
    if (i < text.length) {
      i--;
      substr = substr.substring(0, substr.length - 1);
    }
    const finalColumn = initialColumn + substr.length - 1;
    populateTable(substr, "INVALID IDENTIFIER", line, initialColumn, finalColumn);
  } else if (canPopulate) {
    let substr = current;
    if (i < text.length) {
      i--;
      substr = substr.substring(0, substr.length - 1);
    }
    if (isValidInt(substr)) {
      const finalColumn = initialColumn + substr.length - 1;
      populateTable(substr, "NUMINT", line, initialColumn, finalColumn);
    } else if (isValidFloat(substr)) {
      const finalColumn = initialColumn + substr.length - 1;
      populateTable(substr, "NUMFLOAT", line, initialColumn, finalColumn);
    }
  }
}

function handleReserved(){
  while (isReserved(current)) {
    i++;
    if (i < text.length) {
      current += text[i];
    } else {
      break;
    }
  }
  let substr = current;
  if (i < text.length) {
    i--;
    substr = substr.substring(0, substr.length - 1);
  }
  const finalColumn = initialColumn + substr.length - 1;
  if (getReserved(substr) !== undefined) {
    populateTable(substr, getReserved(substr), line, initialColumn, finalColumn);
  } else {
    populateTable(substr, "INVALID TOKEN", line, initialColumn, finalColumn);
  }
}

function compileLexer(textCode: string) {
  text = textCode;
  table = [];
  errors = [];
  initialColumn = 0;
  current = "";
  line = 0;
  i = 0;
  
  while (i < text.length) {
    current = text[i];
    initialColumn = i;

    // Quebra de linha
    if (current === "\n") {
      handleNewLine();
    }

    // Tratamento de comentários de linha
    else if (current === "/" && i + 1 < text.length && text[i + 1] === "/") {
      handleLineComment();
    }

    // Tratamento de comentários de bloco
    else if (current === "{") {
      handleBlockComment();
    }

    // Tratamento de identificador válido
    else if (isValidIdentifier(current)) {
      handleValidIdentifier();
    }

    // Tratamento de palavra ou símbolo reservado
    else if (isReserved(current)) {
     handleReserved();
    }

    // Tratamento de números válidos
    else if (isValidInt(current) || current === ".") {
      handleValidNumber();
    }

    // Lexema inválido
    else if (current.trim().length > 0) {
      populateTable(current, "INVALID TOKEN", line, initialColumn, initialColumn);
    }

    i++;
  }
  return {table, errors};
}

export { compileLexer };