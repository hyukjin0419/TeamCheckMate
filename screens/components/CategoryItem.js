import { View, Text , StyleSheet, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { auth, collection, db, doc, setDoc, updateDoc } from '../../firebase';
import Checkbox from 'expo-checkbox';
import * as Haptics from "expo-haptics";
import s from "../styles/css.js"
import { getDocs, onSnapshot, query } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const CategoryItem = (props) => {
    const [categoryList, setCategoryList] = useState(props.categoryList)
    const [checklists, setChecklists] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [isWritingNewTask, setIsWritingNewTask] = useState({});
    const [categoryName, setCategoryName] = useState([""]);
    const TextInputRef = useRef(null);
    const user = auth.currentUser;

    const pressAddBtn = (category) => {
      // 다른 텍스트 입력 창이 열려있는지 확인하고 있다면 닫기
      Object.keys(isWritingNewTask).forEach((name) => {
        if (name !== category && isWritingNewTask[category]) {
          closeTextInput(name);
        }
      });
  
      // 플러스 버튼을 누를 때 해당 팀 멤버에 대한 입력 창을 열도록 설정
      setIsWritingNewTask((prevIsWritingNewTask) => ({
        ...prevIsWritingNewTask,
        [category]: true,
      }));
    };
  
    const closeTextInput = (category) => {
      setIsWritingNewTask((prevIsWritingNewTask) => ({
        ...prevIsWritingNewTask,
        [category]: false,
      }));
    };
  
    const addNewTask = async(category) => {
      if (newTaskText.trim() !== "") {
        const updatedChecklists = [...checklists];
        updatedChecklists.push({
          writer: category,
          index: updatedChecklists.filter(
            (checklist) => checklist.writer === category
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
        updatedIsWritingNewTask[category] = false;
        setIsWritingNewTask(updatedIsWritingNewTask);
        try {
          const userRef = doc(db, "user", user.email);
          const userCheckListRef = collection(userRef, "personalCheckList");
          const userCategoryRef = doc(userCheckListRef, category);
          const userTaskRef = collection(userCategoryRef, newTaskText);
          const newIsCheckRef = doc(userTaskRef, "isChecked");

          await setDoc(newIsCheckRef, {
            isChecked: false,
            task: newTaskText,
          })
        } catch (e) {
          console.log(e.message);
        }
  
        // 입력창 비우기
        setNewTaskText("");
      } else {
        setIsWritingNewTask((prev) => ({ ...prev, [category]: false }));
      }
    };
  
    const handleCheckboxChange = async(writer, index, newValue) => {
      // 체크박스 상태 변경
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
          const userTaskRef = collection(userCategoryRef, checklistToUpdate.content);
          const newIsCheckRef = doc(userTaskRef, "isChecked");

          await updateDoc(newIsCheckRef, {
            isChecked: newValue,
          })
        } catch (e) {
          console.log(e.message);
        }
      }
    };
    
    const fecthTaskData = async () => {
      const userDocRef = doc(db, "user", user.email);
      const userCheckListRef = collection(userDocRef, "personalCheckList");
      const querySnapshot1 = await getDocs(query(userCheckListRef));
      if(!querySnapshot1.empty) {
        const list = [];
        querySnapshot1.forEach(async(doc) => {
          list.push({
            id: doc.id,
            category: doc.data().category,
          })
          // setCategoryName((prevCategoryName) => [
          //   ...prevCategoryName,
          //   doc.data().category,
          // ]);
        });
        setCategoryName(list);
        console.log("rkjgaerkuakuefjajkfb", categoryName);
        // const userCategoryRef = doc(userCheckListRef, categoryName);
      }
    }

    useEffect(() => {
      setCategoryList(props.categoryList);
      fecthTaskData();
    }, [props.categoryList]);

  return (
    <KeyboardAvoidingView 
      style={{...styles.container}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 체크리스트 구현 부분 */}
      <View style={styles.checkContainer}>
        <FlatList
          style = {{ flexGrow: 0 }}
          data={categoryList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={{
                  ...styles.categoryContainer,
                  backgroundColor: item.color,
                }}
                onPress={() => pressAddBtn(item.category)}
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
                .filter((checklist) => checklist.writer === item.category)
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
              {isWritingNewTask[item.category] ? (
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
                    onSubmitEditing={() => addNewTask(item.category)}
                    onBlur={() => addNewTask(item.category)}
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
  )
}

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
    width: "60%"
  },
  optionSelect: {
    marginRight: "6%",
    fontSize: 18,
    position: "absolute",
    right: 0,
    top: -7
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

export default CategoryItem