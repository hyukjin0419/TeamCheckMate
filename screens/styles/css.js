import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  //헤더
  head: {
    marginTop: "18%",
    flexDirection: "row",
  },
  //헤더에 들어가는 타이틀 -> 글꼴수에 따라 marginLeft 수정 바람.
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "36%",
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
