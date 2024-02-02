//팀 수정 화면
import React, { useState } from "react";
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
import { db, doc, updateDoc } from "../../../firebase";
import Modal from "react-native-modal";
import s from "../../styles/css";
import { useNavigation } from "@react-navigation/core";

//반응형 디자인을 위한 스크린의 높이, 넓이 구하는 코드
const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default TeamUpdatePage = ({ route }) => {
  const navigation = useNavigation();
  //TeamItem에서 불러오는 정보
  const { title, fileColor, id } = route.params;

  //기존 색상 저장
  const [selectedColor, setSelectedColor] = useState(fileColor);

  // 팔레트서 색상 수정 선택 (확정색상 x)
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  {
    /* 확인버튼 누른 후 확정된 색상 */
  }
  const [colorConfirmed, setColorConfirmed] = useState(fileColor);
  {
    /*모달에서 색상 선택 후 확인버튼 터치 시 색상 확정, 확인버튼 활성화 -> 모달 close */
  }
  const confirmColor = () => {
    console.log(selectedColor);
    setColorConfirmed(selectedColor);
    setButtonDisabled(false);
    setConfirmBtnColor(color.activated);
    handleModalPress();
  };

  const [textInputValue, setTextInputValue] = useState(title);

  /* 문자 입력 시 확인 버튼 활성화  */
  const [confirmBtnColor, setConfirmBtnColor] = useState(color.deactivated);
  const [buttonDisabled, setButtonDisabled] = useState(true);
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

  /* 색상 선택 모달창 띄우기/숨기기 (초기값: 숨기기) */
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModalPress = () => {
    setIsModalVisible(!isModalVisible);
    setSelectedColor(colorConfirmed);
  };

  /* 팀이름, 색상 firebase에 업데이트 */
  const updateTeam = async () => {
    const updateTimeStamp = new Date();
    const teamDocRef = doc(db, "team", id);
    await updateDoc(teamDocRef, {
      title: textInputValue,
      fileImage: colorConfirmed,
      updateTime: updateTimeStamp,
    });
  };
  console.log("id:" + id);

  /* TeamAddPage와 구성은 동일 */
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={s.container}>
        <StatusBar style={"dark"}></StatusBar>
        <View style={s.headContainer}>
          <View style={s.headBtn}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TeamPage");
              }}
            >
              <AntDesign name="left" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={s.title}>팀 수정</Text>

          <TouchableOpacity
            disabled={buttonDisabled}
            style={s.titleRightBtn}
            onPress={() => {
              updateTeam();
              navigation.navigate("TeamPage");
            }}
          >
            <Text style={{ ...s.titleRightText, color: confirmBtnColor }}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.colorTextInputContainer,
            borderColor: colorConfirmed,
          }}
        >
          <View flex={1}>
            <TextInput
              placeholder={title}
              value={textInputValue}
              returnKeyType="done"
              onChangeText={onTextInputChange}
              style={styles.colorTextInput}
            ></TextInput>
          </View>
          <TouchableWithoutFeedback onPress={handleModalPress}>
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

        <View flex={1}>
          <Modal
            onBackButtonPress={handleModalPress}
            onBackdropPress={handleModalPress}
            isVisible={isModalVisible}
            swipeDirection="down"
            onSwipeComplete={handleModalPress}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={200}
            animationOutTiming={200}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={0}
            style={{ margin: 0 }}
          >
            <View style={styles.modalView}>
              {/* 색상 팔레트 모달창 내 색상, 확인버튼 컨테이너 */}
              <View style={styles.modalItemContainter}>
                {/* 모달창 상위 부분 회색 막대기 */}
                <View style={styles.modalVector}></View>
                <Text
                  style={{
                    marginTop: 15,
                    fontFamily: "SUIT-Medium",
                    fontSize: 14,
                  }}
                >
                  색상
                </Text>
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
                            style={[styles.circles, { backgroundColor: color }]}
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
                            style={[styles.circles, { backgroundColor: color }]}
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
                            style={[styles.circles, { backgroundColor: color }]}
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
                            style={[styles.circles, { backgroundColor: color }]}
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
                            style={[styles.circles, { backgroundColor: color }]}
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
                            style={[styles.circles, { backgroundColor: color }]}
                          ></View>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
                <TouchableOpacity onPress={confirmColor}>
                  <View style={styles.modalConfirmBtn}>
                    <Text style={styles.modalText}>확인</Text>
                  </View>
                </TouchableOpacity>
              </View>
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
    borderBottomWidth: 1.5,
    marginTop: "3%",
  },
  colorTextInput: {
    height: 50,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: "1%",
    fontFamily: "SUIT-Regular",
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
  modalText: {
    fontSize: 14,
    fontFamily: "SUIT-Medium",
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
    width: "100%",
  },
  modalConfirmBtn: {
    borderRadius: 10,
    width: WINDOW_WIDHT * 0.9,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: color.deletegrey,
  },
  modalVector: {
    height: 5,
    width: 50,
    backgroundColor: color.deactivated,
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
    backgroundColor: "white",
    borderStartStartRadius: 20,
    borderStartEndRadius: 20,
    marginTop: "auto",
    minHeight: 460,
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
    marginLeft: 10,
    marginRight: "5%",
  },
  circleContainer: {
    flex: 0.18,
    //backgroundColor: "red",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  confirmBtn: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: "3%",
  },
});
