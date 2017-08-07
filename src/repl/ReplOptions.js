// @flow

import { css } from 'glamor';
import React, { Component } from 'react';
import { pluginConfigs, presetPluginConfigs } from './PluginConfig';
import { media } from './styles';

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

// The choice of Component over PureComponent is intentional here.
// It simplifies the re-use of PluginState objects,
// Without requiring gratuitous use of Object-spread.
export default class ReplOptions extends Component {
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
  state.isLoading
    ? <LoadingAnimation />
    : <label key={config.package} className={styles.label}>
        <input
          checked={state.isEnabled && !state.didError}
          disabled={state.didError}
          onChange={(event: SyntheticInputEvent) =>
            toggleSetting(config.package, event.target.checked)}
          type="checkbox"
        />{' '}
        {config.label}
      </label>;

const LoadingAnimation = () =>
  <div className={styles.spinner}>
    <div className={`${styles.spinnerBounce} ${styles.spinnerBounce1}`} />
    <div className={`${styles.spinnerBounce} ${styles.spinnerBounce2}`} />
    <div className={`${styles.spinnerBounce} ${styles.spinnerBounce3}`} />
  </div>;

const bounce = css.keyframes({
  '0%': { transform: 'scale(0)' },
  '40%': { transform: 'scale(1.0)' },
  '80%': { transform: 'scale(0)' },
  '100%': { transform: 'scale(0)' }
});

const styles = {
  label: css({
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.5rem',
    height: '2rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#292929'
    },

    [media.small]: {
      padding: '0.5rem 0.75rem',
      whiteSpace: 'nowrap'
    }
  }),
  options: css({
    backgroundColor: '#222',
    color: '#fff',
    '-webkit-overflow-scrolling': 'touch'
  }),
  spinner: css({
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  spinnerBounce: css({
    width: '10px',
    height: '10px',
    backgroundColor: '#fff',
    borderRadius: '100%',
    display: 'inline-block',
    animationName: bounce,
    animationDuration: '1.4s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out'
  }),
  spinnerBounce1: css({
    animationDelay: '-0.32s',
    marginRight: '1rem'
  }),
  spinnerBounce2: css({
    animationDelay: '-0.16s',
    marginRight: '1rem'
  }),
  spinnerBounce3: css({
    animationDelay: 0
  }),
  strong: css({
    margin: '0.5rem 0',
    padding: '0.25rem 0.5rem',
    background: '#333',

    [media.small]: {
      padding: '0.75rem',
      margin: 0
    }
  })
};
