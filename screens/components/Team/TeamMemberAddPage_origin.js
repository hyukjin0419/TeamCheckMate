import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import styles from "../../styles/css";
import * as MailComposer from "expo-mail-composer";

export default function AddMembers() {
  const navigation = useNavigation();
  //array to store all emails
  const [emailInputArray, setEmailInputArray] = useState([""]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const newEmailInputRef = useRef(null);

  const [sendBtnColor, setSendBtnColor] = useState("#D9D9D9");
  const [selectedInput, setSelectedInput] = useState(null);

  //이메일 추가하기
  const addEmailInput = () => {
    // Add new input into array
    setEmailInputArray([...emailInputArray, ""]);
    setSelectedInput(emailInputArray.length);
    // if (newEmailInputRef.current) {
    //   newEmailInputRef.current.focus();
    // }
  };

  //이메일 삭제하기
  const removeEmailInput = (index) => {
    const tempEmailInputsArray = [...emailInputArray];
    // prevent user from deleting the last input line
    if (tempEmailInputsArray.length > 1) {
      tempEmailInputsArray.splice(index, 1);
      setEmailInputArray(tempEmailInputsArray);
    }
  };

  //이메일 업데이트 하기
  const updateEmailInput = (text, index) => {
    // newEmailInputsArray will contain all the currently added emails
    const newEmailInputsArray = [...emailInputArray];
    // The new index position of the newEmailInputsArray array will include newly added email
    newEmailInputsArray[index] = text;
    // update emailInputArray
    setEmailInputArray(newEmailInputsArray);
    if (
      //배열의 각 요소에 대해 제공된 함수를 실행하고, 그 함수가 하나 이상의 요소에서 'true'를 반환하면 some도 true를 반환한다.
      newEmailInputsArray.some(
        //주어진 이메일이 문자열 && 공백을 제외한 길이가 0보다 큰지 확인
        (email) => typeof email === "string" && email.trim() !== ""
      )
    ) {
      setDisableBtn(false);
      setSendBtnColor("#050026");
    } else {
      setDisableBtn(true);
      setSendBtnColor("#D9D9D9");
    }
  };

  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setIsAvailable(isMailAvailable);
    }
    if (
      selectedInput === emailInputArray.length - 1 &&
      newEmailInputRef.current
    ) {
      newEmailInputRef.current.focus();
    }
    checkAvailability();
  }, [selectedInput, emailInputArray]);

  const sendEmail = () => {
    MailComposer.composeAsync({
      subject: "Testing",
      body: "Testing through multiple emails",
      recipients: emailInputArray,
    });
  };

  const isFocused = (index) => {
    setSelectedInput(index);
  };

  const isBlur = () => {
    setSelectedInput(null);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* 헤더부분 */}
      <View style={s.head}>
        <TouchableOpacity
          style={styles.headBtn}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={s.title}>팀 메이트 초대</Text>
        <TouchableOpacity onPress={sendEmail} disabled={disableBtn}>
          <Text style={{ ...s.titleSend, color: sendBtnColor }}>보내기</Text>
        </TouchableOpacity>
      </View>
      {/* 주어진 함수를 실행하고, 그 결과로 새로운 배열을 생성하는 javascript의 배열 메소드 map을 사용한 구문 */}
      {emailInputArray.map((email, index) => (
        //입력창 전체 컨테이너
        <View
          key={index}
          style={{
            ...s.textBox,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            ref={(inputRef) =>
              index === emailInputArray.length - 1
                ? (newEmailInputRef.current = inputRef)
                : null
            }
            placeholder="이메일"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => updateEmailInput(text, index)}
            style={{
              ...styles.textInput,
              width: "85%",
              borderBottomColor:
                selectedInput !== index ? "#999999" : "#050026",
              color: selectedInput !== index ? "#999999" : "#050026",
            }}
            onFocus={() => isFocused(index)}
            onBlur={isBlur}
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={() => removeEmailInput(index)}>
            <FontAwesome5
              style={{
                marginTop: "50%",
                marginRight: "2%",
                color: selectedInput !== index ? "#999999" : "#050026",
              }}
              name="trash"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ))}

      <View>
        <TouchableOpacity style={s.addBtn} onPress={addEmailInput}>
          <Image
            style={s.addBtnSize}
            source={require("../../images/ClassAddBtn.png")}
          ></Image>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "32%",
  },
  titleSend: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "40%",
  },
  addBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  addBtnSize: {
    height: 40,
    width: 40,
  },
  textBox: {
    marginTop: "3%",
  },
  head: {
    marginTop: "18%",
    flexDirection: "row",
    marginBottom: "2%",
  },
});
