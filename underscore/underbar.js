class underscore {

  identity(val) {
    return val;
  }

  first(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  }

  last(array, n) {
    if (n === undefined) return array[array.length - 1];
    if (n === 0) return [];
    if (n > array.length) return array;
    return array.slice(n - 1, array.length);
  }

  each(collection, iterator) {
    if (!Array.isArray(collection)) {
      const keys = Object.keys(collection);
      for (let i = 0; i < keys.length; i++) {
        iterator(collection[keys[i]], keys[i], collection);
      }
    } else {
      for (let i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    }
  }

  indexOf(array, target) {
    var result = -1;

    this.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  }

  filter(collection, test) {
    let newCollection = [];
    for (let i = 0; i < collection.length; i++) {
      if (test(collection[i])) {
        newCollection.push(collection[i]);
      }
    }
    return newCollection;
  }

  reject(collection, test) {
    const newCollection = this.filter(collection, element => {
      return !test(element);
    });
    return newCollection;
  }

  uniq(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
      if (!obj[array[i]]) {
        obj[array[i]] = 1;
      } else {
        obj[array[i]]++;
      }
    }

    const result = [];
    this.each(Object.keys(obj).sort(), el => {
      result.push(parseInt(el));
    });

    return result;
  }

  map(collection, iterator) {
    const newCollection = [];
    if (!Array.isArray(collection)) {
      const keys = Object.keys(collection);
      for (let i = 0; i < keys.length; i++) {
        newCollection.push(iterator(collection[keys[i]], keys[i], collection));
      }
    } else {
      for (let i = 0; i < collection.length; i++) {
        newCollection.push(iterator(collection[i], i, collection));
      }
    }
    return newCollection;
  }

  pluck(collection, key) {
    return this.map(collection, function(item) {
      return item[key];
    });
  }

  reduce(collection, iterator, accumulator = null) {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        if (accumulator === null) {
          accumulator = collection[i];
          continue;
        }
        accumulator = iterator(accumulator, collection[i]);
      }
      if (accumulator === null) return collection[0];
    } else {
      const keys = Object.keys(collection);
      for (let i = 0; i < keys.length; i++) {
        accumulator = iterator(accumulator, collection[keys[i]]);
      }
      if (accumulator === null) return collection[keys[0]];
    }

    return accumulator;
  }

  contains (collection, target) {
    return this.reduce(
      collection,
      function(wasFound, item) {
        if (wasFound) {
          return true;
        }
        return item === target;
      },
      false
    );
  }

  every (collection, iterator) {
    if (Array.isArray(collection)) {
      if (collection.length === 0) return true;
    } else {
      if (Object.keys(collection).length === 0) return true;
    }
    if (!iterator) {
      return this.reduce(
        collection,
        (acc, el) => {
          if (acc === false) return false;
          return (acc = el);
        },
        true
      );
    } else {
      return this.reduce(
        collection,
        (acc, el) => {
          if (acc === false) return false;
          switch (iterator(el)) {
            case 0:
              return (acc = false);
            case 1:
              return (acc = true);
            case undefined:
              return (acc = false);
            case false:
              return (acc = false);
            case true:
              return (acc = true);
          }
        },
        true
      );
    }
  }

  some (collection, iterator) {
    if (!iterator) {
      return this.reduce(
        collection,
        (acc, el) => {
          if (acc === true) return true;
          return (acc = el);
        },
        false
      );
    }
    return !this.every(collection, el => {
      return !iterator(el);
    });
  }

  extend (obj) {
    for (let i = 0; i < arguments.length; i++) {
      const keys = Object.keys(arguments[i]);
      for (let j = 0; j < keys.length; j++) {
        obj[keys[j]] = arguments[i][keys[j]];
      }
    }
    return obj;
  }

  defaults(obj) {
    for (let i = 0; i < arguments.length; i++) {
      const keys = Object.keys(arguments[i]);
      for (let j = 0; j < keys.length; j++) {
        if (obj[keys[j]] === undefined) obj[keys[j]] = arguments[i][keys[j]];
      }
    }
    return obj;
  }

  once (func) {
    var alreadyCalled = false;
    var result;

    return function() {
      if (!alreadyCalled) {
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      return result;
    };
  }

  memoize (func) {
    const storage = {};

    return function() {
      const keys = Object.keys(storage);
      const argument = JSON.stringify(arguments);

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === argument) return storage[argument];
      }
      storage[argument] = func.apply(this, arguments);

      return storage[argument];
    };
  }

  delay(func, wait) {
    const argsForFunc = Array.prototype.slice.call(arguments, 2);
    setTimeout(function() {
      func.apply(this, argsForFunc);
    }, wait);
  }

  shuffle (array) {
    const shuffled = array.slice(0, array.length);
    for (let i = 0; i < 1000; i++) {
      const randomIndex = Math.floor(Math.random() * (array.length - 1)) + 1;
      const tmp = shuffled[0];
      shuffled[0] = shuffled[randomIndex];
      shuffled[randomIndex] = tmp;
    }
    return shuffled;
  }

  invoke (collection, functionOrKey, args) {
    var argArray = Array.prototype.slice.call(arguments, 2);
    var isFunction =
      functionOrKey && {}.toString.call(functionOrKey) === "[object Function]";
    return this.map(collection, function(item) {
      var setMethod = isFunction ? functionOrKey : item[functionOrKey];
      return setMethod.apply(item, argArray);
    });
  }

  sortBy (collection, iterator) {
    if (typeof iterator === "string") {
      return collection.sort((a, b) => {
        a = a[iterator];
        b = b[iterator];
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
    }
    return collection.sort((a, b) => {
      return iterator(a) - iterator(b);
    });
  }

  zip () {
    const result = [];
    let index = 0;
    while (true) {
      const element = [];
      for (let j = 0; j < arguments.length; j++) {
        element.push(arguments[j][index]);
      }
      const flag = this.every(arguments, element => {
        return element[index] === undefined;
      });
      if (flag) break;
      result.push(element);
      index++;
    }
    return result;
  }

  flatten (nestedArray, result) {
    let array = [];
    if (Array.isArray(nestedArray)) {
      this.each(nestedArray, element => {
        if (Array.isArray(element)) {
          const newArray = this.flatten(element);
          array = [...array, ...newArray];
          return array;
        } else {
          array.push(element);
        }
      });
    } else {
      return nestedArray;
    }
    return array;
  }

  intersection() {
    let array = [];
    const obj = {};

    this.each(arguments, arg => {
      array = [...array, ...arg];
    });

    this.each(array, element => {
      if (!obj[element]) obj[element] = 1;
      else {
        obj[element]++;
      }
    });

    const result = [];
    const keys = Object.keys(obj);
    this.each(keys, key => {
      if (obj[key] > 1) result.push(key);
    });

    return result;
  }

  difference (array) {
    const [base] = arguments;
    this.each(arguments, arg => {
      if (base === arg) return;
      this.each(arg, element => {
        if (this.contains(base, element)) {
          base.splice(this.indexOf(base, element), 1);
        }
      });
    });
    return base;
  }

  throttle(func, wait) {
    let pause = false;
    return function() {
      if (!pause) {
        func.apply(null, arguments);
        pause = true;
        setTimeout(function() {
          pause = false;
        }, wait);
      }
    };
  }
}