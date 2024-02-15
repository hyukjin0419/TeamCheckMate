//과제 아이템
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/core";
import { color } from "../styles/colors";
import { db, collection, doc, deleteDoc } from "../../firebase";
import s from "../styles/css";
import * as Haptics from "expo-haptics";

//스크린의 높이, 넓이 불러오기
const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const AssignmentItem = (props) => {
  const navigation = useNavigation();
  const [teamCode, setTeamCode] = useState(props.teamCode);
  const [title, setTitle] = useState(props.title);
  const [fileColor, setFileColor] = useState(props.fileColor);
  const [memberInfo, setMemberInfo] = useState(props.memberInfo);
  const [memberNames, setMemberNames] = useState(props.memberNames);
  const [assignmentName, setAssignmentName] = useState(props.assignmentName);
  const [assignmentId, setAssignmentId] = useState(props.assignmentId);
  const [dueDate, setDueDate] = useState(props.dueDate);
  // console.log("[AssignmentItem] teamCode", teamCode, "여기까지는 로드 됨");
  // console.log(teamCode, title, fileColor, memberInfo, memberNames);
  const [assignmentOptionModalVisible, setAssignmentOptionModalVisible] =
    useState(false);

  {
    /* 과제 이름, dueDate가 업데이트 되었을 경우 새로고침 */
  }
  useEffect(() => {
    setAssignmentName(props.assignmentName);
  }, [props.assignmentName]);

  useEffect(() => {
    setDueDate(props.dueDate);
  }, [props.dueDate]);

  {
    /* 과제 옵션 모달창 띄우고/숨기는 함수 */
  }
  const handleAssignmentOptionPress = () => {
    setAssignmentOptionModalVisible(!assignmentOptionModalVisible);
    console.log(props.assignmentId);
  };

  {
    /* 과제 삭제하는 함수 */
  }
  const handleDelete = async () => {
    try {
      //team collection에 접근
      const teamDocumentRef = doc(collection(db, "team"), teamCode);
      const assignmentListCollectionRef = collection(
        teamDocumentRef,
        "assignmentList"
      );
      //과제 list colloection에 접근
      const assignmentDocRef = doc(
        assignmentListCollectionRef,
        props.assignmentId
      );

      //접근한 문서 삭제
      await deleteDoc(assignmentDocRef);
      console.log("삭제 완료");
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
    props.getAssignmentList();
  };

  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const [askingModalVisible, setaskingModalVisible] = useState(false);
  handleAskingModalPress = () => {
    setaskingModalVisible(!askingModalVisible);
  };

  return (
    <Pressable
      onLongPress={handleAssignmentOptionPress}
      delayLongPress={800}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => ({
        opacity: pressed ? 0.2 : 1,
      })}
      onPress={() => {
        navigation.navigate("TeamCheckPage", {
          teamCode: teamCode,
          title: title,
          fileColor: fileColor,
          memberInfo: memberInfo,
          memberNames: memberNames,
          assignmentName: assignmentName,
          assignmentId: assignmentId,
          dueDate: dueDate,
        });
      }}
    >
      <ImageBackground
        style={styles.assignmentBox}
        source={require("../images/AssignmentContainer.png")}
      >
        {/* DueDate와 과제 이름 */}
        <View style={styles.assignmentDataContainer}>
          <Text style={styles.dueDateText}>{dueDate}</Text>
          <Text style={styles.assignmentNameText}>{assignmentName}</Text>
        </View>
        <Pressable
          style={styles.optionBtn}
          onPress={() => {
            handleAssignmentOptionPress();
          }}
        ></Pressable>
        {/* 과제 설정 모달창 */}
        <Modal
          onBackButtonPress={handleAssignmentOptionPress}
          onBackdropPress={handleAssignmentOptionPress}
          isVisible={assignmentOptionModalVisible}
          swipeDirection="down"
          onSwipeComplete={handleAssignmentOptionPress}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={0}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          {/* 과제 설정 모달창 */}
          <View style={s.modalView}>
            {/* 모달창 내 아이템 (텍스트, 버튼 등) 컨테이너 */}
            <View style={s.modalItemContainter}>
              {/* 모달창 상단 회색 막대 */}
              <View style={s.modalVector}></View>
              {/* 모달창 상단 과제 이름 표시 */}
              <Text style={s.modalTitle}>{assignmentName}</Text>
              <Text style={styles.modalDueDateText}>제출기한: {dueDate}</Text>
              <View flex={1}></View>
              {/* 팀 수정, 팀 삭제 버튼 컨테이너 */}
              <View style={s.modalTeamBtnContainer}>
                {/* 수정 버튼 */}
                <TouchableOpacity
                  style={s.teamReviseBtn}
                  onPress={() => {
                    {
                      /* 터치 시 과제 수정 화면으로 이동 */
                    }
                    navigation.navigate("AssignmentUpdatePage", {
                      teamCode: teamCode,
                      title: title,
                      fileColor: fileColor,
                      memberInfo: memberInfo,
                      memberNames: memberNames,
                      assignmentName: assignmentName,
                      assignmentId: assignmentId,
                      dueDate: dueDate,
                    });
                    {
                      /* 모달 숨기기 */
                    }
                    setAssignmentOptionModalVisible(false);
                  }}
                >
                  <Text style={s.teamReviseText}>수정</Text>
                </TouchableOpacity>
                {/* 삭제 버튼 */}
                <TouchableOpacity
                  style={s.teamDeleteBtn}
                  onPress={() => {
                    handleAskingModalPress();
                  }}
                >
                  {/* 터치 시 과제 삭제 */}
                  <Text style={s.teamDeleteText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Modal
            onBackdropPress={handleAskingModalPress}
            isVisible={askingModalVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={300}
            animationOutTiming={200}
            backdropTransitionInTiming={0}
            backdropTransitionOutTiming={0}
            backdropOpacity={0.5}
          >
            <View style={s.askingModal}>
              <View marginTop="5%">
                <Text style={s.askingModalText}>과제를 삭제하시겠습니까?</Text>
              </View>
              <View style={s.askingModalBtnContainer}>
                <TouchableOpacity
                  style={s.askingModalCancelBtn}
                  onPress={() => handleAskingModalPress()}
                >
                  <Text style={s.askingModalCancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.askingModalConfirmBtn}
                  onPress={() => {
                    handleAskingModalPress();
                    handleDelete();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={s.askingModalConfirmText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Modal>
      </ImageBackground>
    </Pressable>
  );
};

export default AssignmentItem;

const styles = StyleSheet.create({
  assignmentDataContainer: {
    flex: 1,
    marginLeft: "10%",
    paddingVertical: "5%",
  },
  dueDateText: {
    color: color.redpink,
    fontSize: 12,
    fontFamily: "SUIT-Regular",
  },
  modalDueDateText: {
    alignSelf: "flex-start",
    marginHorizontal: "10%",
    color: color.redpink,
    fontSize: 14,
    fontFamily: "SUIT-Medium",
    marginTop: 20,
  },
  assignmentNameText: {
    color: color.activated,
    fontSize: 20,
    fontFamily: "SUIT-Regular",
    marginTop: 5,
  },
  assignmentBox: {
    alignSelf: "center",
    flexDirection: "row",
    //backgroundColor: "red",
    marginBottom: "5%",
    resizeMode: "cover",
    height: WINDOW_HEIGHT > 800 ? WINDOW_HEIGHT * 0.096 : WINDOW_HEIGHT * 0.117,
    width: WINDOW_WIDHT * 0.9,
  },
  optionBtn: {
    flex: 0.15,
  },
  modal: {
    flex: 1,
  },
  file: {
    width: WINDOW_WIDHT * 0.4,
    height: WINDOW_HEIGHT * 0.18,
    marginHorizontal: 10,
  },
});
