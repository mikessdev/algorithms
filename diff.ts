import _ from "lodash";

export default class GetDifference {
  static diffBetweenLayouts(obj1: any, obj2: any): Difference {
    const differences: Difference = {};

    function compare(obj1: object, obj2: object, path = ""): void {
      const keys1 = _.keys(obj1);
      const keys2 = _.keys(obj2);

      const allKeys = _.union(keys1, keys2);

      _.forEach(allKeys, (key) => {
        const oldValue = obj1[key];
        const newValue = obj2[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (_.isArray(oldValue) && _.isArray(newValue)) {
          differences[currentPath] = [];

          if (!_.isEmpty(newValue)) {
            for (const index in newValue) {
              compare(oldValue[index] || {}, newValue[index], currentPath);

              const diffUnion = differences[currentPath]
                .slice(index)
                .reduce((acc, value) => {
                  return { ...acc, ...value };
                }, {});

              const cleanDifferences = differences[currentPath].slice(0, index);

              differences[currentPath] = cleanDifferences;
              differences[currentPath][index] = diffUnion;
            }
          }
        } else if (_.isObject(oldValue) && _.isObject(newValue)) {
          compare(oldValue, newValue, currentPath);
        } else if (!_.isEqual(oldValue, newValue)) {
          if (_.isArray(differences[path])) {
            differences[path].push({ [key]: newValue });
          } else {
            differences[currentPath] = newValue;
          }
        }
      });
    }

    compare(obj1, obj2);

    return differences;
  }
}

interface Difference {
  [path: string]: any;
}
