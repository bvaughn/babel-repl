// @flow

export type PluginConfig = {
  baseUrl?: string,
  label: string,
  package: string,
  version: string
};

export type PluginConfigs = Array<PluginConfig>;

export type PluginState = {
  config: PluginConfig,
  isEnabled: boolean,
  isLoaded: boolean,
  isLoading: boolean,
  plugin: any
};

export type PluginStateMap = { [name: string]: PluginState };

export type CompileConfig = {
  evaluate: boolean,
  minify: boolean,
  presets: PluginStateMap,
  prettify: boolean
};
