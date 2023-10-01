import { ITokens } from "../interfaces/table";

export class Parser {
  tokens: ITokens[]; 
  currentTokenIndex: number;
  errors: string[];

  constructor(tokens: ITokens[]) {
      this.tokens = tokens;
      this.currentTokenIndex = 0;
      this.errors = [];
  }

  parse() {
      this.programa();
      return this.errors;
  }

  consumeToken(expectedTokenType: any, sinc?: any) {
      const currentToken = this.tokens[this.currentTokenIndex];
      if (currentToken && expectedTokenType.test(`/^${currentToken.token}^/`)) {
          this.currentTokenIndex++;
      } else {
          this.errors.push(`Esperado ${expectedTokenType}, encontrado ${currentToken.token}
          na linha ${currentToken.linha}, coluna inicial ${currentToken.coluna_inicial} até 
          coluna final ${currentToken.coluna_final}`);

          if(sinc) {
            while(this.currentTokenIndex < this.tokens.length && 
                !sinc.test(`/^${this.tokens[this.currentTokenIndex].token}$/`) ){
                this.currentTokenIndex++;
            }
        }
      }
  }

  programa() {
    this.consumeToken('PROGRAM', 'IDENTIFICADOR');
    this.consumeToken('IDENTIFICADOR', 'PONTVIRG');
    this.consumeToken('PONTOVIRG', 'VAR|INT|BOOLEAN|PROCEDURE|BEGIN|IF|WHILE|READ|WRITE');
    
    this.bloco();
    this.consumeToken('PONTO');
  }

  bloco() {
        this.declaracaoVariaveis();
        // this.declaraoSubrotinhas();
        // this.comandoComposto();
  }

  declaracaoVariaveis() {
      this.declaracaoVariavel();
      while (this.tokens[this.currentTokenIndex].token === 'PONTOVIRG' && 
      this.currentTokenIndex < this.tokens.length) {
          this.consumeToken('PONTOVIRG', 'INT|BOOLEAN');
          this.declaracaoVariavel();
      }
  }

  declaracaoVariavel() {
      this.tipo();
      this.listaIdentificadores();
  }

  tipo() {
    this.consumeToken('INT|BOOLEAN', 'IDENTIFICADOR');
  }

  listaIdentificadores() {
      this.consumeToken('IDENTIFICADOR', 'INT|BOOLEAN|PONTOVIRG');
      while (this.tokens[this.currentTokenIndex].token === 'VIRG') {
          this.consumeToken('VIRG', 'IDENTIFICADOR');
          this.consumeToken('IDENTIFICADOR', 'VIRG|PONTOVIRG');
      }
  }
}