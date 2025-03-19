import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles,textSyles, isLoading}) => {
  return (
    <TouchableOpacity 
        onPress = {handlePress}
        activeOpacity={0.7}
        className={`bg-primary rounded-xl min-h-[50px]  justify-center items-center
        ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}>
      <Text className={`font-pbold text-lg ${textSyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton