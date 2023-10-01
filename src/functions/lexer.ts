import { reservedSymbols, reservedWords } from "../constants/reserved";
import { ITokens } from "../interfaces/table";
import { isReserved, isValidIdentifier, isValidInt, isValidFloat } from "./is";

class Lexer {
  table: ITokens[];
  errors: string[];
  initialColumn;
  text;
  current;
  line;
  i;

  constructor(textcode: string){
    this.text = textcode;
    this.table = [];
    this.errors = [];
    this.initialColumn = 0;
    this.current = "";
    this.line = 0;
    this.i = 0;
  }
  
  populateTable(
    lexema: string, 
    token: string, 
    finalColumn: number,
    isError: boolean,
    ) {
    this.table.push({
      lexema: lexema, 
      token: token,
      linha: this.line, 
      coluna_inicial: this.initialColumn,
      coluna_final: finalColumn
    });

    if (isError){
      this.errors.push(
          "Erro na linha " + 
          this.line + 
          " coluna inicial " + 
          this.initialColumn + 
          " coluna final " + 
          finalColumn + 
          ": " + 
          token
        );
    }
  }

  handleNewLine() {
    this.line++;
    this.initialColumn = 0;
  }

  handleLineComment() {
    while (this.i < this.text.length && this.text[this.i] !== "\n") {
      this.i++;
    }
    this.line++;
  }

  handleBlockComment(){
    while (this.i < this.text.length && this.text[this.i] !== "}") {
      if (this.text[this.i] === "\n") {
        this.line++;
      }
      this.i++;
    }
  }

  getReserved(input: string) {
    return reservedSymbols.get(input) || reservedWords.get(input);
  }

  handleValidIdentifier(){
    let char = this.text[this.i];
    while (this.i < this.text.length && isValidIdentifier(this.current)) {
      this.i++;
        if (this.i < this.text.length) {
          char = this.text[this.i];
          this.current += char;
        } else {
          break;
        }
    }
    let substr = this.current;
    if (this.i < this.text.length) {
      this.i--;
      substr = substr.substring(0, substr.length - 1);
    }
    const finalColumn = this.initialColumn + substr.length - 1;
    
    if (this.getReserved(substr)) {
      this.populateTable(substr, this.getReserved(substr), finalColumn, false);
    } else if (isValidIdentifier(substr)) {
      if(substr.length >= 3 && substr.length <= 10){
        this.populateTable(substr, "IDENTIFICADOR", finalColumn, false);
      }
      else {
        this.populateTable(substr, "INVALID IDENTIFIER SIZE", finalColumn, true);
      }
    } else {
      this.populateTable(substr, "INVALID IDENTIFIER",finalColumn, true);
    }
  }

  handleValidNumber(){
    let canPopulate = true;
    let currentChar = " ";
    while (isValidInt(this.current) || isValidFloat(this.current) || this.current === ".") {
      this.i++;
      if (this.i < this.text.length) {
        currentChar = this.text[this.i];
        if (currentChar === ".") {
          if (this.i + 1 < this.text.length && isValidInt(this.text[this.i + 1])) {
            this.current += currentChar;
            this.current += this.text[this.i + 1];
            this.i++;
          } else {
            this.current += currentChar;
            this.i--;
            this.populateTable(this.current, "INVALID TOKEN", (this.initialColumn + this.current.length - 1), true);
            canPopulate = false;
            break;
          }
        } else {
          this.current += currentChar;
        }
      } else {
        break;
      }
    }
    if (isValidIdentifier(currentChar)) {
      let invalidIdentifier = currentChar;
      while (isValidIdentifier(invalidIdentifier)) {
        this.i++;
        if(this.i < this.text.length) {
          currentChar = this.text[this.i];
          invalidIdentifier += currentChar;
        } else {
          break;
        }
      }
      let substr = this.current + invalidIdentifier;
      if (this.i < this.text.length) {
        this.i--;
        substr = substr.substring(0, substr.length - 1);
      }
      const finalColumn = this.initialColumn + substr.length - 1;
      this.populateTable(substr, "INVALID IDENTIFIER", finalColumn, true);
    } else if (canPopulate) {
      let substr = this.current;
      if (this.i < this.text.length) {
        this.i--;
        substr = substr.substring(0, substr.length - 1);
      }
      if (isValidInt(substr)) {
        const finalColumn = this.initialColumn + substr.length - 1;
        this.populateTable(substr, "NUMINT", finalColumn, false);
      } else if (isValidFloat(substr)) {
        const finalColumn = this.initialColumn + substr.length - 1;
        this.populateTable(substr, "NUMFLOAT", finalColumn, false);
      }
    }
  }

  handleReserved(){
    while (isReserved(this.current)) {
      this.i++;
      if (this.i < this.text.length) {
        this.current += this.text[this.i];
      } else {
        break;
      }
    }
    let substr = this.current;
    if (this.i < this.text.length) {
      this.i--;
      substr = substr.substring(0, substr.length - 1);
    }
    const finalColumn = this.initialColumn + substr.length - 1;
    if (this.getReserved(substr) !== undefined) {
      this.populateTable(substr, this.getReserved(substr), finalColumn, false);
    } else {
      this.populateTable(substr, "INVALID TOKEN", finalColumn, true);
    }
  }

  compile() {
    
    while (this.i < this.text.length) {
      this.current = this.text[this.i];
      this.initialColumn++;
      
      // Quebra de linha
      if (this.current === "\n") {
        this.handleNewLine();
      }

      // Tratamento de comentários de linha
      else if (this.current === "/" && this.i + 1 < this.text.length && this.text[this.i + 1] === "/") {
        this.handleLineComment();
      }

      // Tratamento de comentários de bloco
      else if (this.current === "{") {
        this.handleBlockComment();
      }

      // Tratamento de identificador válido
      else if (isValidIdentifier(this.current)) {
        this.handleValidIdentifier();
      }

      // Tratamento de palavra ou símbolo reservado
      else if (isReserved(this.current)) {
        this.handleReserved();
      }

      // Tratamento de números válidos
      else if (isValidInt(this.current) || this.current === ".") {
        this.handleValidNumber();
      }

      // Lexema inválido
      else if (this.current.trim().length > 0) {
        this.populateTable(this.current, "INVALID TOKEN", (this.initialColumn + this.current.length - 1), true);
      }

      this.i++;
    }
    return {table: this.table, errors: this.errors};
  }

}
export { Lexer };
