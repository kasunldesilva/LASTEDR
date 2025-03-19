import { View, Text, TextInput } from 'react-native'
import React from 'react'

const FormField = ({title, value, placeholder,handleChangeText,otherStyles,containerStyles, ...props }) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-pmedium" >{title}</Text>

      <View className={` border-2 border-gray-400 w-full h-14 px-4 rounded-2xl focus:border-primary justify-center ${containerStyles}`}>
        <TextInput
          className="flex-1 font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#c5c6d0"
          onChangeText={handleChangeText}
          multiline={true}
          
        />
      </View>
    </View>
  ) 
}

export default FormField