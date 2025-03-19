import { TouchableOpacity, View, Text, Image } from "react-native";
import React from "react";
import icons from "../constants/icons";

const LongWidget = ({
  date,
  title1,
  exerciseType,
  exerciseCount,
  handlePress,
  containerStyles,
  textSyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl h-24 justify-center shadow-lg
        ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      <View className="flex-row justify-between items-center">
        <View className="w-12 justify-center items-center">
          <Text className="font-pbold text-xl">{date}</Text>
        </View>

        <View>
          <Text className="font-pmedium">{title1}</Text>
          <Text className={`font-pbold text-lg ${textSyles}`}>
            {exerciseType}
          </Text>
          <Text className="font-pmedium">
            {exerciseCount} exercises completed!
          </Text>
        </View>

        <View className="justify-center items-center">
          <Image className="w-7 h-7" source={icons.rightArrow} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
// const LongWidget = () => {
//   return (
//     <View className="w-full h-24 bg-gray-300 rounded-lg justify-center items-center m-4 px-4 shadow-lg">
//       <Text>LongWidget</Text>
//     </View>
//   )
// }

export default LongWidget;
