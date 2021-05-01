/**
 * compareLetters - compares two letters of RU or EN locale
 * @param {string} a - first letter
 * @param {string} b - second letter
 * @returns {number} - 0 if a === b
 *                     -1 if a < b
 *                     1  if a > b
 */
const compareLetters = (a, b) => {
  let result;

  const isEnglishA = /[a-zA-Z]/.test(a);
  const isEnglishB = /[a-zA-Z]/.test(b);
  const isSameLocale = (isEnglishA && isEnglishB) || (!isEnglishA && !isEnglishB);

  if (!isSameLocale) {
    // В нашей сортировке английские символы должны быть "больше", чем русские
    result = (isEnglishA ? 1 : -1);
  } else {
    //по умолчанию localeCompare сравнивает с учётом регистра, диакретических знаков и т.п.
    result = a.localeCompare(b, ['ru', 'en'], {
      caseFirst: 'upper'
    });
  }

  return result;
};

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const result = [...arr];

  const isAscSorting = param === 'asc';
  result.sort((str1, str2) => {
    let compareResult = 0;
    let i;

    // Сравниваем посимвольно, пока не найдём отличающиеся символы
    // либо не кончится одна из строк
    for (i = 0; (i < str1.length && i < str2.length && compareResult === 0); i++) {
      const aLetter = str1.charAt(i);
      const bLetter = str2.charAt(i);
      compareResult = compareLetters(aLetter, bLetter);
    }

    //если одна строка длиннее другой, и они пока равны,
    // то выносим решение на основании их длин
    if (compareResult === 0 && (i < str1.length - 1 || i < str2.length)) {
      compareResult = str1.length - str2.length;
    }

    return isAscSorting ? compareResult : -1 * compareResult;
  });


  return result;
}
