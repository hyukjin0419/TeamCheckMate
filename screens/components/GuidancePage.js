import {View, Text, StyleSheet} from "react-native";

const GuidancePage = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Guidance Page</Text>
        </View>
    );
};

export default GuidancePage;

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