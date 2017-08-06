// @flow

import { css } from 'glamor';
import CodeMirror from './CodeMirror';
import React from 'react';

type Props = {
  className?: string,
  code: ?string,
  error: ?Error,
  onChange?: (value: string) => void,
  options: Object
};

export default function CodeMirrorPanel(props: Props) {
  const { className = '', code, error, onChange, options } = props;

  return (
    <div className={`${styles.panel} ${className}`}>
      <CodeMirror
        className={styles.codeMirror}
        onChange={onChange}
        options={{
          ...options,
          readOnly: onChange == null
        }}
        preserveScrollPosition={onChange == null}
        value={code}
      />
      {error &&
        <pre className={styles.error}>
          {error.message}
        </pre>}
    </div>
  );
}

const styles = {
  codeMirror: css({
    height: '100%'
  }),
  error: css({
    order: 1,
    flex: '0 0 auto',
    maxHeight: '50%',
    overflow: 'auto',
    backgroundColor: '#FEE',
    color: '#A00',
    margin: 0,
    padding: '0.25rem 0.5rem'
  }),
  panel: css({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    overflow: 'auto'
  })
};
