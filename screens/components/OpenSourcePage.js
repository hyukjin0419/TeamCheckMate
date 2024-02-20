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

const OpenSourcePage = () => {
  const navigation = useNavigation();

  return (
    <View style={s.container}>
      <StatusBar style={"dark"}></StatusBar>
      {/* 뒤로가기 버튼, 팀 등록 헤더와 확인버튼 컨테이너 */}
      <View style={s.headContainer}>
        <TouchableOpacity
          style={s.headBtn}
          onPress={() => {
            navigation.navigate("AppInformationPage");
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
        <Text style={s.title}>오픈소스</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>ㅋ</Text>
      </ScrollView>
    </View>
  );
};

export default OpenSourcePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  text: {
    fontSize: 13,
    fontFamily: "SUIT-Regular",
    color: color.activated,
  },
});
