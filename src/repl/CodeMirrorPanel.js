// @flow

import CodeMirror from './CodeMirror';
import React from 'react';

type Props = {
  code: ?string,
  error: ?Error,
  onChange?: (value: string) => void,
  style?: Object
};

export default function CodeMirrorPanel(props: Props) {
  const { code, error, onChange, style } = props;

  return (
    <div style={{ ...styles.panel, ...style }}>
      <CodeMirror
        onChange={onChange}
        options={{
          readOnly: onChange == null
        }}
        style={styles.codeMirror}
        value={code}
      />
      {error &&
        <pre style={styles.error}>
          {error.message}
        </pre>}
    </div>
  );
}

const styles = {
  codeMirror: {
    height: '100%'
  },
  error: {
    order: 1,
    flex: '0 0 auto',
    backgroundColor: '#FEE',
    color: '#A00',
    margin: 0,
    padding: '0.25rem 0.5rem'
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    overflow: 'auto'
  }
};
