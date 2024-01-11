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

export default function UserInformationInputPage() {
  const navigation = useNavigation();
  const [name, setname] = useState("");
  const [school, setschool] = useState("");
  const [studentNumber, setstudentNumber] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");

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
