export type TipoVariavel = 'boolean' | 'int';

export type TipoCategoria = 'program' | 'proc' | 'var' | 'param';

export interface ISymbolTableRow {
  cadeia: string;
  token: string;
  categoria: TipoCategoria | string;
  tipo?: TipoVariavel | TipoCategoria | string;
  valor?: number | boolean;
  utilizada: boolean;
}

export type ISymbolTable ={ [escopo: string]: ISymbolTableRow[]}