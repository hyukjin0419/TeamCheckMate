import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import s from "../styles/css";
import { color } from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { auth } from "../../firebase";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const UserInfoUpdatePage = () => {
  const navigation = useNavigation();
  //const [btnColor, setBtnColor] = useState(color.deactivated);
  const route = useRoute();
  const {
    email: email,
    name: name,
    phoneNumber: phoneNumber,
    school: school,
    studentNumber: studentNumber,
  } = route.params;

  const [userName, setUserName] = useState(name);
  const [userEmail, setuserEmail] = useState(email);
  const [userSchool, setUserSchool] = useState(school);
  const [userStudentNumber, setUserStudentNumber] = useState(studentNumber);
  const [userPhoneNumber, setUserPhoneNumber] = useState(phoneNumber);
  return (
    <KeyboardAvoidingView style={s.container}>
      <StatusBar style={"dark"}></StatusBar>
      {/* 뒤로가기 버튼, 팀 등록 헤더와 확인버튼 컨테이너 */}
      <View style={s.headContainer}>
        <TouchableOpacity
          style={s.headBtn}
          onPress={() => {
            navigation.navigate("SettingPage");
          }}
        >
          <Image
            style={{
              width: 8,
              height: 14,
            }}
            source={require("../images/backBtn.png")}
          />
        </TouchableOpacity>
        <Text style={s.title}>계정 정보</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      {/*입력창*/}
      <View style={s.textInputContainer}>
        {/*이름 입력창*/}
        <TextInput
          placeholder="이름/닉네임"
          style={s.textInput}
          value={userName}
        />
      </View>
      <View style={s.textInputContainer}>
        {/*이름 입력창*/}
        <TextInput placeholder="이메일" style={s.textInput} value={userEmail} />
      </View>
      <View style={s.textInputContainer}>
        {/*학교 입력창*/}
        <TextInput placeholder="학교" style={s.textInput} value={userSchool} />
      </View>
      <View style={s.textInputContainer}>
        {/*학번 입력창*/}
        <TextInput
          placeholder="학번"
          style={s.textInput}
          value={userStudentNumber}
        />
      </View>
      <View style={s.textInputContainer}>
        {/*전화번호 입력창*/}
        <TextInput
          placeholder="전화번호"
          style={s.textInput}
          value={userPhoneNumber}
        />
      </View>
      {/*버튼 Container*/}
      <View>
        {/*가입하기 버튼*/}
        <TouchableOpacity style={{ ...s.button }} disabled={true}>
          <Text style={{ ...s.buttonText, color: "white" }}>확인</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserInfoUpdatePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  optionContainer: {
    height: 60,
    width: "95%",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderColor: color.deactivated,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logOutBtn: {
    width: WINDOW_WIDHT * 0.41,
    height: 55,
    backgroundColor: color.activated,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logOutText: {
    color: "white",
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  accountDeleteBtn: {
    width: WINDOW_WIDHT * 0.41,
    height: 55,
    backgroundColor: color.deletegrey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  accountDeleteText: {
    color: color.redpink,
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    fontFamily: "SUIT-Medium",
    color: color.activated,
    marginLeft: "1%",
  },
});
