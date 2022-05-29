export function isString(arg: any): arg is string {
  return typeof arg === "string";
}

export function omitKey(object: Record<string, any>, omitKey: string) {
  return Object.keys(object).reduce((result, key) => {
    if (key !== omitKey) {
      result[key] = object[key];
    }

    return result;
  }, {});
}
