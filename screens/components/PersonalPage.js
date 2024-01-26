import { View, Button, StyleSheet } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { EvilIcons } from "@expo/vector-icons";
import { showToast, toastConfig } from "../components/Toast";
const PersonalPage = () => {
  const handleShowToast = () => {
    showToast("success", "팀 등록 성공이지롱");
  };
  return (
    <View style={styles.container}>
      {/* PersonalPage의 내용 */}
      <Button title="Show Toast" onPress={handleShowToast} />

      {/* 토스트 메시지의 컨테이너 */}
      <Toast
        position="bottom"
        style={styles.text}
        visibilityTime={2000}
        config={toastConfig}
      />
    </View>
  );
};

export default PersonalPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "SUIT-Regular",
    fontSize: 50,
    // fontWeight: "bold",
    marginBottom: 16,
  },
});
