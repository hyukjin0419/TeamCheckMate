import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import s from "../../styles/css";
import { auth } from "../../../firebase";
import * as React from "react";
import Modal from "react-native-modal";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default PersonalPageBtn = () => {
  const navigation = useNavigation();

  //회원정보 가져오기
  const user = auth.currentUser;
  console.log("TeamPage: 이걸로도 갖올 수 있는겨?" + user.email);
  //플러스 버튼 터치시 팀 등록|팀 참여하기 버튼 모달창 띄우기|숨기기 함수
  const [showModal, setShowModal] = useState(false);
  const handlePress = () => {
    setShowModal(!showModal);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={"dark"}></StatusBar>
      <View style={s.headContainer}></View>
      {/* 팀 추가에 점근할 수 있는 버튼 */}
      <Modal
        isVisible={showModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={100}
        animationOutTiming={100}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        backdropOpacity={0.6}
      >
        <TouchableWithoutFeedback onPress={handlePress}>
          {/*백그라운드 터치시 모달창 사라지게 하는 함수를 호출*/}
          <View style={styles.modalView}>
            <View style={styles.modalInsideView}>
              {/* 버튼 두개: 팀 등록 버튼 & 팀 참여하기 버튼 */}
              <View style={styles.twoBtnContainer} onPress={handlePress}>
                {/* 팀 등록 버튼: 팀등록 페이지로 넘어가는 버튼 */}
                <TouchableOpacity
                  style={styles.addCategoryBtn}
                  onPress={() => {
                    navigation.navigate("CategoryAdd"), setShowModal(false);
                  }}
                >
                  <Text style={styles.categoryManageText}>카테고리 등록</Text>
                  <Image
                    source={require("../../images/icons/teamAdd_plus.png")}
                    style={{ width: 16, height: 16 }}
                  />
                </TouchableOpacity>
                {/* 팀 참여하기 버튼: 팀 참여하기 페이지로 넘어가는 버튼 */}
                <TouchableOpacity
                  style={styles.categoryManageBtn}
                  onPress={() => {
                    navigation.navigate(), setShowModal(false);
                  }}
                >
                  <Text style={styles.categoryManageText}>카테고리 관리</Text>
                  <Image
                    source={require("../../images/icons/EditIcon.png")}
                    style={{ width: 16, height: 16 }}
                  />
                </TouchableOpacity>
              </View>
              {/* 엑스 버튼 */}
              <TouchableOpacity
                style={styles.closeBtnContainer}
                onPress={handlePress}
                activeOpacity={1}
              >
                <Image
                  style={styles.addOrCloseBtn}
                  source={require("../../images/CloseClassAddBtn.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity style={styles.addBtnContainer} onPress={handlePress}>
        <Image
          style={styles.addOrCloseBtn}
          source={require("../../images/ClassAddBtn.png")}
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  addBtnContainer: {
    position: "absolute",
    right: "1%",
    bottom: 10,
    zIndex: 1,
  },
  closeBtnContainer: {
    position: "absolute",
    bottom: 10,
    right: "1%",
  },
  addOrCloseBtn: {
    width: 80,
    height: 80,
  },
  modalView: {
    flexDirection: "column",
    width: WINDOW_WIDHT,
    height: WINDOW_HEIGHT,
    alignSelf: "center",
  },
  modalInsideView: {
    flexDirection: "column-reverse",
    flex: 0.9,
  },
  twoBtnContainer: {
    position: "absolute",
    bottom: 90,
    right: 10,
    paddingHorizontal: "6%",
    alignItems: "flex-end",
  },
  addCategoryBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 12,
    marginTop: "2%",
  },
  categoryManageText: {
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    paddingHorizontal: 1,
    marginRight: 3,
  },
  categoryManageBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
});
