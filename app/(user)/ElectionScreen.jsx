import  { useState,useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Appbar } from "react-native-paper";
import Complain from "../(cr)/Complain";
import Request from "../(cr)/Request";
import { LinearGradient } from "expo-linear-gradient"; 
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
const ElectionScreen = () => {
  const [activeScreen, setActiveScreen] = useState("Home");
  const { t } = useTranslation();
  const handleBack = () => {
    if (activeScreen !== "Home") {
      
      setActiveScreen("Home");
      return true; 
    }
    return false; 
  };
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
      text: "black",
      placeholder: "gray",
    },
  };
  

  useEffect(() => {
    const backAction = () => {
      if (activeScreen !== "Home") {
        setActiveScreen("Home");
        return true; 
      }
      return false; 
    };

    
    BackHandler.addEventListener("hardwareBackPress", backAction);

    
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [activeScreen]);
  if (activeScreen === "complain") return <Complain />;
  if (activeScreen === "request") return <Request />;

  return (
    <>
     <PaperProvider theme={theme}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="" />
        <View style={styles.titleContainer}>
          <Appbar.Content title="EC EDR" />
        </View>
        <Appbar.Action icon="account" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />
          <Text style={styles.title}>{t("Local Authorities Election")} - 2025</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={() => setActiveScreen("complain")}
            >
              <LinearGradient
                colors={["#662483", "#c8057f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Icon name="add-circle-outline" size={20} color="white" />
                <Text style={styles.gradientButtonText}>{t("Complain")}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={() => setActiveScreen("request")}
            >
              <LinearGradient
                colors={["#662483", "#c8057f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Icon name="add-circle-outline" size={20} color="white" />
                <Text style={styles.gradientButtonText}>{t("Request")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            {t(
              "Choose whether you want to file a complain or make a request to ensure your concerns are handled appropriately. Selecting the correct option helps us address your issue more effectively and provide a timely resolution. \nLet us know how we can help!"
            )}
          </Text>
        </SafeAreaView>
        </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10
  },
  title: {
    fontSize: 18,
    
    color: "#94098A",
    marginBottom: 25,
    paddingLeft:20
    
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 50
  },
  buttonWrapper: {
    width: "90%",
    marginVertical: 10
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 10
  },
  gradientButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10
  },
  description: {
    fontSize: 14,
    color: "#94098A",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20
  },
  appBar: {
    backgroundColor: 'white',
  },
  titleContainer: {
    position: 'absolute', 
    left: 16,
    justifyContent: 'center',
  },
});

export default ElectionScreen;
