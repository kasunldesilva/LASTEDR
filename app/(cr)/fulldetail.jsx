import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Image, 
  ScrollView, 
  StyleSheet 
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { FontAwesome } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from 'date-fns'; 


export default function FullDetailScreen() {
  const { id } = useLocalSearchParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
    const router = useRouter();
    const [statusList, setStatusList] = useState([]);
    const [statusItems, setStatusItems] = useState([]);
    const sriLankaDistricts = [
      { label: t("Colombo"), value: "1" },
      { label: t("Gampaha"), value: "2" },
      { label: t("Kalutara"), value: "3" },
      { label: t("Kandy"), value: "4" },
      { label: t("Matale"), value: "5" },
      { label: t("Nuwara Eliya"), value: "6" },
      { label: t("Galle"), value: "7" },
      { label: t("Matara"), value: "8" },
      { label: t("Hambantota"), value: "9" },
      { label: t("Jaffna"), value: "10" },
      { label: t("Kilinochchi"), value: "11" },
      { label: t("Mannar"), value: "12" },
      { label: t("Vavuniya"), value: "13" },
      { label: t("Mullaitivu"), value: "14" },
      { label: t("Batticaloa"), value: "15" },
      { label: t("Ampara"), value: "16" },
      { label: t("Trincomalee"), value: "17" },
      { label: t("Kurunegala"), value: "18" },
      { label: t("Puttalam"), value: "19" },
      { label: t("Anuradhapura"), value: "20" },
      { label: t("Polonnaruwa"), value: "21" },
      { label: t("Badulla"), value: "22" },
      { label: t("Moneragala"), value: "23" },
      { label: t("Ratnapura"), value: "24" },
      { label: t("Kegalle"), value: "25" },
    ];
    const getDistrictName = (districtNumber) => {
      const district = sriLankaDistricts.find(d => d.value === districtNumber.toString());
      return district ? district.label : t("Unknown District");
    };
    const formatDate = (date, time) => {
      if (!date || !time) return ''; 
    
     
      const combinedDateTime = `${date} ${time}`;
    
     
      if (i18n.language === 'en') {
        return format(new Date(combinedDateTime), 'Pp'); 
      } else if (i18n.language === 'si') {
        return format(new Date(combinedDateTime), 'Pp'); 
      } else {
       
        return format(new Date(combinedDateTime), 'Pp');
      }
    };
    


  const handleBack = () => {
    router.back(); 
  };

  useEffect(() => {
    if (!id) return;
  
    const fetchComplaintDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) throw new Error("No token found. Please log in.");
  
        const response = await fetch(`https://ecedr.elections.gov.lk/test/app_edritem/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch complaint details. Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("✅ API Response:", data);
        setComplaint(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token"); 
        if (!token) throw new Error("No token found. Please log in.");
    
        const response = await fetch(`https://ecedrapp.elections.gov.lk/app_edritem/status?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
       
    
        const data = await response.json();
        console.log("✅ Status API Response:", data);
    
        if (data.items && Array.isArray(data.items)) {
          setStatusList(data.items);
        } else {
          setStatusList([]);
        }
      } catch (err) {
        console.error(" Status Fetch Error:", err);
        
      }
    };
    
  
    fetchComplaintDetails();
    fetchStatus();
  }, [id]);
  useEffect(() => {
    const updateStatusItems = () => {
      if (!complaint?.status) return;
    
      const rejectedComment = statusList[0]?.comment_org || "No comment";
      const closeComment = statusList.find(item => item.item_level === "CLOSE")?.comment_org ?? t("No comment provided");
  
      let newStatusItems = [];
  
      switch (complaint.status) {
        case "REJECTED":
          newStatusItems.push({
            item_level: "REJECTED",
            comment_org: rejectedComment,
          });
          break;
  
        case "ACTIVE":
          newStatusItems.push({
            item_level: "NEW",
            comment_org: t("statusdis.NEW"),
          });
          break;
  
        case "VERIFIED":
          if (statusList.some(item => item.item_level === "CLOSE")) {
            newStatusItems.push({
              item_level: "CLOSED",
              comment_org: closeComment,
            });
          }
          if (statusList.some(item => item.item_level === "NEW")) {
            newStatusItems.push({
              item_level: "NEW",
              comment_org: t("statusdis.NEW"),
            });
          }
          if (statusList.some(item => item.item_level === "POLICE_ASSIGN")) {
            newStatusItems.push({
              item_level: "POLICE ASSIGN",
              comment_org: t("statusdis.POLICE"),
            });
          }
          if (newStatusItems.length === 0) {
            newStatusItems.push({
              item_level: "VERIFIED",
              comment_org: t("Passed Election Commission"),
            });
          }
          break;
  
        default:
          newStatusItems.push({
            item_level: "UNKNOWN",
            comment_org: t("Unknown Status"),
          });
      }
  
      setStatusItems(newStatusItems);
    };
  
    updateStatusItems();
  }, [complaint, statusList]);
  
  
  const renderImages = () => {
    if (!complaint || !complaint.file_path || complaint.file_path.length === 0) {
      return <Text style={styles.noImageText}>{t("No images available")}</Text>;
    }
  
   
    const imagePathsArray = complaint.file_path[0]
      .split(',')
      .map(path => path.trim()) 
      .filter(path => path.length > 0); 
  
    return (
      <View style={styles.imageContainer}>
        {imagePathsArray.map((path, index) => {
        
          let imageUrl = path.startsWith("http")
            ? path
            : `https://ecedr.elections.gov.lk/test${path.startsWith("/") ? path : `/images/${path}`}`;
  
          console.log(`✅ Checking Image URL: ${imageUrl}`);
  
          return (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
              onError={(e) => console.error(` Failed to load image: ${imageUrl}`, e.nativeEvent.error)}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <>
      <Appbar.Header style={styles.appBar}>
              <Appbar.BackAction onPress={handleBack} /> 
              <Appbar.Content /> 
              <Appbar.Action icon="account" onPress={() => {}} />
              <Appbar.Action icon="dots-vertical" onPress={() => {}} />
            </Appbar.Header>

      <ScrollView style={styles.container}>
        {loading && <ActivityIndicator size="large" color="#9C2A8E" />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {complaint && (
          <>
           
            <Text style={styles.electionTitle}>
              {t("Local Authorities Election")}- 2025
            </Text>

            <Text style={styles.referenceNumber}>
              {t("Reference Number")}{" "}
              <Text style={styles.refBold}>EDRAPP{complaint.id}</Text>
            </Text>

          
            <View style={styles.complaintBox}>
               <View style={styles.containers}>
                          <LinearGradient
                              colors={["#662483", "#c8057f"]}
                               start={{ x: 0, y: 0 }}
                               end={{ x: 1, y: 0 }}
                               style={styles.badge}
                              >
                                <Text style={styles.badgeText}> {complaint?.item_type === 'COMPLAIN' ? t('Complain') : complaint?.item_type === 'REQUEST' ? t('Request') : t('')}</Text>
                            </LinearGradient>
                    </View>

              <Text style={styles.complaintTitle}>
                {t("Title of the Item")}
              </Text>
              <Text style={styles.itemTitle1}>
                {complaint.title}
              </Text>

              <Text style={styles.descriptionTitle}>
                {t("Description of the Item")}
              </Text>
              <Text style={styles.itemTitle1}>
                {complaint.description}
              </Text>
              <Text style={styles.complaintTitle}>
                {t("Title of the Item")}
              </Text>
              <Text style={styles.itemTitle1}>
                {getDistrictName(complaint.district)}
              </Text>
             
              <Text style={styles.complaintTitle}>
                {t("Date and Time")}
              </Text> 
               <Text style={styles.itemTitle}>
               {formatDate(complaint.incident_date, complaint.incident_time)}
              </Text>
              {/* <Text style={styles.complaintTitle}>
                {t("status")}
              </Text> */}
              {/* <Text style={styles.itemTitle}>
                {complaint.status}
              </Text> */}
            </View>

           
            {renderImages()}

           
            

            <Text style={styles.complaintTitle}>{t("Status")}</Text>
           
            <View style={styles.containers1}>
              {statusItems.map((item, index) => (
                <View key={index} style={styles.statusItem}>
                
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="check-circle" size={24} color="#A11EA3" />
                    {index !== statusItems.length - 1 && <View style={styles.line} />}
                  </View>

                
                  <View style={styles.statusBox}>
                    <Text style={styles.statusTitle}>{item.item_level}</Text>
                    <Text style={styles.statusDescription}>
                      {item.comment_org}
                    </Text>
                  </View>
                </View>
              ))}
            </View>



          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    flex: 1,
  },
  electionTitle: {
    fontSize: 18,
    color: "#800080",
    marginBottom: 10,
  },
  referenceNumber: {
    fontSize: 18,
    color: "#63075D",
    marginVertical: 4,
  },
  refBold: {
    fontWeight: "bold",
    color: "#9C2A8E",
  },
  complaintBox: {
    backgroundColor: "#FCE7F3",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  containers: {
    alignItems: "flex-start", 
    width: "100%",
    
  },badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "flex-start", 
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "left", 
    color: "white",
    backgroundColor: "transparent",
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
    color:"#63075D"
  },
  itemTitle: {
    fontSize: 14,
    color: "#6D28D9",
    fontWeight: "bold",
    marginTop: 1,
  },
  itemTitle1: {
    fontSize: 14,
    color: "#9C2A8E",
    fontWeight: "bold",
    marginTop: 5,
   
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 0,
     color:"#63075D"
  },
  itemDescription: {
    color: "#555",
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  noImageText: {
    marginTop: 16,
    color: "#888",
    fontStyle: "italic",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 24,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 16,
  },
  containers1: {
    paddingVertical: 10,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  line: {
    width: 2,
    height: 40, 
    backgroundColor: "#A11EA3",
    marginTop: 2,
  },
  statusBox: {
    backgroundColor: "#FAE5FF", 
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  statusTitle: {
    fontWeight: "bold",
    color: "#A11EA3",
    fontSize: 16,
    marginBottom: 4,
  },
  statusDescription: {
    color: "#6A1B9A",
    fontSize: 14,
  },
});
