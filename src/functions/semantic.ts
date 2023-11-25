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
    function addSymbolRow(cadeia: string, token: string, escopo: string, valor?: number | boolean, tipo?: string, categoria: string) {
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

    return this.tabela;

  }


  semantic(tokens: IToken[]) {
    this.tokensToSymbolTable(tokens);
    this.checkIdentifiers(tabela);
    this.checkTypes(tabela);
    return this.errors;
  }

  checkIdentifiers(tabela: SymbolTable) {
    for (const escopo in this.tabela) {
      for (const row of this.tabela[escopo]) {
        if (!row.utilizada) {
          this.errors.push(`A variável ${row.cadeia} na linha ${row.linha} não foi utilizada.`);
        }
      }
    }
  }

  checkTypes() {
    for (const escopo in this.tabela) {
      for (const row of this.tabela[escopo]) {
        if (row.tipo) {
          if (row.valor !== undefined && typeof row.valor !== row.tipo) {
            this.errors.push(`Erro de tipo: A variável ${row.cadeia} na linha ${row.linha} tem um tipo incompatível.`);
          }
        }
      }
    }
  }


}


































































