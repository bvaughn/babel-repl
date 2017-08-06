// @flow

import camelCase from 'lodash.camelcase';

import type { PluginState } from './types';

type Callback = (plugin: PluginState) => void;

const PluginLoader = {
  loadPlugin(state: PluginState, callback: Callback) {
    if (state.isLoading) {
      return;
    }

    state.isLoading = true;

    const url = `https://bundle.run/${state.config.package}@${state.config
      .version}`;

    loadScript(url, () => {
      state.isLoaded = true;
      state.isLoading = false;
      state.plugin = window[camelCase(state.config.package)];

      callback(state);
    });
  }
};

function loadScript(source: string, callback: Callback) {
  const script = document.createElement('script');
  script.async = true;
  script.src = source;
  script.onload = callback;

  // $FlowFixMe
  document.head.appendChild(script);
}

export default PluginLoader;
