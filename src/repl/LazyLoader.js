const BABEL_URL = 'https://unpkg.com/babel-standalone@6/babel.min.js'
const BABILI_URL = 'https://unpkg.com/babili-standalone@0/babili.min.js';
const PRETTIER_URL = 'https://unpkg.com/prettier-standalone@1/bundle.js';

let isBabelLoading = false;
let isBabiliLoading = false;
let isPrettierLoading = false;

const LazyLoader = {
  get babel() {
    return window.Babel;
  },
  get babili() {
    return window.Babili;
  },
  get prettier() {
    return window['prettier-standalone'];
  },

  get isBabelLoaded() {
    return !!LazyLoader.babel;
  },
  get isBabiliLoaded() {
    return !!LazyLoader.babili;
  },
  get isPrettierLoaded() {
    return !!LazyLoader.prettier;
  },

  get isBabelLoading() {
    return isBabelLoading;
  },
  get isBabiliLoading() {
    return isBabiliLoading;
  },
  get isPrettierLoading() {
    return isPrettierLoading;
  },

  loadBabel(callback) {
    if (isBabelLoading) {
      return;
    }

    isBabelLoading = true;

    loadScript(BABEL_URL, () => {
      isBabelLoading = false;
      callback();
    });
  },

  loadBabili(callback) {
    if (isBabiliLoading) {
      return;
    }

    isBabiliLoading = true;

    loadScript(BABILI_URL, () => {
      isBabiliLoading = false;
      callback();
    });
  },

  loadPrettier(callback) {
    if (isPrettierLoading) {
      return;
    }

    isPrettierLoading = true;

    loadScript(PRETTIER_URL, () => {
      isPrettierLoading = false;
      callback();
    });
  }
};

function loadScript(source, callback) {
  const script = document.createElement('script');
  script.async = true;
  script.src = source;
  script.onload = callback;

  document.head.appendChild(script);
}

export default LazyLoader;