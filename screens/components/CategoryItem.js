import { View, Text , StyleSheet, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { auth, collection, db, doc, setDoc, updateDoc, listCollections } from '../../firebase';
import Checkbox from 'expo-checkbox';
import * as Haptics from "expo-haptics";
import s from "../styles/css.js"
import moment from 'moment';
import { getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const CategoryItem = (props) => {
    const [categoryList, setCategoryList] = useState(props.categoryList)
    const [checklists, setChecklists] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [isWritingNewTask, setIsWritingNewTask] = useState({});
    const [checkColor, setCheckColor] = useState([]);
    const [checkMap, setCheckMap] = useState(undefined)
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
  
    const addNewTask = async(code) => {
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
            regDate: new Date(),
            modDate: new Date(),
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
          const userTaskRef = collection(userCategoryRef, "tasks");
          const userInputTaskRef = doc(userTaskRef, checklistToUpdate.taskCode)
          
          if(newValue) {
            await updateDoc(userInputTaskRef, {
              isChecked: newValue,
              modDate: new Date(),
            });
          }
          else {
            await updateDoc(userInputTaskRef, {
              isChecked: newValue,
            });
          }
          showCheck(updatedChecklists, writer, index);
        } catch (e) {
          console.log(e.message);
        }
      }
    };

    //Show the check mark if all task is checked
    const showCheck = async(list, writer, index) => {
      const updateList = [...list];
      // Get the specific category
      const checklistToUpdate = updateList.find(
        (checklist) => checklist.writer === writer && checklist.index === index
      );
      try {
        const userRef = doc(db, "user", user.email);
        const userCheckListRef = collection(userRef, "personalCheckList");
        const userCategoryRef = doc(userCheckListRef, checklistToUpdate.writer);
        const userTaskRef = collection(userCategoryRef, "tasks");

        const checkColorList = [...checkColor];
        const querySnapshot = await getDocs(userTaskRef);
        let allChecked = true;
        let compareDate = null;
          if(!querySnapshot.empty) {
            for (const child of querySnapshot.docs) {
              const childModDate = child.data().modDate.toDate();

              if (!compareDate || childModDate > compareDate) {
                compareDate = childModDate;
              }
              if (child.data().isChecked === false) {
                allChecked = false;
                await updateDoc(userCategoryRef, {
                  allCheckedDate: null,
                });
                break; // Skip to the next iteration if isChecked is false
              } else {
                allChecked = true;
                await updateDoc(userCategoryRef, {
                  allCheckedDate: new Date(),
                });
              }
            }
          }
          // if all the checkboxes are checked
          if (allChecked) {
            // get the color of the category
            const colorData = await getDoc(userCategoryRef);
            if (colorData.exists()) {
              // add the color and set id to id of category
              const colorAdd = {
                id: checklistToUpdate.writer,
                checkColor: colorData.data().color,
                regDate: compareDate,
              };
          
               // Check if id is already in the array
              const index = checkColorList.findIndex(item => item.id === colorAdd.id);

              if (index !== -1) {
                // Update existing entry
                if (checkColorList[index].checkColor !== colorAdd.checkColor) {
                  // Update existing entry with the new color
                  const updatedCheckColorList = [...checkColorList];
                  updatedCheckColorList[index] = colorAdd;
                  setCheckColor(updatedCheckColorList);
                }
              } else {
                // Add a new entry
                const updatedCheckColorList = [...checkColorList, colorAdd];
                setCheckColor(updatedCheckColorList);
              }
            }
          }
          // if not all checkboxes are checked, remove the category info from array
          else {
            if (checkColorList.some(item => item.id === checklistToUpdate.writer)) {
              const updatedCheckColorList = checkColorList.filter(item => item.id !== checklistToUpdate.writer);
              setCheckColor(updatedCheckColorList);
            }
          } 

          let dateMap = new Map()
          // add all the dates of tasks being checked into new map
          for (let i = 0; i < checkColor.length; i++) {
              let checkedDate = moment(checkColor[i].regDate).format('YYYY-MM-DD').toString()
              if (dateMap.has(checkedDate)) {
                  let checkArr = dateMap.get(checkedDate)
                  checkArr.push(checkColor[i])
                  dateMap.set(checkedDate, checkArr) 
              } else {
                  dateMap.set(checkedDate, [checkColor[i]])
              }
          }     
          setCheckMap(dateMap);  
      } catch (e) {
        console.log(e.message);
      }
    };
    
    const fecthTaskData = async () => {
      // Access the docs and collections
      const userDocRef = doc(db, "user", user.email);
      const userCheckListRef = collection(userDocRef, "personalCheckList");
      const querySnapshot1 = await getDocs(query(userCheckListRef));
      // Create a temporary list to store tasks
      let tempChecklists = []
      // If collection personalCheckList is not empty
      if(!querySnapshot1.empty) {
        // Iterate each document inside the collection
        await Promise.all(querySnapshot1.docs.map(async (child1) => {
          const userCategoryRef = doc(userCheckListRef, child1.id);
          const userTaskRef = collection(userCategoryRef, "tasks");
          const querySnapshot2 = await getDocs(query(userTaskRef, orderBy("regDate", "asc")));
  
          // if tasks is not empty
          if(!querySnapshot2.empty) {
            querySnapshot2.forEach((child2) => {
              // Add all the tasks that were read into tempCheckLists
              tempChecklists = [...tempChecklists]
              // Push new task read into tempCheckLists
              const currentIndex = tempChecklists.filter(
                (checklist) => checklist.writer === child1.id
              ).length;
              tempChecklists.push({
                writer: child1.id,
                index: currentIndex,
                taskCode: child2.id,
                isWriting: false,
                isChecked: child2.data().isChecked,
                content: child2.data().task,
                regDate: new Date(),
                modDate: new Date(),
              });
              showCheck(tempChecklists, child1.id, currentIndex);
              setChecklists(tempChecklists);
            })
          }
        }));
      }
    }

    useEffect(() => {
      setCategoryList(props.categoryList);
      // Load all tasks inside categories that are saved in firebase
      fecthTaskData();
      props.onCheckColorChange(checkColor);
      props.checkEvent(checkMap);
    }, [props.categoryList, checkColor]);

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