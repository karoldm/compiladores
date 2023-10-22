import { IToken } from "../interfaces/token";

export class Parser {
  tokens: IToken[]; 
  currentTokenIndex: number;
  errors: string[];
  canContinue: boolean;

  constructor(tokens: IToken[]) {
      this.tokens = tokens;
      this.currentTokenIndex = 0;
      this.errors = [];
      this.canContinue = true;
  }

  parse() {
      this.programa();
      return this.errors;
  }

  consumeToken(expectedToken: string, sinc?: string) {
      const currentToken = this.tokens[this.currentTokenIndex];
      
      if(this.currentTokenIndex >= this.tokens.length){
        this.errors.push(`Esperado ${expectedToken}, encontrado EOF`);
          return;
      }
      const regexToken = new RegExp(`\\b${expectedToken}\\b`, 'g');
      // console.log(expectedToken)

      if (currentToken && regexToken.test(currentToken.token)) {
        this.currentTokenIndex++;
        this.canContinue = true;
      } else if(this.canContinue){
          this.errors.push(`Esperado ${expectedToken}, encontrado ${currentToken.token}
          na linha ${currentToken.linha}, coluna inicial ${currentToken.coluna_inicial} até 
          coluna final ${currentToken.coluna_final}`);
          if(sinc) {
            const regexSinc = new RegExp(`\\b${sinc}\\b`, 'g');           
            while(this.tokens[this.currentTokenIndex] && 
              !regexSinc.test(this.tokens[this.currentTokenIndex].token) ){
                this.currentTokenIndex++;
              }
            }
          this.canContinue = false;
      }
  }

  // program
  programa() {
      this.consumeToken('PROGRAM', '(INT|BOOLEAN|PROCEDURE|BEGIN)');
      this.consumeToken('IDENTIFICADOR', '(INT|BOOLEAN|PROCEDURE|BEGIN)');
      this.consumeToken('PONTOVIRG', '(INT|BOOLEAN|PROCEDURE|BEGIN)');
      
      this.bloco();
      this.consumeToken('PONTO');
    }
    
    bloco() {
      if(this.tokens[this.currentTokenIndex]) {
        if(this.tokens[this.currentTokenIndex].token === 'INT' ||
        this.tokens[this.currentTokenIndex].token === 'BOOLEAN'){
          this.parteDeclaracaoVariaveis();
        }
        if(this.tokens[this.currentTokenIndex].token === 'PROCEDURE'){
          this.parteDeclaracaoSubrotinas();
        }
        this.comandoComposto();
      }
      else {
        this.consumeToken('(INT|BOOLEAN|PROCEDURE|BEGIN)');
      }
    }
    
    // declarações
    parteDeclaracaoVariaveis() {
      this.declaracaoVariavel();
      while (this.tokens[this.currentTokenIndex] && 
      this.tokens[this.currentTokenIndex].token === 'PONTOVIRG' && 
      this.tokens[this.currentTokenIndex+1] &&
      ['INT', 'BOOLEAN'].includes(this.tokens[this.currentTokenIndex+1].token)) {
        this.consumeToken('PONTOVIRG');
        this.declaracaoVariavel();
      }
      this.consumeToken('PONTOVIRG', '(PROCEDURE|BEGIN)')
    }
      
    declaracaoVariavel() {
      this.tipo();
      this.listaIdentificadores();
    }
      
    tipo() {
      this.consumeToken('(INT|BOOLEAN)', 'IDENTIFICADOR');
    }

    listaIdentificadores() {
        this.consumeToken('IDENTIFICADOR', 'PONTOVIRG');
        while (this.tokens[this.currentTokenIndex] && 
          this.tokens[this.currentTokenIndex].token !== 'PONTOVIRG' && 
          this.tokens[this.currentTokenIndex].token !== 'DOISPONTOS') {

            if(this.tokens[this.currentTokenIndex].token === 'IDENTIFICADOR' ||
                this.tokens[this.currentTokenIndex].token === 'VIRG') {
              this.consumeToken('VIRG', 'PONTOVIRG');
            }
            else {
              break;
            }
            this.consumeToken('IDENTIFICADOR', 'PONTOVIRG');
        }
    }

    parteDeclaracaoSubrotinas() {
      while(this.tokens[this.currentTokenIndex] && 
        this.tokens[this.currentTokenIndex].token === 'PROCEDURE'){
          this.declaracaoProcedimento();
          this.consumeToken('PONTOVIRG', 'BEGIN');
        }
    }

    declaracaoProcedimento() {
      this.consumeToken('PROCEDURE', 'PONTOVIRG');
      this.consumeToken('IDENTIFICADOR', 'PONTOVIRG');
      if(this.tokens[this.currentTokenIndex] &&
        this.tokens[this.currentTokenIndex].token === 'AP'){
        this.parametrosFormais();
      }
      this.consumeToken('PONTOVIRG', 'BEGIN');
      this.bloco();
    }

    parametrosFormais() {
      this.consumeToken('AP', '(PONTOVIRG)');
      this.secaoParametrosFormais();
      while(this.tokens[this.currentTokenIndex] &&
        this.tokens[this.currentTokenIndex+1] &&
        this.tokens[this.currentTokenIndex].token === 'PONTOVIRG' &&  
        this.tokens[this.currentTokenIndex+1].token === 'FP') {
        this.consumeToken('PONTOVIRG', '(PONTOVIRG)');
        this.secaoParametrosFormais();
      }
      this.consumeToken('FP', 'PONTOVIRG');
    }

    secaoParametrosFormais() {
      if(this.tokens[this.currentTokenIndex] && 
      this.tokens[this.currentTokenIndex].token === 'VAR'){
        this.consumeToken('VAR')
      }
      this.listaIdentificadores();
      this.consumeToken('DOISPONTOS', 'FP');
      this.consumeToken('(INT|BOOLEAN)', 'FP');
    }

    // comandos 
    comandoComposto(){
      if(!this.tokens[this.currentTokenIndex]) return;
      const current = this.tokens[this.currentTokenIndex].token;
      this.consumeToken('BEGIN', '(PONTO|END|ELSE)');
      this.comando();
      while(this.tokens[this.currentTokenIndex] &&
      this.tokens[this.currentTokenIndex+1] &&
      ['IDENTIFICADOR', 'READ', 'WRITE', 'BEGIN', 'IF', 'WHILE']
      .includes(this.tokens[this.currentTokenIndex+1].token)){
        this.consumeToken('PONTOVIRG', '(PONTO|END|ELSE)');
        this.comando();
      }
      if(current === 'BEGIN'){
        this.consumeToken('END', '(PONTO|END|ELSE)');
      }
    }
    
    comando(){
      if(this.currentTokenIndex >= this.tokens.length) return;
      const current = this.tokens[this.currentTokenIndex].token;
      if(current === 'IDENTIFICADOR' && this.tokens[this.currentTokenIndex+1]){
        if(this.tokens[this.currentTokenIndex+1].token === 'AP' ||
        this.tokens[this.currentTokenIndex+1].token === 'PONTOVIRG'){
          this.chamadaProcedimento();
        }
        else {
          this.atribuicao();
        }
      }
      else if(current === 'READ' || current === 'WRITE') {
        this.chamadaProcedimento();
      }
      else if(current === 'BEGIN'){
        this.comandoComposto();
      }
      else if(current === 'IF'){
        this.comandoCondicional();
      }
      else if(current === 'WHILE'){
        this.comandoRepetitivo();
      }
    }

    atribuicao(){
      this.variavel();
      this.consumeToken('ATRIBUICAO', '(PONTOVIRG|END|ELSE)');
      this.expressao();
    }

    variavel(){
      this.consumeToken('(IDENTIFICADOR|TRUE|FALSE)', 
      '(ATRIBUICAO|OPMUL|OPDIV|AND|OPSOMA|OPSUB|OR|IGUALDADE|DIFERENTE|MENOR|MENORIGUAL|MAIORIGUAL|MAIOR|THEN|DO|PONTOVIRG|END|PONTO)');
      const current = this.tokens[this.currentTokenIndex].token;
      if(['OPSOMA', 'OPSUB', 'AP', 'NOT'].includes(current)){
          this.expressao();
        }
    }

    chamadaProcedimento(){
      this.consumeToken('(IDENTIFICADOR|READ|WRITE)', '(PONTOVIRG|END|PONTO)')
      if(this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].token === 'AP'){
        this.consumeToken('AP', 'PONTOVIRG');
        this.listaExpressoes();
        this.consumeToken('FP', 'PONTOVIRG');
      }
    }

    comandoCondicional(){
      this.consumeToken('IF', '(PONTOVIRG|END|PONTO)');
      this.expressao();
      this.consumeToken('THEN', '(PONTOVIRG|END|PONTO)');
      this.comando();
      if(this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].token === 'ELSE'){
        this.consumeToken('ELSE', '(PONTOVIRG|END|PONTO)');
        this.comando();
      }
    }

    comandoRepetitivo(){
      this.consumeToken('WHILE', '(PONTOVIRG|END|PONTO)');
      this.expressao();
      this.consumeToken('DO', '(PONTOVIRG|END|PONTO)');
      this.comando();
    }

    // expressões
    expressao(){
      this.expressaoSimples();
      // = | <> | < | <= | >= | >
      if(this.tokens[this.currentTokenIndex] && 
      ['IGUALDADE', 'DIFERENTE','MENOR', 'MAIOR', 'MENORIGUAL', 'MAIORIGUAL'].includes(this.tokens[this.currentTokenIndex].token)){
        this.relacao();
        this.expressaoSimples();
      }
    }

    expressaoSimples(){
      if(!this.tokens[this.currentTokenIndex]) return;
      if(this.tokens[this.currentTokenIndex].token === 'OPSOMA'){
        this.consumeToken('OPSOMA')
      }
      else if(this.tokens[this.currentTokenIndex].token === 'OPSUB'){
        this.consumeToken('OPSUB')
      }
      this.termo();
      while(this.tokens[this.currentTokenIndex] &&
        ['OPSOMA', 'OPSUB', 'OR'].includes(this.tokens[this.currentTokenIndex].token)) {
        this.consumeToken('(OPSOMA|OPSUB|OR)');
        this.termo();
      }
    }

    termo(){
      this.fator();
      while(this.tokens[this.currentTokenIndex] &&
      ['OPMUL', 'OPDIV', 'AND'].includes(this.tokens[this.currentTokenIndex].token)){
        this.consumeToken('(OPMUL|OPDIV|AND)');
        this.fator();
      }
    }

    fator(){
      if(!this.tokens[this.currentTokenIndex]) return;
      const current = this.tokens[this.currentTokenIndex].token;
      if(['IDENTIFICADOR', 'FALSE', 'TRUE'].includes(current)){
        this.variavel();
      }
      else {
        this.consumeToken('(NUMINT|NUMFLOAT|AP|NOT)', 
        '(VIRG|DO|THEN|FP|PONTOVIRG|PONTO|END|OPMUL|OPDIV|AND OPSOMA|OPSUB|' +
         'OR|IGUAL|DIFERENTE|MENOR|MENORIGUAL|MAIORIGUAL|MAIOR)');
        if(current === 'AP'){
          this.expressao();
          this.consumeToken('FP');
        }
        else if(current === 'NOT'){
          this.fator();
        }
      }
    }

    relacao(){
      // = | <> | < | <= | >= | >
      this.consumeToken('(DIFERENTE|IGUALDADE|MENOR|MAIOR|MENORIGUAL|MAIORIGUAL)',
      '(OPSOMA|OPSUB|IDENTIFICADOR|NUMINT|NUMFLOAT|AP|NOT)');
    }

    listaExpressoes(){
      this.expressao();
      while(this.tokens[this.currentTokenIndex] && 
        this.tokens[this.currentTokenIndex].token === 'VIRG'){
          this.consumeToken('VIRG');
          this.expressao();
        }
    }
  }