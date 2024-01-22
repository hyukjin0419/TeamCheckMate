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
} from "../../../firebase";

export default function AddMembers() {
  const navigation = useNavigation();

  /*
  1. 파이어 베이스에서 이메일 가져와서 저장하기
  2. 검색창 및 사용자 목록화면 구현
    - 일단 사용자 전체목록화면을 구현
    - 이제 입력받은 사용자를 찾아야 함
      - 현재 파베에서 불러온 이메일이 배열안에 객체로 저장되어 있음.
      - 새로운 배열을 생성
      - searchEmail의 값이 변할때마다 filter함수를 사용하여 list를 업데이트
      - 업데이트한 list와
  3. 초대 발송 기능 추가
    - 헐 이거 어캐함?
  4. 시큐리티 고려사항 -> 권한이 없는 사용자가 다른 사용자의 정보에 접근하지 못하도록 보호..?
  */

  const [userEmailArray, setUserEmailArray] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  //1. 파이어 베이스에서 이메일 가져오는 함수
  const getUsers = async () => {
    const list = [];
    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
      list.push({
        id: doc.id,
      });
    });
    setUserEmailArray(list);
  };
  //처음 화면 렌더링시 파이어 베이스에서 이메일 가져오기
  useEffect(() => {
    getUsers();
  }, []);

  //검색어 상태 바뀔때마다 실행
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

  return (
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
        <TouchableOpacity>
          <Text style={{ ...s.titleSend }}>보내기</Text>
        </TouchableOpacity>
      </View>
      <View>
        {/* 검색창 */}
        <View style={s.searchContainer}>
          <Image
            style={s.glass}
            source={require("../../images/icons/glass_grey.png")}
          />
          <TextInput
            value={searchEmail}
            onChangeText={(text) => setSearchEmail(text)}
            placeholder="초대할 팀 메이트의 이메일을 입력해주세요!"
            style={s.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>
        <Pressable>
          <View style={s.subBtn}>
            <Text style={s.subBtnText}>건너뛰기</Text>
          </View>
        </Pressable>
        {filteredResults.length > 0 && (
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Text>{item.id}</Text>
              </View>
            )}
          />
        )}
      </View>
      <View></View>
    </KeyboardAvoidingView>
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
  searchContainer: {
    flexDirection: "row",
    height: "22%",
    backgroundColor: "#EFEFEF",
    borderRadius: 24,
    marginTop: "5%",
  },
  glass: {
    alignSelf: "center",
    marginLeft: "5%",
  },
  textInput: {
    flex: 0.9,
    alignSelf: "center",
    marginLeft: "3%",
  },
  subBtn: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
    alignSelf: "center",
    width: 50,
    marginTop: "6%",
  },
  subBtnText: {
    alignSelf: "center",
    marginTop: "5%",
    fontSize: 12,
    borderBottomColor: "black",
  },
});

//
