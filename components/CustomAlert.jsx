import { View, Text, TouchableOpacity, Modal } from "react-native";
import React from "react";

const CustomAlert = ({ isAlertVisible, setIsAlertVisible, alertMessage }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isAlertVisible}
      onRequestClose={() => setIsAlertVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50 shadow-lg">
        <View
          className="w-80 p-4 bg-white rounded-lg items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text className="text-lg font-pmedium mb-2 text-center">
            {alertMessage}
          </Text>
          <TouchableOpacity
            className="shadow-lg"
            onPress={() => setIsAlertVisible(false)}
            style={{
              backgroundColor: "#63C5DA", // Button background color
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <Text className="font-pbold">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
