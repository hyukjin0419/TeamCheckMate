import React, { useRef, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppState, Image } from "react-native";

import TeamPage from "./screens/components/Team/TeamPage";
import InitialPage from "./screens/InitialPage";
import SignInPage from "./screens/logins/SignInPage";
import LogInPage from "./screens/logins/LogInPage";
import AddMembers from "./screens/logins/AddMembers";
import TeamAddPage from "./screens/components/Team/TeamAddPage";
import TeamJoinPage from "./screens/components/Team/TeamJoinPage";
import SettingPage from "./screens/components/SettingPage";
import PersonalPage from "./screens/components/PersonalPage";
import GuidancePage from "./screens/components/GuidancePage";
import SchedulePage from "./screens/components/SchedulePage";
import { auth } from "./firebase";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PersonalStack = createNativeStackNavigator();
const TeamStack = createNativeStackNavigator();
const ScheduleStack = createNativeStackNavigator();
const GuidanceStack = createNativeStackNavigator();
const SettingStack = createNativeStackNavigator();

function PersonalPageTab() {
  return (
    <PersonalStack.Navigator screenOptions={{ headerShown: false }}>
      <PersonalStack.Screen name="PersonalPage" component={PersonalPage} />
    </PersonalStack.Navigator>
  );
}
function TeamPageTab() {
  return (
    <TeamStack.Navigator screenOptions={{ headerShown: false }}>
      <TeamStack.Screen name="TeamPage" component={TeamPage} />
      <TeamStack.Screen name="TeamAddPage" component={TeamAddPage} />
      <TeamStack.Screen name="TeamJoinPage" component={TeamJoinPage} />
    </TeamStack.Navigator>
  );
}
function SchedulePageTab() {
  return (
    <ScheduleStack.Navigator screenOptions={{ headerShown: false }}>
      <ScheduleStack.Screen name="SchedulePage" component={SchedulePage} />
    </ScheduleStack.Navigator>
  );
}
function GuidancePageTab() {
  return (
    <GuidanceStack.Navigator screenOptions={{ headerShown: false }}>
      <GuidanceStack.Screen name="GuidancePage" component={GuidancePage} />
    </GuidanceStack.Navigator>
  );
}
function SettingPageTab() {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen
        name="SettingPage"
        component={SettingPage}
      ></SettingStack.Screen>
    </SettingStack.Navigator>
  );
}

export default function App() {
  const [isLogIn, setIsLogIn] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const unsubscribeAuthStateChanged = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogIn(user.emailVerified);
      }
      else {
        setIsLogIn(false);
      }
    });

    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const user = auth.currentUser;
        if (user) {
          user.reload().then(() => {
            if (user.emailVerified) {
              console.log("User signed in:", user.email);
              setIsLogIn(user.emailVerified);
              // Do something when the app comes to the foreground
            }
            else {
              setIsLogIn(false);
            }
          });
        }
      }

      appState.current = nextAppState;
      console.log("AppState", appState.current);
    };

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      unsubscribeAuthStateChanged();

      // Check if AppState.removeEventListener is defined before calling
      if (AppState.removeEventListener) {
        AppState.removeEventListener("change", handleAppStateChange);
      }
    };
  }, []);


  //로그인 안되어 있을때 실행화면
  if (!isLogIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="InitialPage">
          <Stack.Screen name="InitialPage" component={InitialPage} />
          <Stack.Screen name="LogInPage" component={LogInPage} />
          <Stack.Screen name="SignInPage" component={SignInPage} />
          <Stack.Screen name="AddMembers" component={AddMembers} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    //로그인 되었을 때 실행화면
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "개인") {
                iconName = focused
                  ? require("./screens/images/PersonalIconSelected.png")
                  : require("./screens/images/PersonalIconUnselected.png");
              } else if (route.name === "팀") {
                iconName = focused
                  ? require("./screens/images/TeamIconSelected.png")
                  : require("./screens/images/TeamIconUnselected.png");
              } else if (route.name === "시간표") {
                iconName = focused
                  ? require("./screens/images/ScheduleIconSelected.png")
                  : require("./screens/images/ScheduleIconUnselected.png");
              } else if (route.name === "길라잡이") {
                iconName = focused
                  ? require("./screens/images/GuidanceIconSelected.png")
                  : require("./screens/images/GuidanceIconUnselected.png");
              } else if (route.name === "설정") {
                iconName = focused
                  ? require("./screens/images/SettingIconSelected.png")
                  : require("./screens/images/SettingIconUnselected.png");
              }

              return (
                <Image source={iconName} style={{ width: 25, height: 25 }} />
              );
            },
            headerShown: false,
            tabBarStyle: { height: "10%" },
            tabBarLabelStyle: { paddingBottom: 7 },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "black",
          })}
        >
          <Tab.Screen name={"개인"} component={PersonalPageTab} />
          <Tab.Screen name={"팀"} component={TeamPageTab} />
          <Tab.Screen name={"시간표"} component={SchedulePageTab} />
          <Tab.Screen name={"길라잡이"} component={GuidancePageTab} />
          <Tab.Screen name={"설정"} component={SettingPageTab} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
