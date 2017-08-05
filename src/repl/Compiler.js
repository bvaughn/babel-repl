import React, { Component } from "react";
import { transform } from "babel-standalone";
import CodeMirror from "./CodeMirror";
import prettier from "prettier";
import "codemirror/lib/codemirror.css";

const DEFAULT_BABEL_CONFIG = {
  presets: ["es2015", "react"]
};

const DEFAULT_PRETTIER_CONFIG = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  parser: "babylon"
};

const beautify = code => prettier.format(code, DEFAULT_PRETTIER_CONFIG);
const compile = code => transform(code, DEFAULT_BABEL_CONFIG).code;

export default class Compiler extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = this._updateState(props.code);
  }

  render() {
    const { code, options } = this.props;
    const { compiled, error } = this.state;

    return (
      <div style={styles.row}>
        <div style={styles.column}>
          <CodeMirror
            CodeMirror={window.CodeMirror}
            onChange={this._onChange}
            options={options}
            style={styles.codeMirror}
            value={code}
          />
          {error &&
            <pre style={styles.error}>
              {error.message}
            </pre>}
        </div>
        <div style={styles.column}>
          <CodeMirror
            CodeMirror={window.CodeMirror}
            options={{
              ...options,
              readOnly: true
            }}
            preserveScrollPosition={true}
            style={styles.codeMirror}
            value={compiled}
          />
        </div>
      </div>
    );
  }

  _updateState(code) {
    try {
      return {
        compiled: beautify(compile(code)),
        error: null
      };
    } catch (error) {
      console.error(error);

      return {
        compiled: null,
        error
      };
    }
  }

  _onChange = code => {
    this.setState(this._updateState(code));
  };
}

const styles = {
  codeMirror: {
    height: "100%"
  },
  column: {
    display: "flex",
    flex: "0 0 50%",
    flexDirection: "column",
    justifyContent: "stretch",
    overflow: "auto"
  },
  error: {
    order: 1,
    flex: "0 0 auto",
    backgroundColor: "#FEE",
    color: "#A00",
    margin: 0,
    padding: "0.25rem 0.5rem"
  },
  row: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row"
  }
};
