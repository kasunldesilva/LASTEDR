import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next"; 
import {
  View,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import i18n from "../../i18n";
import BackgroundSvg from '../../assets/images/background.svg';



const { width, height } = Dimensions.get("window");

const Selecter = () => {
  const { t } = useTranslation(); 
  const router = useRouter();

 
  useEffect(() => {
    console.log("Current Language on mount:", i18n.language); 
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
                <BackgroundSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
              </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
          <View style={styles.container}>
            <Image
              source={require("../../assets/images/national.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>EC-EDR</Text>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logoSmall}
              resizeMode="contain"
            />

           
            <Text style={styles.languagePrompt}> Language</Text>
            <Text style={styles.selectlanguage}> Select the language to get started</Text>
            
            

            
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                i18n.changeLanguage("en");
                router.push("/(login)/Home");
              }}
            >
              <Text style={styles.buttonText}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                i18n.changeLanguage("si");
                router.push("/(login)/Home");
              }}
            >
              <Text style={styles.buttonText}>සිංහල</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                i18n.changeLanguage("ta");
                router.push("/(login)/Home");
              }}
            >
              <Text style={styles.buttonText}>தமிழ்</Text>
            </TouchableOpacity>
          </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "whirte",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,  
    right: 0,
    bottom: 0,
    width: width,  
    height: height,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: width * 0.4,
    height: height * 0.2,
    marginTop: 40,
  },
  headerText: {
    fontSize: 25, 
    fontWeight: "bold",
    color: "#2E073F",
    marginBlockStart: 0,
  },
  languagePrompt: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems:"center",
    color: "#94098A",
    marginLeft: -10,
    paddingBottom:0,
  },
  selectlanguage:{
    fontSize: 16,
   
    alignItems:"center",
    color: "#94098A",
    marginLeft: -10,
    paddingBottom:5,
  },
  languageSubPrompt: {
    fontSize: 15,
    color: "#94098A",
    marginLeft: -70,
    marginBottom: 30,
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#63075D",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoSmall: {
    width: width * 0.7,
    height: width * 0.4,
    marginBottom: -10,
    marginTop: -30,
  },
});

export default Selecter;
