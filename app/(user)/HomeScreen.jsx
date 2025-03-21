import React, { useEffect, useState,useCallback  } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet,RefreshControl, ScrollView, ActivityIndicator, TouchableOpacity, FlatList } from "react-native";
import { useRouter,  useFocusEffect  } from "expo-router";
import CustomPieChart from '../../components/CustomPieChart';
import { Svg, Circle, Text as SvgText } from "react-native-svg";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { List, Divider, Avatar, Appbar, Dialog, Portal, Button,  Menu } from "react-native-paper";
import { Mail, Plus, Folder } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import Icon from "react-native-vector-icons/Ionicons";
export default function Dashboard() {
    const router = useRouter();
    const [complaints, setComplaints] = useState([]);
    const [dashboardData, setDashboardData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState("No"); 
    const { t } = useTranslation();
    const [data, setData] = useState(null);
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
    

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
          const token = await SecureStore.getItemAsync("token");
          const userData = await SecureStore.getItemAsync("user");
          const user = userData ? JSON.parse(userData) : null;

          const userId = user?.id;
          setUserName(user?.username || "No");

          if (!token || !userId) {
              setError("Authentication failed. Please log in again.");
              setLoading(false);
              return;
          }

          const dashboardRes = await fetch(
              "https://ecedr.elections.gov.lk/test/app_edritem/dashbordvalue",
              {
                  method: "GET",
                  headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json",
                  },
              }
          );

          let dashboardJson = await dashboardRes.json();
          if (!dashboardRes.ok) {
              console.log("Error Fetching Dashboard Data:", dashboardJson);
              dashboardJson = {};
          }

          setDashboardData(dashboardJson?.data || {
              total_all_complain: 0,
              total_user_complain: 0,
              total_all_request: 0,
              total_user_request: 0,
          });

          const complaintsRes = await fetch(
              `https://ecedr.elections.gov.lk/test/app_edritem/latest?appUserId=${userId}`,
              {
                  method: "GET",
                  headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json",
                  },
              }
          );

          let complaintsJson = await complaintsRes.json();
          if (Array.isArray(complaintsJson)) {
              setComplaints(complaintsJson);
          } else if (complaintsJson && complaintsJson.id) {
              setComplaints([complaintsJson]);
          } else {
              setComplaints([]);
          }
      } catch (err) {
          console.log("Error fetching data:", err.message);
          setError("Failed to load data.");
      } finally {
          setLoading(false);
          setRefreshing(false); 
      }
  };

  useEffect(() => {
      fetchDashboardData();
  }, []); 
  
  const onRefresh = () => {
      setRefreshing(true);
      fetchDashboardData();
  };
//   useEffect(() => {
//     fetchDashboardData();

    
//     const interval = setInterval(() => {
//         console.log("Auto-refreshing dashboard data...");
//         fetchDashboardData();
//     }, 30000); 

//     return () => clearInterval(interval); 
// }, []); 

 
  const handleLogout = async () => {
      try {
          await AsyncStorage.removeItem("userToken"); 
          router.replace("/(login)/Selecter"); 
      } catch (error) {
          console.error("Logout failed:", error);
      }
  };

  
  if (loading) {
      return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#9B287B" />
          </View>
      );
  }

  if (error) {
      return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "red" }}>{error}</Text>
          </View>
      );
  }
  
   
    
    const domainData = [
        { name: 'Tech', population: 20, color: '#64064C' },
        { name: 'Health', population: 30, color: '#94098A' },
        { name: 'Finance', population: 25, color: '#AB1CA2' },
        { name: 'com', population: 25, color: '#F66CC9' },
      ]; 
      const domainData1 = [
        { name: 'Tech', population: 30, color: '#64064C' },
        { name: 'Health', population: 20, color: '#94098A' },
        { name: 'Finance', population: 10, color: '#AB1CA2' },
        { name: 'com', population: 40, color: '#F66CC9' },
      ]; 
    
   
    return (
        <>
             <PaperProvider theme={theme}>
                  <Appbar.Header style={styles.appBar}>
                      <Appbar.Content title="" />
                      <View style={styles.titleContainer}>
                          <Appbar.Content title="EC EDR" />
                      </View>
                  <Appbar.Action icon="account" />
                  <Menu
                      visible={menuVisible}
                      onDismiss={closeMenu}
                      anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
                  >
                      <Menu.Item onPress={() => router.push("/(cr)/details")} title={t("Help")} leadingIcon="help-circle" />
                      <Menu.Item onPress={() => router.push("/(cr)/about")} title={t("About")} leadingIcon="information" />
                      <Divider />
                      <Menu.Item onPress={handleLogout} title={t("Logout")} leadingIcon="logout" />
                  </Menu>
              </Appbar.Header>

           
              {loading ? (
                  <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#9C2A8E" />
                      <Text>Loading...</Text>
                  </View>
              ) : (
                  <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                      <View style={styles.header}>
                          <Text style={styles.title}>{t("Local Authorities Election")}- 2025</Text>
                      </View>

                      <Text style={styles.welcome}>{t("Welcome Back! Hi")}, {userName}</Text>

                      <View style={styles.buttonContainer}>
                          <TouchableOpacity
                              style={styles.buttonWrapper}
                              onPress={() => router.push("/(user)/ElectionScreen")}
                          >
                              <LinearGradient
                                  colors={["#662483", "#c8057f"]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={styles.gradientButton}
                              >
                                  <Icon name="add-circle-outline" size={20} color="white" />
                                  <Text style={styles.gradientButtonText}>{t("Add Complaint or Request")}</Text>
                              </LinearGradient>
                          </TouchableOpacity>
                      </View>

                      <View style={styles.row}>
                          <View style={styles.chartCard}>
                              <Text style={styles.chartTitle}>{t("All Complaints")}</Text>
                              <View style={styles.chartWrapper}>
                                  <CustomPieChart 
                                      data={domainData} 
                                      totalCount={dashboardData.total_user_complain || 0} 
                                      style={{ width: 150, height: 150 }}  
                                  />                  
                              </View>
                          </View>

                          <View style={styles.chartCard}>
                              <Text style={styles.chartTitle}>{t("All Requests")}</Text> 
                              <View style={styles.chartWrapper}>
                                  <CustomPieChart 
                                      data={domainData1} 
                                      totalCount={dashboardData.total_user_request || 0} 
                                      style={{ width: 150, height: 150 }}  
                                  />
                              </View>
                          </View>
                      </View>

                      <Text style={styles.sectionTitle}>{t("Latest Complaint / Request")}</Text>

                      {complaints.length > 0 ? (
                          complaints.map((item) => (
                              <View style={styles.cards} key={item.id}>
                                  <View style={styles.containers}>
                                      <LinearGradient
                                          colors={["#662483", "#c8057f"]}
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
                                          <Text style={styles.text}>EDRAPPLAE{item?.id || "N/A"}</Text>
                                          <Text style={styles.boldText}>{t("Title")}: <Text style={styles.text}>{item?.title || "No Title"}</Text></Text>
                                          <Text style={styles.boldText}>{t("Status")}: <Text style={styles.boldTexts}>{item?.status || "No Status"}</Text></Text>
                                      </View>
                                      <TouchableOpacity
                                          style={styles.button}
                                          onPress={() => router.push({ pathname: "/(cr)/fulldetail", params: { id: item?.id } })}
                                      >
                                          <Text style={styles.buttonText}>{t("Details")}</Text>
                                      </TouchableOpacity>
                                  </View>
                              </View>
                          ))
                      ) : (
                          <Text style={styles.noData}>No complaints found</Text>
                      )}
                  </ScrollView>
              )}
          </PaperProvider>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    title: { fontSize: 18, color: '#94098A' },
    welcome: { fontSize: 14, color: '#94098A', marginBottom: 10 },
    cards: { backgroundColor: '#fff0f9', padding: 10, borderRadius: 10,  marginBottom: 50 ,},
    iconRow: { flexDirection: 'row', gap: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    chartCard: { backgroundColor: '#fff0f9', padding: 20, borderRadius: 10, alignItems: 'center', width: '48%' },
    chartTitle: { fontSize: 14, fontWeight: 'bold', color: '#9B287B', marginBottom: 6 },
    chart: { height: 100, width: 100 },
    chartCount: { fontSize: 16, fontWeight: 'bold', color: '#9B287B',paddingBottom:-30 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#9B287B', marginBottom: 10 },
    noData: { fontSize: 14, color: "#9B287B", textAlign: "center", marginTop: 10 },
    errorText: { color: 'red', textAlign: 'center' },
    containers: {
        alignItems: "flex-start", 
        width: "100%",
        
      },
      badge: {
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
    details: { flex: 1 },
    boldText: { fontWeight: 'bold',color:"#63075D",fontSize: 14,paddingTop:5},
    boldTexts: { color:"#6D28D9",fontSize: 14,paddingTop:5},
   
    text: { fontSize: 14 ,color:"#9B287B"},
    button: { backgroundColor: '#63075D', paddingLeft: 15,paddingRight:20, borderRadius: 10, justifyContent: 'center', alignItems: 'center',marginTop:10,marginBottom:30 },
    buttonText: { color: 'white' },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20
      },
      buttonWrapper: {
        width: "100%",
        
      },
      gradientButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 80,
        borderRadius: 10,
         paddingLeft:20,
         paddingRight:20
      },
      gradientButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 10
      },
      chartWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
    ,
    chartOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
     appBar: {
    backgroundColor: '#fff',
  },
  titleContainer: {
    position: 'absolute', 
    left: 16, 
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
}
});
