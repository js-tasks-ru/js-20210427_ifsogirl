/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const propertyPath = path;

  const getObjectProperty = (obj, propPath) => {
    let result;

    if (obj && Object.keys(obj).length && propPath && propPath.length) {
      if (!propPath.includes('.')) {
        // Если это последнее свойство,то возвращаем его
        result = obj[propPath];
      } else {
        // иначе берём объект-значение этого ключа и ищем в нём
        const propPathParts = propPath.split('.');
        const rootPath = propPathParts[0];
        const childPath = propPath.replace(`${ rootPath }.`, '');
        result = getObjectProperty(obj[rootPath], childPath);
      }
    }

    return result;
  };

  return function (obj) {
    return getObjectProperty(obj, propertyPath);
  };
}
