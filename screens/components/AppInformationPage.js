import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import s from "../styles/css";
import { color } from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const AppInformationPage = () => {
  const navigation = useNavigation();

  return (
    <View style={s.container}>
      <StatusBar style={"dark"}></StatusBar>
      {/* 뒤로가기 버튼, 팀 등록 헤더와 확인버튼 컨테이너 */}
      <View style={s.headContainer}>
        <TouchableOpacity
          style={s.headBtn}
          onPress={() => {
            navigation.navigate("SettingPage");
          }}
        >
          <Image
            style={{
              width: 8,
              height: 14,
            }}
            source={require("../images/backBtn.png")}
          />
        </TouchableOpacity>
        <Text style={s.title}>앱 정보</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          <Text style={styles.text}>버전</Text>
          <Text style={{ marginRight: "2%" }}>Alpha</Text>
        </View>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate("TermsOfServicePage")}
        >
          <Text style={styles.text}>이용약관</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate("PrivatePolicyPage")}
        >
          <Text style={styles.text}>개인정보 정책</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate("OpenSourcePage")}
        >
          <Text style={styles.text}>오픈소스</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppInformationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  optionContainer: {
    height: 60,
    width: "95%",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderColor: color.deactivated,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logOutBtn: {
    width: WINDOW_WIDHT * 0.41,
    height: 55,
    backgroundColor: color.activated,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logOutText: {
    color: "white",
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  accountDeleteBtn: {
    width: WINDOW_WIDHT * 0.41,
    height: 55,
    backgroundColor: color.deletegrey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  accountDeleteText: {
    color: color.redpink,
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    fontFamily: "SUIT-Medium",
    color: color.activated,
    marginLeft: "1%",
  },
});
