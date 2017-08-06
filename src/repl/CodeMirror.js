// @flow

import React from 'react';

import 'codemirror/lib/codemirror.css';
import './CodeMirror.css';

const DEFAULT_CODE_MIRROR_OPTIONS = {
  autoCloseBrackets: true,
  keyMap: 'sublime',
  matchBrackets: true,
  mode: 'text/jsx',
  lineNumbers: true,
  showCursorWhenSelecting: true,
  tabWidth: 2
};

type Props = {
  autoFocus: boolean,
  className: string,
  onChange: (value: string) => void,
  options: Object,
  value: ?string,
  preserveScrollPosition: boolean
};

export default class CodeMirror extends React.Component {
  static defaultProps = {
    autoFocus: false,
    className: '',
    preserveScrollPosition: false,
    onChange: (value: string) => {}
  };

  props: Props;
  state = {
    isFocused: false
  };

  _codeMirror: any;
  _textAreaRef: HTMLTextAreaElement;

  componentDidMount() {
    this._codeMirror = window.CodeMirror.fromTextArea(this._textAreaRef, {
      ...DEFAULT_CODE_MIRROR_OPTIONS,
      ...this.props.options
    });
    this._codeMirror.on('change', this._onChange);
    this._codeMirror.setValue(this.props.value || '');
  }

  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this._codeMirror) {
      this._codeMirror.toTextArea();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
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
    } else if (!nextProps.value) {
      this._codeMirror.setValue('');
    }

    if (typeof nextProps.options === 'object') {
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
    const { autoFocus, className, value } = this.props;

    return (
      <textarea
        autoComplete="off"
        autoFocus={autoFocus}
        className={className}
        defaultValue={value}
        ref={this._setTextAreaRef}
      />
    );
  }

  _updateOption(optionName: string, newValue: any) {
    const oldValue = this._codeMirror.getOption(optionName);

    if (oldValue !== newValue) {
      this._codeMirror.setOption(optionName, newValue);
    }
  }

  _onChange = (doc: any, change: any) => {
    if (change.origin !== 'setValue') {
      this.props.onChange(doc.getValue());
    }
  };

  _setTextAreaRef = (ref: HTMLTextAreaElement) => {
    this._textAreaRef = ref;
  };
}
