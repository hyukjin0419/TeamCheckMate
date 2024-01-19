import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "../../styles/css";
import * as MailComposer from "expo-mail-composer";

export default function TeamMemberAddPage() {
  const navigation = useNavigation();
  //array to store all emails
  const [emailInputs, setEmailInputs] = useState([""]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);

  const [sendBtnColor, setSendBtnColor] = useState("#D9D9D9");

  const addEmailInput = () => {
    // Add new input into array
    setEmailInputs([...emailInputs, ""]);
  };

  const removeEmailInput = () => {
    const tempEmailInputs = [...emailInputs];
    // prevent user from deleting the last input line
    if (tempEmailInputs.length > 1) {
      // -1 means end of the array
      tempEmailInputs.splice(-1, 1);
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

    checkAvailability();
  }, []);

  const sendEmail = () => {
    MailComposer.composeAsync({
      subject: "Testing",
      body: "Testing through multiple emails",
      recipients: emailInputs,
    });
  };

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
        <View key={index} style={s.textBox}>
          <TextInput
            placeholder="이메일"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => updateEmailInput(text, index)}
            style={styles.textInput}
            keyboardType="email-address"
          />
        </View>
      ))}
      <View>
        <TouchableOpacity style={s.addBtn} onPress={addEmailInput}>
          <Image
            style={s.addBtnSize}
            source={require("../../images/ClassAddBtn.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity style={s.addBtn} onPress={removeEmailInput}>
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
