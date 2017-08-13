// @flow

export type BabelPresets = Array<string | Array<string | Object>>;

export type EnvConfig = {
  browsers: string,
  electron: ?number,
  isEnvPresetEnabled: boolean,
  isElectronEnabled: boolean,
  isNodeEnabled: boolean,
  node: ?number
};

export type LoadScriptCallback = (success: boolean) => void;

export type PluginConfig = {
  baseUrl?: string,
  isPreLoaded?: boolean,
  label: string,
  package: string,
  version?: string
};

export type PluginConfigs = Array<PluginConfig>;

export type PluginState = {
  config: PluginConfig,
  didError: boolean,
  isEnabled: boolean,
  isLoaded: boolean,
  isLoading: boolean,
  plugin: any
};

export type PluginStateMap = { [name: string]: PluginState };

export type CompileConfig = {
  evaluate: boolean,
  presets: BabelPresets,
  prettify: boolean
};

export type PersistedState = {
  babili: boolean,
  browsers: string,
  builtIns: boolean,
  code: string,
  debug: boolean,
  evaluate: boolean,
  lineWrap: boolean,
  presets: string,
  prettier: boolean,
  showSidebar: boolean,
  targets: string
};

type BabelPresetTargetsMap = {
  [key: string]: number
};

type BabelNamedPresetAndTarget = {
  name: string,
  targets: BabelPresetTargetsMap
};

export type BabelPresetEnvResult = {
  modulePlugin: string,
  polyfills: ?Array<string>,
  polyfillsWithTargets: ?Array<BabelNamedPresetAndTarget>,
  targets: BabelPresetTargetsMap,
  transformations: Array<string>,
  transformationsWithTargets: Array<BabelNamedPresetAndTarget>
};
