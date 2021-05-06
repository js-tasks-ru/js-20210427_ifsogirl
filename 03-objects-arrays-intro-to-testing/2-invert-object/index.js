/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  let result;
  if (obj) {
    result = {};

    Object.entries(obj).forEach(([key, value]) => {
      result[value] = key;
    });
  }
  else {
    console.error('Object to invert was not passed');
  }

  return result;
}
