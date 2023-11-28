import { ISymbolTable, TipoCategoria, TipoVariavel } from '../interfaces/SymbolTable';

export class SymbolTable {
  [x: string]: any;
  table: ISymbolTable;

  constructor() {
    this.table = {};
  }

  updateValue(escopo: string, cadeia: string, valor: number | boolean | undefined){
    if(this.table['global']){
      this.table['global'].forEach(row => {
        if(row.cadeia === cadeia){
          row.valor = valor;
        }
      })
    } else {
      if(this.table[escopo]){
        this.table[escopo].forEach(row => {
          if(row.cadeia === cadeia){
            row.valor = valor;
          }
        })
      }
    }
  }

  updateUtilizada(escopo: string, cadeia: string, utilizada: boolean){
    if(this.table['global']){
      this.table['global'].forEach(row => {
        if(row.cadeia === cadeia){
          row.utilizada = utilizada;
        }
      })
    } else {
      if(this.table[escopo]){
        this.table[escopo].forEach(row => {
          if(row.cadeia === cadeia){
            row.utilizada = utilizada;
          }
        })
      }
    }
  }

  push(
    cadeia: string, 
    token: string, 
    escopo: string, 
    valor: number | boolean | undefined, 
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
    return this.table['global'].find(t => t.cadeia === cadeia) ?? this.table[escopo].find(t => t.cadeia === cadeia);
  }

  remove(token: string, escopo: string){
    delete this.table[escopo];
  }

}
