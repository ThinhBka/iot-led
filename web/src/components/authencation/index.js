import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./style.css";

let axiosConfig = {
  withCredentials: true,
}

class Authencation extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      admin: false,
      dataUsers: [],
      dataAdmins: [],
      errors: [],
    };
  }

  changeAccount = (e, data) => {
    this.setState({ [data]: e.target.value });
  };

  checkUser = () => {
    this.setState({ loading: true });
    const { email, password, admin } = this.state;
    const { history } = this.props;
    console.log(email, password)
    if (admin) {
      axios
        .post("/login/admin", {
          email,
          password,
        }, axiosConfig)
        .then( (res) => {
          history.push(res.data.redirectUrl);
          this.setState({ loading: false });
        })
        .catch( (err) => {
          this.setState({ errors: err, loading: false });
        });
    } else {
      axios
        .post("/login/user", {
          email,
          password,
        },axiosConfig)
        .then( (res) => {
          history.push(res.data.redirectUrl);
          this.setState({ loading: false });
        })
        .catch( (err) => {
          this.setState({ errors: err, loading: false });
        });
    }
  };

  render() {
    const { loading, admin } = this.state;
    return (
      <Form>
        <div className="login-form">Login</div>
        <FormGroup className="input-group">
          <Label for="email" className="input-label">
            Email
          </Label>
          <Input
            className="input-text"
            type="email"
            name="email"
            id="Email"
            placeholder=""
            onChange={(e) => this.changeAccount(e, "email")}
          />
        </FormGroup>
        <FormGroup className="input-group">
          <Label for="password" className="input-label">
            Password
          </Label>
          <Input
            className="input-text"
            type="password"
            name="password"
            id="Password"
            placeholder=""
            onChange={(e) => this.changeAccount(e, "password")}
          />
        </FormGroup>
        <FormGroup className="input-group">
          <Input
            className="input-checkbox"
            type="checkbox"
            name="admin"
            id="admin"
            placeholder=""
            onChange={() => this.setState({ admin: !admin })}
          />
          <Label for="admin" className="input-admin">
            If you are admin, pls check in box
          </Label>
        </FormGroup>
        <div style={{ position: 'relative' }}>
          <Button className="btn-submit" onClick={this.checkUser}>Submit</Button>
        </div>
        {loading ? <Spinner className="xo-loading" color="primary" /> : ""}
      </Form>
    );
  }
}

export default withRouter(Authencation);
