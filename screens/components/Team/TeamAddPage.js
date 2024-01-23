//수업 등록 화면
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
import { color } from "../../styles/colors";
import { db, collection, addDoc, auth, doc } from "../../../firebase";
import Modal from "react-native-modal";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default TeamAddPage = ({ navigation }) => {
  //회원정보 가져오기
  const user = auth.currentUser;
  const email = user.email;

  //색상 선택  띄우기/숨기기 (초기값: 숨기기)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // 색상 옵션 (확정된 색상 아님) (초기값: 기본 색상)
  const [selectedColor, setSelectedColor] = useState(color.colors1[0]);
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  //확인버튼 누른 후 확정된 색상
  const [colorConfirmed, setColorConfirmed] = useState(color.colors1[0]);

  //모달에서 색상 선택 후 확인 누르면 색상 변경 -> 모달 close
  const confirmColor = () => {
    console.log(selectedColor);
    setColorConfirmed(selectedColor);
    openModal();
  };

  //팀 등록 입력란에 문자 입력시 확인버튼 활성화, 확인버튼 터치 시 파일 아이콘 색상 확정
  const [confirmBtnColor, setConfirmBtnColor] = useState(color.deactivated);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [textInputValue, setTextInputValue] = useState("");

  //팀 등록 입력란에 문자 입력시 확인버튼 활성화, 확인버튼 터치 시 파일 아이콘 색상 확정

  const onTextInputChange = (text) => {
    setTextInputValue(text);
    if (text.length > 0) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
    } else {
      setButtonDisabled(true);
      setConfirmBtnColor(color.deactivated);
    }
  };

  const addTeamItem = async () => {
    try {
      const timestamp = new Date();
      const teamDocRef = await addDoc(collection(db, "team"), {
        title: textInputValue,
        fileImage: colorConfirmed,
        timestamp: timestamp,
      });
      console.log("Document written with ID: ", teamDocRef.id);
      const userDocRef = doc(db, "user", email);
      addTeamIdtoUser(userDocRef, teamDocRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const addTeamIdtoUser = async (userDocRef, teamDocRefID) => {
    const teamListCollectionRef = collection(userDocRef, "teamList");
    await addDoc(teamListCollectionRef, {
      teamID: teamDocRefID,
    });
  };

  confirmBtnPressed = () => {
    addTeamItem();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style={"dark"}></StatusBar>
        {/* 뒤로가기 버튼, 팀 등록 헤더와 확인버튼 컨테이너 */}
        <View style={styles.headerContainer}>
          <View style={styles.backBtn}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TeamPage");
              }}
            >
              <AntDesign name="left" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerText}>팀 등록</Text>
          </View>
          <TouchableOpacity
            disabled={buttonDisabled}
            style={styles.confirmBtn}
            onPress={() => {
              confirmBtnPressed();
            }}
          >
            <Text
              style={{ ...styles.headerText, color: confirmBtnColor }}
              onPress={() => {
                // confirmBtnPressed();
                navigation.navigate("TeamMemberAddPage");
              }}
            >
              확인
            </Text>
          </TouchableOpacity>
        </View>
        {/* 팀 이름 입력란과 색상 선택 버튼*/}
        <View
          style={{
            ...styles.colorTextInputContainer,
            borderColor: colorConfirmed,
          }}
        >
          <View flex={1}>
            <TextInput
              placeholder="팀 이름"
              value={textInputValue}
              returnKeyType="done"
              onChangeText={onTextInputChange}
              style={styles.colorTextInput}
            ></TextInput>
          </View>
          {/* 색상 선택 버튼 */}
          <TouchableWithoutFeedback onPress={openModal}>
            <View style={styles.circleContainer}>
              <View
                style={{ ...styles.circle, backgroundColor: colorConfirmed }}
              ></View>
              <Image
                style={styles.triangle}
                source={require("../../images/ColorSelectionTriangleBtn.png")}
              ></Image>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.descriptionContainter}>
          <Text style={styles.description}>
            색상을 변경할 수 있습니다
          </Text>
        </View>
        {/* 색상 선택 버튼 */}
        <View>
          {/* 색상 팔레트 모달창 회색 배경 */}
          <Modal
            animationType="fade"
            visible={isModalVisible}
            transparent={true}
          >
            <View style={styles.modalBackground}>
              {/* 색상 팔레트 swipeable 모달창 */}
              <Modal
                onSwipeComplete={() => setIsModalVisible(false)}
                swipeDirection={"down"}
                animationType="slide"
                visible={isModalVisible}
                onBackdropPress={openModal}
                backdropOpacity={0.2}
                transparent={true}
              >
                <View style={styles.modalView}>
                  {/* 색상 팔레트 모달창 내 색상, 확인버튼 컨테이너 */}
                  <View style={styles.modalItemContainter}>
                    {/* 모달창 상위 부분 회색 막대기 */}
                    <View style={styles.modalVector}></View>
                    {/* 모달창 내 색상 옵션 컨테이너 */}
                    <View style={styles.colorContainer}>
                      {/* 6x6 색상 옵션 컨테이너 (rowColorsContainer 하나당 색상 6개씩 총 6줄) */}
                      <View style={styles.modalColorsContainer}>
                        {/* 팔레트 첫 번째 줄 */}
                        {color.colors1.map((color, index) => (
                          <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleColorSelect(color)}
                          >
                            <View
                              style={[
                                styles.circleSelected,
                                {
                                  borderColor:
                                    selectedColor === color ? "grey" : "white",
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.circles,
                                  { backgroundColor: color },
                                ]}
                              ></View>
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                      <View style={styles.modalColorsContainer}>
                        {color.colors2.map((color, index) => (
                          <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleColorSelect(color)}
                          >
                            <View
                              style={[
                                styles.circleSelected,
                                {
                                  borderColor:
                                    selectedColor === color ? "grey" : "white",
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.circles,
                                  { backgroundColor: color },
                                ]}
                              ></View>
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                      <View style={styles.modalColorsContainer}>
                        {color.colors3.map((color, index) => (
                          <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleColorSelect(color)}
                          >
                            <View
                              style={[
                                styles.circleSelected,
                                {
                                  borderColor:
                                    selectedColor === color ? "grey" : "white",
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.circles,
                                  { backgroundColor: color },
                                ]}
                              ></View>
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                      <View style={styles.modalColorsContainer}>
                        {color.colors4.map((color, index) => (
                          <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleColorSelect(color)}
                          >
                            <View
                              style={[
                                styles.circleSelected,
                                {
                                  borderColor:
                                    selectedColor === color ? "grey" : "white",
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.circles,
                                  { backgroundColor: color },
                                ]}
                              ></View>
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                      <View style={styles.modalColorsContainer}>
                        {color.colors5.map((color, index) => (
                          <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleColorSelect(color)}
                          >
                            <View
                              style={[
                                styles.circleSelected,
                                {
                                  borderColor:
                                    selectedColor === color ? "grey" : "white",
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.circles,
                                  { backgroundColor: color },
                                ]}
                              ></View>
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                      <View style={styles.modalColorsContainer}>
                        {color.colors6.map((color, index) => (
                          <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleColorSelect(color)}
                          >
                            <View
                              style={[
                                styles.circleSelected,
                                {
                                  borderColor:
                                    selectedColor === color ? "grey" : "white",
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.circles,
                                  { backgroundColor: color },
                                ]}
                              ></View>
                            </View>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                    </View>
                    <View style={styles.modalBtnContainer}>
                      <TouchableOpacity onPress={confirmColor}>
                        <Image
                          style={styles.modalConfirmBtn}
                          source={require("../../images/modalConfirmBtn.png")}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </Modal>
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
  colorTextInputContainer: {
    flexDirection: "row",
    //backgroundColor: "blue",
    borderBottomWidth: 2,
  },
  colorTextInput: {
    height: 50,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: "1%",
    //marginTop: "5%",
    paddingTop: "2%",
  },
  modalItemContainter: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "space-evenly",
    //backgroundColor: "red",
    marginBottom: "5%",
  },
  colorContainer: {
    flex: 1.5,
    justifyContent: "space-evenly",
    //backgroundColor: "yellow"
  },
  modalBtnContainer: {
    flex: 0.2,
    alignItems: "center",
    //backgroundColor: "red"
  },
  modalText: {
    marginTop: "3%",
    fontSize: 16,
  },
  circleSelected: {
    height: 40,
    width: 40,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalColorsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "95%",
  },
  modalConfirmBtn: {
    borderRadius: 10,
    width: WINDOW_WIDHT * 0.9,
    height: WINDOW_HEIGHT * 0.06,
  },
  modalVector: {
    height: 5,
    width: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: WINDOW_HEIGHT * 2,
    width: WINDOW_WIDHT * 2,
    marginHorizontal: "-50%",
    marginVertical: "-50%",
  },
  modalView: {
    //flex: 1,
    backgroundColor: "white",
    borderStartStartRadius: 20,
    borderStartEndRadius: 20,
    height: 550 /*WINDOW_HEIGHT * 0.6*/,
    marginTop: "auto",
    marginHorizontal: "-5.5%",
    marginVertical: "-7%",
  },
  descriptionContainter: {
    alignItems: "flex-end",
    paddingVertical: "3%",
    paddingHorizontal: "2%",
  },
  description: {
    fontWeight: "400",
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  circles: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  triangle: {
    width: 10,
    height: 10,
    marginLeft: "3%",
    marginRight: "5%",
  },
  circleContainer: {
    flex: 0.18,
    //backgroundColor: "red",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  headerContainer: {
    marginTop: "5%",
    flex: 0.13,
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
