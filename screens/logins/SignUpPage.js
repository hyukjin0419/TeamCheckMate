import { useNavigation } from "@react-navigation/core";
import React, { useRef, useState, useEffect } from "react";
import {
  AppState,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import { Alert } from "react-native";
import s from "../styles/css.js";
import { db, doc, setDoc } from "../../firebase.js";
import { color } from "../styles/colors.js";

export default function SignInPage({ route }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const appState = useRef(AppState.currentState);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const unsubscribeAuthStateChanged = auth.onAuthStateChanged(
      async (user) => {
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            console.log("User signed in:", user.email);
          }
        }
      }
    );

    const handleAppStateChange = async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const user = auth.currentUser;
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            console.log("User signed in:", user.email);
          }
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
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
  }, [navigation]);

  //회원가입 관련 함수
  const handleSignUp = () => {
    if (isButtonClicked) {
      return;
    }
    setIsButtonClicked(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        await sendEmailVerification(user).then(async () => {
          Alert.alert("인증 이메일이 전송되었습니다");
          console.log("Registered with: " + user.email);
          route.params?.handleSignUp(false);
        });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("이 계정은 이미 존재합니다");
          setIsButtonClicked(false);
        } else {
          Alert.alert("이메일과 비밀번호 입력해 주세요");
          setIsButtonClicked(false);
        }
      });
  };

  const goingBack = () => {
    const user = auth.currentUser;
    deleteUser(user);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView style={s.container}>
        {/*head 부분*/}
        <View style={s.headContainer}>
          <TouchableOpacity style={s.headBtn} onPress={goingBack}>
            <Image
              style={{
                width: 8,
                height: 14,
              }}
              source={require("../images/backBtn.png")}
            />
          </TouchableOpacity>
          <Text style={s.title}>가입하기</Text>
          <View style={s.titleRightBtn}></View>
        </View>

        {/*입력창*/}
        <View style={s.textInputContainer}>
          {/*이메일 입력창*/}
          <TextInput
            placeholder="이메일"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={s.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={s.textInputContainer}>
          {/*비밀번호 입력창*/}
          <TextInput
            placeholder="비밀번호"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={s.textInput}
            secureTextEntry
          />
        </View>
        {/*버튼 Container*/}
        <View>
          {/*가입하기 버튼*/}
          <TouchableOpacity
            onPress={handleSignUp}
            style={{ ...s.button, backgroundColor: color.activated }}
          >
            <Text style={{ ...s.buttonText, color: "white" }}>확인</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
