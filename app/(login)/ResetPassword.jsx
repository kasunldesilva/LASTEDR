// import React, { useState } from "react";
// import {
//   View,
//   ImageBackground,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Image,
//   Text,
//   Dimensions,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // For icons

// const { width, height } = Dimensions.get("window");

// export default function ResetPassword() {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false); // To show success overlay

//   const handleSubmit = () => {
//     setError(""); // Clear previous errors

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters.");
//     } else if (password !== confirmPassword) {
//       setError("Passwords do not match. Please try again.");
//     } else {
//       setSuccess(true); // Show success overlay
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <ImageBackground
//           source={require("../../assets/images/background.png")}
//           style={styles.background}
//           resizeMode="cover"
//         >
//           <View style={styles.container}>
//             {/* Header */}
//             <Text style={styles.headerText}>Create a new password...</Text>

//             {/* National Logo */}
//             <Image
//               source={require("../../assets/images/national.png")}
//               style={styles.logo}
//               resizeMode="contain"
//             />

//             <Text style={styles.text}>EC-EDR</Text>

//             {/* Subtitle */}
//             <Image
//               source={require("../../assets/images/logo.png")}
//               style={styles.logoSmall}
//               resizeMode="contain"
//             />

//             {/* Password Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 placeholderTextColor="#aaa"
//                 secureTextEntry={!showPassword}
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.iconContainer}
//               >
//                 <Ionicons
//                   name={showPassword ? "eye" : "eye-off"}
//                   size={20}
//                   color="#888"
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Confirm Password Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm Password"
//                 placeholderTextColor="#aaa"
//                 secureTextEntry={!showConfirmPassword}
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                 style={styles.iconContainer}
//               >
//                 <Ionicons
//                   name={showConfirmPassword ? "eye" : "eye-off"}
//                   size={20}
//                   color="#888"
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Error Message */}
//             {error ? <Text style={styles.errorText}>{error}</Text> : null}

//             {/* Submit Button */}
//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//               <Text style={styles.buttonText}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </ImageBackground>
//       </ScrollView>

//       {/* Success Overlay */}
//       {success && (
//         <View style={styles.overlay}>
//           <View style={styles.successContainer}>
//             <Image
//               source={require("../../assets/images/react-logo.png")}
//               style={styles.successIcon}
//               resizeMode="contain"
//             />
//             <Text style={styles.successHeader}>Congratulations!</Text>
//             <Text style={styles.successMessage}>
//               Password Reset successful.{"\n"}You'll be redirected to the{" "}
//               login screen now.
//             </Text>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   background: {
//     width: width,
//     height: height,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: "90%",
//     marginTop: 50,
//   },
//   headerText: {
//     fontSize: 18,
//     color: "#9B57B1",
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     marginBottom: 10,
//   },
//   logoSmall: {
//     width: width * 0.7,
//     height: width * 0.4,
//     marginBottom: -10,
//     marginTop: -30,
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2E073F",
//     marginBottom: 5,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     height: 50,
//     backgroundColor: "#fff",
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: "#333",
//   },
//   iconContainer: {
//     marginLeft: 10,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 14,
//     marginTop: 10,
//   },
//   button: {
//     width: "100%",
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#9B57B1",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   successContainer: {
//     width: width * 0.8,
//     backgroundColor: "rgba(255, 255, 255, 0.9)", // White background with opacity
//     padding: 20,
//     borderRadius: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 10,
//   },
//   successIcon: {
//     width: 80,
//     height: 80,
//     marginBottom: 20,
//   },
//   successHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#9B57B1",
//     marginBottom: 10,
//   },
//   successMessage: {
//     fontSize: 16,
//     color: "#333",
//     textAlign: "center",
//   },
// });
