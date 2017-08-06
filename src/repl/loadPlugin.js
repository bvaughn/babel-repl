// @flow

import camelCase from 'lodash.camelcase';

import type { PluginState } from './types';

type Callback = (plugin: PluginState) => void;

export default function loadPlugin(state: PluginState, callback: Callback) {
  if (state.isLoading) {
    return;
  }

  state.isLoading = true;

  const { config } = state;
  const base = config.baseUrl || 'https://bundle.run';
  const url = `${base}/${config.package}@${config.version}`;

  loadScript(url, () => {
    state.isLoaded = true;
    state.isLoading = false;
    state.plugin = window[camelCase(state.config.package)];

    callback(state);
  });
}

function loadScript(source: string, callback: Callback) {
  const script = document.createElement('script');
  script.async = true;
  script.src = source;
  script.onload = callback;

  // $FlowFixMe
  document.head.appendChild(script);
}
