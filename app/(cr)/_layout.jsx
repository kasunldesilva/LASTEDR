import { Stack } from "expo-router";
import {useFonts} from "expo-font";
export default function CrLayout() {
 
  return (
    
    <Stack>
      
      <Stack.Screen name="Complain" options={{ headerShown: false }} />
      <Stack.Screen name="Request" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
      <Stack.Screen name="fulldetail" options={{ headerShown: false }} />

      
      
      
      
      
    </Stack>
  );
}
