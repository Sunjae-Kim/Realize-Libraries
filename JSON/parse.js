const makeElement = (json, index) => {
  let element = '';
  let breakAll = false;
  while(true){
    if(!json[index]) throw new SyntaxError;
    if(json[index] === '}' || json[index] === ']') break;
    if(json[index] === ',') break;
    element = element.concat(json[index]);
    index++;
  };

  element = element.trim();
  if(element === 'true') { element = true } 
  else if(element === 'false') { element = false }
  else if(element === 'null') { element = null }
  else {element = Number(element)}
  
  return {element, index, breakAll};
}

const makeString = (json, index) => {
  let element = '';
  while(true){
    if(!json[index]) throw new SyntaxError;
    if(json[index] === '\\'){
      element = element.concat(json[index+1]);
      index = index + 2;
      continue;
    }
    if(json[index] === '"') break;
    element = element.concat(json[index]);
    index++;
  };

  return {element, index};
}

var parseJSON = function(json, index=0) {
  if(typeof(json) !== 'string') return json;
  let key, value, result, isKey = true, searching = true;
  const primaryData = index === 0 ? true : false;
  const element = json[index] === "{" ? {} : [];
  while(searching){
    if(!json[index]) throw new SyntaxError;
    index++;
    switch(json[index]){
      case '}':
        searching = false;
        break;
      case '{':
        result = parseJSON(json, index);
        index = result.index;
        if(Array.isArray(element)) {
          element.push(result.element);
        } 
        else {
          value = result.element;
          if(!isKey) element[key] = value;
        }
        isKey = true
        break;
      case ']':
        searching = false;
        break;
      case '[':
        result = parseJSON(json, index);
        index = result.index;
        if(Array.isArray(element)) {
          element.push(result.element);
        } 
        else {
          value = result.element;
          if(!isKey) element[key] = value;
        }
        isKey = true;
        break;
        case '"':
        result = makeString(json, index+1);
        index = result.index;
        if(Array.isArray(element)){
          element.push(result.element);
        } 
        else {
          isKey ? key = result.element : value = result.element;
          if(!isKey) element[key] = value;
          isKey = !isKey;
        }
        break;
      case ',': break;
      case ' ': break;
      case ':': break;
      case '\\': break;
      case '\n': break;
      case '\r': break;
      case '\t': break;
      default :
        result = makeElement(json, index);
        index = result.index-1;
        breakAll = result.breakAll;
        if(Array.isArray(element)){
          element.push(result.element);
        }
        else {
          value = result.element;
          if(!isKey) element[key] = value;
          isKey = !isKey;
        }
      }
  }
  if(primaryData) return element;

  return {element, index};
};