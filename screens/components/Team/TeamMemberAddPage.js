import { useNavigation } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import s from "../../styles/css";
import * as MailComposer from "expo-mail-composer";
import {
  getFirestore, //get db
  collection, //Collection
  doc, //문서
  addDoc, //C
  getDocs, //R
  updateDoc, //U
  deleteDoc, //D
  setDoc,
  orderBy,
  query,
  db,
  auth,
} from "../../../firebase";
import { color } from "../../styles/colors";

export default function AddMembers({ route }) {
  const navigation = useNavigation();
  //TeamAddPage에서 풀러오는 TeamID
  const { teamID } = route.params;
  const [teamCode, setTeamCode] = useState(teamID);
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
  const [confirmBtnColor, setConfirmBtnColor] = useState(color.deactivated);
  //확인 버튼 상태 (초기값:비활성화 상태)
  const [buttonDisabled, setButtonDisabled] = useState(true);

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
    setTeamCode(teamID);
    console.log(teamID);
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

  const sendEmail = () => {
    const bodyText = `
    안녕하세요, 사용자가 발송한 Check Team Mate의 팀 초대코드입니다.
    팀 등록 페이지에서 팀 초대코드를 입력해주세요.

    팀 초대코드: ${teamCode}
  `;
    const recipientEmails = addedUserEmailArray.map((item) => item.id);
    MailComposer.composeAsync({
      recipients: recipientEmails,
      subject: "[Check Team Mate_초대코드 발송]",
      body: bodyText,
    });
  };
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
                  style={{
                    ...s.twoBtnContainerLeft,
                    backgroundColor:
                      addedUserEmailArray.length > 0
                        ? "#050026"
                        : confirmBtnColor,
                  }}
                >
                  <Text style={s.twoBtnContainerLeftText}>보내기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.twoBtnContainerRight}>
                  <Text style={s.twoBtnContainerRightText}>건너뛰기</Text>
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
});

// 1. 검색창 색상 바꾸기
// 2. 초대할 이메일 간격 넓히기
