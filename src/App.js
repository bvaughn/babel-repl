import React, { Component } from "react";
import Repl from "./repl/Repl.js";

const code = `class Foo extends React.Component {
  render() {
    return <div>Hi {this.props.name}</div>
  }
}`;

class App extends Component {
  render() {
    return <Repl code={code} />;
  }
}

export default App;
