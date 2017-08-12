// @flow

import { envPresetDefaults } from './PluginConfig';
import StorageService from './StorageService';
import UriUtils from './UriUtils';

import type {
  EnvConfig,
  PersistedState,
  PluginConfig,
  PluginConfigs,
  PluginState,
  PluginStateMap
} from './types';

export const envConfigToTargetsString = (envConfig: EnvConfig): string => {
  const components = [];

  if (envConfig.isElectronEnabled && envConfig.electron) {
    components.push(`Electron-${envConfig.electron}`);
  }

  if (envConfig.isNodeEnabled && envConfig.node) {
    components.push(`Node-${envConfig.node}`);
  }

  return encodeURIComponent(components.join(','));
};

export const loadPersistedState = (): PersistedState => {
  const storageState = StorageService.get('replState');
  const queryState = UriUtils.parseQuery();
  const merged = {
    ...storageState,
    ...queryState
  };

  return {
    babili: merged.babili === true,
    browsers: merged.browsers || '',
    builtIns: merged.builtIns === true,
    code: merged.code || '',
    debug: merged.debug === true,
    evaluate: merged.evaluate === true,
    experimental: merged.experimental === true,
    lineWrap: merged.lineWrap != null ? merged.lineWrap : true,
    loose: merged.loose === true,
    presets: merged.presets || '',
    prettier: merged.prettier === true,
    showSidebar: merged.showSidebar === true,
    spec: merged.spec === true,
    targets: merged.targets || ''
  };
};

type DefaultPlugins = { [name: string]: boolean };

export const configArrayToStateMap = (
  pluginConfigs: PluginConfigs,
  defaults: DefaultPlugins = {}
): PluginStateMap =>
  pluginConfigs.reduce((reduced, config) => {
    reduced[config.package] = configToState(
      config,
      defaults[config.package] === true
    );
    return reduced;
  }, {});

export const configToState = (
  config: PluginConfig,
  isEnabled: boolean = false
): PluginState => ({
  config,
  didError: false,
  isEnabled,
  isLoaded: config.isPreLoaded === true,
  isLoading: false,
  plugin: null
});

export const persistedStateToEnvConfig = (
  persistedState: PersistedState
): EnvConfig => {
  const envConfig: EnvConfig = {
    browsers: persistedState.browsers,
    electron: envPresetDefaults.electron.default,
    isEnvPresetEnabled: persistedState.presets.includes('env'),
    isElectronEnabled: false,
    isNodeEnabled: false,
    node: envPresetDefaults.node.default
  };

  decodeURIComponent(persistedState.targets).split(',').forEach(component => {
    try {
      const pieces = component.split('-');
      const name = pieces[0].toLowerCase();
      const value = parseFloat(pieces[1]);

      switch (name) {
        case 'electron':
          envConfig.electron = value;
          envConfig.isElectronEnabled = true;
          break;
        case 'node':
          envConfig.node = value;
          envConfig.isNodeEnabled = true;
          break;
        default:
          console.warn(`Unknown env target "${name}" specified`);
          break;
      }
    } catch (error) {
      console.error('Error parsing env preset configuration', error);
    }
  });

  return envConfig;
};
