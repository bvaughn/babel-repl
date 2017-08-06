// @flow

import React from 'react';
import CodeMirrorPanel from './CodeMirrorPanel';
import ReplOptions from './ReplOptions';
import compile from './compile';
import { pluginConfigs, presetPluginConfigs } from './PluginConfig';

import type { PluginConfigs, PluginStateMap } from './types';

// TODO Update (and restore) settings from URL if present.
// TODO Persist code and preset settings (to cookies) as fallback if no URL.
// TODO Check for unloaded presets when toggled

type Props = {
  defaultValue: ?string
};

type State = {
  code: string,
  compiled: ?string,
  compileError: ?Error,
  evalError: ?Error,
  evaluate: boolean,
  lineWrapping: boolean,
  plugins: PluginStateMap,
  presets: PluginStateMap
};

export default class Repl extends React.Component {
  static defaultProps = {
    defaultValue: ''
  };

  props: Props;
  state: State;

  constructor(props: Props, context: any) {
    super(props, context);

    const code = props.defaultValue || '';

    const state = {
      code,
      compiled: null,
      compileError: null,
      evalError: null,
      evaluate: false,
      lineWrapping: false,
      plugins: configToState(pluginConfigs),
      presets: configToState(presetPluginConfigs)
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
      lineWrapping,
      plugins,
      presets
    } = this.state;

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
          style={styles.codeMirrorPanel}
        />
        <CodeMirrorPanel
          code={compiled}
          error={evalError}
          style={styles.codeMirrorPanel}
        />
      </div>
    );
  }

  _compile = (code: string, state: State) => {
    return compile(code, {
      evaluate: state.evaluate,
      minify: state.plugins.babili.isEnabled,
      presets: state.presets,
      prettify: state.plugins.prettier.isEnabled
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

        this._updateCode(code);
      }
    );
  };

  _updateCode = (code: string) => {
    this.setState(state => this._compile(code, state));
  };
}

const configToState = (pluginConfigs: PluginConfigs): PluginStateMap =>
  pluginConfigs.reduce((reduced, config) => {
    reduced[config.package] = {
      config,
      isEnabled: false,
      isLoaded: false,
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
