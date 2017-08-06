import PropTypes from "prop-types";
import React, { Component } from "react";
import CodeMirror from "./CodeMirror";
import LazyLoader from "./LazyLoader";
import "codemirror/lib/codemirror.css";

const LOADING_PLACEHOLDER = "// Loading presets ...";

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

export default class Editor extends Component {
  static propTypes = {
    defaultValue: PropTypes.string.isRequired,
    options: PropTypes.object,
    presets: PropTypes.array.isRequired,
    prettify: PropTypes.bool.isRequired
  };

  static defaultProps = {
    defaultValue: "",
    prettify: false
  };

  state = {
    code: this.props.defaultValue,
    ...this._updateState(this.props.defaultValue)
  };

  constructor(props, context) {
    super(props, context);

    this._loadRequiredDependencies(props);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.minify !== this.props.minify ||
      prevProps.presets !== this.props.presets ||
      prevProps.prettify !== this.props.prettify
    ) {
      this.setState(state => this._updateState(state.code));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.minify !== this.props.minify ||
      nextProps.prettify !== this.props.prettify
    ) {
      this._loadRequiredDependencies(nextProps);
    }
  }

  render() {
    const { defaultValue, options } = this.props;
    const { compiled, error } = this.state;

    return (
      <div style={styles.row}>
        <div style={styles.column}>
          <CodeMirror
            onChange={this._onChange}
            defaultValue={defaultValue}
            options={options}
            style={styles.codeMirror}
          />
          {error &&
            <pre style={styles.error}>
              {error.message}
            </pre>}
        </div>
        <div style={styles.column}>
          <CodeMirror
            options={{
              ...options,
              readOnly: true
            }}
            preserveScrollPosition={true}
            style={styles.codeMirror}
            value={this._isLoading() ? LOADING_PLACEHOLDER : compiled}
          />
        </div>
      </div>
    );
  }

  _beautify(code) {
    return LazyLoader.prettier.format(code, DEFAULT_PRETTIER_CONFIG);
  }

  _compile(code) {
    const { minify, presets } = this.props;

    const appliedPresets = presets.concat();

    if (minify) {
      appliedPresets.push("babili");
    }

    return LazyLoader.babel.transform(code, {
      presets: appliedPresets
    }).code;
  }

  _isLoading() {
    const { minify, prettify } = this.props;

    return (
      !LazyLoader.isBabelLoaded ||
      (minify && !LazyLoader.isBabiliLoaded) ||
      (prettify && !LazyLoader.isPrettierLoaded)
    );
  }

  _loadRequiredDependencies(props) {
    if (!LazyLoader.isBabelLoaded && !LazyLoader.isBabelLoading) {
      LazyLoader.loadBabel(() => {
        this.setState(state => this._updateState(state.code));
      });
    }

    if (
      props.minify &&
      !LazyLoader.isBabiliLoaded &&
      !LazyLoader.isBabiliLoading
    ) {
      LazyLoader.loadBabili(() => {
        this.setState(state => this._updateState(state.code));
      });
    }

    if (
      props.prettify &&
      !LazyLoader.isPrettierLoaded &&
      !LazyLoader.isPrettierLoading
    ) {
      LazyLoader.loadPrettier(() => {
        this.setState(state => this._updateState(state.code));
      });
    }
  }

  _updateState(code) {
    if (this._isLoading()) {
      return {
        compiled: null,
        error: null
      };
    }

    const { prettify } = this.props;

    try {
      let compiled = this._compile(code);

      if (prettify) {
        compiled = this._beautify(compiled);
      }

      return {
        compiled,
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
    this.setState(state => this._updateState(code));
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
  loading: {
    padding: "0.25rem 0.5rem"
  },
  row: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row"
  }
};
