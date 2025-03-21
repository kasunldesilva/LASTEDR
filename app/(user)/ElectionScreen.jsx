import { useReducer, useEffect,useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar,BackHandler } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Appbar, Divider, Menu, Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import Complain from "../(cr)/Complain";
import Request from "../(cr)/Request";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
const screens = { HOME: "Home", COMPLAIN: "Complain", REQUEST: "Request" };

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SCREEN":
      return action.screen;
    default:
      return state;
  }
};


const ElectionScreen = () => {
  const [activeScreen, dispatch] = useReducer(reducer, screens.HOME);
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const { t } = useTranslation();
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.replace("/(login)/Selecter");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (activeScreen !== screens.HOME) {
        dispatch({ type: "SET_SCREEN", screen: screens.HOME });
        return true;
      }
      return false; 
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [activeScreen]);

  return (
    <PaperProvider theme={DefaultTheme}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="EC EDR" />
        <Appbar.Action icon="account" onPress={() => {}} />
        <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
          <Menu.Item onPress={() => router.push("/(cr)/details")} title= {t("Help")}  leadingIcon="help-circle" />
          <Menu.Item onPress={() => router.push("/(cr)/about")} title={t("About")} leadingIcon="information" />
          <Divider />
          <Menu.Item onPress={handleLogout} title={t("Logout")} leadingIcon="logout" />
        </Menu>
      </Appbar.Header>

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        {activeScreen === screens.HOME && (
          <>
            <Text style={styles.title}>Local Authorities Election - 2025</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonWrapper} onPress={() => dispatch({ type: "SET_SCREEN", screen: screens.COMPLAIN })}>
                <LinearGradient colors={["#662483", "#c8057f"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                  <Icon name="add-circle-outline" size={20} color="white" />
                  <Text style={styles.gradientButtonText}>{t("Complain")}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonWrapper} onPress={() => dispatch({ type: "SET_SCREEN", screen: screens.REQUEST })}>
                <LinearGradient colors={["#662483", "#c8057f"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                  <Icon name="add-circle-outline" size={20} color="white" />
                  <Text style={styles.gradientButtonText}>{t("Request")}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.description}>
             {t("Choose whether you want to file a complain or make a request to ensure your concerns are handled appropriately. Selecting the correct option helps us address your issue more effectively and provide a timely resolution. \nLet us know how we can help!")}
            </Text>
          </>
        )}

        {activeScreen === screens.COMPLAIN && <Complain setActiveScreen={(screen) => dispatch({ type: "SET_SCREEN", screen })} />}
        {activeScreen === screens.REQUEST && <Request setActiveScreen={(screen) => dispatch({ type: "SET_SCREEN", screen })} />}
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: 10 },
  title: { fontSize: 18, color: "#94098A", marginBottom: 25, paddingLeft: 20 },
  buttonContainer: { width: "100%", alignItems: "center", marginBottom: 50 },
  buttonWrapper: { width: "90%", marginVertical: 10 },
  gradientButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 80, borderRadius: 10, paddingHorizontal: 10 },
  gradientButtonText: { color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  description: { fontSize: 14, color: "#94098A", textAlign: "center", paddingHorizontal: 20, lineHeight: 20 },
  appBar: { backgroundColor: "white" },
});

export default ElectionScreen;
