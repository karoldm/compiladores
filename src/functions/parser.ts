import { IToken } from "../interfaces/token";

export class Parser {
  tokens: IToken[]; 
  currentTokenIndex: number;
  errors: string[];

  constructor(tokens: IToken[]) {
      this.tokens = tokens;
      this.currentTokenIndex = 0;
      this.errors = [];
  }

  parse() {
      this.programa();
      return this.errors;
  }

  createPattern(expectedPattern: string) {
    return `^${expectedPattern}$`;
  }

  consumeToken(expectedToken: string, sinc?: string) {
      const currentToken = this.tokens[this.currentTokenIndex];
      
      if(this.currentTokenIndex >= this.tokens.length){
        return;
      }
      
      const regexToken = new RegExp(this.createPattern(expectedToken), 'g');
      // console.log(currentToken)
      if (currentToken && regexToken.test(currentToken.token)) {
          this.currentTokenIndex++;
      } else {
          this.errors.push(`Esperado ${expectedToken}, encontrado ${currentToken.token}
          na linha ${currentToken.linha}, coluna inicial ${currentToken.coluna_inicial} até 
          coluna final ${currentToken.coluna_final}`);

          if(sinc) {
            const regexSinc = new RegExp(expectedToken);
            
            while(this.currentTokenIndex < this.tokens.length && 
              !regexSinc.test(this.tokens[this.currentTokenIndex].token) ){
                // console.log(this.tokens[this.currentTokenIndex].token)
                this.currentTokenIndex++;
              }
        }
      }
  }

  programa() {
    this.consumeToken('PROGRAM', '(VAR|INT|BOOLEAN|PROCEDURE|BEGIN|IF|WHILE|READ|WRITE|PONTO)');
    this.consumeToken('IDENTIFICADOR', '(VAR|INT|BOOLEAN|PROCEDURE|BEGIN|IF|WHILE|READ|WRITE|PONTO)');
    this.consumeToken('PONTOVIRG', '(VAR|INT|BOOLEAN|PROCEDURE|BEGIN|IF|WHILE|READ|WRITE|PONTO)');
    
    this.bloco();
    this.consumeToken('PONTO', '');
  }
  
  bloco() {
    this.declaracaoVariaveis();
  }

  declaracaoVariaveis() {
    this.declaracaoVariavel();
      while (this.currentTokenIndex < this.tokens.length && 
        ['BOOLEAN', 'INT'].includes(this.tokens[this.currentTokenIndex].token)) {
        this.declaracaoVariavel();
      }
  }

  declaracaoVariavel() {
    if(this.currentTokenIndex < this.tokens.length && 
      ['BOOLEAN', 'INT'].includes(this.tokens[this.currentTokenIndex].token)) {
        this.tipo();
        this.listaIdentificadores();
        this.consumeToken('PONTOVIRG', '(VAR|INT|BOOLEAN|PROCEDURE|BEGIN|IF|WHILE|READ|WRITE|PONTO)');
      }
  }

  tipo() {
    this.consumeToken('(INT|BOOLEAN)', 'IDENTIFICADOR');
  }

  listaIdentificadores() {
      this.consumeToken('IDENTIFICADOR', 'PONTOVIRG');
      while (this.currentTokenIndex < this.tokens.length && 
        this.tokens[this.currentTokenIndex].token === 'VIRG') {
          this.consumeToken('VIRG', 'IDENTIFICADOR');
          this.consumeToken('IDENTIFICADOR', '(VIRG|PONTOVIRG)');
      }
    }
  }