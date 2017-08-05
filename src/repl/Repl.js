import React, { Component } from "react";
import Compiler from "./Compiler";

export default class Repl extends Component {
  state = {
    lineWrapping: false
  };

  render() {
    const { code } = this.props;
    const { lineWrapping } = this.state;

    const options = {
      lineWrapping
    };

    return (
      <div style={styles.column}>
        <div style={styles.options}>
          <label>
            <input
              type="checkbox"
              value={lineWrapping}
              onChange={this._onLineWrappingChange}
            /> Line Wrap
          </label>
        </div>
        <Compiler code={code} options={options} />
      </div>
    );
  }

  _onLineWrappingChange = event => {
    this.setState({
      lineWrapping: event.currentTarget.checked
    });
  };
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
