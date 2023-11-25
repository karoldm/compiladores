import { IToken } from "../interfaces/token";
import { ISymbolTable, ISymbolTableRow, TipoCategoria, TipoVariavel } from "../interfaces/SymbolTable";
import { SymbolTable } from "./symbolTable";

export class Semantic {
  errors: string[];
  tokens: IToken[];
  escopo: string;
  tabela = new SymbolTable;

  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.errors = [];
    this.escopo = '';
  }


  tokensToSymbolTable(tokens: IToken[]) {
    for (const token of tokens) {
      switch (token.token) {
        case 'IDENTIFICADOR':
          addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'var');
          break;

        // case 'INT':
        // case 'BOOLEAN':
        //   addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'var');
        //   break;

        case 'PROCEDURE':
          addSymbolRow(token.lexema, token.token, 'global', 0, 'proc', 'proc');
          break;

        case 'PROGRAM':
          addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'program');
          break;

        case 'PARAM':
          addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'param');
          break;

        default:
   
          break;
      }
    }

    function addSymbolRow(this: any, cadeia: string, token: string, escopo: string, valor: number | boolean, tipo: string, categoria: string) {
      this.tabela[escopo] = [];
      if (!this.tabela[escopo]) {
        this.tabela[escopo] = [];
      }

      this.tabela[escopo].push({
        cadeia,
        token,
        escopo,
        valor,
        tipo,
        categoria
      });
    }

    return this.tabela;

  }


  semantic(tokens: IToken[]) { 
    this.tabela = this.tokensToSymbolTable(tokens);
    this.checkIdentifiers(this.tabela);
    this.checkTypes(this.tabela);
    return this.errors;
  }

  checkIdentifiers(tabela: SymbolTable) {
    for (const escopo in this.tabela) {
      for (const row of this.tabela.table[escopo]) {
        if (!row.utilizada) {
          this.errors.push(`A variável ${row.cadeia} não foi utilizada.`);
        }
      }
    }
  }

  checkTypes(tabela: SymbolTable) {
    for (const escopo in this.tabela) {
      for (const row of this.tabela.table[escopo]) {
        if (row.tipo) {
          if (row.valor !== undefined && typeof row.valor !== row.tipo) {
            this.errors.push(`Erro de tipo: A variável ${row.cadeia} tem um tipo incompatível.`);
          }
        }
      }
    }
  }


}



