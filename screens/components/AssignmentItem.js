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

//스크린의 높이, 넓이 불러오기
const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const AssignmentItem = (props) => {
  const navigation = useNavigation();

  //과제 이름 (AssignmentPage에서 전달받음)
  const [assignmentName, setAssignmentName] = useState(props.assignmentName);
  //dueDate (AssignmentPage에서 전달받음)
  const [dueDate, setDueDate] = useState(props.dueDate);

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
    <View style={styles.assignmentBox}>
      {/* DueDate와 과제 이름 */}
      <View style={styles.assignmentDataContainer}>
        <Text style={styles.dueDateText}>Due Date: {dueDate}</Text>
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
        style={styles.modal}
        visible={assignmentOptionModalVisible}
        transparent={true}
        animationType="fade"
      >
        {/* 모달창 회색 배경 */}
        <View style={styles.background}>
          {/* 과제 설정 모달창 */}
          <Modal
            onSwipeComplete={() => setAssignmentOptionModalVisible(false)}
            swipeDirection={"down"}
            animationType="slide"
            visible={assignmentOptionModalVisible}
            //모달이 아닌 영역을 터치하면 창을 닫자!
            onBackdropPress={handleAssignmentOptionPress}
            //모달 뒷배경 투명도를 0으로 설정
            backdropOpacity={0}
            transparent={true}
          >
            {/* 과제 설정 모달창 */}
            <View style={styles.modalView}>
              {/* 모달창 내 아이템 (텍스트, 버튼 등) 컨테이너 */}
              <View style={styles.modalItemContainter}>
                {/* 모달창 상단 회색 막대 */}
                <View style={styles.modalVector}></View>
                {/* 모달창 상단 과제 이름 표시 */}
                <View style={styles.modalAssignmentNameTextContainer}>
                  <Text style={styles.assignmentNameText}>
                    {assignmentName}
                  </Text>
                </View>
                <Text style={styles.modalDueDateTextContainer}>
                  Due Date: {dueDate}
                </Text>
                {/* 참여 코드, 팀원 목록 표시 */}
                <View flex={1}></View>
                {/* 팀 수정, 팀 삭제 버튼 컨테이너 */}
                <View style={styles.modalTeamBtnContainer}>
                  {/* 팀 수정 버튼 */}
                  <TouchableOpacity
                    style={styles.teamReviseBtn}
                    onPress={() => {
                      {
                        /* 터치 시 팀 수정 화면으로 이동 (팀 이름, 색상, id까지 함꼐 전송) */
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
                    <Text style={styles.teamReviseText}>수정</Text>
                  </TouchableOpacity>
                  {/* 팀 삭제 버튼 */}
                  <TouchableOpacity
                    style={styles.teamDeleteBtn}
                    onPress={handleDelete}
                  >
                    {/* 터치 시 팀 삭제 */}
                    <Text style={styles.teamDeleteText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View></View>
        </View>
      </Modal>
    </View>
  );
};

export default AssignmentItem;

const styles = StyleSheet.create({
  modalTeamBtnContainer: {
    width: WINDOW_WIDHT,
    //backgroundColor:"yellow",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: WINDOW_HEIGHT * 0.13,
  },
  assignmentDataContainer: {
    flex: 1,
    marginLeft: "7%",
    justifyContent: "space-evenly",
    paddingVertical: "5%",
  },
  dueDateText: {
    color: "#FF2868",
  },
  modalAssignmentNameTextContainer: {
    flex: 1,
    marginTop: "7%",
  },
  modalDueDateTextContainer: {
    flex: 1,
    color: "#FF2868",
    alignSelf: "flex-start",
    marginHorizontal: "10%",
  },
  assignmentNameText: {
    color: color.activated,
    fontSize: 20,
    fontWeight: "500",
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
    height: WINDOW_HEIGHT > 800 ? WINDOW_HEIGHT * 0.1 : WINDOW_HEIGHT * 0.12,
    //backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: "5%",
    flexDirection: "row",
  },
  teamReviseBtn: {
    width: WINDOW_WIDHT * 0.4,
    height: WINDOW_HEIGHT * 0.07,
    backgroundColor: "#050026",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamReviseText: {
    color: "#D9D9D9",
  },
  teamDeleteBtn: {
    width: WINDOW_WIDHT * 0.4,
    height: WINDOW_HEIGHT * 0.07,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamDeleteText: {
    color: "#FF2868",
  },
  modal: {
    flex: 1,
  },
  modalVector: {
    height: 5,
    width: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginTop: 10,
  },
  modalItemContainter: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "space-evenly",
    //backgroundColor: "red",
    marginBottom: "5%",
  },
  background: {
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
    height: 400 /*WINDOW_HEIGHT * 0.6*/,
    alignSelf: "stretch",
    alignItems: "center",
    //marginTop: "70%",
    marginTop: "auto",
    marginHorizontal: "-5.5%",
    marginBottom: "-6%",
  },
  file: {
    width: WINDOW_WIDHT * 0.4,
    height: WINDOW_HEIGHT * 0.18,
    marginHorizontal: 10,
  },
  optionContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    //backgroundColor: "blue",
    marginBottom: "5%",
  },
  fileOption: {
    //backgroundColor: "red",
    width: "20%",
    height: "80%",
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30%",
    //backgroundColor: "teal",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "400",
  },
});
