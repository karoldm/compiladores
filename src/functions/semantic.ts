import { IToken } from "../interfaces/token";
import { ISymbolTable, ISymbolTableRow, TipoCategoria, TipoVariavel } from "../interfaces/SymbolTable";
import { SymbolTable } from "./symbolTable";

export class Semantic {
  errors: string[];
  tokens: IToken[];
  escopo: string;
  tabela: SymbolTable;
  pilhaTipos: string[];


  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.errors = [];
    this.escopo = '';
    this.tabela = new SymbolTable();
    this.pilhaTipos = [];
  }

  tokensToSymbolTable = (tokens: IToken[]) => {
    for (const token of this.tokens) {
      switch (token.token) {
        case 'IDENTIFICADOR':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'var');
          break;

        case 'BOOLEAN':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'boolean');
          break;

        case 'INT':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, token.token, 'int');
          break;

        case 'PROCEDURE':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'proc', 'proc');
          break;

        case 'PROGRAM':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'program');
          break;

        case 'PARAM':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'param');
          break;

        default:

          break;
      }
    }

    return this.tabela;
  };


  obterTipoVariavel(identificador: string) {
    for (const escopo in this.tabela.table) {
      for (const row of this.tabela.table[escopo]) {
        if (row.cadeia === identificador) {
          return row.token;
        }
      }
    }
  }





  verificaTokens = (tokens: IToken[]) => {
    for (const token of this.tokens) {
      switch (token.token) {
        case "IDENTIFICADOR":
          this.pilhaTipos.push(token.lexema);
          break;

        case "INT":
          this.pilhaTipos.push('INT');
          break;

        case "BOOLEAN":
          this.pilhaTipos.push('BOOLEAN');
          break;

        case 'OPSOMA' || 'OPSUB' || 'OPMUL' || 'OPDIV':
          const tipoDireito = this.pilhaTipos.pop();
          const tipoEsquerdo = this.pilhaTipos.pop();
          if (!tipoEsquerdo || !tipoDireito) {
            this.errors.push(`Linha: ${token.linha} - Operação sem operandos entre ${tipoEsquerdo} e ${tipoDireito}.`);
            break;
          }
          if (tipoEsquerdo !== "INT" || tipoDireito !== "INT") {
            this.errors.push(`Linha: ${token.linha} - Operação ${token.token} aceita apenas inteiros.`);
          }
          this.pilhaTipos.push("INT");
          break;


        case "MENOR" || "IGUAL" || "DIFERENTE" || "MAIOR" || "MENORIGUAL" || "MAIORIGUAL":
          if (tipoEsquerdo !== tipoDireito) {;
            this.errors.push(`Linha: ${token.linha} - TOperação ${token.token} aceita apenas boleanos.}.`);
          }
          this.pilhaTipos.push("BOOLEAN");
          break;


        default:
          this.errors.push(`Operador desconhecido: ${token.token}`);
          break;

      }

    }
  }


    addSymbolRow = (cadeia: string, token: string, escopo: string, valor: number | boolean, tipo: string, categoria: string) => {
      this.tabela.push(cadeia, token, escopo, valor, tipo, categoria);
    };

    semantic = (tokens: IToken[]) => {
      this.tabela = this.tokensToSymbolTable(tokens);
      this.verificaTokens(tokens);
      this.checkIdentifiers();
      this.checkTypes();
      return this.errors;
    };

    checkIdentifiers = () => {
      for (const escopo in this.tabela.table) {
        for (const row of this.tabela.table[escopo]) {
          if (row.tipo === 'var') {
            this.useVariable(row.cadeia);
          }
        }
      }

      for (const escopo in this.tabela.table) {
        for (const row of this.tabela.table[escopo]) {
          if (row.categoria === 'var') {
            if (!row.utilizada) {
              this.errors.push(`A variável ${row.cadeia} não foi utilizada.`);
            }
          }
        }
      }
    };

    checkTypes = () => {
      for (const escopo in this.tabela.table) {
        for (const row of this.tabela.table[escopo]) {
          if (row.tipo === 'var') {
            if (row.valor !== undefined) {
              this.errors.push(`Erro de tipo: A variável ${row.cadeia} tem um tipo incompatível.`);
            }
          }
        }
      }
    };

    useVariable = (identifier: string) => {
      let count = 0;
      for (const escopo in this.tabela.table) {
        for (const row of this.tabela.table[escopo]) {
          if (row.categoria === 'var' && row.cadeia === identifier) {
            count++;
            if (count > 1) {
              row.utilizada = true;
            }
          }

        }
      }
    }




  }













