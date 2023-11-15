import { IToken } from "../interfaces/token";
import { SymbolTable, TipoVariavel, TipoCategoria } from "./symbolTable";

export class Semantic {
  table = new SymbolTable();
  tokens: IToken[];
  errors: string[];
  escopoAtual: null;

  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.errors = [];
    this.escopoAtual = null;
  }

  semantic(table: SymbolTable, escopoAtual: string = 'global') {
    switch (table) {
      case 'TipoVariavel':
        this.verificaVariavel(table, escopoAtual);
        break;
      case 'TipoCategoria':
        this.VerificaCadeia(table, escopoAtual);
        break;
    }
  }


  verificaVariavel(table: SymbolTable, escopoAtual: string) {
    const { identificador, tipo, valor } = variavel;

    if (this.table.get(identificador, escopoAtual)) {
      this.errors.push(`Variável ${identificador} já foi declarada.`);
    }

    this.table.push(
      identificador,
      token,
      escopoAtual,
      valor,
      tipo,
      TipoCategoria.VAR
    );
  }



  verificaCadeia(table: SymbolTable, escopoAtual: string) {
    const { identificador, valor } = table;

    const variavel = this.table.get(identificador, escopoAtual);
    if (!variavel) {
      this.errors.push(`Variável ${identificador} foi utilizada antes da declaração.`);
    }

    if (typeof valor !== variavel.tipo) {
      this.errors.push(
        `Tipo incorreto: Valor ${typeof valor} não é compatível com tipo ${variavel.tipo}.`
      );
    }

    variavel.utilizada = true;
  }


}


