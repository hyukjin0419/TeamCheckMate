import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import s from "../../styles/css";
import {
  auth,
} from "../../../firebase";
import * as React from "react";

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
      <TouchableOpacity style={styles.AddBtnContainer} onPress={handlePress}>
        <Image
          style={styles.addOrCloseBtn}
          source={require("../../images/categoryAddBtn.png")}
        ></Image>

        {/* 모달 뷰 */}
        <Modal
          style={styles.modalView}
          // animationType="fade"
          transparent={true}
          visible={showModal}
          animationInTiming={20} // 애니메이션 속도 조절 (단위: 밀리초)
          animationOutTiming={20}
        >
          <TouchableWithoutFeedback onPress={handlePress}>
            {/*백그라운드 터치시 모달창 사라지게 하는 함수를 호출*/}
            <View style={styles.modalView}>
              <View style={s.headContainer}></View>
              {/* 엑스 버튼 */}
              <TouchableOpacity
                style={styles.AddBtnContainer}
                onPress={handlePress}
              >
                <Image
                  style={{...styles.addOrCloseBtn}}
                  source={require("../../images/categoryCloseBtn.png")}
                ></Image>
              </TouchableOpacity>
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
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TeamJoinPage"), setShowModal(false);
                  }}
                ></TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  AddBtnContainer: {
    alignItems: "flex-end",
    paddingBottom: "2%",
    paddingHorizontal: "5%",
    position: "absolute",
    bottom: 22,
    marginLeft: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 4,
  },
  addOrCloseBtn: {
    width: 50,
    height: 50,
    marginRight: "2%",
  },
  modalView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  twoBtnContainer: {
    paddingHorizontal: "6%",
    alignItems: "flex-end",
    justifyContent: "center",
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
