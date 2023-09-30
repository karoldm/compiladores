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

  consumeToken(expectedTokenType: string) {
      const currentToken = this.tokens[this.currentTokenIndex];
      if (currentToken && currentToken.token === expectedTokenType) {
          this.currentTokenIndex++;
      } else {
          this.errors.push(`Esperado ${expectedTokenType}, encontrado ${currentToken.token}
          na linha ${currentToken.linha}, coluna inicial ${currentToken.coluna_inicial} até 
          coluna final ${currentToken.coluna_final}`);
      }
  }

  programa() {
      this.consumeToken('PALAVRA RESERVADA PROGRAM');
      this.consumeToken('IDENTIFICADOR');
      this.consumeToken('PONTOVIRG');
      this.bloco();
  }

  bloco() {
      if (this.tokens[this.currentTokenIndex].token === 'PALAVRA RESERVADA VAR') {
          this.consumeToken('PALAVRA RESERVADA VAR');
          this.declaracaoVariaveis();
      }

      // Implementar o resto do bloco nas etapas seguintes
  }

  declaracaoVariaveis() {
      this.declaracaoVariavel();
      while (this.tokens[this.currentTokenIndex].token === 'PONTOVIRG' && 
      this.currentTokenIndex < this.tokens.length) {
          this.consumeToken('PONTOVIRG');
          this.declaracaoVariavel();
      }
  }

  declaracaoVariavel() {
      this.tipo();
      this.listaIdentificadores();
  }

  tipo() {
    const currentToken = this.tokens[this.currentTokenIndex];
      if (currentToken.token === 'PALAVRA RESERVADA INT' || currentToken.token === 'PALAVRA RESERVADA BOOLEAN') {
          this.consumeToken(currentToken.token);
      } else {
        this.errors.push(`Esperado int ou boolean na linha ${currentToken.linha}, 
        coluna inicial ${currentToken.coluna_inicial} até coluna final ${currentToken.coluna_final}`);
      }
  }

  listaIdentificadores() {
      this.consumeToken('IDENTIFICADOR');
      while (this.tokens[this.currentTokenIndex].token === 'VIRG') {
          this.consumeToken('VIRG');
          this.consumeToken('IDENTIFICADOR');
      }
  }
}