import { useNavigation } from "@react-navigation/core";
import React, { useRef, useState, useEffect } from "react";
import {
  AppState,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import { Alert } from "react-native";
import styles from "../styles/css.js";
import { db, doc, setDoc } from "../../firebase.js";

export default function SignInPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");
  const [school, setschool] = useState("");
  const [studentNumber, setstudentNumber] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const appState = useRef(AppState.currentState);
  //   active: 앱이 현재 활성화 되어 있습니다.
  //   background: 앱이 백그라운드에 있습니다.
  //   inactive: 앱이 비활성화 되었지만 여전히 실행 중입니다.
  const [disableBtn, setDisableBtn] = useState(true);
  const [signInButtonColor, setSignInButtonColor] = useState("#D9D9D9");
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const unsubscribeAuthStateChanged = auth.onAuthStateChanged(
      async (user) => {
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            console.log("SignInPage -> User signed in:", user.email);
          }
        }
      }
    );
    //handleAppStateChange는 AppState 모듈에서 제공하는 이벤트 핸들러이다. 이 핸들러는 앱의 상태가 변할 때 자동으로 호출된다. 또한 매개변수의 값은 항상 새로운 앱 상태인 nextAppState의 값
    const handleAppStateChange = async (nextAppState) => {
      const isInBackground = appState.current.match(/inactive|background/);
      //만약 백그라운드에 있다가 앱을 active시키면
      if (isInBackground && nextAppState === "active") {
        //유저 정보를 받아와서
        const user = auth.currentUser;
        //유저 정보를 업데이트 하고
        if (user) {
          await user.reload();
          //만약 이메일이 verified 되었으면
          if (user.emailVerified) {
            console.log("User signed in:", user.email);
            //alert("You have successfully signed in");
          }
        }
      }
      //여기 무슨뜻인지..?
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log("AppState: " + appState.current);
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
    try {
      createUserWithEmailAndPassword(auth, email, password).then(
        async (userCredentials) => {
          const user = userCredentials.user;
          await sendEmailVerification(user).then(async () => {
            alert("Verification email sent.");
            console.log("Registered with: " + user.email);
            try {
              const timestamp = new Date();
              const docRef = await setDoc(doc(db, "user", email), {
                email: email,
                name: name,
                school: school,
                studentNumber: studentNumber,
                phoneNumber: phoneNumber,
                timestamp: timestamp,
              });
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          });
        }
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This account already exists");
      } else {
        console.error("Error creating user:", error);
      }
    }
  };
  //이메일 비밀번호 입력 되었는지 확인하는 함수
  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;

    if (isEmailValid && isPasswordValid) {
      setDisableBtn(false);
      setSignInButtonColor("#050026");
    } else {
      setDisableBtn(true);
      setSignInButtonColor("#D9D9D9");
    }
  }, [email, password]);
  return (
    <KeyboardAvoidingView style={styles.container}>
      {/*head 부분*/}
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.navigate("InitialPage")}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>가입하기</Text>
      </View>

      {/*입력창*/}
      <View style={styles.textBox}>
        {/*이메일 입력창*/}
        <TextInput
          placeholder="이메일"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/*이메일 입력창*/}
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.textInput}
          secureTextEntry
        />
        {/*이름 입력창*/}
        <TextInput
          placeholder="이름"
          value={name}
          onChangeText={(text) => setname(text)}
          style={styles.textInput}
        />
        {/*학교 입력창*/}
        <TextInput
          placeholder="학교"
          value={school}
          onChangeText={(text) => setschool(text)}
          style={styles.textInput}
        />
        {/*학번 입력창*/}
        <TextInput
          placeholder="학번"
          value={studentNumber}
          onChangeText={(text) => setstudentNumber(text)}
          style={styles.textInput}
        />
        {/*전화번호 입력창*/}
        <TextInput
          placeholder="전화번호"
          value={phoneNumber}
          onChangeText={(text) => setphoneNumber(text)}
          style={styles.textInput}
        />
      </View>
      {/*버튼 Container*/}
      <View>
        {/*가입하기 버튼*/}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={disableBtn}
          style={{
            ...styles.button,
            backgroundColor: signInButtonColor,
            marginTop: 20,
          }}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
