import { ISymbolTable, TipoCategoria, TipoVariavel } from '../interfaces/SymbolTable';

export class SymbolTable {
  [x: string]: any;
  table: ISymbolTable;

  constructor() {
    this.table = {};
  }

  updateValue(escopo: string, cadeia: string, valor: number | boolean | undefined){
    if(this.get(cadeia, 'global')){
      this.table['global'].forEach(row => {
        if(row.cadeia === cadeia){
          row.valor = valor;
          return;
        }
      })
    }
    else if(this.get(cadeia, escopo)){
      this.table[escopo].forEach(row => {
        if(row.cadeia === cadeia){
          row.valor = valor;
          return;
        }
      })
    }
  }

  updateUtilizada(cadeia: string, escopo: string, utilizada: boolean){
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
    if(this.table['global']){
      if(this.table['global'].find(t => t.cadeia === cadeia)){
        return this.table['global'].find(t => t.cadeia === cadeia);
      }
      else if(this.table[escopo]){
        return this.table[escopo].find(t => t.cadeia === cadeia);
      }
    }
    else if(this.table[escopo]){
      return this.table[escopo].find(t => t.cadeia === cadeia);
    }
  }

  remove(token: string, escopo: string){
    delete this.table[escopo];
  }

}
