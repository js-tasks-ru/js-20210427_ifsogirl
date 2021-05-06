/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const propertyPathParts = path && path.length ? path.split('.') : [];

  const getObjectProperty = (obj, pathsArray) => {
    let result;

    if (obj && Object.keys(obj).length && pathsArray.length) {
      const [currentPath, ...restPathParts] = pathsArray;
      if (pathsArray.length === 1) {
        // Если это последнее свойство,то возвращаем его
        result = obj[currentPath];
      } else {
        // иначе берём объект-значение этого ключа и ищем в нём
        result = getObjectProperty(obj[currentPath], restPathParts);
      }
    }

    return result;
  };

  return function (obj) {
    return getObjectProperty(obj, propertyPathParts);
  };
}
