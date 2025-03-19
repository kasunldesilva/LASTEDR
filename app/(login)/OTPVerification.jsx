import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  ImageBackground,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from "expo-router";
import BackgroundSvg from '../../assets/images/background.svg';


const { width, height } = Dimensions.get("window");

export default function OTPVerification() {
  const { mobile } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [counter, setCounter] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const otpInputs = useRef([]);
  const { t } = useTranslation();
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    let timer = null;

    if (counter > 0) {
      timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [counter]);

  const handleOtpChange = (text, index) => {
    if (!/^\d?$/.test(text)) return;

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = text;
      return newOtp;
    });

    if (text && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerification = async () => {
    const otpCode = otp.join("").trim();

    console.log("Mobile received:", mobile);
    console.log("OTP entered:", otpCode);

    if (!otpCode || otpCode.length !== 6) {
      Alert.alert(t("Invalid OTP"));
      return;
    }

    setLoading(true);

    try {
      const API_URL = "https://ecedr.elections.gov.lk/test/app_user/otp";

      console.log("Sending OTP verification request:", {
        mobile: mobile,
        otp: otpCode,
      });

      const response = await axios.post(
        API_URL,
        { mobile, otp: otpCode },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message?.toLowerCase().includes("otp successfully")) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(response.data.message || t("Invalid OTP"));
      }
    } catch (error) {
      console.error("OTP Verification Error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setCounter(60); 

      const API_URL = "https://ecedr.elections.gov.lk/test/app_user/reotp";
      console.log("Resending OTP for mobile:", mobile);

      const response = await axios.post(
        API_URL,
        { mobile },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message?.toLowerCase().includes("otp sent")) {
       
      } else {
        Alert.alert("Error", response.data.message || t("Invalid OTP."));
      }
    } catch (error) {
      console.error("Resend OTP Error:", error.response?.data || error.message);
      // Alert.alert("Error", error.response?.data?.message || "An error occurred while resending OTP.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
                                  <BackgroundSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                                </View>
       <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            
            <Text style={styles.headerText}>{t("Continue Registration")}...</Text>

          
            <Text style={styles.header}>{t("Verify")}</Text>

            
            <View style={styles.subTextContainer}>
              <Text style={styles.subText}>
                {t("An SMS has been sent. Please check your mobile and complete the OTP")}
              </Text>
            </View>

            
            <View style={styles.timerResendContainer}>
              {isResendDisabled ? (
                <Text style={styles.timerText}>
                  {t("Resend OTP in")} {counter}s
                </Text>
              ) : (
                
                  
                  
                  <TouchableOpacity onPress={handleResendOtp} style={styles.resendButton}>
                    <Text style={styles.resendButtonText}>{t("Didn't receive the code…? Resend Code")}</Text>
                  </TouchableOpacity>
            
              
              )}
            </View>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                />
              ))}
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Verify Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleOtpVerification}
              disabled={loading}
            >
              <Text style={styles.buttonText}> {t("Verify")}</Text>
            </TouchableOpacity>

            {/* Logo */}
            <Image
              source={require("../../assets/images/splash image.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Success Modal */}
          {showSuccessModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="checkmark-done-circle-outline"
                    size={60}
                    color="#94098A"
                  />
                </View>

                <Text style={styles.modalTitle}>{t("Congratulations !")}</Text>

                <Text style={styles.modalText}>
                  {t("Registered successfully. You’ll be redirected to the login screen now")}
                </Text>

                <TouchableOpacity
                  style={styles.agreeButton}
                  onPress={() => {
                    setShowSuccessModal(false);
                    router.push("/Login");
                  }}
                >
                  <Text style={styles.agreeButtonText}>{t("Login")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
     
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },

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
    width: "100%",  
    height: "100%",
  },

  headerText: {
    fontSize: 16,
    color: "#94098A",
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 0,
    paddingTop:10,
    marginBottom: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#63075D",
    textAlign: "center",
    marginBottom: 50,
  },

  subTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  subText: {
    fontSize: 16,
    color: '#94098A',
    textAlign: 'center',
  },

  timerResendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  timerText: {
    fontSize: 14,
    color: '#94098A',
    fontWeight: 'bold',
  },

  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  resendButtonText: {
    color: '#94098A',
    fontWeight: 'bold',
    fontSize: 16,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    borderColor: '#94098A',
    color: '#000',
  },

  button: {
    backgroundColor: "#63075D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  logo: {
    width: width * 0.7,
    height: width * 0.4,
    marginVertical: 10,
    marginTop: 30,
    alignSelf: "center",
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 50,
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#94098A",
    marginBottom: 10,
  },

  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },

  agreeButton: {
    backgroundColor: "#94098A",
    paddingVertical: 12,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },

  agreeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  timerResendContainer: {
    flexDirection: 'column',   
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  
});
