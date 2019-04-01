import React, { Component } from "react";
import ReactDOM from "react-dom";
import "../index.css";

/** eslint-disable line */
export default class App extends Component {
  render() {
    return <div>Hello #Titans</div>;
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
