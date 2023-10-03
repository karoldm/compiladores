export interface IToken {
  lexema: string;
  token: string;
  linha: number;
  coluna_inicial: number;
  coluna_final: number;
}

export type Columns = ("lexema" | "token" | "linha" | "coluna_inicial" | "coluna_final");
