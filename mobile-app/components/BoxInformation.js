import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default class BoxInformation extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <SafeAreaView>
        <Text>Box Information</Text>
      </SafeAreaView>
    )
  }
}