import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import { color } from "../styles/colors";
import s from "../styles/css.js";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default TeamCheckPage = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    teamCode,
    title,
    fileColor,
    memberInfo,
    memberNames,
    assignmentName,
    assignmentId,
    dueDate,
  } = route.params;

  /*
필요한 함수가 뭘까..
1. 플러스 버튼 눌렀을 때 입력창이 열려야함 -> 입력창 state
2. 입력창이 입력이 끝났을 때 checklists에 체크박스컨테이너 하나가 추가 되어야함 (addTask)
3. 만약 체크박스 눌렀을 때 상태가 바뀌어야 함
4. update 및 delete도 구현해야 함
*/

  const [checklists, setChecklists] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isWritingNewTask, setIsWritingNewTask] = useState({});

  const pressAddBtn = (memberName) => {
    // 플러스 버튼을 누를 때 해당 팀 멤버에 대한 입력 창을 열도록 설정
    const updatedIsWritingNewTask = { ...isWritingNewTask };
    updatedIsWritingNewTask[memberName] = true;
    setIsWritingNewTask(updatedIsWritingNewTask);
  };

  const addNewTask = (memberName) => {
    // 입력이 끝났을 때 checklists에 새로운 체크박스 컨테이너를 추가
    const updatedChecklists = [...checklists];
    updatedChecklists.push({
      writer: memberName,
      index: updatedChecklists.filter(
        (checklist) => checklist.writer === memberName
      ).length,
      isWriting: false,
      isChecked: false,
      content: newTaskText,
      regDate: new Date(),
      modDate: new Date(),
    });
    setChecklists(updatedChecklists);

    // 입력이 완료되면 입력 상태 초기화
    const updatedIsWritingNewTask = { ...isWritingNewTask };
    updatedIsWritingNewTask[memberName] = false;
    setIsWritingNewTask(updatedIsWritingNewTask);

    // 입력창 비우기
    setNewTaskText("");
  };

  const handleCheckboxChange = (writer, index, newValue) => {
    // 체크박스 상태 변경
    const updatedChecklists = [...checklists];
    const checklistToUpdate = updatedChecklists.find(
      (checklist) => checklist.writer === writer && checklist.index === index
    );

    if (checklistToUpdate) {
      checklistToUpdate.isChecked = newValue;
      checklistToUpdate.modDate = new Date();
      setChecklists(updatedChecklists);
    }
  };

  console.log(JSON.stringify(checklists, null, 2));

  return (
    //헤더 부분
    <View style={s.container}>
      <View style={s.headContainer}>
        {/* Header code */}
        <View style={s.headBtn}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {/* Title */}
        <Text style={s.title}>{title}</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      {/* 과제 제목 부분 */}
      <View style={styles.assignmentTitleContainer}>
        <View style={styles.assignmentTitleInfoContainer}>
          <Text style={styles.dueDateText}>{dueDate}</Text>
          <Text style={styles.assignmentTitleText}>{assignmentName}</Text>
        </View>
      </View>
      {/* 팀원 목록 부분 */}

      <View style={styles.teamMembersNamesArrayContainer}>
        {/* Display the 팀메이트 */}

        <View
          style={{
            ...styles.teamMateContainer,
            backgroundColor: fileColor,
            borderColor: fileColor,
            marginRight: "3%",
          }}
        >
          <Text style={{ ...styles.teamMateText }}>팀메이트</Text>
        </View>

        <FlatList
          data={memberNames}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                ...styles.memberNameContainer,
                borderColor: fileColor,
              }}
              onPress={() => createChecklist(item.name)}
            >
              <Text style={styles.memberNameText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 체크리스트 구현 부분 */}
      <View style={styles.checkContainer}>
        <FlatList
          data={memberInfo}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={{
                  ...styles.memberNameContainerTwo,
                  borderColor: fileColor,
                }}
                onPress={() => pressAddBtn(item.name)}
              >
                <Text style={styles.memberNameTextTwo}>{item.name}</Text>
                <Image
                  source={require("../images/ListAddBtn.png")}
                  style={styles.taskAddBtn}
                />
              </TouchableOpacity>

              {/* 생성된 체크리스트 렌더링 */}

              {/* 체크리스트 항목 추가 입력 창 */}
              {checklists
                .filter((checklist) => checklist.writer === item.name)
                .map((checklist, index) => (
                  <View key={index} style={styles.checklistItem}>
                    <Text>{checklist.content}</Text>
                    <Checkbox
                      value={checklist.isChecked}
                      onValueChange={(newValue) =>
                        handleCheckboxChange(checklist.writer, index, newValue)
                      }
                    />
                  </View>
                ))}

              {/* 체크리스트 항목 추가 입력 창 */}
              {isWritingNewTask[item.name] ? (
                <View>
                  <TextInput
                    placeholder="할 일 추가..."
                    value={newTaskText}
                    onChangeText={(text) => setNewTaskText(text)}
                    onSubmitEditing={() => addNewTask(item.name)}
                  />
                </View>
              ) : null}
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // --------------과제 타이틀 영역-----------------
  assignmentTitleContainer: {
    width: WINDOW_WIDHT * 0.9,
    height: WINDOW_HEIGHT > 800 ? WINDOW_HEIGHT * 0.095 : WINDOW_HEIGHT * 0.12,
    //backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 9,
    marginTop: "5%",
    marginBottom: "5%",
    flexDirection: "row",
    // backgroundColor: "yellow",
  },
  assignmentTitleInfoContainer: {
    flex: 1,
    marginLeft: "7%",
    justifyContent: "space-evenly",
    paddingVertical: "5%",
    // backgroundColor: "grey",
  },
  dueDateText: {
    color: color.redpink,
    fontSize: 12,
    fontFamily: "SUIT-Regular",
  },
  assignmentTitleText: {
    color: color.activated,
    fontSize: 20,
    fontFamily: "SUIT-Regular",
  },
  // --------------------중간 팀 멤버 이름 영역----------------
  teamMembersNamesArrayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  teamMateContainer: {
    borderRadius: 200,
    borderWidth: 1,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  teamMateText: {
    padding: 9,
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: "SUIT-Medium",
    fontSize: 12,
  },
  memberNameContainer: {
    marginRight: 6,
    borderRadius: 200,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  memberNameText: {
    padding: 9,
    paddingRight: 13,
    paddingLeft: 13,
    fontFamily: "SUIT-Medium",
    fontSize: 12,
  },
  // ---------------------체크 리스트 부분--------------------
  checkContainer: {
    // backgroundColor: "grey",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    // marginTop: "6%",
  },
  memberNameContainerTwo: {
    flexDirection: "row",
    borderRadius: 200,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
    borderWidth: 1,
    marginTop: "23%",
  },
  memberNameTextTwo: {
    fontFamily: "SUIT-Medium",
    fontSize: 12,
    // backgroundColor: "yellow",
    padding: 10,
    paddingLeft: 7,
    paddingRight: 6,
    margin: 0,
  },
  taskAddBtn: {
    width: 18,
    height: 18,
    // backgroundColor: "blue",
    margin: 0,
    padding: 0,
    marginRight: 8,
  },
});
