var stringifyJSON = function(obj) {
  if (obj && {}.toString.call(obj) === "[object Function]") return;
  if (obj === undefined) return undefined;
  if (obj === null) return `${null}`;
  if (Array.isArray(obj)) {
    let str = "[";
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] && {}.toString.call(obj[i]) === "[object Function]")
        i = obj.length;
      let element = stringifyJSON(obj[i]);
      if (element === undefined) continue;
      element = i === obj.length - 1 ? element : `${element},`;
      str = str.concat(element);
    }
    str = str.concat("]");
    return str;
  }
  switch (typeof obj) {
    case "number":
      return `${obj}`;
    case "boolean":
      return `${obj}`;
    case "string":
      return `"${obj}"`;
    default:
      const keys = Object.keys(obj);
      let str = "{";
      for (let i = 0; i < keys.length; i++) {
        if (
          obj[keys[i]] &&
          {}.toString.call(obj[keys[i]]) === "[object Function]"
        )
          i = keys.length;
        if (obj[keys[i]] === undefined) i = keys.length;
        const value = stringifyJSON(obj[keys[i]]);
        const key = `"${keys[i]}"`;
        if (value === undefined) continue;
        const element =
          i === keys.length - 1 ? `${key}:${value}` : `${key}:${value},`;
        str = str.concat("", element);
      }
      str = str.concat("", "}");
      return str;
  }
};