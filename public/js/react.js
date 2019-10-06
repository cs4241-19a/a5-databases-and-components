'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timer: 0 };
    this.tick()
  }

  render() {
    if (this.state.timer > 0) {
      return this.state.timer;
    }

    return e(
      'p',
      'Session Timer: ',
      this.state.timer},
    );
  }
  
  tick(){
     setInterval( ()=> this.setState({ anumber:this.state.anumber + 1 }), 1000 )
  }
}

const domContainer = document.getElementById('reactContainer');
ReactDOM.render(e(LikeButton), domContainer);