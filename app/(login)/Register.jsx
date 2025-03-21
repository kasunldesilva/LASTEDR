import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  TextInput,
  Dimensions,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Device from "expo-device";
import BackgroundSvg from '../../assets/images/background.svg';

const { width, height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    username: "",
    mobile: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 


  // Get Device ID
  useEffect(() => {
    async function fetchDeviceId() {
      const id = Device.modelId || Device.osBuildId || "Unknown";
      setDeviceId(id);
    }
    fetchDeviceId();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };


  const isValidPassword = (password) => {
    if (!password) return false; 
    return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password);
  };
  


  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!isValidPassword(form.password)) {
      setErrorMessage(
        `${t("checkpassword.step1")} ${t("checkpassword.step2")} ${t("checkpassword.step3")}`
      );
      
      setLoading(false);
      return;
    }
    

    if (form.password !== form.confirmPassword) {
      setErrorMessage(t("Passwords do not match."));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://ecedr.elections.gov.lk/test/app_user/",
        {
          username: form.username,
          nic: form.nic,
          mobile: form.mobile,
          password: form.password,
          confirm_password: form.confirmPassword,
          device_id: deviceId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      router.push({
        pathname: "/OTPVerification",
        params: { mobile: form.mobile },
      });

    } catch (error) {
      setLoading(false);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Registration failed.");
      } else {
        setErrorMessage("An error occurred, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
                                  <BackgroundSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                                </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
          <View style={styles.container}>
          
            <Text style={styles.headerText}>{t("Hello! Register to get started…")}</Text>

          
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/national.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>EC-EDR</Text>

           
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.smallLogo}
              resizeMode="contain"
            />

          
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94098A" />
              <TextInput
                placeholder={t("Username")}
                placeholderTextColor="gray" 
                style={styles.input}
                onChangeText={(text) => setForm({ ...form, username: text })}
              />
              
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={20} color="#94098A" />
              <TextInput
                placeholder={t("NIC")}
                placeholderTextColor="gray" 
                style={styles.input}
                onChangeText={(text) => setForm({ ...form, nic: text })}
              />
              
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#94098A" />
              <TextInput
                placeholder={t("Mobile Number")}
                placeholderTextColor="gray" 
                style={styles.input}
                keyboardType="phone-pad"
                onChangeText={(text) => setForm({ ...form, mobile: text })}
              />
              
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94098A" />
              <TextInput
                placeholder={t("Password")}
                placeholderTextColor="gray" 
                style={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={(text) => setForm({ ...form, password: text })}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#888"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94098A" />
              <TextInput
                placeholder={t("Confirm Password")}
                placeholderTextColor="gray" 
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

           
            <TouchableOpacity
                style={styles.button}
                onPress={() => setShowConsentModal(true)}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? t("Registering...") : t("Register")}
                </Text>
              </TouchableOpacity>

           
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.signInText}>{t("Have an Account! Login")}</Text>
            </TouchableOpacity>
          </View>
        
      </ScrollView>
        {showConsentModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-done-circle-outline" size={60} color="#94098A" />
              </View>

              <Text style={styles.modalTitle}>{t("Consent Statement")}</Text>

              <Text style={styles.modalText}>
               {t(" Do you agree to share this information, including your identity, with third parties?")}
              </Text>

              <TouchableOpacity
                style={styles.agreeButton}
                onPress={() => {
                  setShowConsentModal(false);
                  handleRegister();
                }}
              >
                <Text style={styles.agreeButtonText}>{t("Agree")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.disagreeButton}
                onPress={() => {
                  setShowConsentModal(false);
                  handleRegister();
                  // alert("You must agree to proceed.");
                }}
              >
                <Text style={styles.disagreeButtonText}>{t("Disagree")}</Text>
              </TouchableOpacity>
            </View>
          </View>
         )}

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 20,
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
    width: "85%",
    alignItems: "center",
    
  },
  headerText: {
    fontSize: 16,
    color: "#94098A",
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: -10,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    marginTop: 10,
    width: width * 0.5,
    height: width * 0.3,
    marginBottom: -10,
  },
  smallLogo: {
    width: width * 0.6,
    height: width * 0.31,
    marginBottom: -10,
    marginTop: -30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E073F",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 6,
    width: "100%",
    height: 45,
    shadowColor: "#80080",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
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
  button: {
    backgroundColor: "#63075D",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
    marginTop:10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  signInText: {
    fontSize: 14,
    color: "#94098A",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: height,
    width: width,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  
  modalContainer: {
    width: "85%",
    backgroundColor: "#f9edfa",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  
  iconContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 50,
    marginBottom: 10,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#94098A",
    marginBottom: 10,
  },
  
  modalText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    color: "#94098A",
    
  },
  
  agreeButton: {
    backgroundColor: "#94098A",
    paddingVertical: 12,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  
  agreeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
     backgroundColor: "#94098A",
  },
  
  disagreeButton: {
    backgroundColor: "#94098A",
    
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  
  disagreeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  
});
