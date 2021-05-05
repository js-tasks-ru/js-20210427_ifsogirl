
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
    const compareResult = str1.localeCompare(str2, ['ru', 'en'], {
      caseFirst: 'upper'
    });

    return  isAscSorting? compareResult : -1 * compareResult;
  });

  return result;
}
