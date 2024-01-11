//시작 화면
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import commonStyles from "./css.js";

export default function InitialPage() {
  const navigation = useNavigation();

  return (
    <View style={commonStyles.container}>
      {/*로고 Container*/}
      <StatusBar style={"dark"} />
      <View style={styles.logoContainter}>
        <Image
          style={styles.logoImage}
          source={require("./images/logo.png")}
        ></Image>
      </View>
      {/*이미지 Container*/}
      <View style={styles.imgContainer}>
        <Image
          style={styles.logInImage}
          source={require("./images/LoginImages.gif")}
        ></Image>
        {/*Description Container*/}
        <Text style={styles.description}>
          무임승차를 방지하기 위한 최적의 방법
        </Text>
      </View>
      {/*버튼 Container*/}
      <View style={styles.BtnContainter}>
        {/*로그인 버튼*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("LogInPage")}
          style={{ ...commonStyles.button, backgroundColor: "#050026" }}
        >
          <Text style={commonStyles.buttonText}>로그인</Text>
        </TouchableOpacity>
        {/*가입하기 버튼*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("SignInPage")}
          style={commonStyles.subButton}
        >
          <Text style={commonStyles.subButtonText}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainter: {
    flex: 1.2,
    //backgroundColor: "teal",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "7%",
  },
  imgContainer: {
    flex: 2,
    //backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logInImage: {
    height: 270,
    width: 290,
  },
  logoImage: {
    height: 107,
    width: 115,
  },
  description: {
    color: "#050026",
    fontSize: 16,
    fontWeight: 400,
    alignSelf: "center",
    marginBottom: "11%",
  },
  BtnContainter: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: "8%",
  },
});
