import React, { useState, useEffect } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
Platform
 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import * as ImagePicker from "expo-image-picker";
import {
  Appbar,
  TextInput as PaperTextInput,
  Button,
  Divider, 
  Menu 
} from "react-native-paper";

import DateTimePicker from '@react-native-community/datetimepicker';

import ModalSelector from "react-native-modal-selector";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import mime from "mime";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
const { width, height } = Dimensions.get("window");

const ComplaintScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [token, setToken] = useState(null);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaintID, setComplaintID] = useState(null);
  const [request, setRequest] = useState(null);
  const [file, setFile] = useState(null);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken"); 
      router.replace("/(login)/Selecter"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [formDatas, setFormDatas] = useState({ district: "" });

  const [menuVisible, setMenuVisible] = useState(false);

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
  const [formData, setFormData] = useState({
    location: "",
    village: "",
    district: "",
    title: "",
    description: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      if (!storedToken) {
        Alert.alert("Error", "No authentication token found. Please log in.");
        router.push("/(login)/Login");
      } else {
        setToken(storedToken);
      }
    };
    fetchToken();
  }, []);

  const sriLankaDistricts = [
    { label: t("Colombo"), value: "1" },
    { label: t("Gampaha"), value: "2" },
    { label: t("Kaluthara"), value: "3" },
    { label: t("Kandy"), value: "4" },
    { label: t("Matale"), value: "5" },
    { label: t("Nuwara Eliya"), value: "6" },
    { label: t("Galle"), value: "7" },
    { label: t("Matara"), value: "8" },
    { label: t("Hambanthota"), value: "9" },
    { label: t("Jaffna"), value: "10" },
    { label: t("Kilinochchi"), value: "11" },
    { label: t("Mannar"), value: "12" },
    { label: t("Vavuniya"), value: "13" },
    { label: t("Mulathivu"), value: "14" },
    { label: t("Baticoloa"), value: "15" },
    { label: t("Ampara"), value: "16" },
    { label: t("Trincomalee"), value: "17" },
    { label: t("Kurunegala"), value: "18" },
    { label: t("Puththalama"), value: "19" },
    { label: t("Anuradhapura"), value: "20" },
    { label: t("Polonnaruwa"), value: "21" },
    { label: t("Badulla"), value: "22" },
    { label: t("Monaragala"), value: "23" },
    { label: t("Rathnapura"), value: "24" },
    { label: t("Kegalle"), value: "25" },
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setFormData((prev) => ({
        ...prev,
        date: selectedDate.toISOString().split("T")[0], 
      }));
    }
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      setFormData((prev) => ({
        ...prev,
        time: selectedTime.toLocaleTimeString("en-GB", { hour12: false }),
      }));
    }
  };
  
  const handleLocationSelection = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const formattedLocation = `Lat: ${location.coords.latitude}, Lng: ${location.coords.longitude}`;

      setFormData((prev) => ({ ...prev, location: formattedLocation }));
    } catch (error) {
      // console.error("Error fetching location:", error);
      // Alert.alert("Error", "Failed to get location.");
    }
  };

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],  
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } 
    );
    return result.uri;
  };
  
  const uploadMultipleFiles = async () => {
    if (!images.length) {
      Alert.alert("No Files", "Please select at least one file to upload.");
      return;
    }
  
    const data = new FormData();
  
    for (let i = 0; i < images.length; i++) {
      const compressedUri = await compressImage(images[i]); 
      const fileType = compressedUri.split(".").pop();
  
      data.append("EDRApp", {
        uri: compressedUri,
        name: `image_${Date.now()}_${i}.${fileType}`,
        type: `image/${fileType}`,
      });
    }
  
    try {
      const response = await fetch("https://ecedr.elections.gov.lk/test/app_upload/multifile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: data,
      });
  
      const textResponse = await response.text();
      console.log("Full Response:", textResponse);
  
      try {
        const result = JSON.parse(textResponse);
        console.log("Upload Response:", result);
  
        if (response.ok && result.uploadedFiles) {
          setStep(2);
          return result.uploadedFiles.map((file) => file.filePath);
        } else {
          throw new Error("File upload failed");
        }
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        Alert.alert("Error", "Unexpected response format. Please check server response.");
      }
    } catch (error) {
      console.error("Multi Upload Error:", error);
      Alert.alert("Error", "File upload failed.");
    }
  };
  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Error", "No valid authentication token. Please log in.");
      router.push("/(login)/Login");
      return;
    }
  
    if (!formData.village.trim()) {
      Alert.alert("Validation Error", "Please enter the village.");
      return;
    }
  
    if (!formData.district) {
      Alert.alert("Validation Error", "Please select a district.");
      return;
    }
  
    try {
      let uploadedFilePaths = [];
  
      if (images.length > 0) {
        const uploadedFiles = await uploadMultipleFiles();
        if (!uploadedFiles) {
          Alert.alert("Error", "File upload failed.");
          return;
        }
        uploadedFilePaths = uploadedFiles;
      }
  
      const requestBody = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        item_type: "COMPLAIN",
        incident_date: formData.date,
        incident_time: formData.time,
        district: formData.district,
        village: formData.village.trim(),
        location: formData.location.trim(),
        file_path: uploadedFilePaths.length > 0 ? uploadedFilePaths.join(",") : null,
      };
  
      const response = await fetch(
        "https://ecedr.elections.gov.lk/test/app_edritem",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      const responseJson = await response.json();
      console.log("Server Response:", response.status, responseJson);
  
      if (response.status === 403) {
        Alert.alert("Session Expired", "Please log in again.");
        await SecureStore.deleteItemAsync("token");
        router.push("/(login)/Login");
      } else if (response.status === 400) {
        Alert.alert("Bad Request", responseJson.message || "Check the input values and try again.");
      } else if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      } else {
        if (responseJson.status && responseJson.data?.id) {
          setComplaintID(responseJson.data.id); 
          setSuccess(true);
          console.log("Success state updated!");
        } else {
          Alert.alert("Error", "Unexpected response format. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Submission failed.");
    }
  };
  
  
  useEffect(() => {
    console.log("Success State Changed:", success);
    console.log("Complaint ID Updated:", complaintID);
  }, [success, complaintID]);
  
  

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, 
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selectedImages]);
    }
  };
  
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required to take photos.");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]); 
    }
  };
  
  const openImagePicker = () => {
    Alert.alert("Select Image", "Choose an option", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickImages },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
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
                              onPress={() => {}}  
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {step === 1 ? (
            <View style={styles.uploadContain}>
              <Text style={styles.title}>
                {t("Local Authorities Election")}- 2025
              </Text>
              <Text style={styles.headern}>{t("Add Complaint")}</Text>

              <View style={styles.uploadCont}>
                <TouchableOpacity
                  onPress={openImagePicker}
                  style={styles.uploadButton}
                >
                  <Image
                    source={require("../../assets/images/camara.png")}
                    style={styles.cameraIcon}
                  />
                  <Text style={styles.uploadText}>
                    {t("Choose Photos or Videos")}
                  </Text>
                </TouchableOpacity>

                <FlatList
                  data={images}
                  horizontal
                  renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.imagePreview} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />

                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={uploadMultipleFiles}
                >
                  <Text style={styles.uploadBtnText}>{t("Upload")}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep(2)}>
                  <Text style={styles.skipText}>{t("Skip")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.titles}>
                {t("Local Authority Election")}- 2025
              </Text>
              <Text style={styles.headern}>{t("Complaint Details")}</Text>

              <View style={styles.formContain}>
                <PaperTextInput
                  mode="outlined"
                  label={t("Complaint Location")}
                  right={
                    <PaperTextInput.Icon
                      icon="map-marker"
                      onPress={handleLocationSelection}
                    />
                  }
                  value={formData.location}
                  style={styles.input}
                />

                <PaperTextInput
                  mode="outlined"
                  label={t("Village of the incident")}
                  onChangeText={(text) =>
                    setFormData({ ...formData, village: text })
                  }
                  style={styles.input}
                />

                <View style={styles.container1}>
                  <Text style={styles.label}>{t("District")}</Text>
                  <View style={styles.inputs}>
                  <ModalSelector
                      data={sriLankaDistricts}
                      keyExtractor={(item) => String(item.value)}
                      labelExtractor={(item) => item.label}
                      initValue={formData.district 
                        ? sriLankaDistricts.find(d => d.value === formData.district)?.label 
                        : t("Select District")
                      }
                      onChange={(option) => 
                        setFormData(prevState => ({ ...prevState, district: option.value }))
                      }
                      style={styles.selector}
                      selectStyle={styles.selectStyle}
                      selectTextStyle={styles.selectTextStyle}
                      optionContainerStyle={styles.optionContainerStyle}
                      optionTextStyle={styles.optionTextStyle}
                      cancelStyle={styles.cancelStyle}
                      cancelTextStyle={styles.cancelTextStyle}
                    />


                  </View>
                </View>

                <PaperTextInput
                  mode="outlined"
                  label={t("Title")}
                  onChangeText={(text) =>
                    setFormData({ ...formData, title: text })
                  }
                  style={styles.input}
                  
                />

                <PaperTextInput
                  mode="outlined"
                  label={t("Description")}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  multiline
                  style={styles.textArea}
                />

                <PaperTextInput
                    mode="outlined"
                    label={t("Date of the incident")}
                    right={<PaperTextInput.Icon icon="calendar" />}
                    value={formData.date}
                    onFocus={() => setShowDatePicker(true)}
                    style={styles.input}
                  />
                  {showDatePicker && (
                    <View style={styles.datePickerWrapper}>
                    <View style={styles.datePickerContainer}>
                      <DateTimePicker
                        mode="date"
                        value={formData.date ? new Date(formData.date) : new Date()}
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={handleDateChange}
                      />
                    </View>
                  </View>
                  )}

                  {/* Time Picker Input */}
                  <PaperTextInput
                    mode="outlined"
                    label={t("Time of the incident")}
                    right={<PaperTextInput.Icon icon="clock-outline" />}
                    value={formData.time}
                    onFocus={() => setShowTimePicker(true)}
                    style={styles.input}
                  />
                  {showTimePicker && (
                    <View style={[styles.datePickerWrapper]}>
                      <View style={styles.datePickerContainer}>
                          <DateTimePicker
                            mode="time"
                            value={selectedTime}
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={handleTimeChange}
                          />
                        </View>
                        </View>
                  )}
                <TouchableOpacity
                style={styles.submit}
                  onPress={handleSubmit}
                >
                  <Text style={styles.uploadBtnText}>{t("Submit")}</Text>
                </TouchableOpacity>


                
              </View>
            </View>
          )}
        </ScrollView>

        {success && complaintID ? (
            <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-done-circle-outline" size={60} color="#94098A" />
              </View>
              <Text style={styles.modalTitle}>{t("Thank you for your submission!")}</Text>
              <Text style={styles.modalText}>
                {t("Your reference number is ")}{"\n"}
                <Text style={styles.modalTexts}>EDRAPPPLAE{complaintID}</Text>
              </Text>
              <Text style={styles.modalText}>{t("Kindly keep it safe for future use.")}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.agreeButton}
                  onPress={() => {
                    setSuccess(false);
                    setFormData({
                      location: "",
                      village: "",
                      district: "",
                      title: "",
                      description: "",
                      date: "",
                      time: "",
                    });
                    setFile(null);
                    router.replace("/(user)/HomeScreen");
                  }}
                >
                  <Text style={styles.agreeButtonText}>{t("Ok")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          ) : null}
          </PaperProvider>

    </View>
  );
};




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  uploadContain: { flex: 1, paddingBottom: 100 },
  uploadCont: { flex: 1, padding: 10, paddingTop: 30, alignItems: "center" },
  formContain: { flex: 1, padding: 0 },
  formContainer: { flex: 1, padding: 20 },
  headern: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#800080",
    marginBottom: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    
    color: "#800080",
    marginBottom: 25,
    paddingLeft:20
  },
  titles: {
    fontSize: 18,
    
    color: "#800080",
    marginBottom: 25,
   
  },
  uploadButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#800080",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: { width: 60, height: 60, tintColor: "#1a1717" },
  uploadText: { color: "#a3158a", marginTop: 0, fontWeight: "bold" },
  imagePreview: { width: 80, height: 80, margin: 5, borderRadius: 10 },
  uploadBtn: {
    backgroundColor: "#a3158a",
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 5,
    marginTop: 0,
  },
  uploadBtnText: { color: "white", fontWeight: "bold" },
  skipText: {
    textAlign: "center",
    color: "#a3158a",
    marginTop: 10,
    fontWeight: "bold",
  },
  
  textArea: { height: 100, marginBottom: 10 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    width: width * 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  successIcon: { width: 80, height: 80, marginBottom: 20 },
  successHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9B57B1",
    marginBottom: 10,
  },
  successMessage: { fontSize: 16, color: "#333", marginBottom: 10 },
  submit: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#9B57B1",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
    backgroundColor: "#FCE4FF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    textAlign: "center",  
  },
  iconContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#94098A",
    marginBottom: 10,
    textAlign: "center", 
  },
  modalText: {
    fontSize: 16,
    color: '#94098A',
    textAlign: "center",
    marginBottom: 20,
  },
  modalTexts: {
    fontSize: 18,
    color: '#63075D',
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  agreeButton: {
    backgroundColor: "#94098A",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  agreeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  appBar: {
    backgroundColor: 'white',
  },
  titleContainer: {
    position: 'absolute', 
    left: 16, 
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "white",
    marginBottom:10
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", 
    
  },
  label: {
    fontSize: 16,
    
    marginBottom: 2,
    color: "black",
  },
  inputs: {
    width: "100%",
  },
  selector: {
    width: "100%",
    paddingVertical: 10,
  },
  selectStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  selectTextStyle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  optionContainerStyle: {
  
    backgroundColor: "#FCE4FF",    
    borderRadius: 10,          
    padding: 10,
    marginTop:20
  },
  optionTextStyle: {
    textAlign: "center",      
    fontSize: 16,               
    color: "#333",            
  },
  cancelStyle: {
    backgroundColor: "#94098A",
    borderRadius: 5,
    padding: 10,
  },
  cancelTextStyle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },datePickerWrapper: {
    position: "absolute",
    top: "40%",
    left: "40%",
    transform: [{ translateX: -140 }, { translateY: -140 }],
    zIndex: 8,
  },
  datePickerContainer: {
    backgroundColor: "#bd20b1",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
});

export default ComplaintScreen;
