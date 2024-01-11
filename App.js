import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InitialPage from "./screens/InitialPage";
import SignInPage from "./screens/SignInPage";
import LogInPage from "./screens/LogInPage";
import TeamPage from "./screens/TeamPage";
import UserInformationInputPage from "./screens/UserInformationInputPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InitialPage" component={InitialPage}></Stack.Screen>
        <Stack.Screen name="SignInPage" component={SignInPage}></Stack.Screen>
        <Stack.Screen name="LogInPage" component={LogInPage}></Stack.Screen>
        <Stack.Screen
          name="UserInformationInputPage"
          component={UserInformationInputPage}
        ></Stack.Screen>
        <Stack.Screen name="TeamPage" component={TeamPage}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
