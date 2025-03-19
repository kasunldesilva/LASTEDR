import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet ,ScrollView,Dimensions,Platform
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Appbar } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import Ionicons from '@expo/vector-icons/Ionicons';
import Modal from "react-native-modal";





const { width, height } = Dimensions.get("window");

const Request = () => {
  const router = useRouter();
  const [request, setRequest] = useState({
    title: "",
    description: "",
    incident_date: "",
  });
  const { t } = useTranslation();

  const handleBack = () => {
    router.back();
  };

  const [file, setFile] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [token, setToken] = useState(null);
  const [success, setSuccess] = useState(false);
  const [complaintID, setComplaintID] = useState(null);
  
const [tempDate, setTempDate] = useState(new Date());


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
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setRequest({
        ...request,
        incident_date: selectedDate.toISOString().split("T")[0],
      });
    }
  };

  const uploadFile = async (fileUri) => {
    if (!fileUri || !token) {
      Alert.alert("Error", "Missing file or authentication token.");
      return null;
    }

  
    const formData = new FormData();
    formData.append("EDRApp", {
      uri: fileUri,
      name: `upload_${Date.now()}.jpg`,
      type: "image/jpeg",
    });
  
    try {
      const response = await fetch("https://ecedr.elections.gov.lk/test/app_upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const result = await response.json();
      console.log("File Upload Response:", result);
  
      if (response.ok) {
        console.log("File uploaded at:", result.filePath); 
        return result.filePath;
      } else {
        throw new Error(result.message || "File upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", error.message || "File upload failed.");
      return null;
    }
  };
  
  

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Error", "No valid authentication token. Please log in.");
      router.push("/(login)/Login");
      return;
    }
  
    try {
      let uploadedFilePath = null;
      if (file) {
        uploadedFilePath = await uploadFile(file);
        console.log("Uploaded file path:", uploadedFilePath); 
        if (!uploadedFilePath) {
          Alert.alert("Error", "File upload failed.");
          return;
        }
      }
  
      const requestBody = {
        title: request.title.trim(),
        description: request.description.trim(),
        item_type: "REQUEST",
        incident_date: request.incident_date,
        file_path: uploadedFilePath ? [uploadedFilePath] : [], 
      };
      
  
      console.log("Final Request Body:", JSON.stringify(requestBody, null, 2)); 
  
      const response = await fetch("https://ecedr.elections.gov.lk/test/app_edritem", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseJson = await response.json();
      console.log("Server Response:", responseJson);
  
      if (responseJson.status && responseJson.data?.id) {
        setComplaintID(responseJson.data.id);
        setSuccess(true);
        console.log("Success state updated!");
      } else {
        Alert.alert("Error", "Submission failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Submission failed.");
    }
  };
  

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });

    if (result.canceled) return;
    
    setFile(result.assets[0].uri); 
  };

  return (
    <>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={handleBack} /> 
        <Appbar.Content /> 
        <Appbar.Action icon="account" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <View style={styles.container}>
          <Text style={styles.title}>{t("Local Authorities Election")}- 2025</Text>
          <Text style={styles.heading}>{t("Request Details")}</Text>

          <TextInput
            placeholder={t("Title")}
            style={styles.input}
            onChangeText={(text) => setRequest({ ...request, title: text })}
          />
          <TextInput
            placeholder={t("Description")}
            style={[styles.input, styles.textArea]}
            multiline
            onChangeText={(text) => setRequest({ ...request, description: text })}
          />

        <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="gray" />
            <Text style={styles.dateText}>
              {request.incident_date || "Date of the request"}
            </Text>
          </TouchableOpacity>

         
          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

        
          <Modal isVisible={showDatePicker && Platform.OS === "ios"}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                onChange={handleDateChange}
              />
             <TouchableOpacity
                style={[
                  styles.datePickerContainer,
                  request.incident_date && styles.datePickerSelected, 
                ]}
                onPress={() => {
                  setTempDate(date);
                  setShowDatePicker(true);
                }}
              >
                <Ionicons name="calendar-outline" size={20} color={request.incident_date ? "#800080" : "gray"} />
                <Text style={[styles.dateText, request.incident_date && styles.dateTextSelected]}>
                  {request.incident_date ? request.incident_date : "Select Date"} 
                </Text>
              </TouchableOpacity>

            </View>
          </Modal>

          <TouchableOpacity style={styles.fileUpload} onPress={pickFile}>
            <Text style={styles.fileText}>
              {file ? "File Selected" : "Attach Files (Images)"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>{t("Submit")}</Text>
          </TouchableOpacity>
        </View>
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
                 setRequest({
                   title: "",
                   description: "",
                   incident_date: "",
                 });
                 setFile(null);
                 router.replace("/(user)/HomeScreen");
               }}
             >
               <Text style={styles.agreeButtonText}>{t("okay")}</Text>
             </TouchableOpacity>
           </View>
         </View>
       </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
   
  },
  modalContent:{
    backgroundColor: "#FCE4FF", padding: 10, borderRadius: 0

  },
  
  title: { fontSize: 18, color: '#94098A' },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800080",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
  },
  datePickerContainer: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
  },
  fileUpload: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    textAlign: "center",
    marginBottom: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#800080",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
    textAlign: "center",  // Ensures text is centered within the container
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
    textAlign: "center",  // This will center the text
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
    justifyContent: 'flex-end', // Pushes the button to the right side
    width: '100%',
  },
  agreeButton: {
    backgroundColor: "#94098A",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  agreeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    marginBottom: 10,
  },
  
  datePickerSelected: {
    borderColor: "#800080", 
    backgroundColor: "#FCE4FF", 
  },
  
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "gray",
  },
  
  dateTextSelected: {
    color: "#800080", 
    fontWeight: "bold",
  },
  
});

export default Request;
