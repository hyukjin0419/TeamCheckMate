import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";
import styles from "../styles/css.js";
import { auth, db, doc, setDoc } from "../../firebase.js";
import { onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";

export default function UserInfoInputPage({ route }) {
  const navigation = useNavigation();
  const { userEmail, onUploadSuccess } = route.params;
  const [name, setname] = useState("");
  const [school, setschool] = useState("");
  const [studentNumber, setstudentNumber] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [logIn, setLogIn] = useState(true);


  //회원가입 관련 함수
  const uploadInformation = async () => {
        try {
            const timestamp = new Date();
            const docRef = await setDoc(doc(db, "user", userEmail), {
                email: userEmail,
                name: name,
                school: school,
                studentNumber: studentNumber,
                phoneNumber: phoneNumber,
                hasSignedUp: logIn,
                timestamp: timestamp,
            });
            onUploadSuccess(true);
        } catch (e) {
            console.error("Error adding document: ", e);
            setLogIn(false);
        }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/*head 부분*/}
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>가입하기</Text>
      </View>

      {/*입력창*/}
      <View style={styles.textBox}>

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
          onPress={uploadInformation}
          style={{ ...styles.button, backgroundColor: "#050026" }}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

