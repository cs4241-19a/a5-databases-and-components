"use strict";

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timer: 0 };
    this.tick();
  }

  render() {
    if (this.state.timer < 15) {
      const par = "Session Timer: " + this.state.timer + "";
      return par;
    } else {
      timeOut();
      return null;
    }
  }

  tick() {
    setInterval(() => this.setState({ timer: this.state.timer + 1 }), 1000);
  }
}

const domContainer = document.getElementById("reactContainer");
ReactDOM.render(e(LikeButton), domContainer);

function timeOut() {
  fetch("/logout", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(function(res) {
    window.location = res.url;
  });
}
