import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  SafeAreaView, ActivityIndicator, Alert 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
export default function ComplaintsList() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const { t } = useTranslation();
   const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
      text: "black",
      placeholder: "gray",
    },
  };

   useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("user");
        const user = userData ? JSON.parse(userData) : null;
        const userId = user?.id;
  
        if (!token || !userId) {
          console.error("Authentication failed. Please log in again.");
          setComplaints([]); 
          setLoading(false);
          return;
        }
  
        const response = await fetch(
          `https://ecedr.elections.gov.lk/test/app_edritem/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          console.warn("Fetch request failed. Assuming no complaints.");
          setComplaints([]); 
          return;
        }
  
        const data = await response.json();
  
        if (Array.isArray(data) && data.length === 0) {
          setComplaints([]); 
        } else if (Array.isArray(data)) {
          setComplaints(data);
        } else {
          console.warn("Unexpected API response:", data);
          setComplaints([]); 
        }
  
      } catch (err) {
        console.error("Fetch error:", err);
        setComplaints([]); 
      } finally {
        setLoading(false);
      }
    };
  
    fetchComplaints();
  }, []);
  
  
  
  
  return (
    <>
      <PaperProvider theme={theme}>
          <Appbar.Header style={styles.appBar}>
                      <Appbar.Content title="" />
                      <View style={styles.titleContainer}>
                        <Appbar.Content title="EC EDR" />
                      </View>
                      <Appbar.Action icon="account" onPress={() => {}} />
                      <Appbar.Action icon="dots-vertical" onPress={() => {}} />
          </Appbar.Header>
        
          <View style={styles.container}>
          <Text style={styles.title}>{t("Local Authorities Election")}- 2025</Text>
            <Text style={styles.subHeader}>{t("My Complains/ Requests")}</Text>

            
            {loading && <ActivityIndicator size="large" color="#9C2A8E" />}

              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : complaints.length === 0 && !loading ? (
                <Text style={styles.noData}>{t("No Complaints and Requests")}</Text>
              ) : (
                <FlatList
                data={complaints}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                      <View style={styles.containers}>
                              <LinearGradient
                                  colors={["#662483", "#c8057f"]}// Purple to Blue gradient
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={styles.badge}
                                  >
                                    <Text style={styles.badgeText}>
                                      {item?.item_type === 'COMPLAIN' ? t('Complain') : item?.item_type === 'REQUEST' ? t('Request') : t('')}
                                    </Text>

                                </LinearGradient>
                        </View>
              
                    <View style={styles.row}>
                      <View style={styles.details}>
                        <Text style={styles.boldText}>{t("Reference Number")}:</Text>
                        <Text style={styles.text}>EDRAPPLAE{item.id}</Text>
                        <Text style={styles.boldText}>{t("Title")}:</Text>
                        <Text style={styles.text}>{item.title}</Text>
                        <Text style={styles.boldText}>{t("Status")}:</Text>
                        <Text style={styles.texts}>{item.status}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push({ pathname: "/(cr)/fulldetail", params: { id: item.id } })}
                      >
                        <Text style={styles.buttonText}>{t("Details")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              )}

          </View>
        </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 10 },
  header: { fontSize: 16, color: "#800080", marginBottom: 5 },
  subHeader: { fontSize: 16, color: "#9C2A8E", marginBottom: 10 ,paddingLeft:10},
  card: { 
    backgroundColor: "#fff0f6", 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 10, 
  },
  
  row: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
  },
  details: { flex: 1, paddingRight: 10 },
  boldText: { fontWeight: "bold", color: "#5C136B", marginTop: 2, fontSize: 14 },
  text: { color: "#9C2A8E", fontSize: 14 },
  texts: { color: "#6D28D9", fontSize: 14 },
  button: { 
    backgroundColor: "#9C2A8E", 
    paddingVertical: 6, 
    paddingHorizontal: 15, 
    borderRadius: 5, 
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  error: { color: "red", fontSize: 16, textAlign: "center", marginTop: 10 },
  noData: { color: "#63075D", fontSize: 16, textAlign: "center", marginTop: 10 },
  appBar: {
    backgroundColor: '#fff',
  },
  titleContainer: {
    position: 'absolute', 
    left: 16, 
    justifyContent: 'center',
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
  title: { 
    fontSize: 18, 
    color: '#94098A' ,
    paddingLeft:10
  }
    
});
