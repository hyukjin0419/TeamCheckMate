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
import styles from "../styles/css";
import * as MailComposer from "expo-mail-composer";

export default function AddMembers() {
  const navigation = useNavigation();
  //array to store all emails
  const [emailInputs, setEmailInputs] = useState([""]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const newEmailInputRef = useRef(null);

  const [sendBtnColor, setSendBtnColor] = useState("#D9D9D9");
  const [selectedInput, setSelectedInput] = useState(null)

  const addEmailInput = () => {
    // Add new input into array
    setEmailInputs([...emailInputs, ""]);
    setSelectedInput(emailInputs.length);
    // if (newEmailInputRef.current) {
    //   newEmailInputRef.current.focus();
    // }
  
  };

  const removeEmailInput = (index) => {
    const tempEmailInputs = [...emailInputs];
    // prevent user from deleting the last input line
    if (tempEmailInputs.length > 1) {
      tempEmailInputs.splice(index, 1);
      setEmailInputs(tempEmailInputs);
    }
  };

  const updateEmailInput = (text, index) => {
    // newEmailInputs will contain all the currently added emails
    const newEmailInputs = [...emailInputs];
    // The new index position of the newEmailInputs array will include newly added email
    newEmailInputs[index] = text;
    // update emailInputs
    setEmailInputs(newEmailInputs);
    if (
      newEmailInputs.some(
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
    if (selectedInput === emailInputs.length - 1 && newEmailInputRef.current) {
      newEmailInputRef.current.focus();
    }

    checkAvailability();
  }, [selectedInput, emailInputs]);

  const sendEmail = () => {
    MailComposer.composeAsync({
      subject: "Testing",
      body: "Testing through multiple emails",
      recipients: emailInputs,
    });
  };

  const isFocused = (index) => {
    setSelectedInput(index);
  }

  const isBlur = () => {
    setSelectedInput(null);
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={s.head}>
        <TouchableOpacity
          style={styles.headBtn}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={s.title}>팀 메이트 초대</Text>
        <TouchableOpacity onPress={sendEmail} disabled={disableBtn}>
          <Text style={{ ...s.titleSend, color: sendBtnColor }}>전송</Text>
        </TouchableOpacity>
      </View>

      {emailInputs.map((email, index) => (
        <View key={index} style={{...s.textBox, flexDirection: "row", justifyContent: "space-between"}}>
          <TextInput
          ref={(inputRef) => (index === emailInputs.length - 1 ? (newEmailInputRef.current = inputRef) : null)}
            placeholder="이메일"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => updateEmailInput(text, index)}
            style={{...styles.textInput, width: "85%", borderBottomColor: selectedInput !== index ? "#999999" : "#050026", color: selectedInput !== index ? "#999999" : "#050026"}}
            onFocus={() => isFocused(index)}
            onBlur={isBlur}
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={() => removeEmailInput(index)}>
            <FontAwesome5 style={{marginTop: "50%", marginRight: "2%", color: selectedInput !== index ? "#999999" : "#050026"}} name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ))}
      <View>
        <TouchableOpacity style={s.addBtn} onPress={addEmailInput}>
          <Image
            style={s.addBtnSize}
            source={require("../images/ClassAddBtn.png")}
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
    marginLeft: "45%",
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
