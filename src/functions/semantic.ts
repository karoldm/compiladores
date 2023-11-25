import { IToken } from "../interfaces/token";
import { ISymbolTable, ISymbolTableRow, TipoCategoria, TipoVariavel } from "../interfaces/SymbolTable";
import { SymbolTable } from "./symbolTable";

export class Semantic {
  errors: string[];
  tokens: IToken[];
  escopo: string;
  tabela: SymbolTable;

  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.errors = [];
    this.escopo = '';
    this.tabela = new SymbolTable();
  }

  tokensToSymbolTable = (tokens: IToken[]) => {
    for (const token of this.tokens) {
      switch (token.token) {
        case 'IDENTIFICADOR':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'var');
          break;

          // case 'IDENTIFICADOR':
          //   addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'var');
          //   break;
          
          // // case 'INT':
          // // case 'BOOLEAN':
          // //   addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'var');
          // //   break;
          
          // case 'PROCEDURE':
          //   addSymbolRow(token.lexema, token.token, 'global', 0, 'proc', 'proc');
          //   break;
          
          // case 'PROGRAM':
          //   addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'program');
          //   break;
          
          // case 'PARAM':
          //   addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'param');
          //   break;
          
          default:
          
            break;
      }
    }

    return this.tabela;
  };

  addSymbolRow = (cadeia: string, token: string, escopo: string, valor: number | boolean, tipo: string, categoria: string) => {
    this.tabela.push(cadeia, token, escopo, valor, tipo, categoria);
  };

  semantic = (tokens: IToken[]) => {
    this.tabela = this.tokensToSymbolTable(tokens);
    this.checkIdentifiers();
    this.checkTypes();
    return this.errors;
  };

  checkIdentifiers = () => {
    for (const escopo in this.tabela.table) {
      for (const row of this.tabela.table[escopo]) {
        if (!row.utilizada) {
          this.errors.push(`A variável ${row.cadeia} não foi utilizada.`);
        }
      }
    }
  };

  checkTypes = () => {
    for (const escopo in this.tabela.table) {
      for (const row of this.tabela.table[escopo]) {
        if (row.tipo) {
          if (row.valor !== undefined && typeof row.valor !== row.tipo) {
            this.errors.push(`Erro de tipo: A variável ${row.cadeia} tem um tipo incompatível.`);
          }
        }
      }
    }
  };
}




