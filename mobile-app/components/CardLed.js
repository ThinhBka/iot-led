import React from "react";
import { SafeAreaView, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Button, Image } from "react-native-elements";
import ledOn from "../assets/lightOn.png";
import ledOff from "../assets/lightOff.png";

export default class CardLed extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { led, changeLight } = this.props;
    return (
      <SafeAreaView style={styles.boxMain}>
        <Text style={styles.textMain}>Led {led.ledIndex}</Text>
        <Image
          source={led.state ? ledOn : ledOff }
          style={[{ width: 100, height: 100 }, styles.boxImg]}
          PlaceholderContent={<ActivityIndicator />}
        />
        <Button onPress={changeLight} title={!led.state ? "ON" : "OFF"} buttonStyle={[{ backgroundColor: !led.state ? "#005A9C" : "red"}, styles.turnBtn]} />
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  boxMain: {
    flex: 1,
    margin: 8,
    marginTop: 35
  },
  textMain: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  boxImg: {
    left: 20,
    margin: 8
  },
  turnBtn: {
    width: 150,
    margin: 8,
  }
})