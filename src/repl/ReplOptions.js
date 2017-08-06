// @flow

import React from 'react';
import { pluginConfigs, presetPluginConfigs } from './PluginConfig';

import type { PluginConfig, PluginState, PluginStateMap } from './types';

type ToggleSetting = (name: string, isEnabled: boolean) => void;

type Props = {
  evaluate: boolean,
  lineWrapping: boolean,
  pluginState: PluginStateMap,
  presetState: PluginStateMap,
  style?: Object,
  toggleSetting: ToggleSetting
};

export default class ReplOptions extends React.PureComponent {
  props: Props;

  render() {
    const {
      evaluate,
      lineWrapping,
      pluginState,
      presetState,
      style,
      toggleSetting
    } = this.props;

    return (
      <div style={{ ...styles.options, ...style }}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={evaluate}
            onChange={this._onEvaluateChange}
          />{' '}
          Evaluate
        </label>
        <strong style={styles.strong}>Presets</strong>
        {presetPluginConfigs.map(config =>
          <PluginToggle
            config={config}
            key={config.package}
            state={presetState[config.package]}
            toggleSetting={toggleSetting}
          />
        )}
        <strong style={styles.strong}>Formatting</strong>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={lineWrapping}
            onChange={this._onLineWrappingChange}
          />{' '}
          Line Wrap
        </label>
        {pluginConfigs.map(config =>
          <PluginToggle
            config={config}
            key={config.package}
            state={pluginState[config.package]}
            toggleSetting={toggleSetting}
          />
        )}
      </div>
    );
  }

  _onEvaluateChange = (event: SyntheticInputEvent) => {
    this.props.toggleSetting('evaluate', event.target.checked);
  };

  _onLineWrappingChange = (event: SyntheticInputEvent) => {
    this.props.toggleSetting('lineWrapping', event.target.checked);
  };
}

type PluginToggleProps = {
  config: PluginConfig,
  state: PluginState,
  toggleSetting: ToggleSetting
};

const PluginToggle = ({ config, state, toggleSetting }: PluginToggleProps) =>
  <label key={config.package} style={styles.label}>
    <input
      checked={state.isEnabled}
      onChange={(event: SyntheticInputEvent) =>
        toggleSetting(config.package, event.target.checked)}
      type="checkbox"
    />{' '}
    {config.label}
  </label>;

const styles = {
  label: {
    padding: '0.25rem 0.5rem'
  },
  options: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    background: '#222',
    color: '#fff',
    overflow: 'auto'
  },
  strong: {
    margin: '0.5rem 0',
    padding: '0.25rem 0.5rem',
    background: '#333'
  }
};
