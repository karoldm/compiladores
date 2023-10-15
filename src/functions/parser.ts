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
        this.errors.push(`Esperado ${expectedToken} no finla do arquivo`);
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
            const regexSinc = new RegExp(sinc, 'g');
            console.log(sinc)            
            while(this.currentTokenIndex < this.tokens.length && 
              !regexSinc.test(this.tokens[this.currentTokenIndex].token) ){
                //console.log(this.tokens[this.currentTokenIndex].token)
                //console.log(regexSinc.test(this.tokens[this.currentTokenIndex].token))
                this.currentTokenIndex++;
              }
              console.log(this.tokens[this.currentTokenIndex])
        }
      }
  }

  // program
  programa() {
      this.consumeToken('PROGRAM', 'IDENTIFICADOR');
      this.consumeToken('IDENTIFICADOR', 'PONTOVIRG');
      this.consumeToken('PONTOVIRG');
      
      this.bloco();
      this.consumeToken('PONTO');
    }
    
    bloco() {
      const current = this.tokens[this.currentTokenIndex].token;
      if(current === 'INT' || current === 'BOOLEAN'){
        this.declaracaoVariaveis();
      }
      if(current === 'READ' || current === 'WRITE'){
        this.declaracaoSubrotinas();
      }
      this.comandoComposto();
    }
    
    // declarações
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
          this.consumeToken('PONTOVIRG');
        }
      }
      
    tipo() {
      this.consumeToken('(INT|BOOLEAN)', 'IDENTIFICADOR');
    }

    listaIdentificadores() {
        this.consumeToken('IDENTIFICADOR', 'PONTOVIRG');
        while (this.currentTokenIndex < this.tokens.length && 
          this.tokens[this.currentTokenIndex].token !== 'PONTOVIRG') {

            if(this.tokens[this.currentTokenIndex].token === 'IDENTIFICADOR' ||
                this.tokens[this.currentTokenIndex].token === 'VIRG') {
              this.consumeToken('VIRG', 'IDENTIFICADOR');
            }

            else {
              break;
            }

            this.consumeToken('IDENTIFICADOR', '(VIRG|PONTOVIRG|PONTO)');
        }
    }

    declaracaoSubrotinas() {
      while(this.currentTokenIndex < this.tokens.length && 
        this.tokens[this.currentTokenIndex].token === 'PROCEDURE'){
          this.declaracaoProcedimento();
          this.consumeToken('PONTOVIRG');
        }
    }

    declaracaoProcedimento() {
      this.consumeToken('PROCEDURE', 'IDENTIFICADOR');
      this.consumeToken('IDENTIFICADOR', 'PONTOVIRG');
      if(this.currentTokenIndex < this.tokens.length &&
        this.tokens[this.currentTokenIndex].token === 'AP'){
        this.parametrosFormais();
      }
      this.consumeToken('PONTOVIRG');
      this.bloco();
    }

    parametrosFormais() {
      this.consumeToken('AP', 'IDENTIFICADOR');
      this.secaoParametrosFormais();
      while(this.currentTokenIndex < this.tokens.length  
        && this.tokens[this.currentTokenIndex].token === 'PONTOVIRG') {
        this.consumeToken('PONTVIRG');
        this.secaoParametrosFormais();
      }
      this.consumeToken('FP');
    }

    secaoParametrosFormais() {
      if(this.tokens[this.currentTokenIndex].token === 'VAR'){
        this.consumeToken('VAR')
      }
      this.listaIdentificadores();
      this.consumeToken('DOISPONTOS', 'IDENTIFICADOR');
      this.consumeToken('IDENTIFICADOR');
    }

    // comandos 
    comandoComposto() {
      this.consumeToken('BEGIN', '(IDENTIFICADOR|BEGIN|IF|WHILE)');
      this.comando();
      while(this.currentTokenIndex < this.tokens.length &&
        this.tokens[this.currentTokenIndex].token === 'PONTOVIRG'){
          this.consumeToken('PONTOVIRG');
          this.comando();
        }
      this.consumeToken('END');
    }
    
    comando(){
      const current = this.tokens[this.currentTokenIndex].token;
      if(current === 'IDENTIFICADOR'){
        this.consumeToken('IDENTIFICADOR', 'ATRIBUICAO');

        if(this.tokens[this.currentTokenIndex].token === 'ATRIBUICAO'){
          this.consumeToken('ATRIBUICAO', '(OPSOMA|OPSUB)');
          this.expressao();
        }
        else if(this.tokens[this.currentTokenIndex].token === 'AP') {
          this.consumeToken( 'AP', '(OPSOMA|OPSUB|IDENTIFICADOR|AP)');
          this.listaExpressoes();
          this.consumeToken('FP');
        }
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
      else{
        this.consumeToken('(IF|WHILE|BEGIN|IDENTIFICADOR)');
      }
    }

    atribuicao(){
      this.variavel();
      this.consumeToken('ATRIBUICAO', '(OPSOMA|OPSUB)');
      this.expressao();
    }

    variavel(){
      this.consumeToken('IDENTIFICADOR');
      if(this.tokens[this.currentTokenIndex].token === 'OPSOMA' || 
        this.tokens[this.currentTokenIndex].token === 'OPSUB'){
          this.expressao();
        }
    }

    chamadaProcedimento(){
      this.consumeToken('IDENTIFICADOR');
      if(this.tokens[this.currentTokenIndex].token === 'AP'){
        this.consumeToken('AP', '(OPSOMA|OPSUB)');
        this.listaExpressoes();
        this.consumeToken('FP');
      }
    }

    comandoCondicional(){
      this.consumeToken('IF', '(OPSOMA|OPSUB)');
      this.expressao();
      this.consumeToken('THEN', '(IF|WHILE|IDENTIFICADOR|BEGIN)');
      if(this.tokens[this.currentTokenIndex].token === 'ELSE'){
        this.consumeToken('ELSE');
        this.comando();
      }
    }

    comandoRepetitivo(){
      this.consumeToken('WHILE');
      this.expressao();
      this.consumeToken('DO');
      this.comando();
    }

    // expressões
    expressao(){
      this.expressaoSimples();
      const current = this.tokens[this.currentTokenIndex].token;
      // = | <> | < | <= | >= | >
      if(current === 'IGUALDADE' || current === 'DIFERENTE' || current === 'MENOR' ||
      current === 'MAIOR' || current === 'MAIORIGUAL' || current === 'MENORIGUAL'){
        this.relacao();
        this.expressaoSimples();
      }
    }

    expressaoSimples(){
      if(this.tokens[this.currentTokenIndex].token === 'OPSOMA'){
        this.consumeToken('OPSOMA', '(IDENTIFICADOR|NOT|NUMINT|NUMFLOAT|AP)')
      }
      else if(this.tokens[this.currentTokenIndex].token === 'UPSUB'){
        this.consumeToken('UPSUB', '(IDENTIFICADOR|NOT|NUMINT|NUMFLOAT|AP)')
      }
      this.termo();
      while(this.currentTokenIndex < this.tokens.length && (
        this.tokens[this.currentTokenIndex].token === 'OPSOMA' ||
        this.tokens[this.currentTokenIndex].token === 'OPSUB' ||
        this.tokens[this.currentTokenIndex].token === 'OR'
      )) {
        this.consumeToken('(OPSOMA|OPSUB|OR)', '(IDENTIFICADOR|NOT|NUMINT|NUMFLOAT|AP)');
        this.termo();
      }
    }

    termo(){
      this.fator();
      while(this.currentTokenIndex < this.tokens.length && (
            this.tokens[this.currentTokenIndex].token === '*' ||
            this.tokens[this.currentTokenIndex].token === 'DIV' ||
            this.tokens[this.currentTokenIndex].token === 'AND')){
              this.consumeToken('(*|DIV|AND)', '(IDENTIFICADOR|NOT|NUMINT|NUMFLOAT|AP|NOT)');
              this.fator();
      }
    }

    fator(){
      const current = this.tokens[this.currentTokenIndex].token;
      if(current === 'IDENTIFICADOR'){
        this.variavel();
      }
      else if(current === 'NUMINT'){
        this.consumeToken('NUMINT');
      }
      else if(current === 'NUMFLOAT'){
        this.consumeToken('NUMFLOAT');
      }
      else if(current === 'AP'){
        this.consumeToken('AP', '(OPSOMA|OPSUB)');
        this.expressao();
        this.consumeToken('FP');
      }
      else if(current === 'NOT'){
        this.consumeToken('NOT');
        this.fator();
      }
      else{
        this.consumeToken('(IDENTIFICADOR|NOT|AP|NUMINT|NUMFLOAT)');
      }
    }

    relacao(){
      const current = this.tokens[this.currentTokenIndex].token;
      if(current === 'IGUALDADE'){
        this.consumeToken('IGUALDADE');
      } else if(current === 'MENOR'){
        this.consumeToken('MENOR');
      } else if(current === 'MAIOR'){
        this.consumeToken('MAIOR');
      } else if(current === 'MENORIGUAL'){
        this.consumeToken('MENORIGUAL');
      } else if(current === 'MAIORIGUAL'){
        this.consumeToken('MAIORIGUAL');
      }
      else {
        this.consumeToken('(IGUALDADE|MENOR|MAIOR|MENORIGUAL|MAIORIGUAL)');
      }
    }

    listaExpressoes(){
      this.expressao();
      while(this.currentTokenIndex < this.tokens.length && 
        this.tokens[this.currentTokenIndex].token === 'VIRG'){
          this.consumeToken('VIRG', '(OPSOMA|OPSUB)');
          this.expressao();
        }
    }
  }