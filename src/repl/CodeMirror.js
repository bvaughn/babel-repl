import PropTypes from "prop-types";
import React from "react";
import "./CodeMirror.css";

const DEFAULT_CODE_MIRROR_OPTIONS = {
  autoCloseBrackets: true,
  keyMap: "sublime",
  matchBrackets: true,
  mode: "text/jsx",
  lineNumbers: true,
  showCursorWhenSelecting: true,
  tabWidth: 2
};

export default class CodeMirror extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    className: PropTypes.any,
    defaultValue: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.object,
    path: PropTypes.string,
    value: PropTypes.string,
    preserveScrollPosition: PropTypes.bool.isRequired
  };

  static defaultProps = {
    autoFocus: false,
    preserveScrollPosition: false,
    onChange: () => {}
  };

  state = {
    isFocused: false
  };

  componentDidMount() {
    this._codeMirror = window.CodeMirror.fromTextArea(this._textAreaRef, {
      ...DEFAULT_CODE_MIRROR_OPTIONS,
      ...this.props.options
    });
    this._codeMirror.on("change", this._onChange);
    this._codeMirror.setValue(
      this.props.defaultValue || this.props.value || ""
    );
  }

  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this._codeMirror) {
      this._codeMirror.toTextArea();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.value &&
      nextProps.value !== this.props.value &&
      this._codeMirror.getValue() !== nextProps.value
    ) {
      if (nextProps.preserveScrollPosition) {
        var prevScrollPosition = this._codeMirror.getScrollInfo();
        this._codeMirror.setValue(nextProps.value);
        this._codeMirror.scrollTo(
          prevScrollPosition.left,
          prevScrollPosition.top
        );
      } else {
        this._codeMirror.setValue(nextProps.value);
      }
    }
    if (typeof nextProps.options === "object") {
      for (let optionName in nextProps.options) {
        if (nextProps.options.hasOwnProperty(optionName)) {
          this._updateOption(optionName, nextProps.options[optionName]);
        }
      }
    }
  }

  focus() {
    if (this._codeMirror) {
      this._codeMirror.focus();
    }
  }

  render() {
    return (
      <textarea
        autoComplete="off"
        autoFocus={this.props.autoFocus}
        defaultValue={this.props.value}
        name={this.props.name || this.props.path}
        ref={this._setTextAreaRef}
        style={this.props.style}
      />
    );
  }

  _updateOption(optionName, newValue) {
    const oldValue = this._codeMirror.getOption(optionName);

    if (oldValue !== newValue) {
      this._codeMirror.setOption(optionName, newValue);
    }
  }

  _onChange = (doc, change) => {
    if (change.origin !== "setValue") {
      this.props.onChange(doc.getValue(), change);
    }
  };

  _setTextAreaRef = ref => {
    this._textAreaRef = ref;
  };
}
