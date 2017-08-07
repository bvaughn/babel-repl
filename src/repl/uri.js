import LZString from 'lz-string';

const compress = (string: string) =>
  LZString.compressToBase64(string)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='

const decompress = (string: string) =>
  LZString.decompressFromBase64(
    string
      .replace(/\-/g, '+') // Convert '-' to '+'
      .replace(/\_/g, '/') // Convert '_' to '/'
  );

const encode = (value: any) => window.encodeURIComponent(value);

const decode = (value: any) => {
  try {
    return window.decodeURIComponent('' + value);
  } catch (err) {
    return value;
  }
};

/* URL:
    babili=true
    evaluate=false
    lineWrap=true
    presets=es2015%2Cstage-2
    targets=
    browsers=
    builtIns=false
    debug=false
    code_lz=GYVwdgxgLglg9mABAIQDYEMAWAKAlIgbwChFEiBfIA
*/
const parseQuery = () => {
  const parsed = document.location.hash
    .replace(/^\#\?/, '')
    .split('&')
    .reduce((reduced: Object, pair: string) => {
      const pieces = pair.split('=');
      const name = decodeURIComponent('' + pieces[0]);
      const value = decodeURIComponent('' + pieces[1]);

      reduced[name] = value;
      return reduced;
    }, {});

  if (parsed.code_lz) {
    parsed.code = decompress(parsed.code_lz);
  }

  return parsed;
};

const updateQuery = (object: Object) => {
  var query = Object.keys(object)
    .map(
      key =>
        key === 'code'
          ? `${key}_lz=` + compress(object.code)
          : key + '=' + encode(object[key])
    )
    .join('&');

  window.location.hash = '?' + query;
};

export { compress, decode, decompress, encode, parseQuery, updateQuery };
