//과제 아이템
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/core";
import { color } from "../styles/colors";
import { db, collection, doc, deleteDoc } from "../../firebase";
import s from "../styles/css";

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
  console.log("[AssignmentItem] teamCode", teamCode, "여기까지는 로드 됨");
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
      const teamDocumentRef = doc(collection(db, "team"), props.teamid);
      const assignmentListCollectionRef = collection(
        teamDocumentRef,
        "과제 list"
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

  return (
    //과제 아이템 박스
    <TouchableOpacity
      style={styles.assignmentBox}
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
      {/* DueDate와 과제 이름 */}
      <View style={styles.assignmentDataContainer}>
        <Text style={styles.dueDateText}>{dueDate}</Text>
        <Text style={styles.assignmentNameText}>{assignmentName}</Text>
      </View>
      {/* 과제 옵션 버튼 (터치 시 모달창 띄움) */}
      <Pressable
        style={styles.assignmentOptionBtnContainer}
        onPress={() => {
          handleAssignmentOptionPress(props);
        }}
      >
        <View style={styles.assignmentOptionBtn} />
        <View style={styles.assignmentOptionBtn} />
        <View style={styles.assignmentOptionBtn} />
      </Pressable>
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
            <Text style={styles.assignmentNameText}>{assignmentName}</Text>
            <Text style={styles.modalDueDateText}>제출기한: {dueDate}</Text>
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
                    title: props.title,
                    fileColor: props.fileColor,
                    teamid: props.teamid,
                    assignmentName: props.assignmentName,
                    dueDate: props.dueDate,
                    assignmentId: props.assignmentId,
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
              <TouchableOpacity style={s.teamDeleteBtn} onPress={handleDelete}>
                {/* 터치 시 과제 삭제 */}
                <Text style={s.teamDeleteText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default AssignmentItem;

const styles = StyleSheet.create({
  assignmentDataContainer: {
    flex: 1,
    marginLeft: "7%",
    justifyContent: "space-evenly",
    paddingVertical: "5%",
  },
  dueDateText: {
    color: color.redpink,
    fontSize: 12,
    fontFamily: "SUIT-Regular",
  },
  modalDueDateText: {
    flex: 1,
    alignSelf: "flex-start",
    marginHorizontal: "10%",
    color: color.redpink,
    fontSize: 14,
    fontFamily: "SUIT-Medium",
    marginTop: 20,
  },
  assignmentNameText: {
    color: color.activated,
    fontSize: 16,
    fontFamily: "SUIT-Regular",
    marginTop: 20,
  },
  assignmentOptionBtnContainer: {
    flex: 0.05,
    justifyContent: "space-between",
    //backgroundColor: "red",
    paddingVertical: "9%",
  },
  assignmentOptionBtn: {
    height: 3.5,
    width: 3.5,
    backgroundColor: "black",
    borderRadius: 20,
  },
  assignmentBox: {
    width: WINDOW_WIDHT * 0.9,
    height: WINDOW_HEIGHT > 800 ? WINDOW_HEIGHT * 0.095 : WINDOW_HEIGHT * 0.12,
    //backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: "5%",
    flexDirection: "row",
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
