import {View, Text, StyleSheet, Button} from "react-native";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const SettingPage = () => {

    const logOut = () => {
        auth
        .signOut()
        .then(() => {
            navigation.replace("InitialPage");
          })
          .catch((error) => alert(error.message));
    }
    return(
        <View style={styles.container}>
            <Button title="Sign Out" onPress={logOut} style={styles.text} />
        </View>
    );
};

export default SettingPage;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    }
})