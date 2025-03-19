import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { 
  List, 
  Divider, 
  Avatar, 
  Appbar, 
  Dialog, 
  Portal, 
  Button 
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { useRouter } from "expo-router"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const SettingsScreen = () => {
  const { t } = useTranslation();
  const router = useRouter(); 
  const [visible, setVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const showLogoutDialog = () => setLogoutVisible(true);
  const hideLogoutDialog = () => setLogoutVisible(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    hideDialog();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken"); 
      router.replace("/(login)/Selecter"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="" />
        <View style={styles.titleContainer}>
          <Appbar.Content title="EC EDR" />
        </View>
        <Appbar.Action icon="account" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={showLogoutDialog} />  
      </Appbar.Header>


     
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <List.Section>
          <List.Subheader style={styles.subheader}>{t("General")}</List.Subheader>
          <List.Item
            title={t("Language")}
            description={i18n.language === "en" ? "English" : i18n.language === "si" ? "සිංහල" : "தமிழ்"}
            left={() => <Avatar.Icon size={40} icon="web" style={styles.icon} />}
            onPress={showDialog}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader style={styles.subheader}>{t("About")}</List.Subheader>
          <List.Item
            title={t("Help")}
            description="Get help on how to use the app"
            left={() => <Avatar.Icon size={40} icon="help-circle" style={styles.icon} />}
            onPress={() => router.push("/(cr)/details")} 
          />
          <List.Item
            title={t("Privacy Policy")}
            left={() => <Avatar.Icon size={40} icon="shield" style={styles.iconPurple} />}
            onPress={() => router.push("/privacy-policy")} 
          />
          <List.Item
            title={t("App Version")}
            description="1.0.1 (3)"
            left={() => <Avatar.Icon size={40} icon="information" style={styles.icon} />}
          />
        </List.Section>

        <Divider style={styles.divider} />

      
        
      </ScrollView>

     
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title style={styles.dialogTitle}>{t("Select Language")}</Dialog.Title>
          <Dialog.Content>
            <Button mode="contained" style={styles.languageButton} onPress={() => changeLanguage("en")}>English</Button>
            <Button mode="contained" style={styles.languageButton} onPress={() => changeLanguage("si")}>සිංහල</Button>
            <Button mode="contained" style={styles.languageButton} onPress={() => changeLanguage("ta")}>தமிழ்</Button>
          </Dialog.Content>
        </Dialog>
      </Portal>

      
      <Portal>
        <Dialog visible={logoutVisible} onDismiss={hideLogoutDialog}>
          <Dialog.Title style={styles.dialogTitle}>{t("Logout")}</Dialog.Title>
          <Dialog.Content>
            <Button mode="contained" style={styles.languageButton} onPress={handleLogout}>
              {t("Yes, Logout")}
            </Button>
            <Button mode="outlined" style={styles.languageButton} onPress={hideLogoutDialog}>
              {t("Cancel")}
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  appbar: {
    backgroundColor: "white",
  },
  appbarTitle: {
    color: "white",
    fontWeight: "bold",
  },
  subheader: {
    color: "#94098A",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    backgroundColor: "#94098A",
  },
  iconPurple: {
    backgroundColor: "#800080",
  },
  divider: {
    marginVertical: 10,
  },
  dialogTitle: {
   
    textAlign: "center",
    color:"#94098A"
  },
  languageButton: {
    marginVertical: 5,
    backgroundColor: "#63075D",
  },
  logoutContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "#800080",
    paddingHorizontal: 20,
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

export default SettingsScreen;
