/**
 * Merge 2 objects
 * 
 * @param {any} obj1
 * @param {any} obj2
 * @returns {any}
 */
export default function mergeObjects(obj1: any, obj2: any): any {
  Object.entries(obj2).forEach((element) => {
    const key = element[0];
    const value: any = element[1];
    if (Array.isArray(value)) {
      if (!obj1[key]) obj1[key] = [];
      for (let i = 0; i < value.length; i++) {
        if (!obj1[key].includes(value[i]))
          obj1[key].push(value[i]);
      }
    } else if (typeof value === 'object') {
      if (!obj1[key]) obj1[key] = {};
      obj1[key] = mergeObjects(obj1[key], value);
    } else {
      obj1[key] = value;
    }
  });
  return obj1;
}