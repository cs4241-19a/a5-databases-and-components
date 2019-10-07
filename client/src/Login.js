import React from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';

export default class Login extends React.Component {
  componentDidMount() {
  }

  login(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const username = this.usernameInput.value;
    const password = this.passwordInput.value;
    $.ajax({
      type: "POST",
      url: '/api/login',
      data: {
        username,
        password,
      },
    }).done(() => {
      this.props.changeState();
    }).fail(e => {
      alert('username or password error');
    });

  }

  render() {
    return (
      <div className="row pt-5">
        <div className="col-3" />
        <div className="col-6">
          <header>
            <h1>
              Login To System
            </h1>
          </header>
          <div>
            <Form onSubmit={this.login.bind(this)}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  ref={(ref) => {
                    console.log(ref);
                    this.usernameInput = ref;
                  }}
                  placeholder="Enter user name"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  ref={(ref) => {this.passwordInput = ref}}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
