// ToastContainer.js
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Text, View } from "react-native";
import React from "react";

export const showToast = (type, message) => {
  Toast.show({
    type: type,
    text1: message,
    // additional configurations if needed
  });
};

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "yellow",
        borderRadius: 15,
        borderLeftColor: "#000000BF",
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
