export const stringifyObject = obj =>
  obj
    ? Object.keys(obj).reduce((acc, key) => `${acc}&f[${key}]=${obj[key]}`, '')
    : undefined;
