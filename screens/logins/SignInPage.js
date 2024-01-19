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
  const [name, setname] = useState("");
  const [school, setschool] = useState("");
  const [studentNumber, setstudentNumber] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const appState = useRef(AppState.currentState);
  const [disableBtn, setDisableBtn] = useState(true);
  const [signInButtonColor, setSignInButtonColor] = useState("#D9D9D9");
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    const unsubscribeAuthStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          console.log("User signed in:", user.email);
        }
      }
    });
  
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
      createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        await sendEmailVerification(user)
        .then(async () => {
          alert('Verification email sent.');
          setShowSignIn(true);
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
        })
        
      })
    .catch ((error) => {
      if (error.code === "auth/email-already-in-use") {
        alert("This account already exists");
      } else {
        console.error("Error creating user:", error);
      }
    })
  };

  const emailRequired = (text) => {
    setEmail(text);
    if(!text.trim() || !password.trim()) {
      setDisableBtn(true);
      setSignInButtonColor("#D9D9D9");
    }
    else {
      setDisableBtn(false);
      setSignInButtonColor("#050026");
    }
  }

  const passwordRequired = (text) => {
    setPassword(text);
    if(!email.trim() || !text.trim()) {
      setDisableBtn(true);
      setSignInButtonColor("#D9D9D9");
    }
    else {
      setDisableBtn(false);
      setSignInButtonColor("#050026");
    }
  }

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
          placeholder=" 이메일"
          value={email}
          onChangeText={(text) => emailRequired(text)}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          
        />
        {/* if email value is empty and it is not focused */}
        {!isEmailFocused && !email.trim() && (
          // create a text value and position the red asterisk to the email TextInput
          <Text style={{ color: 'red', position: 'absolute', marginLeft: "2%", marginTop: "4%" }}>*</Text>
        )}
        
        {/*이메일 입력창*/}
        <TextInput
          placeholder=" 비밀번호"
          value={password}
          onChangeText={(text) => passwordRequired(text)}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          style={styles.textInput}
          secureTextEntry
        />
        {/* if password value is empty and it is not focused */}
        {!isPasswordFocused && !password.trim() && (
          // create a text value and position the red asterisk to the password TextInput
          <Text style={{ color: 'red', position: 'absolute', marginLeft: "2%", marginTop: "20%" }}>*</Text>
        )}

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
          style={{ ...styles.button, backgroundColor: signInButtonColor }}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

