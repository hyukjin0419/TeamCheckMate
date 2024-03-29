//팀 파일 아이콘 [팀 정보] 모달창에서 팀원추가버튼 터치 시 이동되는 {팀원 추가 화면}입니다.
//팀원 추가 하였을 때 팀 생성 토스트 알림이 뜨지 않게 하기 위하여 만든 페이지 입니다.
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import s from "../../styles/css";
import * as MailComposer from "expo-mail-composer";
import {
  collection, //Collection
  getDocs, //R
  db,
  auth,
} from "../../../firebase";
import { color } from "../../styles/colors";

export default function TeamUpdateAddMemberPage({ route }) {
  const navigation = useNavigation();
  //TeamAddPage에서 풀러오는 TeamID
  const { teamId } = route.params;
  const [teamCode, setTeamCode] = useState(teamId);
  //파이어베이스에서 가져온 이메일 배열
  const [userEmailArray, setUserEmailArray] = useState([]);
  //검색창에 입력되는 이메일
  const [searchEmail, setSearchEmail] = useState("");
  //입력되는 이메일과 파이어베이스에서 가져온 이메일 비교를 위한 배열
  const [filteredResults, setFilteredResults] = useState([]);
  //검색중? or Not
  const [isSearching, setIsSearching] = useState(false);
  //사용자가 이메일 선택시 선택한 이메일 새로운 배열에 저장하기 위한 배열
  const [addedUserEmailArray, setAddedUserEmailArray] = useState([]);
  //현재 로그인된 유저 정보
  const user = auth.currentUser;
  //보내기 버튼 활성||비활성
  const [confirmBtnColor, setConfirmBtnColor] = useState("#BEBEBE");

  //1. 파이어 베이스에서 이메일 가져오는 함수 (자신의 이메일은 가져오지 x)
  const getUsers = async () => {
    const list = [];
    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
      if (doc.id !== user.email)
        list.push({
          id: doc.id,
        });
    });
    setUserEmailArray(list);
  };
  //2.처음 화면 렌더링시 파이어 베이스에서 이메일 가져오기
  useEffect(() => {
    getUsers();
    setTeamCode(teamId);
    console.log(teamId);
  }, []);

  //3.검색어 상태 바뀔때마다 실행
  useEffect(() => {
    //fileter() -> 배열의 각 요소에 대해 주어진 함수를 호출하고, 함수의 반환 값이 'true'인요소들만 모아서 새로운 배열을 생성한다.
    //삼항 연산자 사용. 'searchEmail'이 비어 있지 않은 경우에만 필터링 수행
    //(condition) ? trueExpression : falseExpression
    const newFilteredResults =
      searchEmail.trim() !== ""
        ? userEmailArray.filter(
            (user) => user.id.includes(searchEmail) && user.id !== ""
          )
        : [];
    setFilteredResults(newFilteredResults);
  }, [searchEmail]);
  // console.log(filteredResults);

  //4. 검색 후 이메일 누를시 그 이메일 발송이메일에 추가
  //console.log를 보기 위해 조건문 추가 -> 기능상 제거해도 무관함
  const addEmail = (props) => {
    const isDuplicate = addedUserEmailArray.some((item) => item.id === props);

    if (!isDuplicate) {
      // 중복이 아닐 때만 추가
      addedUserEmailArray.push({
        id: props,
      });
      console.log("이메일 추가 성공");
    } else {
      Alert.alert("이미 추가된 이메일입니다.");
      console.log("이미 추가된 이메일입니다.");
    }
    setIsSearching(false);
    setSearchEmail("");
    console.log("현재 추가된: ", addedUserEmailArray);
  };

  //5. x 버튼 누를시 해당 이메일 배열에서 삭제
  const removeEmail = (emailId) => {
    // 해당 이메일을 addedUserEmailArray에서 제거
    const updatedArray = addedUserEmailArray.filter(
      (item) => item.id !== emailId
    );
    setAddedUserEmailArray(updatedArray);
    console.log("이메일 제거 성공");
  };

  const sendEmail = async () => {
    const bodyText = `
    안녕하세요, 사용자가 발송한 Check Team Mate의 팀 초대코드입니다.
    팀 등록 페이지에서 팀 초대코드를 입력해주세요.

    팀 초대코드: ${teamCode}
  `;
    const recipientEmails = addedUserEmailArray.map((item) => item.id);
    try {
      const result = await MailComposer.composeAsync({
        recipients: recipientEmails,
        subject: "[Check Team Mate_초대코드 발송]",
        body: bodyText,
      });
      console.log("MailComposer 결과:", result);

      // 메일이 성공적으로 전송되었을 때에만 navigate
      if (result.status === "sent") {
        navigation.navigate("TeamPage", { teamAdded: false });
      } else {
        // 사용자가 메일을 취소하거나 전송에 실패한 경우의 처리
        console.log("메일 전송이 취소되었거나 실패했습니다.");
      }
    } catch (error) {
      console.error("메일 보내기 오류:", error);
      // 오류 처리 등이 필요하면 추가할 수 있습니다.
    }
  };

  // -------------------------------------------------------------
  return (
    // 이메일 입력중 나머지 화면 누르면 키보드 및 검색창 내리기
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsSearching(false);
      }}
    >
      <KeyboardAvoidingView style={s.container}>
        {/* 헤더부분 */}
        <View style={s.headContainer}>
          <Text style={s.title}>팀 메이트 초대</Text>
        </View>

        {/* 검색창 */}
        <View>
          <View style={styles.searchContainer}>
            <View style={styles.iconContainer}>
              <Image
                style={styles.glass}
                source={
                  isSearching
                    ? require("../../images/icons/glass_navy.png")
                    : require("../../images/icons/glass_grey.png")
                }
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                value={searchEmail}
                onChangeText={(text) => {
                  setSearchEmail(text);
                  setIsSearching(text.trim() !== "");
                }}
                onSubmitEditing={() => {
                  setSearchEmail("");
                  setIsSearching(false);
                }}
                placeholder="초대할 팀 메이트의 이메일을 입력해주세요!"
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* 검색중일때 이메일 매치해서 보여주기 */}
          {isSearching ? (
            /* 검색된 emailContainer */
            filteredResults.length > 0 && (
              <View style={styles.emailContainer}>
                <FlatList
                  style={styles.emailTextContainer}
                  data={filteredResults}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addEmail(item.id)}>
                      <Text style={styles.emailText}>{item.id}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )
          ) : (
            /* 건너뛰기 버튼 및 새로운 배열에 추가된 이메일들 -> 초대할 이메일*/

            <View>
              {addedUserEmailArray.length > 0 && (
                <View>
                  <Text style={styles.emailAddedTitle}>초대할 이메일</Text>
                  <FlatList
                    keyboardShouldPersistTaps="always"
                    data={addedUserEmailArray}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.emailAddedContainer}>
                        <Text style={styles.emailAddedText}>{item.id}</Text>
                        {/* 삭제 버튼 */}
                        <TouchableOpacity
                          style={styles.xIcon}
                          onPress={() => removeEmail(item.id)}
                        >
                          <AntDesign
                            name="closecircle"
                            size={15}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )}
              <View style={s.twoBtnContainer}>
                <TouchableOpacity
                  disabled={addedUserEmailArray.length > 0 ? false : true}
                  style={{
                    ...s.twoBtnContainerLeft,
                    backgroundColor:
                      addedUserEmailArray.length > 0
                        ? color.activated
                        : confirmBtnColor, //deactivated
                  }}
                  onPress={() => {
                    if (addedUserEmailArray.length > 0) {
                      sendEmail();
                    }
                  }}
                >
                  <Text style={s.twoBtnContainerLeftText}>보내기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.twoBtnContainerRight}
                  onPress={() => {
                    //팀 페이지로 넘어갈 때 토스트 띄우기 위한 boolean
                    navigation.navigate("TeamPage", { teamAdded: false });
                  }}
                >
                  <Text style={styles.twoBtnContainerRightText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  //검색창 컨테이너
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    height: 50,
    backgroundColor: "#EFEFEF",
    borderRadius: 24,
    marginTop: "5%",
  },
  //돋보기 컨테이너
  iconContainer: {
    flex: 1,
    alignSelf: "center",
    marginLeft: "5%",
  },
  //돋보기 아이콘
  glass: {},
  //검색창 컨테이너
  textInputContainer: {
    flexDirection: "row",
    flex: 23,
    alignSelf: "center",
    marginLeft: "3%",
  },
  //검색창 입력
  textInput: {
    // backgroundColor: "green",
    flex: 0.93,
    fontSize: 14,
    fontFamily: "SUIT-Regular",
  },
  //이메일 리스트 컨테이너
  emailContainer: {
    zIndex: 1,
    backgroundColor: "#EFEFEF",
    borderRadius: 24,
    marginTop: "5%",
  },
  emailTextContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  //이메일 리스트 컨테이너 안 이메일 Text
  emailText: {
    padding: 10,
    justifyContent: "center",
    marginLeft: "3%",
    fontFamily: "SUIT-Regular",
    fontSize: 14,
  },
  // 추가된 이메일 보여주는 창
  //초대할 이메일 (제목)
  emailAddedTitle: {
    fontSize: 12,
    color: color.activated,
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 10,
    marginBottom: 15,
  },
  //초대할 이메일 리스트 컨테이너
  emailAddedContainer: {
    flexDirection: "row",
  },
  //초대할 이메일 텍스트
  emailAddedText: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 10,
    fontFamily: "SUIT-Regular",
  },
  //삭제 아이콘 컨테이너
  xIcon: {
    alignSelf: "center",
    marginLeft: 5,
    marginBottom: 10,
  },
  //삭제버튼 {취소} 텍스트
  twoBtnContainerRightText: {
    fontFamily: "SUIT-Medium",
    textAlign: "center",
    fontSize: 14,
    color: color.redpink,
  },
});

// 1. 검색창 색상 바꾸기
// 2. 초대할 이메일 간격 넓히기
