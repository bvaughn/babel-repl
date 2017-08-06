import PropTypes from "prop-types";
import React, { Component } from "react";
import CodeMirror from "./CodeMirror";
import LazySLoader from './LazySLoader';
import "codemirror/lib/codemirror.css";

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

export default class Compiler extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    minify: PropTypes.object,
    prettify: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    code: '',
    minify: false,
    prettify: false,
  };

  state = {
    compiled: this._compile(this.props.code),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.prettify !== this.props.prettify) {
      this.setState(state => this._updateState(state.code));
    }
  }

  render() {
    const { defaultValue, minify, options } = this.props;
    const { compiled, error } = this.state;

    return (
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
    );
  }

  _compile(code) {
    try {
      const {minify, prettify} = this.props;

      // TODO Make completely dynamic, don't hard-code
      const presets = ["es2015", "react"];

      if (minify) {
        presets.push('babili');
      }

      let comiled = window.Babel.transform(
        code,
        {presets}
      ).code;

      if (prettify) {
        compiled = window['prettier-standalone'].format(
          compiled,
          DEFAULT_PRETTIER_CONFIG,
        );
      }

      return {
        compiled: compiled,
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
}

const styles = {
  codeMirror: {
    height: "100%"
  },
};
