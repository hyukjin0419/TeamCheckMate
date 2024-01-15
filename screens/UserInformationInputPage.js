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
import styles from "./css.js";
import { db, doc, setDoc } from "../firebase.js";

export default function UserInformationInputPage({ route }) {
  const navigation = useNavigation();
  const email = route.params?.userEmail;
  const [name, setname] = useState("");
  const [school, setschool] = useState("");
  const [studentNumber, setstudentNumber] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");

  const addUser = async () => {
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
      console.error("Error adding user's Info: ", e);
    }

    navigation.navigate("TeamPage");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/*head 부분*/}
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.navigate("InitialPage")}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={{ ...styles.title, marginLeft: "26%" }}>
          가입 정보 입력하기
        </Text>
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
          onPress={() => addUser()}
          style={{ ...styles.button, backgroundColor: "#050026" }}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>가입하기</Text>
        </TouchableOpacity>
        {/*건너뛰기 버튼*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("TeamPage")}
          style={styles.subButton}
        >
          <Text style={styles.subButtonText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
