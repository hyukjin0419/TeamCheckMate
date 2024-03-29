// ToastContainer.js
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import React from "react";

export const showToast = (type, message) => {
  Toast.show({
    type: type,
    text1: message,
  });
};

export const showToastFromTeamJoingPage = (type, message) => {
  setTimeout(() => {
    Toast.show({
      type: type,
      text1: message,
    });
  });
};

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "#000000BF",
        borderRadius: 15,
        borderLeftWidth: 0,
        borderLeftColor: "#000000BF",
        // marginTop: "",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontFamily: "SUIT-Regular",
        color: "white",
      }}
    />
  ),
};
