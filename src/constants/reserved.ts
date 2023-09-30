const reservedWords = new Map();
const reservedSymbols = new Map();
reservedSymbols.set("+", "OPSOMA");
reservedSymbols.set("-", "OPSUB");
reservedSymbols.set("*", "OPMUL");
reservedSymbols.set("div", "OPDIV");
reservedSymbols.set("(", "AP");
reservedSymbols.set(")", "FP");
reservedSymbols.set(";", "PONTOVIRG");
reservedSymbols.set("<", "MENOR");        
reservedSymbols.set("<>", "DIFERENTE");        
reservedSymbols.set("=", "IGUAL");
reservedSymbols.set(">", "MAIOR");
reservedSymbols.set("<=", "MENORIGUAL");
reservedSymbols.set(">=", "MAIORIGUAL");
reservedSymbols.set(":=", "ATRIBUICAO");
reservedSymbols.set(",", "VIRG");
reservedWords.set("begin", "PALAVRA RESERVADA BEGIN");
reservedWords.set("end", "PALAVRA RESERVADA END");
reservedWords.set("then", "PALAVRA RESERVADA THEN");
reservedWords.set("else", "PALAVRA RESERVADA ELSE");
reservedWords.set("if", "PALAVRA RESERVADA IF");
reservedWords.set("while", "PALAVRA RESERVADA WHILE");
reservedWords.set("do", "PALAVRA RESERVADA DO");
reservedWords.set("program", "PALAVRA RESERVADA PROGRAM");
reservedWords.set("procedure", "PALAVRA RESERVADA PROCEDURE");
reservedWords.set("int", "PALAVRA RESERVADA INT");
reservedWords.set("boolean", "PALAVRA RESERVADA BOOLEAN");
reservedWords.set("read", "PALAVRA RESERVADA READ");
reservedWords.set("true", "PALAVRA RESERVADA TRUE");
reservedWords.set("false", "PALAVRA RESERVADA FALSE");
reservedWords.set("and", "PALAVRA RESERVADA AND");
reservedWords.set("or", "PALAVRA RESERVADA OR");
reservedWords.set("var", "PALAVRA RESERVADA VAR");

export {reservedWords, reservedSymbols};