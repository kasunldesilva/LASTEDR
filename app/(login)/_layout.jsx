import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { NavigationContainer } from '@react-navigation/native'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name="Login"  options={{headerShown:false}} />
        <Stack.Screen name="Register"  options={{headerShown:false}} />
        <Stack.Screen name="Selecter" options={{headerShown:false}} />
        <Stack.Screen name= "ResetPassword" />
        <Stack.Screen name= "OTPVerification" options={{headerShown:false}} />
        <Stack.Screen name= "ResendOTP" options={{headerShown:false}}/>
        <Stack.Screen name= "test" options={{headerShown:false}}/>
        

       
        
        
       
        <Stack.Screen name="Home"  options={{headerShown:false}} />
      

    </Stack>

  )
    
}

export default _layout