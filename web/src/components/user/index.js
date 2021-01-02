import React, { Component } from "react";
import { Button, Container, Row, Col } from "reactstrap";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import io from "socket.io-client";
import lightOn from "../assets/img/lightOn.png";
import lightOff from "../assets/img/lightOff.png";
import "./style.css";

let axiosConfig = {
  withCredentials: true,
};

const socket = io("http://192.168.1.12:9080/", {
  withCredentials: true,
});

class UserControll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      led: [
        // { ledIndex: "1", state: true },
        // { ledIndex: "2", state: true },
      ],
    };
  }

  componentDidMount() {
    const { history, match } = this.props;
    if (Cookies.get("userId")) {
      axios.get(`/user/${match.params.id}`, axiosConfig).then((res) => {
        if (!res.data.success) {
          history.push(res.data.redirectUrl);
        } else {
          socket.emit("stateLed", res.data.user[0].dataLed);
          this.setState({ led: res.data.user[0].dataLed });
        }
      });
    } else {
      history.push("/login");
    }
  }

  componentDidUpdate() {
    socket.on("stateLed", (res) => this.setState({ led: res.data }));
  }
  updateData = (data) => {
    socket.emit("stateLed", data);
  };

  changeLight(idx) {
    const { match, history } = this.props;
    const { led } = this.state;
    led[idx].state = !led[idx].state;
    this.setState({ led }, () => {
      axios
        .post(`/user/${match.params.id}`, { dataLed: led }, axiosConfig)
        .then((res) => {
          if (!res.data.success) {
            history.push(res.data.redirectUrl);
          } else {
            this.updateData(led);
          }
        });
    });
  }

  logOut = () => {
    const { history } = this.props;
    socket.emit("message", "off");
    axios
      .get("/login/logout", axiosConfig)
      .then((res) => history.push(res.data.redirectUrl));
  };

  render() {
    const { led } = this.state;
    return (
      <Container>
        <div className="xo-content">Controll Led</div>
        <Row>
          {led.map((item, idx) => (
            <Col className="box-led" xs="6" sm={`${12 / led.length}`}>
              <div className="box-content">
                <p className="text-label">Led 0{item.ledIndex}</p>
                <div className="box-image">
                  <img
                    src={item.state ? lightOn : lightOff}
                    alt=""
                    style={{ width: 100, height: 100 }}
                  />
                </div>
                <div className="box-btn">
                  <Button
                    color={!item.state ? "primary" : "danger"}
                    onClick={() => this.changeLight(idx)}
                  >
                    {" "}
                    {!item.state ? "ON+" : "OFF"}
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          <Col className="btn-logout">
            <Button onClick={this.logOut}>Log Out</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(UserControll);
