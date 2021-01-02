import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  Modal,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar, Button } from "react-native-elements";
import BoxInformation from '../components/BoxInformation';
const sizeScreen = Dimensions.get("screen");

let axiosConfig = {
  withCredentials: true,
};


export default class AdminScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      email: "",
      password: "",
      confirmPassword: "",
      search: "",
      modal: false,
      dataLed: [],
      dataLedIndx: [],
      loading: false,
      errors: [],
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const adminId = await AsyncStorage.getItem("adminId")
    if(adminId){
      axios.get("/admin",{ token: adminId }, axiosConfig).then((res) => {
        if (!res.data.success) {
          navigation.navigate('Login');
        } else {
          this.setState({ data: res.data.users });
        }
      });
    }else{
      navigation.navigate('Login');
    }
  }

  updateSearch = (value) => {
    this.setState({ search: value });
  };
  render() {
    const { search, loading, data } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={(value) => this.updateSearch(value)}
          onCancel={() => this.setState({ search: "" })}
          showLoading={loading}
          value={search}
          searchIcon={{ size: 26 }}
        />
        <FlatList
          data={data}
          renderItem={({ item }) => <BoxInformation box={item} />}
          keyExtractor={(item) => item.id}
        />

        <View style={[styles.boxContent, styles.boxShadow]}>
          <Button title="Add User" buttonStyle={styles.btnAdd} />
          <Button
            title="Log Out"
            buttonStyle={styles.btnLogOut}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 200, height: 80 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  boxContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: sizeScreen.width,
    height: 80,
    borderTopColor: "white",
    borderWidth: 1,
  },
  btnAdd: {
    width: 150,
    marginRight: 25,
  },
  btnLogOut: {
    width: 120,
    backgroundColor: 'red'
  },
});
