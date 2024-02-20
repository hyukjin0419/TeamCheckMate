import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import s from "../styles/css";
import { color } from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const PasswordResetPage = () => {
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
        <Text style={s.title}>비밀번호 변경</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      <View style={styles.container}>
        <Text
          style={{
            alignSelf: "center",
            fontFamily: "SUIT-Regular",
            fontSize: 15,
          }}
        >
          비밀번호 변경 메일을 전송했어요.
        </Text>
      </View>
    </View>
  );
};

export default PasswordResetPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: "20%",
  },
  text: {
    fontSize: 13,
    fontFamily: "SUIT-Regular",
    color: color.activated,
  },
});
