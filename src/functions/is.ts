import { reservedSymbols, reservedWords } from "../constants/reserved";

function isValidInt(input: string) {
  const unsignedIntRegex = /^\d+$/;
  return unsignedIntRegex.test(input);
}

function isValidFloat(input: string) {
  const unsignedRealRegex = /^(\d*\.\d+|\d+)$/;
  return unsignedRealRegex.test(input);
}

function isValidIdentifier(input: string) {
  // <identificador> ::= <letra> {<letra> | <dígito>}
  // tamanho sempre entre 3 e 10 (inclusivo)
  const regexIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return regexIdentifier.test(input);
}

function isLetter(input: string) {
  return (input >= 'a' && input <= 'z') || (input >= 'A' && input <= 'Z');
}

function isReserved(input: string) {
  for (const key of reservedWords.keys()) {
    if (key.includes(input)) {
      return true;
    }
  }
  for (const key of reservedSymbols.keys()) {
    if (key.includes(input)) {
      return true;
    }
  }
  return false;
}

function isLetterOrUnderscore(input: string) {
  return (input >= 'a' && input <= 'z') || (input >= 'A' && input <= 'Z') || input === '_';
}

function isReservedSymbol(input: string) {
  for (const key of reservedSymbols.keys()) {
    if (key.includes(input)) {
      return true;
    }
  }
}

export {isLetter, isValidFloat, isValidIdentifier, isValidInt, isReserved, isLetterOrUnderscore, isReservedSymbol};