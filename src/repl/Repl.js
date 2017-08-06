import React, { Component } from "react";
import Editor from "./Editor";

export default class Repl extends Component {
  state = {
    lineWrapping: false,
    minify: false,
    prettify: false,
  };

  render() {
    const { defaultValue } = this.props;
    const { lineWrapping, minify, prettify } = this.state;

    const options = {
      lineWrapping
    };

    return (
      <div style={styles.column}>
        <div style={styles.options}>
          <label>
            <input
              type="checkbox"
              checked={lineWrapping}
              onChange={this._onLineWrappingChange}
            /> Line Wrap
          </label>
          {/*
          <label>
            <input
              type="checkbox"
              checked={prettify}
              onChange={this._onPrettifyChange}
            /> Prettify
          </label>
          */}
          {' '}
          <label>
            <input
              type="checkbox"
              checked={minify}
              onChange={this._onMinifyChange}
            /> Minify (Babili)
          </label>
        </div>
        <Editor
          defaultValue={defaultValue}
          minify={minify}
          options={options}
          prettify={prettify}
        />
      </div>
    );
  }

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

const styles = {
  column: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
    overflow: "auto"
  },
  options: {
    background: "#323330",
    color: "#fff",
    padding: "0.5rem"
  }
};
