import {View, Text, StyleSheet, Button} from "react-native";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const SettingPage = () => {

    return(
        <View style={styles.container}>
            <Button title="Sign Out" onPress={() =>  signOut(auth)} style={styles.text} />
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