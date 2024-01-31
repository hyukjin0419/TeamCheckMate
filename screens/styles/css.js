import * as Font from "expo-font";
import { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { color } from "./colors";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export const css = () => {
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "SUIT-Regular": require("../../assets/fonts/SUIT-Regular.ttf"),
        "SUIT-Medium": require("../../assets/fonts/SUIT-Medium.ttf"),
      });
    };
    loadFonts();
  }, []);
};
const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  //헤더
  headContainer: {
    display: "flex",
    marginTop: WINDOW_HEIGHT > 700 ? "18%" : "12%",
    flexDirection: "row",
    marginBottom: "2%",
  },
  headBtn: {
    flex: 0.5,
    alignSelf: "flex-start",
    // backgroundColor: "red",
  },
  //헤더에 들어가는 타이틀 -> 글꼴수에 따라 marginLeft 수정 바람.
  title: {
    flex: 3,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "SUIT-Medium",
    // backgroundColor: "violet",
  },
  //헤더 오른쪽 버튼 (안보일 수 있음, 비율 맞추기 위해 존재)
  titleRightBtn: {
    flex: 0.5,
    // backgroundColor: "blue",
  },
  titleRightText: {
    fontSize: 16,
    alignSelf: "flex-end", // 오른쪽 정렬
    fontFamily: "SUIT-Medium",
  },
  //------------------------TextInput---------------------------
  //입력창을 감싸는 컨테이너
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  //textInput
  textInput: {
    height: 50,
    fontSize: 16,
    fontFamily: "SUIT-Regular",
    marginLeft: "1%",
    marginTop: "5%",
    paddingTop: "2%",
  },
  //입력창 밑줄
  textInputContainer: {
    borderBottomWidth: 1.5,
  },

  //버튼 기본 디자인
  button: {
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
    marginTop: "11%",
  },
  //버튼안 text 기본 디자인
  buttonText: {
    fontSize: 14,
    fontWeight: 400,
    color: "white",
    fontFamily: "SUIT-Medium",
  },
  //가입하기 버튼 & 건너뛰기 버튼처럼 메인 버튼 밑에 있는 작은 글꼴 디자인
  subButton: {
    marginTop: "2%",
    borderBottomWidth: 0.8,
    padding: 1,
    alignSelf: "center",
  },
  subButtonText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "SUIT-Regular",
  },
  // -----------------------팀 등록 & 팀 수정 페이지--------------------------------------
  twoBtnContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  twoBtnContainerLeft: {
    flex: 1,
    backgroundColor: color.activated,
    padding: 15,
    marginRight: 5,
    borderRadius: 7,
  },
  twoBtnContainerLeftText: {
    color: "white",
    fontFamily: "SUIT-Medium",
    textAlign: "center",
    fontSize: 13,
  },
  twoBtnContainerRight: {
    flex: 1,
    backgroundColor: color.deletegrey,
    padding: 15,
    marginLeft: 5,
    borderRadius: 7,
  },
  twoBtnContainerRightText: {
    fontFamily: "SUIT-Medium",
    textAlign: "center",
    fontSize: 13,
  },
  // -----------------------모달창--------------------------------------
  modalTeamBtnContainer: {
    width: WINDOW_WIDHT,
    //backgroundColor: "yellow",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: WINDOW_HEIGHT * 0.1,
  },
  teamReviseBtn: {
    width: WINDOW_WIDHT * 0.45,
    height: 65,
    backgroundColor: color.activated,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamReviseText: {
    color: "white",
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  teamDeleteBtn: {
    width: WINDOW_WIDHT * 0.45,
    height: 65,
    backgroundColor: color.deletegrey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamDeleteText: {
    color: color.redpink,
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  modalVector: {
    height: 5,
    width: 50,
    backgroundColor: color.deactivated,
    borderRadius: 10,
  },
  modalTitle: {
    marginTop: 20,
    fontFamily: "SUIT-Medium",
    fontSize: 16,
  },
  modalItemContainter: {
    flex: 1,
    alignItems: "center",
    marginBottom: "5%",
  },
  modalView: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400, // This property determines the minimum height of the modal
  },
});

export default commonStyles;
