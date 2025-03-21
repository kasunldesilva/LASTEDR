import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { 
  List, 
  Divider, 
  Avatar, 
  Appbar, 
  Dialog, 
  Portal, 
  Button, 
  Menu 
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { useRouter } from "expo-router"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

const SettingsScreen = () => {
  const { t } = useTranslation();
  const router = useRouter(); 
  const [visible, setVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const showLogoutDialog = () => setLogoutVisible(true);
  const hideLogoutDialog = () => setLogoutVisible(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
      text: "black",
      placeholder: "gray",
    },
  };
  
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
    <PaperProvider theme={theme}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="" />
        <View style={styles.titleContainer}>
          <Appbar.Content title="EC EDR" />
        </View>
        <Appbar.Action icon="account" onPress={() => {}} />
        
      
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
        >
          <Menu.Item 
            onPress={() => router.push("/(cr)/details")}
            title={t("Help")} 
            leadingIcon="help-circle"
          />
          <Menu.Item 
            onPress={() => router.push("/(cr)/about")}
            title={t("About")} 
            leadingIcon="information"
          />
          <Divider />
          <Menu.Item 
            onPress={handleLogout}
            title={t("Logout")} 
            leadingIcon="logout"
          />
        </Menu>
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
            description={t("Get help on how to use the app")}
            left={() => <Avatar.Icon size={40} icon="help-circle" style={styles.icon} />}
            onPress={() => router.push("/(cr)/details")} 
          />
          <List.Item
            title={t("Privacy Policy")}
            left={() => <Avatar.Icon size={40} icon="shield" style={styles.iconPurple} />}
          />
          <List.Item
            title={t("App Version")}
            description="1.0.1 (3)"
            left={() => <Avatar.Icon size={40} icon="information" style={styles.icon} />}
          />
        </List.Section>

        <Divider style={styles.divider} />
      </ScrollView>

      {/* Language Selection Dialog */}
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

     
    </PaperProvider>
  );
};

const styles = StyleSheet.create({   
  scrollContainer: {
    paddingBottom: 20,
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
