import React, { Component } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button, CheckBox } from "react-native-elements";
import axios from "axios";

let axiosConfig = {
  withCredentials: true,
}

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      checked: false,
      errors: [],
      loading: false
    };
  }

  onLogin(){
    this.setState({ loading: true });
    const { email, password, checked } = this.state;
    const { navigation } = this.props;
    console.log({email, password, checked});
    if (checked) {
      axios
        .post("/login/admin", {
          email,
          password,
        }, axiosConfig)
        .then( (res) => {
          this.storeData("adminId", res.data.adminId);
          navigation.navigate('Admin');
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
          this.storeData("userId", res.data.userId);
          navigation.navigate('User');
          this.setState({ loading: false });
        })
        .catch( (err) => {
          this.setState({ errors: err, loading: false });
        });
    }
  };

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key , value)
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { email, password, checked, loading } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.boxInput}>
          <Text style={styles.textLabel}>Email</Text>
          <Input
            placeholder="email@address.com"
            leftIcon={<Icon name="user" size={24} color="black" />}
            style={styles.inputText}
            value={email}
            onChangeText={value => this.setState({ email: value })}
            // errorStyle={{ color: "red" }}
            // errorMessage="Error Email"
          />
        </View>
        <View style={styles.boxInput}>
          <Text style={styles.textLabel}>Password</Text>
          <Input
            placeholder="Password"
            leftIcon={<Icon name="rocket" size={24} color="black"/>}
            style={styles.inputText}
            value={password}
            secureTextEntry={true}
            onChangeText={value => this.setState({ password: value })}
            // errorStyle={{ color: "red" }}
            // errorMessage="Error Password"
          />
        </View>
        <View style={styles.boxInput}>
          <CheckBox title="You are a admin" checked={checked} onPress={() => this.setState({ checked: !checked })}/>
        </View>

        <Button
          icon={<Icon name="arrow-right" size={20} color="white" style={{ left: 6}}/>}
          iconRight
          title="Submit"
          iconContainerStyle={styles.iconStyle}
          buttonStyle={styles.btnStyle}
          onPress={() => this.onLogin()}
          loading={loading}
          loadingStyle={[styles.btnStyle, styles.loadding]}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  boxInput: {
    paddingHorizontal: 16,
  },
  iconStyle: {
    marginLeft: 10,
    padding: 8,
  },
  btnStyle: {
    width: 200,
    left: 80,
    margin: 8,
    height: 50
  },
  textLabel: {
    margin: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#555555",
  },
  inputText: {
    padding: 8,
  },
  loadding: {
    left: 0
  }
});
