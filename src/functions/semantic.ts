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
  tipoAtual: string = '';
  i: number; 


  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.errors = [];
    this.escopo = 'global';
    this.tabela = new SymbolTable();
    this.pilhaTipos = [];
    this.i = 0;
  }

  tokensToSymbolTable = (tokens: IToken[]) => {
    for (;this.i<tokens.length;this.i++) {
      let token = tokens[this.i];

      switch (token.token) {
        case 'BOOLEAN':
        case 'INT':
          this.tipoAtual = token.lexema;
          break;

        case 'IDENTIFICADOR':
          if (tokens[this.i-1].token === "BOOLEAN" || tokens[this.i-1].token === "INT"){
            if(!this.hasSymbol(token.lexema, 'global')){
              this.addSymbolRow(token.lexema, token.token, 'global', undefined, this.tipoAtual, token.token);
            }
            else {
              this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} 
            já declarada`);
            }            this.i++;
            while(tokens[this.i].token === "VIRG"){
              this.i++;
              token = tokens[this.i];
              if(!this.hasSymbol(token.lexema, 'global')){
                this.addSymbolRow(token.lexema, token.token, 'global', undefined, this.tipoAtual, token.token);
              }
              else {
                this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} já declarada`);
              }
              this.i++;
            }
          }

          else if(tokens[this.i+1].token === "ATRIBUICAO"){

            if(!this.hasSymbol(token.lexema, 'global')){
              this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} 
              não declarada`);
            }
            else {
              this.i++;

              if((tokens[this.i].token === "NUMINT" || tokens[this.i].token === "FALSE"
              || tokens[this.i].token === "TRUE" || tokens[this.i].token === "NUMFLOAT")
              && tokens[this.i+1].token === "PONTOVIRG"){
                const value = this.getTipo(tokens[this.i].token);
                if(tokens[this.i].token === this.tabela.get(token.lexema, 'global')?.tipo){
                  this.tabela.updateValue('global', token.lexema, value);
                } else {
                  this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${tokens[this.i].token}
                   a uma variável do tipo ${this.tabela.get(token.lexema, 'global')?.tipo}`);
                }
              }
  
              else if(tokens[this.i].token === "IDENTIFICADOR" && tokens[this.i+1].token === "PONTOVIRG") {
                if(this.hasSymbol(tokens[this.i].lexema, 'global')){
                  if(tokens[this.i].token === this.tabela.get(token.lexema, 'global')?.tipo){
                    const value = this.getTipo(tokens[this.i].token);
                    this.tabela.updateValue('global', token.lexema, value);
                  } else {
                    this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${tokens[this.i].token}
                     a uma variável do tipo ${this.tabela.get(token.lexema, 'global')?.tipo}`);
                  }
                } else {
                  this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} 
                  não declarada.`)
                }
              }

              else {
                let op = [];
                let tipo = this.tabela.get(token.lexema, 'global')?.tipo;
                while(tokens[this.i].token !== "PONTOVIRG"){
                  if(tokens[this.i].token === "IDENTIFICADOR"){
                    if(!this.tabela.get(tokens[this.i].lexema, 'global')){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} 
                      não declarada.`)
                    }
                    else if(this.tabela.get(tokens[this.i].lexema, 'global')?.tipo !== tipo){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${tokens[this.i].token}
                     a uma variável do tipo ${tipo}`);
                    }
                    else {
                      op.push(this.tabela.get(tokens[this.i].lexema, 'global')?.valor);
                      this.i++;
                    }
                  }
                  else if(tokens[this.i].token === "NUMINT" || tokens[this.i].token === "NUMFLOAT"){
                    if(["NUMINT", "NUMFLOAT"].includes(tipo!)){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${tokens[this.i].token}
                     a uma variável do tipo ${tipo}`);
                    }
                    else {
                      op.push(+tokens[this.i].lexema);
                      this.i++;
                    }
                  }
                  else if(tokens[this.i].token === "TRUE" || tokens[this.i].token === "FALSE"){
                    if('BOOLEAN' !== tipo){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${tokens[this.i].token}
                     a uma variável do tipo ${tipo}`);
                    }
                    else {
                      op.push(tokens[this.i].token === "TRUE"); 
                      this.i++;
                    }
                  }
                  else if(tokens[this.i].token === "OPSOMA" || tokens[this.i].token === "OPSUB" 
                  || tokens[this.i].token === "OPDIV" || tokens[this.i].token === "OPMUL"){
                    if(["NUMINT", "NUMFLOAT"].includes(tipo!)){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Operação de ${tokens[this.i].token} sobre ${tipo}`);
                    }
                    else {
                      if(tokens[this.i].token === "OPDIV"){
                        op.push("/");
                      }
                      else{
                        op.push(tokens[this.i].lexema);
                      }
                      this.i++;
                    }
                  }
                  else if(tokens[this.i].token === "AND" || tokens[this.i].token === "OR"){
                    if("BOOLEAN" !== tipo){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Operação de ${tokens[this.i].token} sobre ${tipo}`);
                    }
                    else {
                      op.push(tokens[this.i].lexema);
                      this.i++;
                    }
                  }
                  // else if(tokens[this.i].token === "M" || tokens[this.i].token === "OR"){
                  //   if("BOOLEAN" !== tipo){
                  //     this.errors.push(`Linha ${tokens[this.i].linha} - Operação de ${tokens[this.i].token} sobre ${tipo}`);
                  //   }
                  //   else {
                  //     op.push(tokens[this.i]);
                  //     this.i++;
                  //   }
                  // }
                }
                let total = eval(op.join(" "));
                this.tabela.updateValue('global', token.lexema, total);
              }
            }

          }


          
          break;

        case 'PROCEDURE':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'proc', 'proc');
          this.pilhaTipos.push('procedure');
          break;

        case 'PROGRAM':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'program');
          this.pilhaTipos.push('program');
          break;

        case 'PARAM':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'param');
          this.pilhaTipos.push('param');
          break;

        case 'BEGIN':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'begin');
          this.pilhaTipos.push('begin');
          break;

        case 'END':
          this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'end');
          this.pilhaTipos.push('end');
          break;

        case 'IF':
              this.i++; 
              while (tokens[this.i].token !== "THEN") {
                if(tokens[this.i].token === "IDENTIFICADOR"){
                    if(!this.hasSymbol(tokens[this.i].lexema, 'global')){
                    this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} não declarada`);
                  }
                }
                 switch(tokens[this.i].token){
                 case 'MENOR':
                 case 'MAIOR':
                 case 'MENORIGUAL':
                 case 'MAIORIGUAL':
                 case 'IGUAL':
                 case 'DIFERENTE':
                  if(tokens[this.i+1].token === "TRUE" || tokens[this.i+1].token === "FALSE" || (
                  tokens[this.i+1].token === "IDENTIFICADOR" && (this.getTipo(tokens[this.i+1].token) === true || 
                  (this.getTipo(tokens[this.i+1].token) === false || this.getTipo(tokens[this.i+1].token) === true) ))){
                    this.errors.push(`Linha ${tokens[this.i].linha} - Operação só pode ser realizada entre inteiros`);
                  } 
                  else if (tokens[this.i+1].token === "IDENTIFICADOR"){
                    if(!this.hasSymbol(tokens[this.i+1].lexema, 'global')){
                    this.errors.push(`Linha ${tokens[this.i+1].linha} - Variável ${tokens[this.i+1].lexema} não declarada`);
                  }
                  }
                  break;
                 }
                this.i++;
                
              }
              this.i++;
              break;

            case 'WHILE':   
            this.i++; 
            while (tokens[this.i].token !== "FP") {
              if(tokens[this.i].token === "IDENTIFICADOR"){
                  if(!this.hasSymbol(tokens[this.i].lexema, 'global')){
                  this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} não declarada`);
                }
              }
               switch(tokens[this.i].token){
               case 'MENOR':
               case 'MAIOR':
               case 'MENORIGUAL':
               case 'MAIORIGUAL':
               case 'IGUAL':
               case 'DIFERENTE':
                if(tokens[this.i+1].token === "TRUE" || tokens[this.i+1].token === "FALSE" || (
                tokens[this.i+1].token === "IDENTIFICADOR" && (this.getTipo(tokens[this.i+1].token) === true || 
                (this.getTipo(tokens[this.i+1].token) === false || this.getTipo(tokens[this.i+1].token) === true) ))){
                  this.errors.push(`Linha ${tokens[this.i].linha} - Operação só pode ser realizada entre inteiros`);
                } 
                else if (tokens[this.i+1].token === "IDENTIFICADOR"){
                  if(!this.hasSymbol(tokens[this.i+1].lexema, 'global')){
                  this.errors.push(`Linha ${tokens[this.i+1].linha} - Variável ${tokens[this.i+1].lexema} não declarada`);
                }
                }
                break;
               }
              this.i++;
              
            }
            this.i++;
            break;

            
              // this.addSymbolRow(token.lexema, token.token, 'global', undefined, this.tipoAtual, token.token);
              // while(tokens[this.i].token !== "THEN"){
              // this.i++;
              // token = tokens[this.i];
              // }
              // if(!this.hasSymbol(token.lexema, 'global')){
              //   this.addSymbolRow(token.lexema, token.token, 'global', undefined, this.tipoAtual, token.token);
              // }
              // else {
              //   this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} já declarada`);
              // }
              
        
        //   this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'end');
        //   this.pilhaTipos.push('end');
        //   break;

        // case 'THEN':
        //   this.addSymbolRow(token.lexema, token.token, 'global', 0, 'program', 'end');
        //   this.pilhaTipos.push('end');
        //   break;


      }
    }

    return this.tabela;
  };

  getTipo(value: string){
    return value === "TRUE" ? true : value === "FALSE" ? false : +value;
  }


  obterTipoVariavel(identificador: string) {
    for (const escopo in this.tabela.table) {
      for (const row of this.tabela.table[escopo]) {
        if (row.cadeia === identificador) {
          return row.token;
        }
      }
    }
  }


  addSymbolRow = (cadeia: string, token: string, escopo: string, valor: number | boolean | undefined, tipo: string, categoria: string) => {
    this.tabela.push(cadeia, token, escopo, valor, tipo, categoria);
  };

  semantic = (tokens: IToken[]) => {
    this.tabela = this.tokensToSymbolTable(tokens);
    // this.verificaTokens(tokens);
    // this.checkIdentifiers();
    // this.checkTypes();
    return this.errors;
  };

  // checkIdentifiers = () => {
  //   for (const escopo in this.tabela.table) {
  //     for (const row of this.tabela.table[escopo]) {
  //       if (row.tipo === 'var') {
  //         this.useVariable(row.cadeia);
  //       }
  //     }
  //   }
  //   for (const escopo in this.tabela.table) {
  //     for (const row of this.tabela.table[escopo]) {
  //       if (row.categoria === 'var') {
  //         if (!row.utilizada) {
  //           this.errors.push(`A variável ${row.cadeia} não foi utilizada.`);
  //         }
  //       }
  //     }
  //   }
  // };



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

  hasSymbol = (cadeia: string, escopo: string) => {
    for (const escopo in this.tabela.table) {
      for (const row of this.tabela.table[escopo]) {
        if (cadeia === row.cadeia) {
          return true
        }
      }
    }
    return false;
  }


  // isInFunctionScope = () => {

  //   for (const escopo in this.tabela.table) {
  //     for (const row of this.tabela.table[escopo]) {
  //       if (row.cadeia === 'PROCEDURE') {
  //         this.tabela.escopo = 'procedure'
  //       }
  //     }
  //   }
  // }



  // checkVariables = () => {
  //   const declaredVariables = new Set();

  //   for (const escopo in this.tabela.table) {
  //     for (const row of this.tabela.table[escopo]) {
  //       if (row.categoria === 'var') {
  //         declaredVariables.add(row.cadeia);
  //       }
  //     }
  //   }

  //   for (const escopo in this.tabela.table) {
  //     for (const row of this.tabela.table[escopo]) {
  //       if (row.categoria === 'var' && !declaredVariables.has(row.cadeia)) {
  //         this.errors.push(`A variável ${row.cadeia} foi usada sem ser declarada.`);
  //       }
  //     }
  //   };
  // };






}

