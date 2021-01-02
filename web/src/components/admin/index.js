import React, { Component } from "react";
import {
  Table,
  Button,
  Badge,
  Input,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Cookies from 'js-cookie'
import searchIcon from "../assets/img/search.png";
import "./style.css";

let axiosConfig = {
  withCredentials: true,
};

class AdminControll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchText: "",
      modal: false,
      dataLed: [],
      dataLedIndx: [],
      email: "",
      password: "",
      confirmPassword: "",
      errors: [],
    };
  }

  changeAccount(e, data) {
    this.setState({ [data]: e.target.value });
  }

  confirmPasswordFunc(e) {
    this.setState({ confirmPassword: e.target.value }, () => {
      const { confirmPassword, password } = this.state;
      let error = [];
      if (confirmPassword !== password) {
        error.push("Check error");
        this.setState({ errors: error });
        setTimeout(() => {
          this.setState({
            errors: [],
          });
        }, 2000);
      }
    });
  }

  componentDidMount() {
    const { history } = this.props;
    console.log(Cookies.get('adminId'));
    if(Cookies.get('adminId')){
      axios.get("/admin", axiosConfig).then((res) => {
        if (!res.data.success) {
          history.push(res.data.redirectUrl);
        } else {
          this.setState({ data: res.data.users });
        }
      });
    }else{
      history.push('/login');
    }
  }

  searchAccount(e, data){
    this.setState({
      [data]: e.target.value
    })
  };

  searchFunc = () => {
    const { history } = this.props;
    const { searchText } = this.state;
    // C1: use query
    axios.get(`/admin/search?q=${searchText}`, axiosConfig).then(res => {
      if(searchText.trim() === ""){
        history.push(res.data.redirectUrl)
      }else{
        history.push({
          pathname: res.data.redirectUrl,
          search: `?search=${searchText}`
        })
      }
      this.setState({
        data: res.data.user
      })
    });
    // C2: use live query
  }

  toggle = () => {
    const { modal } = this.state;
    this.setState({ modal: !modal });
  };

  onChangeMulti = (event) => {
    let opts = [],
      dataSave = [],
      opt;
    for (let i = 0, len = event.target.options.length; i < len; i++) {
      opt = event.target.options[i];
      if (opt.selected) {
        dataSave.push({ ledIndex: opt.value, state: false });
        opts.push(opt.value);
      }
    }
    console.log(opts, dataSave);
    this.setState({ dataLedIndx: opts, dataLed: dataSave });
  };

  addUser = (e) => {
    e.preventDefault();
    const { data, email, password, dataLed, modal, dataUserId } = this.state;
    const checkUserIdx = data.findIndex((item) => item._id === dataUserId);
    if (checkUserIdx !== -1) {
      const newData = [
        ...data.slice(0, checkUserIdx),
        { _id: dataUserId, email, password, dataLed },
        ...data.slice(checkUserIdx + 1),
      ];
      this.setState(
        {
          data: newData,
          modal: !modal,
          email: "",
          password: "",
          dataLed: [],
          dataUserId: null,
        },
        () => {
          axios.put(
            "/admin/update/user",
            {
              idUser: dataUserId,
              email,
              password,
              dataLed,
            },
            axiosConfig
          );
        }
      );
    } else {
      axios
        .post(
          "/admin/create/user",
          {
            email,
            password,
            dataLed,
          },
          axiosConfig
        )
        .then((res) => {
          const newData = [...data, res.data.user];
          this.setState({
            data: newData,
            modal: !modal,
            email: "",
            password: "",
            confirmPassword: "",
            dataLedIndx: [],
            dataLed: [],
          });
        });
    }
  };

  deleteUser(index) {
    console.log(index);
    const { data } = this.state;
    const dataOld = data[index];
    const newData = [...data.slice(0, index), ...data.slice(index + 1)];
    this.setState({ data: newData }, () => {
      axios.post(
        "/admin/delete/user",
        {
          idUser: dataOld._id,
        },
        axiosConfig
      );
    });
  }

  editUser(index) {
    const { data, modal } = this.state;
    let dataLedIndx = [];
    for (let i = 0; i < data[index].dataLed.length; i++) {
      dataLedIndx.push(data[index].dataLed[i].ledIndex);
    }
    this.setState({
      modal: !modal,
      email: data[index].email,
      password: data[index].password,
      confirmPassword: data[index].password,
      dataLedIndx,
      dataUserId: data[index]._id,
    });
  }

  logOut = () => {
    const { history } = this.props;
    axios
      .get("/login/logout", axiosConfig)
      .then((res) => history.push(res.data.redirectUrl));
  };

  render() {
    const {
      modal,
      dataLedIndx,
      data,
      errors,
      email,
      password,
      confirmPassword,
    } = this.state;
    console.log(data);
    return (
      <Container>
        <Row className="box-controll">
          <Input
            className="search-text"
            type="text"
            name="q"
            id="search"
            placeholder=""
            onChange={(e) => this.searchAccount(e, "searchText")}
          />
          <Button className="box-icon" onClick={this.searchFunc}>
            <img alt="" src={searchIcon} className="icon-search" />
          </Button>
          <Button
            color="primary"
            className="box-add-user"
            onClick={this.toggle}
          >
            Add User+
          </Button>
          <Button color="danger" className="box-log-out" onClick={this.logOut}>
            Log Out
          </Button>
        </Row>
        <Row>
          <Table dark>
            <thead>
              <tr>
                <th>Id</th>
                <th>Account</th>
                <th>Password</th>
                <th>Permission (Điều khiển đèn)</th>
                <th>Set Up (Edit-Delete)</th>
              </tr>
            </thead>
            <tbody>
              {data.length <= 0
                ? ""
                : data.map((item, idx) => (
                    <tr key={item._id}>
                      <th scope="row">{item._id}</th>
                      <th>{item.email}</th>
                      <th>{item.password}</th>
                      <th>
                        {!item.dataLed
                          ? ""
                          : item.dataLed.map((itemLed) => (
                              <>
                                <Badge color="secondary" key={itemLed.ledIndex}>
                                  Led {itemLed.ledIndex}
                                </Badge>{" "}
                              </>
                            ))}
                      </th>
                      <th>
                        <Button color="info" onClick={() => this.editUser(idx)}>
                          Edit
                        </Button>{" "}
                        <Button
                          color="danger"
                          onClick={() => this.deleteUser(idx)}
                        >
                          Delete
                        </Button>
                      </th>
                    </tr>
                  ))}
            </tbody>
          </Table>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add User</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="email" className="modal-email">
                  Email
                </Label>
                <Input
                  className="input-text"
                  type="email"
                  name="email"
                  id="Email"
                  placeholder=""
                  value={email}
                  onChange={(e) => this.changeAccount(e, "email")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password" className="modal-email">
                  Password
                </Label>
                <Input
                  className="input-text"
                  type="password"
                  name="password"
                  id="Password"
                  placeholder=""
                  value={password}
                  onChange={(e) => this.changeAccount(e, "password")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="confirm-password" className="modal-email">
                  Comfirm Password
                </Label>
                <Input
                  className="input-text"
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => this.confirmPasswordFunc(e)}
                />
                {errors.length !== 0 ? (
                  <Label className="error-text">
                    {" "}
                    Check password error, pls
                  </Label>
                ) : (
                  ""
                )}
              </FormGroup>
              <FormGroup>
                <Label for="password" className="modal-email">
                  Select Led Controll
                </Label>
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect"
                  multiple
                  value={dataLedIndx}
                  onChange={(event) => {
                    this.onChangeMulti(event);
                  }}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addUser}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default withRouter(AdminControll);
