import { StyleSheet, Dimensions } from "react-native";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

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
  },
  //로그인 화면에서 쓰이는 textBox
  textBox: {
    marginTop: "10%",
  },
  //로그인 화면에서 쓰이는 textInput
  textInput: {
    margin: "3%",
    fontSize: 16,
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  //버튼 기본 디자인
  button: {
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
  },
  //버튼안 text 기본 디자인
  buttonText: {
    fontSize: 15,
    fontWeight: 400,
    color: "white",
  },
  //가입하기 버튼 & 건너뛰기 버튼처럼 메인 버튼 밑에 있는 작은 글꼴 디자인
  subButton: {
    borderBottomWidth: 1,
    padding: 4,
    alignSelf: "center",
  },
  subButtonText: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default commonStyles;
