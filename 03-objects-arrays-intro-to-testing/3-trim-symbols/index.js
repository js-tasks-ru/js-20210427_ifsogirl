/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size !== 'number') {
    return string;
  }

  let result = '';

  if (size > 0) {
    let searchChar = null;
    let addedSymbolsCount = 0;
    for (let i = 0; i < string.length; i++) {
      const currentChar = string.charAt(i);

      // если встретили другой символ  (отличный от сохранённого),
      // то запоминаем его и обнуляем счётчик добавленных в другую строку таких же символов
      if (searchChar !== currentChar) {
        searchChar = currentChar;
        addedSymbolsCount = 0;
      }

      if (addedSymbolsCount < size) {
        result += currentChar;
        addedSymbolsCount++;
      }
    }
  }

  return result;
}
