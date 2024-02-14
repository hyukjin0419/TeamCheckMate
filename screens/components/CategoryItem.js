import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  auth,
  collection,
  db,
  doc,
  setDoc,
  updateDoc,
  listCollections,
} from "../../firebase";
import Checkbox from "expo-checkbox";
import * as Haptics from "expo-haptics";
import s from "../styles/css.js";
import { getDocs, onSnapshot, query } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const CategoryItem = (props) => {
  const [categoryList, setCategoryList] = useState(props.categoryList);
  const [checklists, setChecklists] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isWritingNewTask, setIsWritingNewTask] = useState({});
  const TextInputRef = useRef(null);
  const user = auth.currentUser;

  const pressAddBtn = (id) => {
    // 다른 텍스트 입력 창이 열려있는지 확인하고 있다면 닫기
    Object.keys(isWritingNewTask).forEach((name) => {
      if (name !== id && isWritingNewTask[id]) {
        closeTextInput(name);
      }
    });

    // 플러스 버튼을 누를 때 해당 팀 멤버에 대한 입력 창을 열도록 설정
    setIsWritingNewTask((prevIsWritingNewTask) => ({
      ...prevIsWritingNewTask,
      [id]: true,
    }));
  };

  const closeTextInput = (code) => {
    setIsWritingNewTask((prevIsWritingNewTask) => ({
      ...prevIsWritingNewTask,
      [code]: false,
    }));
  };

  const addNewTask = async (code) => {
    if (newTaskText.trim() !== "") {
      const updatedChecklists = [...checklists];
      try {
        const userRef = doc(db, "user", user.email);
        const userCheckListRef = collection(userRef, "personalCheckList");
        const userCategoryRef = doc(userCheckListRef, code);
        const userTaskRef = collection(userCategoryRef, "tasks");
        const userInputTaskRef = doc(userTaskRef);

        const userInputTaskRefId = userInputTaskRef.id;

        updatedChecklists.push({
          writer: code,
          index: updatedChecklists.filter(
            (checklist) => checklist.writer === code
          ).length,
          taskCode: userInputTaskRefId,
          isWriting: false,
          isChecked: false,
          content: newTaskText,
          regDate: new Date(),
          modDate: new Date(),
        });

        await setDoc(userInputTaskRef, {
          isChecked: false,
          task: newTaskText,
        });
      } catch (e) {
        console.log(e.message);
      }
      setChecklists(updatedChecklists);

      // 입력이 완료되면 입력 상태 초기화
      const updatedIsWritingNewTask = { ...isWritingNewTask };
      updatedIsWritingNewTask[code] = false;
      setIsWritingNewTask(updatedIsWritingNewTask);

      // 입력창 비우기
      setNewTaskText("");
    } else {
      setIsWritingNewTask((prev) => ({ ...prev, [code]: false }));
    }
  };

  const handleCheckboxChange = async (writer, index, newValue) => {
    // 체크박스 상태 변경
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedChecklists = [...checklists];
    const checklistToUpdate = updatedChecklists.find(
      (checklist) => checklist.writer === writer && checklist.index === index
    );

    if (checklistToUpdate) {
      checklistToUpdate.isChecked = newValue;
      checklistToUpdate.modDate = new Date();
      setChecklists(updatedChecklists);
      try {
        const userRef = doc(db, "user", user.email);
        const userCheckListRef = collection(userRef, "personalCheckList");
        const userCategoryRef = doc(userCheckListRef, checklistToUpdate.writer);
        const userTaskRef = collection(userCategoryRef, "tasks");
        const userInputTaskRef = doc(userTaskRef, checklistToUpdate.taskCode);

        await updateDoc(userInputTaskRef, {
          isChecked: newValue,
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const fecthTaskData = async () => {
    // Access the docs and collections
    const userDocRef = doc(db, "user", user.email);
    const userCheckListRef = collection(userDocRef, "personalCheckList");
    const querySnapshot1 = await getDocs(query(userCheckListRef));
    // Create a temporary list to store tasks
    let tempChecklists = [];
    // If collection personalCheckList is not empty
    if (!querySnapshot1.empty) {
      // Iterate each document inside the collection
      querySnapshot1.forEach(async (child1) => {
        // Get the document id
        const userCategoryRef = doc(userCheckListRef, child1.id);
        // Access the tasks collection inside the document
        const userTaskRef = collection(userCategoryRef, "tasks");
        const querySnapshot2 = await getDocs(userTaskRef);
        // if tasks is not empty
        if (!querySnapshot2.empty) {
          querySnapshot2.forEach((child2) => {
            // Add all the tasks that were read into tempCheckLists
            tempChecklists = [...tempChecklists];
            // Push new task read into tempCheckLists
            tempChecklists.push({
              writer: child1.id,
              index: tempChecklists.filter(
                (checklist) => checklist.writer === child1.id
              ).length,
              taskCode: child2.id,
              isWriting: false,
              isChecked: child2.data().isChecked,
              content: child2.data().task,
              regDate: new Date(),
              modDate: new Date(),
            });
            setChecklists(tempChecklists);
          });
        }
      });
    }
  };

  useEffect(() => {
    setCategoryList(props.categoryList);
    // Load all tasks inside categories that are saved in firebase
    fecthTaskData();
  }, [props.categoryList]);

  return (
    <KeyboardAvoidingView
      style={{ ...styles.container }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 체크리스트 구현 부분 */}
      <View style={styles.checkContainer}>
        <FlatList
          style={{ flexGrow: 0 }}
          data={categoryList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={{
                  ...styles.categoryContainer,
                  backgroundColor: item.color,
                }}
                onPress={() => pressAddBtn(item.id)}
              >
                <Text style={styles.categoryText}>{item.category}</Text>
                <Image
                  source={require("../images/categoryAddBtn.png")}
                  style={styles.taskAddBtn}
                />
              </TouchableOpacity>

              {/* 생성된 체크리스트 렌더링 */}

              {/* 체크리스트 항목 추가 입력 창 */}
              {checklists
                .filter((checklist) => checklist.writer === item.id)
                .map((checklist, index) => (
                  <View key={index} style={styles.checkBoxContainer}>
                    <Checkbox
                      value={checklist.isChecked}
                      style={styles.checkbox}
                      color={item.color}
                      onValueChange={(newValue) =>
                        handleCheckboxChange(checklist.writer, index, newValue)
                      }
                    />
                    <Text style={styles.checkBoxContent}>
                      {checklist.content}
                    </Text>
                    <TouchableOpacity>
                      <Image
                        source={require("../images/icons/three_dots.png")}
                        style={styles.threeDots}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

              {/* 입력창 생성 */}
              {isWritingNewTask[item.id] ? (
                <View style={styles.checkBoxContainer}>
                  <Checkbox style={styles.checkbox} color={item.color} />
                  <TextInput
                    ref={TextInputRef} // ref 설정
                    placeholder="할 일 추가..."
                    style={styles.checkBoxContent}
                    value={newTaskText}
                    autoFocus={true}
                    returnKeyType="done"
                    onChangeText={(text) => setNewTaskText(text)}
                    onSubmitEditing={() => addNewTask(item.id)}
                    //onBlur={() => addNewTask(item.id)}
                  />
                  <TouchableOpacity>
                    <Image
                      source={require("../images/icons/three_dots.png")}
                      style={styles.threeDots}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "60%",
    backgroundColor: "white",
    marginLeft: "4%",
  },
  addClassBtnText: {
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    paddingHorizontal: 1,
    marginRight: 3,
  },
  checkText: {
    marginLeft: "3%",
    fontFamily: "SUIT-Regular",
    borderBottomWidth: 1,
    width: "60%",
  },
  optionSelect: {
    marginRight: "6%",
    fontSize: 18,
    position: "absolute",
    right: 0,
    top: -7,
  },
  checkContainer: {
    flex: 1,
    marginTop: "3%",
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: "orange",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  categoryContainer: {
    flex: 1,
    // backgroundColor: "green",
    flexDirection: "row",
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  categoryText: {
    fontFamily: "SUIT-Medium",
    fontSize: 12,
    // backgroundColor: "yellow",
    padding: 10,
    paddingLeft: 7,
    paddingRight: 6,
  },
  taskAddBtn: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  // ----------------------------체크 하나-----------------------
  checkBoxContainer: {
    flex: 0.9,
    width: "90%",
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "violet",
    marginBottom: "7%",
    alignSelf: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  checkBoxContent: {
    flex: 1,
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    marginLeft: 14,
    // backgroundColor: "green",
  },
  checklistTextInput: {
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    marginLeft: 14,
  },
  threeDots: {
    width: 17.5,
    height: 4,
  },
});

export default CategoryItem;
