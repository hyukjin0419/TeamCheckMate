import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Image} from "react-native";
import InitialPage from './screens/InitialPage';
import SignInPage from './screens/SignInPage';
import LoadingScreen from './screens/LoadingPage';
import TeamPage from './screens/TeamPage';
import TeamAddPage from './screens/TeamAddPage';
import TeamJoinPage from './screens/TeamJoinPage';
import SettingPage from './screens/SettingPage';
import PersonalPage from './screens/PersonalPage';
import GuidancePage from './screens/GuidancePage';
import SchedulePage from './screens/SchedulePage';

//<Stack.Screen name="LoadingScreen" component={LoadingScreen} ></Stack.Screen>
const Tab = createBottomTabNavigator();

const PersonalStack = createNativeStackNavigator();
const TeamStack = createNativeStackNavigator();
const ScheduleStack = createNativeStackNavigator();
const GuidanceStack = createNativeStackNavigator();
const SettingStack = createNativeStackNavigator();

function PersonalPageTab(){
  return(
    <PersonalStack.Navigator screenOptions={{headerShown: false}}>
      <PersonalStack.Screen name="PersonalPage" component={PersonalPage} />
    </PersonalStack.Navigator>
  )
}
function TeamPageTab() {
  return (
    <TeamStack.Navigator screenOptions={{headerShown: false}}>
      <TeamStack.Screen name="TeamPage" component={TeamPage} />
      <TeamStack.Screen name="TeamAddPage" component={TeamAddPage} />
      <TeamStack.Screen name="TeamJoinPage" component={TeamJoinPage} />
    </TeamStack.Navigator>
  );
}
function SchedulePageTab(){
  return(
    <ScheduleStack.Navigator screenOptions={{headerShown: false}}>
      <ScheduleStack.Screen name="SchedulePage" component={SchedulePage} />
    </ScheduleStack.Navigator>
  )
}
function GuidancePageTab(){
  return(
    <GuidanceStack.Navigator screenOptions={{headerShown: false}}>
      <GuidanceStack.Screen name="GuidancePage" component={GuidancePage} />
    </GuidanceStack.Navigator>
  )
}
function SettingPageTab(){
  return (
    <SettingStack.Navigator screenOptions={{headerShown: false}}>
      <SettingStack.Screen name="SettingPage" component={SettingPage}></SettingStack.Screen>
    </SettingStack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === '개인') {
              iconName = focused ? require('./screens/Images/PersonalIconSelected.png') : require('./screens/Images/PersonalIconUnselected.png');
            }
            else if (route.name === '팀') {
              iconName = focused ? require('./screens/Images/TeamIconSelected.png') : require('./screens/Images/TeamIconUnselected.png');
            } 
            else if (route.name === '시간표') {
              iconName = focused ? require('./screens/Images/ScheduleIconSelected.png') : require('./screens/Images/ScheduleIconUnselected.png');
            }
            
            else if (route.name === '길라잡이') {
              iconName = focused ? require('./screens/Images/GuidanceIconSelected.png') : require('./screens/Images/GuidanceIconUnselected.png');
            }
            else if (route.name === '설정') {
              iconName = focused ? require('./screens/Images/SettingIconSelected.png') : require('./screens/Images/SettingIconUnselected.png');
            }
            

            return <Image source={iconName} style={{ width: 25, height: 25}} />;
          }, headerShown: false, tabBarStyle: {height: "10%"}, tabBarLabelStyle: {paddingBottom: 7}, tabBarActiveTintColor: "black", tabBarInactiveTintColor: "black"
        })}>
        {/*<Stack.Screen name="InitialPage" component={InitialPage} ></Stack.Screen>
        <Stack.Screen name="SignInPage" component={SignInPage}></Stack.Screen>*/}
        <Tab.Screen name={"개인"} component={PersonalPageTab} />
        <Tab.Screen name="팀" component={TeamPageTab} />
        <Tab.Screen name={"시간표"} component={SchedulePageTab} />
        <Tab.Screen name={"길라잡이"} component={GuidancePageTab} />
        <Tab.Screen name={"설정"} component={SettingPageTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}