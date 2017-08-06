import React, { Component } from "react";
import Editor from "./Editor";

const PRE_LOADED_PRESETS = [
  'env',
  'es2015',
  'es2015-loose',
  'es2016',
  'es2017',
  'react',
  'stage-0',
  'stage-1',
  'stage-2',
  'stage-3',
];

const DEFAULT_PRESETS = {
  'es2015': true,
  'stage-2': true,
  'react': true,
};

// TODO Update (and restore) settings from URL if present.
// TODO Persist code and preset settings (to cookies) as fallback if no URL.
// TODO Move dynamic preset loading out of Editor and into Repl; Editor should just accept an array of strings.

export default class Repl extends Component {
  state = {
    evaluate: false,
    lineWrapping: false,
    minify: false,
    prettify: false,
    selectedPresets: DEFAULT_PRESETS,
  };

  render() {
    const { defaultValue } = this.props;
    const { evaluate, lineWrapping, minify, prettify, selectedPresets } = this.state;

    const options = {
      lineWrapping
    };

    return (
      <div style={styles.row}>
        <div style={styles.options}>
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={evaluate}
              onChange={this._onEvaluateChange}
            /> Evaluate
          </label>
          <strong style={styles.strong}>
            Presets
          </strong>
          {PRE_LOADED_PRESETS.map(preset => (
            <PresetInput
              key={preset}
              preset={preset}
              selectedPresets={selectedPresets}
              setState={this.setState.bind(this)}
            />
          ))}
          <strong style={styles.strong}>
            Formatting
          </strong>
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={lineWrapping}
              onChange={this._onLineWrappingChange}
            /> Line Wrap
          </label>
          {/* TODO Re-enable when I have a Prettier UMD solution
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={prettify}
              onChange={this._onPrettifyChange}
            /> Prettify
          </label>
          */}
          <label style={styles.label}>
            <input
              type="checkbox"
              checked={minify}
              onChange={this._onMinifyChange}
            /> Minify (Babili)
          </label>
        </div>
        <Editor
          defaultValue={defaultValue}
          evaluate={evaluate}
          minify={minify}
          options={options}
          prettify={prettify}
          presets={Object.keys(selectedPresets).filter(key => selectedPresets[key])}
        />
      </div>
    );
  }

  _onEvaluateChange = event => this.setState({
    evaluate: event.currentTarget.checked
  });

  _onLineWrappingChange = event => this.setState({
    lineWrapping: event.currentTarget.checked
  });

  _onMinifyChange = event => this.setState({
    minify: event.currentTarget.checked
  });

  _onPrettifyChange = event => this.setState({
    prettify: event.currentTarget.checked
  });
}

const PresetInput = ({preset, selectedPresets, setState}) => (
  <label
    key={preset}
    style={styles.label}
  >
    <input
      type="checkbox"
      defaultChecked={selectedPresets[preset]}
      onChange={() => setState(state => {
        state.selectedPresets[preset] = !state.selectedPresets[preset];
        return {...state};
      })}
    /> {preset}
  </label>
);

const styles = {
  label: {
    padding: "0.25rem 0.5rem",
  },
  options: {
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    background: "#222",
    color: "#fff",
    overflow: "auto"
  },
  row: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "stretch",
    overflow: "auto"
  },
  strong: {
    padding: "0.25rem 0.5rem",
    background: "#333",
  },
};
