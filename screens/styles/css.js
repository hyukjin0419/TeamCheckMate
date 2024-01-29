import * as Font from "expo-font";
import { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";

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
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "flex-end", // 오른쪽 정렬
    fontFamily: "SUIT-Medium",
  },
  //로그인 화면에서 쓰이는 textBox
  inputTextContainer: {
    marginTop: "%",
  },
  //로그인 화면에서 쓰이는 textInput
  textInput: {
    marginTop: "10%",
    fontSize: 16,
    borderBottomColor: "#050026",
    borderBottomWidth: 2,
    paddingBottom: 10,
    fontFamily: "SUIT-Regular",
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
    backgroundColor: "#050026",
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
    backgroundColor: "#EFEFEF",
    padding: 15,
    marginLeft: 5,
    borderRadius: 7,
  },
  twoBtnContainerRightText: {
    fontFamily: "SUIT-Medium",
    textAlign: "center",
    fontSize: 13,
  },
});

export default commonStyles;
