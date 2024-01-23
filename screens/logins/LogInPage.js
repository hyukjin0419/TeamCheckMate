import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { Alert } from "react-native";
import s from "../styles/css";
import { color } from "../styles/colors";

export default function LogInPage({ route }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginSuccess = route.params || false;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          console.log("User signed in: ", user.email);
        } else {
          Alert.alert("인증되지 않은 이메일입니다");
          signOut(auth);
        }
      }
    });

    return unsubscribe;
  }, []);

  //로그인 관련 함수
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with: " + user.email);
        //Set handleLoginSuccess function to be true and bring it over to App.js
        route.params.handleLoginSuccess(true);
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          Alert.alert("잘못된 이메일이나 비밀번호 입력했습니다");
        } else {
          Alert.alert("유효한 이메일과 비밀번호를 입력해 주세요");
        }
      });
  };

  return (
    <KeyboardAvoidingView style={s.container}>
      <View style={s.headContainer}>
        <TouchableOpacity
          style={s.headBtn}
          onPress={() => navigation.navigate("InitialPage")}
        >
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={s.title}>로그인</Text>
        <View style={s.titleRightBtn}></View>
      </View>

      <View style={s.textBox}>
        <TextInput
          placeholder="이메일"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={s.textInput}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={s.textInput}
          secureTextEntry
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={handleLogin}
          style={{ ...s.button, backgroundColor: color.activated }}
        >
          <Text style={{ ...s.buttonText, color: "white" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
