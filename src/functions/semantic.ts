import { IToken } from "../interfaces/token";
import { ISymbolTable, ISymbolTableRow, TipoCategoria, TipoVariavel } from "../interfaces/SymbolTable";
import { SymbolTable } from "./symbolTable";

export class Semantic {
  errors: string[];
  tokens: IToken[];
  escopo: string;
  tabela: SymbolTable;
  pilhaTipos: string[];
  tipoDireito: any = '';
  tipoEsquerdo: any = '';


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
    for (const token of tokens) {
      switch (token.token) {
        case 'IDENTIFICADOR':
          this.pilhaTipos.push('IDENTIFICADOR');
          break;

        case 'INT':
          this.pilhaTipos.push('INT');
          break;

        case 'BOOLEAN':
          this.pilhaTipos.push('BOOLEAN');
          break;

        case 'OPSOMA':
        case 'OPSUB':
        case 'OPMUL':
        case 'OPDIV':
        case 'MENOR':
        case 'IGUAL':
        case 'DIFERENTE':
        case 'MAIOR':
        case 'MENORIGUAL':
        case 'MAIORIGUAL':
          this.tipoDireito = this.pilhaTipos.pop();
          this.tipoEsquerdo = this.pilhaTipos.pop();

          if (!this.tipoEsquerdo || !this.tipoDireito) {
            this.errors.push(`Linha: ${token.linha} - Operação sem operandos entre ${this.tipoEsquerdo} e ${this.tipoDireito}.`);
            break;
          }

          if ((this.tipoEsquerdo !== 'INT' && this.tipoEsquerdo !== 'IDENTIFICADOR') ||
            (this.tipoDireito !== 'INT' && this.tipoDireito !== 'IDENTIFICADOR')) {
            this.errors.push(`Linha: ${token.linha} - Operação ${token.token} aceita apenas inteiros.`);
          }

          this.pilhaTipos.push('INT');
          break;

        // Adicione outros casos conforme necessário

        default:
          // Adicione lógica para outros tipos de token, se necessário
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
            // this.errors.push(`A variável ${row.cadeia} não foi utilizada.`);
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













