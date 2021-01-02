import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, Text, FlatList } from "react-native";
import { Button } from "react-native-elements";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardLed from "../components/CardLed";
import axios from "axios";

let axiosConfig = {
  withCredentials: true,
};

const socket = io("http://192.168.1.12:9080/", {
  withCredentials: true,
});

export default class UserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      led: [
        // { ledIndex: "1", state: true },
        // { ledIndex: "2", state: true },
      ],
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      axios
        .get(`/user/${userId}`, { token: userId }, axiosConfig)
        .then((res) => {
          if (!res.data.success) {
            navigation.navigate("Login");
          } else {
            console.log(res.data.user[0].dataLed);
            socket.emit("stateLed", res.data.user[0].dataLed);
            this.setState({ led: res.data.user[0].dataLed });
          }
        });
    } else {
      navigation.navigate("Login");
    }
  }

  componentDidUpdate() {
    socket.on("stateLed", (res) => this.setState({ led: res.data }));
  }

  async changeLight(idx) {
    const { navigation } = this.props;
    const { led } = this.state;
    const userId = await AsyncStorage.getItem("userId");
    led[idx].state = !led[idx].state;
    this.setState({ led }, () => {
      axios
        .post(`/user/${userId}`, { dataLed: led, token: userId }, axiosConfig)
        .then((res) => {
          if (!res.data.success) {
            navigation.navigate("Login");
          } else {
            socket.emit("stateLed", led);
          }
        });
    });
  }

  logOut = async () => {
    const { navigation } = this.props;
    socket.emit("message", "off");
    await AsyncStorage.removeItem("userId");
    axios
      .get("/login/logout", axiosConfig)
      .then((res) => navigation.navigate("Login"));
  };

  render() {
    const { led } = this.state;
    return (
      <SafeAreaView>
        <Text style={styles.textDemo}>Controll Led</Text>
        <FlatList
          data={led}
          numColumns={2}
          renderItem={({ item, index }) => (
            <CardLed led={item} changeLight={() => this.changeLight(index)} />
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.boxBtn}>
          <Button title="Log Out" buttonStyle={styles.btnStyle} onPress={this.logOut}/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  boxBtn: {
    width: 150,
    position: 'relative',
    bottom: -250,
    left: 110
  },
  textDemo: {
    textAlign: 'center',
    margin: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#FA532E'
  },
  btnStyle: {
    backgroundColor: '#555555'
  }
})
