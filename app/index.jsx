import React ,{useEffect} from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import BackgroundSvg from "../assets/images/background.svg"; 

export default function Index() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Selecter"); 
    }, 1000); 

    return () => clearTimeout(timer); 
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
       
        <View style={styles.background}>
          <BackgroundSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.container, { marginTop: height * 0.04 }]}>
            <TouchableOpacity onPress={() => router.push("/(login)/Selecter")}>
              <Image
                source={require("../assets/images/national.png")}
                style={[styles.logo, { width: width * 0.7 }]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text style={[styles.text, { fontSize: width * 0.08 }]}>EC-EDR</Text>

            <TouchableOpacity onPress={() => router.push("/(login)/Selecter")}>
              <Image
                source={require("../assets/images/logo.png")}
                style={[styles.logo, { width: width * 0.7 }]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(login)/Selecter")}>
              <Image
                source={require("../assets/images/splash image.png")}
                style={[styles.interactiveImage, { width: width * 0.8 }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    
  },
    background: {
    position: "absolute",
    top: 0,
    left: 0,  
    right: 0,
    bottom: 0,
    width: "100%",  
    height: "100%",
  },

  scrollContainer: {
    flexGrow: 1,
    marginTop: 30,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: undefined,
    aspectRatio: 2,
    marginVertical: 0,
  },
  interactiveImage: {
    height: undefined,
    aspectRatio: 1.6,
    marginVertical: 20,
  },
  text: {
    fontWeight: "bold",
    color: "#2E073F",
    textAlign: "center",
  },
};
