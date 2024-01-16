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
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase.js";
import { Alert } from "react-native";
import styles from "../styles/css.js";
import { db, doc, setDoc } from "../../firebase.js";

export default function SignInPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

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
          navigation.replace("UserInformationInputPage");
        }
      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  useEffect(() => {
    const unsubscribeAuthStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          console.log("User signed in:", user.email);
          navigation.replace("UserInformationInputPage");
        }
      }
    });

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      unsubscribeAuthStateChanged();
      // Check if AppState.removeEventListener is defined before calling
      if (AppState.removeEventListener) {
        AppState.removeEventListener("change", handleAppStateChange);
      }
    };
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in: ", user.email);
        navigation.replace("UserInformationInputPage", {
          userEmail: user.email,
        });
      }
    });

    return unsubscribe;
  }, []);

  //회원가입 관련 함수
  const handleSignUp = () => {
    try {
      createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        await sendEmailVerification(user)
        .then(async () => {
          alert('Verification email sent.');
          console.log("Registered with: " + user.email);
          try {
            const docRef = await setDoc(doc(db, "user", email), {
              email: email,
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        })
        
      })
    }
    catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This account already exists");
      } else {
        console.error("Error creating user:", error);
      }
    }
  };

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
      </View>
      {/*버튼 Container*/}
      <View>
        {/*가입하기 버튼*/}
        <TouchableOpacity
          onPress={handleSignUp}
          style={{ ...styles.button, backgroundColor: "#050026" }}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>가입하기</Text>
        </TouchableOpacity>
        {/*건너뛰기 버튼
        나중에 삭제해야함 -> test를 위해 추가해놓음
        -> 백엔드쪽에서 어떻게 할건지 고민해봐야 함*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("UserInformationInputPage")}
          style={styles.subButton}
        >
          <Text style={styles.subButtonText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
