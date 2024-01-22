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
import styles from "../../styles/css";
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

export default function AddMembers() {
  const navigation = useNavigation();

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
  //현재 로그인되 유저 정보
  const user = auth.currentUser;

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
    const recipientEmails = addedUserEmailArray.map((item) => item.id);
    MailComposer.composeAsync({
      recipients: recipientEmails,
      subject: "[Check Team Mate_초대코드 발송]",
      body: "안녕하세요 user가 발송한 Check Team Mate의 팀 초대코드입니다. 팀등록페이지에서 팀 초대코드를 입력해주세요.",
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
        <View style={s.head}>
          <TouchableOpacity
            style={styles.headBtn}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={s.title}>팀 메이트 초대</Text>
          <TouchableOpacity onPress={sendEmail}>
            <Text style={{ ...s.titleSend }}>보내기</Text>
          </TouchableOpacity>
        </View>

        {/* 검색창 */}
        <View>
          <View style={s.searchContainer}>
            <Image
              style={s.glass}
              source={require("../../images/icons/glass_grey.png")}
            />
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
              style={s.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          {/* 검색중일때 이메일 매치해서 보여주기 */}
          {isSearching ? (
            /* 검색된 emailContainer */
            filteredResults.length > 0 && (
              <View style={s.emailContainer}>
                <FlatList
                  data={filteredResults}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addEmail(item.id)}>
                      <Text style={s.emailText}>{item.id}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )
          ) : (
            /* 건너뛰기 버튼 및 새로운 배열에 추가된 이메일들 -> 초대할 이메일*/
            <View>
              <Pressable>
                <View style={s.subBtn}>
                  <Text style={s.subBtnText}>건너뛰기</Text>
                </View>
              </Pressable>
              {addedUserEmailArray.length > 0 && (
                <View>
                  <Text style={s.emailAddedTitle}>초대할 이메일</Text>
                  <View style={s.emailAddedContainer}>
                    <FlatList
                      data={addedUserEmailArray}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <View style={s.emailAddedContainer}>
                          <Text style={s.emailAddedText}>{item.id}</Text>
                          {/* 삭제 버튼 */}
                          <TouchableOpacity
                            style={s.xIcon}
                            onPress={() => removeEmail(item.id)}
                          >
                            <Image
                              source={require("../../images/icons/x.png")}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "31%",
  },
  titleSend: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "38%",
  },
  head: {
    position: "relative",
    marginTop: "18%",
    flexDirection: "row",
    marginBottom: "2%",
  },
  //검색창 컨테이너
  searchContainer: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "#EFEFEF",
    borderRadius: 24,
    marginTop: "5%",
  },
  //돋보기
  glass: {
    alignSelf: "center",
    marginLeft: "5%",
  },
  //검색창 입력
  textInput: {
    flex: 0.9,
    alignSelf: "center",
    marginLeft: "3%",
  },
  //건너뛰기 버튼 컨테이너
  subBtn: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
    alignSelf: "center",
    width: 50,
    marginTop: 20,
  },
  //건너뛰기 버튼 Text
  subBtnText: {
    alignSelf: "center",
    fontSize: 12,
    borderBottomColor: "black",
  },
  //이메일 리스트 컨테이너
  emailContainer: {
    zIndex: 1,
    backgroundColor: "#EFEFEF",
    borderRadius: 24,
    marginTop: "5%",
  },
  emailPressed: {
    backgroundColor: "red",
  },
  //이메일 리스트 컨테이너 안 이메일 Text
  emailText: {
    padding: 15,
    justifyContent: "center",
    marginLeft: "3%",
  },
  emailAddedTitle: {
    fontSize: 12,
    color: "#050026",
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 10,
  },
  emailAddedContainer: {
    flexDirection: "row",
  },
  emailAddedText: {
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  xIcon: {
    alignSelf: "center",
  },
});
