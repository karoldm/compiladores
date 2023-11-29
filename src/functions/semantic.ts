import { IToken } from "../interfaces/token";
import { SymbolTable } from "./symbolTable";

export class Semantic {
  errors: string[];
  tokens: IToken[];
  pilhaEscopo: string[];
  tabela: SymbolTable;
  tipoAtual: string = '';
  i: number; 

  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.errors = [];
    this.pilhaEscopo = ['global'];
    this.tabela = new SymbolTable();
    this.i = 0;
  }

  tokensToSymbolTable = (tokens: IToken[]) => {
    for (;this.i < tokens.length; this.i++) {
      let token = tokens[this.i];

      switch (token.token) {

        case 'BOOLEAN':
        case 'INT':
          this.tipoAtual = token.lexema;
          break;

        case 'IDENTIFICADOR':
          if (this.i-1 > 0 && (tokens[this.i-1].token === "BOOLEAN" || tokens[this.i-1].token === "INT")){
            if(!this.tabela.get(token.lexema, this.getEscopo())){
              this.addSymbolRow(token.lexema, token.token,  this.getEscopo(), undefined, this.tipoAtual, token.token);
            }
            else {
              this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} 
            já declarada`);
            }            
            this.i++;
            while(tokens[this.i].token === "VIRG" && this.i < tokens.length) {
              this.i++;
              token = tokens[this.i];
              if(!this.tabela.get(token.lexema,  this.getEscopo())){
                this.addSymbolRow(token.lexema, token.token,  this.getEscopo(), undefined, this.tipoAtual, token.token);
              }
              else {
                this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} já declarada`);
              }
              this.i++;
            }
          }

          else if(this.i+1 < tokens.length && tokens[this.i+1].token === "ATRIBUICAO"){
            if(!this.tabela.get(token.lexema,  this.getEscopo())){
              this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} 
              não declarada`);
            }
            else {
                this.i++;
                let op = [];
                let tipo = this.tabela.get(token.lexema,  this.getEscopo())?.tipo;
                this.i++;
                this.tabela.updateUtilizada(token.lexema,  this.getEscopo(), true);
                while(["IDENTIFICADOR", "TRUE", "FALSE", "NUMINT", "NUMFLOAT",
              "OPSOMA", "OPSUB", "OPMUL", "OPDIV", "MENOR", "IGUAL", "MENORIGUAL", 
              "MAIOR", "MAIORIGUAL", "DIFERENTE"].includes(tokens[this.i].token) && 
              this.i < tokens.length){
                  if(tokens[this.i].token === "IDENTIFICADOR"){
                    if(!this.tabela.get(tokens[this.i].lexema,  this.getEscopo())){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} 
                      não declarada.`)
                    }
                    else if(this.tabela.get(tokens[this.i].lexema,  this.getEscopo())?.tipo !== tipo){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${this.tabela.get(tokens[this.i].lexema,  this.getEscopo())?.tipo}
                     a uma variável do tipo ${tipo}`);
                    }
                    else {
                      op.push(this.tabela.get(tokens[this.i].lexema,  this.getEscopo())?.valor);
                      this.tabela.updateUtilizada(tokens[this.i].lexema,  this.getEscopo(), true);

                    }
                  }
                  else if(tokens[this.i].token === "NUMINT" || tokens[this.i].token === "NUMFLOAT"){
                    if(tipo !== "int"){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${tokens[this.i].token}
                     a uma variável do tipo ${tipo}`);
                    }
                    else {
                      op.push(+tokens[this.i].lexema);
                    }
                  }
                  else if(tokens[this.i].token === "TRUE" || tokens[this.i].token === "FALSE"){
                    if('boolean' !== tipo){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Atribuição de ${tokens[this.i].token}
                     a uma variável do tipo ${tipo}`);
                    }
                    else {
                      op.push(tokens[this.i].token === "TRUE"); 
                    }
                  }
                  else if(tokens[this.i].token === "OPSOMA" || tokens[this.i].token === "OPSUB" 
                  || tokens[this.i].token === "OPDIV" || tokens[this.i].token === "OPMUL"){
                    if(tipo !== 'int'){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Operação de ${tokens[this.i].token} sobre ${tipo}`);
                    }
                    else {
                      if(tokens[this.i].token === "OPDIV"){
                        op.push("/");
                      }
                      else{
                        op.push(tokens[this.i].lexema);
                      }
                    }
                  }
                  else if(tokens[this.i].token === "AND" || tokens[this.i].token === "OR"){
                    if("boolean" !== tipo){
                      this.errors.push(`Linha ${tokens[this.i].linha} - Operação de ${this.tabela.get(tokens[this.i].lexema,  this.getEscopo())?.tipo} sobre ${tipo}`);
                    }
                    else {
                      op.push(tokens[this.i].lexema);
                    }
                  }
                  this.i++
                }
                this.i--;
                let total = eval(op.join(" "));
                this.tabela.updateValue( this.getEscopo(), token.lexema, total);
              }
          }
          break;

        case 'PROCEDURE':
          this.i++;
          token = tokens[this.i];
          if(!this.tabela.get(token.lexema,  this.getEscopo())) {
            this.addSymbolRow(token.lexema, token.token,  this.getEscopo(), undefined, this.tipoAtual, token.token);
          }
          else {
            this.errors.push(`Linha ${tokens[this.i].linha} - Procedure ${tokens[this.i].lexema} 
            já declarada`);
          }
          this.pilhaEscopo.push(tokens[this.i].lexema);
          break;

        case 'END':
          this.pilhaEscopo = this.pilhaEscopo.slice(0, -1);
          break;

        case 'VAR':
          this.i++;
          let vars = [tokens[this.i]];
          this.i++;
          while(tokens[this.i].token === "VIRG" && this.i < tokens.length) {
            this.i++;
            token = tokens[this.i];
            if(!this.tabela.get(token.lexema,  this.getEscopo())){
              vars.push(token);
            }
            else {
              this.errors.push(`Linha ${tokens[this.i].linha} - Variável ${tokens[this.i].lexema} já declarada`);
            }
            this.i++;
          }
          this.i++;
          this.tipoAtual = tokens[this.i].lexema;
          vars.forEach(v => {
            this.addSymbolRow(v.lexema, v.token,  this.getEscopo(), undefined, this.tipoAtual, v.token);
          });
          break;

        case 'IF':
              this.i++; 
              while (tokens[this.i].token !== "THEN" && this.i < tokens.length) {
                if(tokens[this.i].token === "IDENTIFICADOR"){
                    if(!this.tabela.get(tokens[this.i].lexema,  this.getEscopo())){
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
                  tokens[this.i+1].token === "IDENTIFICADOR" && 
                  (this.tabela.get(tokens[this.i+1].lexema,  this.getEscopo())?.tipo === "boolean"))){

                    this.errors.push(`Linha ${tokens[this.i].linha} - Operação só pode ser realizada entre inteiros`);
                  } 
                  else if (tokens[this.i+1].token === "IDENTIFICADOR"){
                    if(!this.tabela.get(tokens[this.i+1].lexema,  this.getEscopo())){
                    this.errors.push(`Linha ${tokens[this.i+1].linha} - Variável ${tokens[this.i+1].lexema} não declarada`);
                  }
                  }
                  break;
                 }
                this.i++;
              }
              break;

            case 'WHILE':   
            this.i++; 
            while (tokens[this.i].token !== "DO" && this.i < tokens.length) {
              if(tokens[this.i].token === "IDENTIFICADOR"){
                  if(!this.tabela.get(tokens[this.i].lexema,  this.getEscopo())){
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
                if(this.i+1 < tokens.length && 
                  (tokens[this.i+1].token === "TRUE" || tokens[this.i+1].token === "FALSE" || (
                tokens[this.i+1].token === "IDENTIFICADOR" && 
                (this.getTipo(tokens[this.i+1].token) === true || 
                (this.getTipo(tokens[this.i+1].token) === false || 
                this.getTipo(tokens[this.i+1].token) === true) || 
                (this.tabela.get(tokens[this.i+1].lexema,  this.getEscopo())?.tipo === "boolean") 
                ||  this.tabela.get(tokens[this.i+1].lexema, this.getEscopo())?.tipo === 'boolean' )))){
                  this.errors.push(`Linha ${tokens[this.i].linha} - Operação só pode ser realizada entre inteiros`);
                } 
                else if (tokens[this.i+1].token === "IDENTIFICADOR"){
                  if(!this.tabela.get(tokens[this.i+1].lexema,  this.getEscopo())){
                  this.errors.push(`Linha ${tokens[this.i+1].linha} - Variável ${tokens[this.i+1].lexema} não declarada`);
                }
                }
                break;
               }
              this.i++;
            }
            break;
      }
    }
    return this.tabela;
  };

  getTipo(value: string){
    return value === "TRUE" ? true : value === "FALSE" ? false : +value;
  }

  getEscopo(){
    return this.pilhaEscopo[this.pilhaEscopo.length-1];
  }


  addSymbolRow = (cadeia: string, token: string, escopo: string, valor: number | boolean | undefined, tipo: string, categoria: string) => {
    this.tabela.push(cadeia, token, escopo, valor, tipo, categoria);
  };

  semantic = (tokens: IToken[]) => {
    this.tabela = this.tokensToSymbolTable(tokens);
    return {errors: this.errors, table: this.tabela};
  };
}


