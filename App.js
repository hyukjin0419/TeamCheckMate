import React, { useRef, useState, useEffect } from "react";
import { AppState, Image, View } from "react-native";
//useEffect: 함수를 사용하면 컴포넌트가 렌더링될 때와 업데이트 될 때 특정코드를 실행할 수 있다.
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//Image 컴포넌트는 앱에서 이미지를 로드하고 표시하는 데 사용됩니다. 이미지 태그 안에 주소를 넣어서
import { auth, db, doc } from "./firebase";
import TeamPage from "./screens/components/Team/TeamPage";
import InitialPage from "./screens/InitialPage";
import SignInPage from "./screens/logins/SignUpPage";
import LogInPage from "./screens/logins/LogInPage";
import TeamAddPage from "./screens/components/Team/TeamAddPage";
import TeamJoinPage from "./screens/components/Team/TeamJoinPage";
import TeamUpdatePage from "./screens/components/Team/TeamUpdatePage";
import AssignmentPage from "./screens/components/AssignmentPage";
import AssignmentAddPage from "./screens/components/AssignmentAddPage";
import AssignmentUpdatePage from "./screens/components/AssignmentUpdatePage";
import SettingPage from "./screens/components/SettingPage";
import PersonalPage from "./screens/components/PersonalPage";
import GuidancePage from "./screens/components/GuidancePage";
import SchedulePage from "./screens/components/SchedulePage";
import TeamMemberAddPage from "./screens/components/Team/TeamMemberAddPage";
import TeamUpdateAddMemberPage from "./screens/components/Team/TeamUpdateAddMemberPage";
import UserInfoInputPage from "./screens/logins/UserInfoInputPage";
import { getDoc } from "firebase/firestore";
import * as Font from "expo-font";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const Stack = createNativeStackNavigator();
// - 스택 형태로 화면 전환을 관리한다
// - 새로운 화면을 스택에 추가하거나 이전 화면으로 돌아가는 기능등을 제공한다
// - 주로 선형적인 관계를 표현한다
const Tab = createBottomTabNavigator();
// - 하단 탭 바를 통해 여러 개의 화면을 효과적으로 전환할 수 있게 한다.
// - 앱의 주요 섹션이나 기능을 나타내는데 사용된다.
// - 주로 여러 주제나 기능으로 구분된 화면을 제공할 때 사용된다.

const PersonalStack = createNativeStackNavigator(); //개인화면 탭
const TeamStack = createNativeStackNavigator(); //팀 화면 탭
const ScheduleStack = createNativeStackNavigator(); //스케줄 탭
const GuidanceStack = createNativeStackNavigator(); //길라잡이 탭
const SettingStack = createNativeStackNavigator(); //설정

//네비게이션은 NavigationContainer -> Stack.Navigator -> stack.Screen순으로 정의된다.
//NavigationContainer: 전체 네비게이션 트리를 감싸는 래퍼 역항르 수행. 일반적으로 앱 최상위 컴포넌트에서 사용
//Navigator: 스택 네비게이터를 정의. 화면을 스택처럼 쌓아두고 이전 화면으로 돌아갈 수 있는 기능 제공
//Stack.Screen: 스택 네비게이터 내에서 각각의 화면을 정의 한다. 화면 구성 옵션과 특정 컴포넌트를 매핑한다.
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
      <TeamStack.Screen name="TeamUpdatePage" component={TeamUpdatePage} />
      <TeamStack.Screen name="TeamJoinPage" component={TeamJoinPage} />
      <TeamStack.Screen
        name="TeamMemberAddPage"
        component={TeamMemberAddPage}
      />
      <TeamStack.Screen
        name="TeamUpdateAddMemberPage"
        component={TeamUpdateAddMemberPage}
      />
      <TeamStack.Screen name="AssignmentPage" component={AssignmentPage} />
      <TeamStack.Screen
        name="AssignmentAddPage"
        component={AssignmentAddPage}
      />
      <TeamStack.Screen
        name="AssignmentUpdatePage"
        component={AssignmentUpdatePage}
      />
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
  //font 불러오기
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "SUIT-Regular": require("./assets/fonts/SUIT-Regular.ttf"),
        "SUIT-Medium": require("./assets/fonts/SUIT-Medium.ttf"),
      });
    };
    loadFonts();
  }, []);
  //로그인이 되었는지 저장하는 변수
  const [isLogIn, setIsLogIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const appState = useRef(AppState.currentState);
  const [logUserIn, setLogUserIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginCheck, setLoginCheck] = useState(true);
  const [loading, setLoading] = useState(true);

  //Firebase의 인증 상태 변경을 감시한다.
  useEffect(() => {
    const unsubscribeAuthStateChanged = auth.onAuthStateChanged(
      async (user) => {
        if (user) {
          setUserEmail(user.email);
          setIsLogIn(user.emailVerified);
          setLoginCheck(false);
        } else {
          setIsLogIn(false);
          setLogUserIn(false);
          setLoginSuccess(false);
          setLoginCheck(true);
        }
      }
    );

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
            } else {
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

  // If app is loaded, set timer to show loader for 4 seconds
  useEffect(() => {
    const timeStamp = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timeStamp);
  }, []);

  //If user inputs information or skips it, set conditions to be true
  const handleUploadSuccess = () => {
    // Update state or perform any action needed when upload is successful
    setLogUserIn(true);
    setLoginSuccess(true);
    setLoginCheck(false);
  };

  //If user logs in then set conditions to be true
  const handleLoginSuccess = () => {
    setLoginSuccess(true);
    setLogUserIn(true);
    setLoginCheck(false);
  };

  const handleSignUp = () => {
    setLoginCheck(true);
  };

  // if loading is true, show loading image
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ height: "70%", width: "70%" }}
          source={require("./screens/images/loading.gif")}
        />
      </View>
    );
  } else {
    //로그인 안되어 있을때 실행화면
    if (!isLogIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="InitialPage"
          >
            <Stack.Screen name="InitialPage" component={InitialPage} />
            <Stack.Screen
              name="LogInPage"
              component={LogInPage}
              initialParams={{ handleLoginSuccess: handleLoginSuccess }}
            />
            <Stack.Screen
              name="SignInPage"
              component={SignInPage}
              initialParams={{ handleSignUp: handleSignUp }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      //로그인 되었을 때 실행화면
      if (!logUserIn && !loginSuccess && loginCheck) {
        return (
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="UserInfoInputPage"
                component={UserInfoInputPage}
                initialParams={{
                  userEmail: userEmail,
                  onUploadSuccess: handleUploadSuccess,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        );
      } else if (loginSuccess || logUserIn || !loginCheck) {
        return (
          <NavigationContainer>
            {/* 탭 네비게이션을 설정하는 컴포넌트 */}
            <Tab.Navigator
              // screenListeners: 탭 내 각 화면에 대한 옵션을 정의한다. 아이콘, 스타일, 라벨등을 설정할 수 있다.
              //route는 현재 화면의 정보를 담고있는 객체이다. 이 객체를 통해 현재 화면에 정보에 접근할 수 있다.
              screenOptions={({ route }) => ({
                //탭 바에 표시될 아이콘을 설정한다.
                //현재 선택된 탭일 때와 아닐 때 아이콘을 다르게 지정할 수 있다.
                tabBarIcon: ({ focused, color, size }) => {
                  let iconAddress;

                  if (route.name === "개인") {
                    //focused는 현재 탭이 활성화 된 상태인지 여부를 나타내는 불리언 값
                    //require("...")는 현재 탭이 (비)활성화 되었을 때 상요할 이미지의 경로를 나타낸다.
                    iconAddress = focused
                      ? require("./screens/images/PersonalIconSelected.png")
                      : require("./screens/images/PersonalIconUnselected.png");
                  } else if (route.name === "팀") {
                    iconAddress = focused
                      ? require("./screens/images/TeamIconSelected.png")
                      : require("./screens/images/TeamIconUnselected.png");
                  } else if (route.name === "시간표") {
                    iconAddress = focused
                      ? require("./screens/images/ScheduleIconSelected.png")
                      : require("./screens/images/ScheduleIconUnselected.png");
                  } else if (route.name === "길라잡이") {
                    iconAddress = focused
                      ? require("./screens/images/GuidanceIconSelected.png")
                      : require("./screens/images/GuidanceIconUnselected.png");
                  } else if (route.name === "설정") {
                    iconAddress = focused
                      ? require("./screens/images/SettingIconSelected.png")
                      : require("./screens/images/SettingIconUnselected.png");
                  }

                  return (
                    <Image
                      source={iconAddress}
                      style={{ width: 25, height: 25 }}
                    />
                  );
                },
                headerShown: false,
                tabBarStyle: { height: "10%", borderTopWidth: 0 }, //탭 바의 스타일을 설정한다.
                tabBarLabelStyle: { paddingBottom: 7 }, //탭 바 라벨의 스타일을 설정한다.
                tabBarActiveTintColor: "black", //활성화된 탭의 텍스트 색상을 설정한다.
                tabBarInactiveTintColor: "black", //비활성화된 탭의 텍스트 색상을 설정한다.
              })}
            >
              {/* 각 탭 화면을 정의하는 컴포넌트
              name속성을 탭의 이름
              component 속성은 해당 탭이 표시될 때 렌더링 될 컴포넌트를 지정 */}
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
  }
}

const config = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
