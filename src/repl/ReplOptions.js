// @flow

import { css } from 'glamor';
import React, { PureComponent } from 'react';
import { pluginConfigs, presetPluginConfigs } from './PluginConfig';

import type { PluginConfig, PluginState, PluginStateMap } from './types';

type ToggleSetting = (name: string, isEnabled: boolean) => void;

type Props = {
  className: string,
  evaluate: boolean,
  lineWrapping: boolean,
  pluginState: PluginStateMap,
  presetState: PluginStateMap,
  toggleSetting: ToggleSetting
};

export default class ReplOptions extends PureComponent {
  props: Props;

  static defaultProps = {
    className: ''
  };

  render() {
    const {
      className,
      evaluate,
      lineWrapping,
      pluginState,
      presetState,
      toggleSetting
    } = this.props;

    return (
      <div className={`${styles.options} ${className}`}>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={evaluate}
            onChange={this._onEvaluateChange}
          />{' '}
          Evaluate
        </label>
        <strong className={styles.strong}>Presets</strong>
        {presetPluginConfigs.map(config =>
          <PluginToggle
            config={config}
            key={config.package}
            state={presetState[config.package]}
            toggleSetting={toggleSetting}
          />
        )}
        <strong className={styles.strong}>Formatting</strong>
        <label className={styles.label}>
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
  <label key={config.package} className={styles.label}>
    <input
      checked={state.isEnabled && !state.didError}
      disabled={state.didError}
      onChange={(event: SyntheticInputEvent) =>
        toggleSetting(config.package, event.target.checked)}
      type="checkbox"
    />{' '}
    {config.label}
  </label>;

const styles = {
  label: css({
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#292929'
    }
  }),
  options: css({
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem 0',
    backgroundColor: '#222',
    color: '#fff',
    overflow: 'auto'
  }),
  strong: css({
    margin: '0.5rem 0',
    padding: '0.25rem 0.5rem',
    background: '#333'
  })
};
