
import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { hot } from "react-hot-loader";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLogin: false,
    };

  }
  changeState() {
    this.setState({
      hasLogin: true,
    });
  }

  render() {
    if (this.state.hasLogin) {
      return <Dashboard />
    } else {
      return <Login changeState={this.changeState.bind(this)} />
    }
  }
}

export default hot(module)(App);
