import { ISymbolTable, TipoCategoria, TipoVariavel } from '../interfaces/SymbolTable';

export class SymbolTable {
  table: ISymbolTable;

  constructor() {
    this.table = {};
  }

  updateValue(escopo: string, cadeia: string, valor: number | boolean){
    if(this.table[escopo]){
      this.table[escopo].forEach(row => {
        if(row.cadeia === cadeia){
          row.valor = valor;
        }
      })
    }
  }

  push(
    cadeia: string, 
    token: string, 
    escopo: string, 
    valor: number | boolean, 
    tipo: TipoVariavel | TipoCategoria | string, 
    categoria: TipoCategoria | string
  ){
    if(!this.table[escopo]){
      this.table[escopo] = []; 
    }

    this.table[escopo].push({
      cadeia, 
      token, 
      categoria, 
      tipo,
      valor,
      utilizada: false
    });
  }

  get(cadeia: string, escopo: string){
    return this.table[escopo].find(t => t.cadeia === cadeia);
  }

  remove(token: string, escopo: string){
    delete this.table[escopo];
  }

}
