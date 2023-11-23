import { IToken } from "../interfaces/token";
import { ISymbolTable, ISymbolTableRow, TipoCategoria, TipoVariavel } from "../interfaces/SymbolTable";
import { SymbolTable } from "./symbolTable";
import { table } from "console";

export class Semantic {
  errors: string[];
  escopo: string;
  tabela: ISymbolTable;

  constructor(tabela: ISymbolTable) {
    this.tabela = tabela;
    this.errors = [];
    this.escopo = '';
  }

 checkDeclaration(escopo: string, cadeia: string) {
    if (this.tabela[escopo]) {
      return this.tabela[escopo].some((symbol) => symbol.cadeia === cadeia);
    }
    return false;
  }
  

  
checkType(escopo: string, cadeia: string, expectedType: TipoVariavel){
    const symbol = this.tabela[escopo]?.find((s) => s.cadeia === cadeia);
    return symbol && symbol.tipo === expectedType;
  }
  
  // Exemplo de uso
  // const isCorrectType = checkType('global', 'x', 'int');
  // if (!isCorrectType) {
  //   console.error('Erro de tipo: A variável x deve ser do tipo int.');
  
  
  // Exemplo simplificado para verificar condições booleanas
// checkBooleanCondition(condition: boolean) {
//   if (typeof condition !== 'boolean') {
//     console.error('Erro: A condição do controle de fluxo deve ser do tipo boolean.');
//   }

  semantic(){
    const isCorrectType = this.checkType('global', 'x', 'int');
    if (!isCorrectType) {
      this.errors.push(`O tipo da variável está incorreto.`);
    }

    const isCorrectDeclaration = this.checkDeclaration('global', 'x');
    if (!isCorrectType) {
      this.errors.push(`A declaração da vraiável está incorreta`);
    }
  
    return this.errors;

  }



}


























   






   












