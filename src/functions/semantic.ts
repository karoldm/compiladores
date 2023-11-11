import { IToken } from "../interfaces/token";
import { SymbolTable } from "./symbolTable";

export class Semantic {
  table = new SymbolTable();
  tokens: IToken[];

  constructor(tokens: IToken[]) {
      this.tokens = tokens;
  }

  run() {
      
  }

}