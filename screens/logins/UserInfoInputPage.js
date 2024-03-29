import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";
import s from "../styles/css.js";
import { auth, db, doc, setDoc } from "../../firebase.js";
import {
  deleteUser,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { color } from "../styles/colors.js";

export default function UserInfoInputPage({ route }) {
  const navigation = useNavigation();
  const { userEmail, onUploadSuccess, moveBack } = route.params;
  const [name, setname] = useState("");
  const [school, setschool] = useState("");
  const [studentNumber, setstudentNumber] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [logIn, setLogIn] = useState(true);
  const [disableBtn, setDisableBtn] = useState(true);
  const [btnColor, setBtnColor] = useState(color.deactivated);

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
      //Set this value to true and pass it to App.js
      onUploadSuccess(true);
    } catch (e) {
      console.error("문서 추가 중 오류 발생: ", e);
      setLogIn(false);
    }
  };

  //If user presses skip button, set all non mandatory values to be blank
  const skipInput = async () => {
    if (disableBtn) {
      Alert.alert("이름/닉네임 입력해주세요");
    } else {
      try {
        const timestamp = new Date();
        const docRef = await setDoc(doc(db, "user", userEmail), {
          email: userEmail,
          name: "",
          school: "",
          studentNumber: "",
          phoneNumber: "",
          hasSignedUp: logIn,
          timestamp: timestamp,
        });
        onUploadSuccess(true);
      } catch (e) {
        console.error("문서 추가 중 오류 발생: ", e);
        setLogIn(false);
      }
    }
  };

  const previousPage = () => {
    const user = auth.currentUser;
    deleteUser(user);
    signOut(auth);
  };

  const [maxLength, setMaxLength] = useState(15); // 영어일 때의 maxLength
  const isNameEmpty = (text) => {
    setname(text);
    if (!text.trim()) {
      setDisableBtn(true);
      setBtnColor(color.deactivated);
    } else {
      setDisableBtn(false);
      setBtnColor(color.activated);
    }
    const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
    setMaxLength(isKorean ? 10 : 15);
  };

  return (
    <KeyboardAvoidingView style={s.container}>
      {/*head 부분*/}
      <View style={s.headContainer}>
        <TouchableOpacity style={s.headBtn} onPress={previousPage}>
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
        {/*이름 입력창*/}
        <TextInput
          placeholder="이름/닉네임"
          value={name}
          onChangeText={(text) => isNameEmpty(text)}
          style={s.textInput}
        />
        {!name.trim() && (
          <Text style={{ color: "red", position: "absolute", marginTop: "8%" }}>
            *
          </Text>
        )}
        {!name.trim() && (
          <Text
            style={{
              color: "red",
              position: "absolute",
              marginLeft: "40%",
              marginTop: "21%",
            }}
          >
            이름/닉네임을 반드시 입력해주세요!
          </Text>
        )}
      </View>
      <View style={s.textInputContainer}>
        {/*학교 입력창*/}
        <TextInput
          placeholder="학교"
          value={school}
          onChangeText={(text) => setschool(text)}
          style={s.textInput}
        />
      </View>
      <View style={s.textInputContainer}>
        {/*학번 입력창*/}
        <TextInput
          placeholder="학번"
          value={studentNumber}
          onChangeText={(text) => setstudentNumber(text)}
          style={s.textInput}
        />
      </View>
      <View style={s.textInputContainer}>
        {/*전화번호 입력창*/}
        <TextInput
          placeholder="전화번호"
          value={phoneNumber}
          onChangeText={(text) => setphoneNumber(text)}
          style={s.textInput}
        />
      </View>
      {/*버튼 Container*/}
      <View>
        {/*가입하기 버튼*/}
        <TouchableOpacity
          onPress={uploadInformation}
          style={{ ...s.button, backgroundColor: btnColor }}
          disabled={disableBtn}
        >
          <Text style={{ ...s.buttonText, color: "white" }}>확인</Text>
        </TouchableOpacity>
        {/*가입하기 버튼*/}
        <TouchableOpacity onPress={skipInput} style={s.subButton}>
          <Text style={s.subButtonText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
