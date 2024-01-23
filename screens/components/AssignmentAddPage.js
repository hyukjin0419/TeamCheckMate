//과제 추가 화면
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { color } from "../styles/colors";
import { db, collection, addDoc, auth, doc, setDoc } from "../../firebase";
import { useNavigation } from "@react-navigation/core";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default AssignmentAddPage = ({ route }) => {
  const navigation = useNavigation();

  {
    /* AssignmentPage에서 팀 이름, 파일 아이콘 색상, 팀 id 불러오기 */
  }
  const { title, fileColor, teamid } = route.params;
  console.log("teamid before navigation:", teamid);
  {
    /* 과제추가 확인버튼 상태 변경 코드 */
  }
  const [confirmBtnColor, setConfirmBtnColor] = useState(color.deactivated); //확인버튼 색상 (초기값: 비활성화)
  const [buttonDisabled, setButtonDisabled] = useState(true); //확인버튼 상태 (초기값: 비활성화)

  {
    /*과제 이름, Duedate*/
  }
  const [assignmentName, setAssignmentName] = useState("");
  const [dueDate, setDueDate] = useState("");

  {
    /* 과제이름, Duedate가 valid input인지 판별 */
  }
  const [assignmentValid, setAssignmentValid] = useState(false);
  const [dueDateValid, setDueDateValid] = useState(false);

  {
    /* 과제이름, Duedate가 둘 다 valid input인 경우 확인버튼 활성화 */
  }
  //과제이름
  const AssignmentNameInputChange = (text) => {
    setAssignmentName(text);
    if (text.length > 0) {
      setAssignmentValid(true);
    } else {
      setAssignmentValid(false);
    }
    if (assignmentValid && dueDateValid) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
    }
  };
  //DueDate
  const dueDateInputChange = (text) => {
    setDueDate(text);
    if (text.length > 0) {
      setDueDateValid(true);
    } else {
      setDueDateValid(false);
    }
    if (assignmentValid && dueDateValid) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
    }
  };

  const addAssignment = async () => {
    try {
      const teamCollectionRef = collection(db, "team", teamid, "과제 list");
      const assignmentDocRef = await addDoc(teamCollectionRef, {
        assignmentName: assignmentName,
        dueDate: dueDate,
      });

      console.log(
        "과제가 성공적으로 추가되었습니다. 문서 ID:",
        assignmentDocRef.id,
        "과제이름:",
        assignmentName
      );

      // assignmentDocRef.id 값이 정상적으로 존재할 때에만 navigation.navigate 호출
      if (assignmentDocRef.id) {
        navigation.navigate("AssignmentPage", {
          title: title,
          fileColor: fileColor,
          teamid: teamid,
          //assignmentId: assignmentDocRef.id,
        });
      } else {
        console.error("assignmentDocRef.id 값이 유효하지 않습니다.");
      }
    } catch (error) {
      console.error("과제 추가 중 오류 발생:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style={"dark"}></StatusBar>
        {/* 헤더 (뒤로가기 버튼, 과제추가 헤더, 확인버튼) */}
        <View style={styles.headerContainer}>
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              navigation.navigate("AssignmentPage", {
                title: title,
                fileColor: fileColor,
                teamid: teamid,
              });
            }}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerText}>과제 추가</Text>
          </View>
          {/* 확인 버튼 */}
          <TouchableOpacity
            style={styles.confirmBtn}
            disabled={buttonDisabled}
            onPress={() => {
              addAssignment();
            }}
          >
            <Text style={{ ...styles.headerText, color: confirmBtnColor }}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
        {/* 과제이름 입력란 */}
        <View style={styles.inputContainer}>
          <View style={styles.TextInputContainer}>
            <TextInput
              placeholder="과제 이름"
              onChangeText={AssignmentNameInputChange}
              value={assignmentName}
              style={styles.TextInput}
            ></TextInput>
          </View>
          {/* DueDate TimePicker */}
          <View style={styles.TextInputContainer}>
            <TextInput
              placeholder="Due Date"
              onChangeText={dueDateInputChange}
              value={dueDate}
              style={styles.TextInput}
            ></TextInput>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
    //backgroundColor: "skyblue",
  },
  TextInput: {
    height: 50,
    fontSize: 15,
    fontWeight: "500",
    marginLeft: "1%",
    marginTop: "5%",
    paddingTop: "2%",
  },
  TextInputContainer: {
    borderBottomWidth: 1,
  },
  headerContainer: {
    marginTop: "5%",
    flex: 0.15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    //backgroundColor: "red",
  },
  backBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginLeft: "3%",
  },
  confirmBtn: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: "3%",
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
  },
});
