/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  let result = new Set([]);

  if (arr && arr.length) {
    arr.forEach(item => {
      result.add(item);
    });
    // фильтруем массив, проверяя, что каждый элемент - единственный
    // result = arr.filter((item, index) => arr.indexOf(item) === index);
  }

  return Array.from(result);
}
