import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,

  ImageBackground,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import BackgroundSvg from '../../assets/images/background.svg';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

  const handleLogin = async () => {
    if (!username || !password) {
      showToast("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://ecedr.elections.gov.lk/test/app_user/login/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message === "Login Successfully" && response.data.token) {
        const { token, user } = response.data;

       
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("user", JSON.stringify(user));

        // showToast("🎉 Login Successful! Redirecting...");
        setTimeout(() => {
          router.replace("/(user)/HomeScreen");
        }, 1000);
      } else {
        showToast(response.data.message || "Unexpected error.");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    Alert.alert("Notification", message);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.background}>
                            <BackgroundSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                          </View>
     
            <View>
            <Text style={styles.texts}>{t("Welcome Back! Glad to see you")}</Text>
            </View>
            
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
            
            <View style={styles.container}>
                      
                        <Image
                          source={require("../../assets/images/national.png")}
                          style={styles.logo}
                          resizeMode="contain"
                          
                        />
                        <Text style={styles.text}>EC-EDR</Text>
                        
                        <Image
                          source={require("../../assets/images/logo.png")}
                          style={styles.logo2}
                          resizeMode="contain"
                        />
                      </View>
            <Text style={styles.main}>{t("Login")}</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94098A" />
              <TextInput
                style={styles.input}
                placeholder={t("Username")}
                placeholderTextColor="gray" 
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94098A" />
              <TextInput
                style={styles.input}
                placeholder={t("Password")}
                placeholderTextColor="gray" 
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            {/* <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => router.push("/(login)/OTPVerification")}>
              <Text style={{ color: "#9B57B1" }}>Forgot password?</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: "#fff", fontSize: 16 }}>{t("Login")}</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/Register")}>
              <Text style={styles.new}>{t("Create New Account")}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
};const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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
  
  
  container: {
    justifyContent: "center",
    alignItems: "center",
    
   
    
  },
  logo: {
    width: width * 0.6, 
    height: width * 0.3, 
    marginTop:0, 
  },
  logo2: {
    width: width * 0.7, 
    height: width * 0.3, 
    marginTop:0, 
  },
  text: {
    fontSize: 25, 
    fontWeight: "bold",
    color: "#2E073F",
    marginBlockStart: 0,
  },
  texts: {
    fontSize: 16, 
    fontWeight: "bold",
    color: "#94098A",
    marginTop:20,
    marginLeft:15
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "90%",
    height: 50,
    shadowColor: "#94098A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  main:{ 
    fontSize: 18, 
    fontWeight: "bold",
     color: "#94098A", 
     marginBottom: 20,
  },
  new:{
       color: "#94098A", 
       marginTop: 10 ,
       fontWeight: "bold"
      },

  button:{
    backgroundColor: "#63075D",
    padding: 15,
    borderRadius: 25,
    width: "85%",
    alignItems: "center",
  }
  
});


export default Login;
