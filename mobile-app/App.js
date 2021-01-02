import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import LoginScreen from "./screens/login.screen";
import AdminScreen from "./screens/admin.screen";
import UserScreen from "./screens/user.screen";

const Stack = createStackNavigator();

axios.defaults.baseURL = "https://84f5c43a5ca2.ngrok.io";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
