export function isObject(o) {
  if (Array.isArray(o))
    return false;
  return o != null && typeof o === 'object';
}

export function parseResponse(response) {
  const mappings = {};

  function parsePartial(obj) {
    if (obj == null) {
      return;
    }

    if ('uid' in obj) {
      mappings[obj.uid] = obj;

      for (const key in obj) {
        const value = obj[key];

        if (isObject(value)) {
          obj[key] = value.uid;
          parsePartial(value);
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const current = value[i];

            if (isObject(current)) {
              value[i] = current.uid;
              parsePartial(current);
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < response.length; i++) {
    if (typeof response[i] === 'object') {
      parsePartial(response[i]);
      response[i] = response[i].uid;
    }
  }

  return {
    'response': response,
    'mappings': mappings
  };
}

// path something like 'data[0].author.books[0]'
export function getEntity(path, response, mappings) {

  function helper(slices, response, mappings) {
    let current = slices.pop();
    const pos = current.indexOf('[');
    let index = null;

    if (pos > 0) {
      // indexing array
      const start = pos + 1;
      const end = current.length - 1;

      index = parseInt(current.slice(start, end), 10);
      current = current.slice(0, pos); // array property key
    }

    if (!(current in response)) {
      throw new Error(`Invalid property ${current} in given response.`);
    }

    if (index == null && !(response[current] in mappings)) {
      throw new Error(`Uuid ${response[current]} not found.`);
    }

    if (index != null) {
      response = response[current];

      if (!(response[index] in mappings)) {
        throw new Error(`Uuid ${response[index]} not found.`);
      }
      response = mappings[response[index]]
    } else {
      response = mappings[response[current]]
    }

    if (slices.length > 0) {
      return helper(slices, response, mappings)
    }
    return response
  }

  const parts = path.split('.').reverse();

  return helper(parts, response, mappings)
}
