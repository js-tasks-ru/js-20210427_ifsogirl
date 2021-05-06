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
    for (let i = 0; i < string.length;) {
      // запоминаем символ - будем считать кол-во повторений
      const searchChar = string.charAt(i);
      let sequenceLength = 0;

      // пока следующие символы совпадают с нашим - увеличиваем счётчик
      // и добавляем этот символ в результат, пока кол-во  меньше size
      while (searchChar === string[i]) {
        i++;

        if (sequenceLength < size) {
          result += searchChar;
        }

        sequenceLength++;
      }
    }
  }

  return result;
}
