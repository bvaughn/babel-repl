// @flow

import React from 'react';
import CodeMirrorPanel from './CodeMirrorPanel';
import ReplOptions from './ReplOptions';
import compile from './compile';
import loadPlugin from './loadPlugin';
import {
  defaultPresets,
  pluginConfigs,
  presetPluginConfigs
} from './PluginConfig';

import type { PluginConfigs, PluginStateMap } from './types';

// TODO Update (and restore) settings from URL if present.
// TODO Persist code and preset settings (to cookies) as fallback if no URL.
// TODO Media query to stack panels for small-width screens.
// TODO Collapsible options panel.

type Props = {
  defaultValue: ?string
};

type State = {
  code: string,
  compiled: ?string,
  compileError: ?Error,
  evalError: ?Error,
  evaluate: boolean,
  isLoadingPlugins: boolean,
  lineWrapping: boolean,
  plugins: PluginStateMap,
  presets: PluginStateMap
};

const LOADING_PLACEHOLDER_CODE = '// Loading plugins...';

export default class Repl extends React.Component {
  static defaultProps = {
    defaultValue: ''
  };

  props: Props;
  state: State;

  _numLoadingPlugins = 0;

  constructor(props: Props, context: any) {
    super(props, context);

    const code = props.defaultValue || '';

    const state = {
      code,
      compiled: null,
      compileError: null,
      evalError: null,
      evaluate: false,
      isLoadingPlugins: false,
      lineWrapping: false,
      plugins: configToState(pluginConfigs, false),
      presets: configToState(presetPluginConfigs, true, defaultPresets)
    };

    this.state = {
      ...state,
      ...this._compile(code, state)
    };
  }

  render() {
    const {
      code,
      compiled,
      compileError,
      evaluate,
      evalError,
      isLoadingPlugins,
      lineWrapping,
      plugins,
      presets
    } = this.state;

    const options = {
      lineWrapping
    };

    return (
      <div style={styles.row}>
        <ReplOptions
          evaluate={evaluate}
          lineWrapping={lineWrapping}
          pluginState={plugins}
          presetState={presets}
          style={styles.optionsColumn}
          toggleSetting={this._toggleSetting}
        />
        <CodeMirrorPanel
          code={code}
          error={compileError}
          onChange={this._updateCode}
          options={options}
          style={styles.codeMirrorPanel}
        />
        <CodeMirrorPanel
          code={isLoadingPlugins ? LOADING_PLACEHOLDER_CODE : compiled}
          error={evalError}
          options={options}
          style={styles.codeMirrorPanel}
        />
      </div>
    );
  }

  _checkForUnloadedPlugins() {
    const { isLoadingPlugins, plugins } = this.state;

    // Assume all default presets are baked into babel-standalone
    // We really only need to worry about plugins
    for (const key in plugins) {
      const plugin = plugins[key];

      if (plugin.isEnabled && !plugin.isLoaded && !plugin.isLoading) {
        this._numLoadingPlugins++;

        loadPlugin(plugin, success => {
          this._numLoadingPlugins--;

          if (!success) {
            this.setState(state => ({
              plugins: { ...plugins }
            }));
          }

          if (this._numLoadingPlugins === 0) {
            this.setState({ isLoadingPlugins: false }, () => {
              const { code } = this.state;

              this._updateCode(code);
            });
          }
        });
      }
    }

    if (!isLoadingPlugins && this._numLoadingPlugins > 0) {
      this.setState({ isLoadingPlugins: true });
    }
  }

  _compile = (code: string, state: State) => {
    const { evaluate, isLoadingPlugins, plugins, presets } = state;

    if (isLoadingPlugins) {
      return {
        compiled: null,
        compileError: null,
        evalError: null
      };
    }

    const presetsArray: Array<string> = Object.keys(presets)
      .filter(key => presets[key].isEnabled && !presets[key].didError)
      .map(key => presets[key].config.label);

    const babili = plugins['babili-standalone'];
    if (babili.isEnabled && !babili.didError) {
      presetsArray.push('babili');
    }

    return compile(code, {
      evaluate: evaluate,
      presets: presetsArray,
      prettify: plugins.prettier.isEnabled
    });
  };

  _toggleSetting = (name: string, isEnabled: boolean) => {
    this.setState(
      state => {
        const { plugins, presets } = state;

        if (state.hasOwnProperty(name)) {
          return {
            [name]: isEnabled
          };
        } else if (plugins.hasOwnProperty(name)) {
          plugins[name].isEnabled = isEnabled;

          return {
            plugins: { ...plugins }
          };
        } else if (presets.hasOwnProperty(name)) {
          presets[name].isEnabled = isEnabled;

          return {
            presets: { ...presets }
          };
        }
      },
      () => {
        const { code } = this.state;

        this._checkForUnloadedPlugins();
        this._updateCode(code);
      }
    );
  };

  _updateCode = (code: string) => {
    this.setState(state => this._compile(code, state));
  };
}

type DefaultPlugins = { [name: string]: boolean };

const configToState = (
  pluginConfigs: PluginConfigs,
  arePreLoaded: boolean,
  defaults: DefaultPlugins = {}
): PluginStateMap =>
  pluginConfigs.reduce((reduced, config) => {
    reduced[config.package] = {
      config,
      didError: false,
      isEnabled: defaults[config.package] === true,
      isLoaded: arePreLoaded,
      isLoading: false,
      plugin: null
    };

    return reduced;
  }, {});

const styles = {
  codeMirrorPanel: {
    flex: '0 1 50%'
  },
  optionsColumn: {
    flex: '0 0 auto'
  },
  row: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    overflow: 'auto'
  }
};
