import { View, Text } from 'react-native'
import React from 'react'

const Widget = ({title, data}) => {
  return (
    <View className="w-24 h-24 bg-gray-300 rounded-lg justify-center items-center m-2 shadow-lg ">
      <Text className="font-pbold text-lg">{data}</Text>
      <Text className="font-pregular">{title}</Text>
    </View>
  )
}

export default Widget