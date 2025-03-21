import React from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
const { width, height } = Dimensions.get("window");
export default function Index() {
      const router = useRouter();
    const handleBack = () => {
        router.back(); 
      };
   
    return (
      <SafeAreaView style={styles.safeArea}>
        <Appbar.Header style={styles.appBar}>
            <Appbar.BackAction onPress={handleBack} /> 
            <Appbar.Content /> 
            <Appbar.Action icon="account" onPress={() => {}} />
            <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.container]}>
            <Image
              source={require("../../assets/images/national.png")}
              style={[styles.logo, { width: width * 0.6,  }]}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/images/logo.png")}
              style={[styles.logo, { width: width * 0.6,  }]}
              resizeMode="contain"
            />
          </View>
  
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
             
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: width * 0.3, height: height * 0.2, paddingRight:10 }}
                resizeMode="contain"
              />
  
            
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.appName}>EC EDR</Text>
                <Text style={styles.appVersion}>1.0.9 (16)</Text>
                <Text style={styles.appPackage}>lk.gov.elections.edr</Text>
              </View>
            </View>
  
            {/* Description */}
            <Text style={styles.description}>
              The EC EDR App is an essential tool designed to ensure a smooth and
              transparent election process by enabling the public to report
              election-related complaints and requests efficiently.
            </Text>
          </View>
  
          {/* Footer */}
          <Text style={styles.footer}>IT Branch</Text>
          <Text style={styles.footer}>Election Commission of Sri Lanka</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const styles = {
    safeArea: {
      flex: 1,
      backgroundColor: "#F8F3F9",
    },
    scrollContainer: {
      alignItems: "center",
      marginTop:30
     
    },
    logo: {
        height: undefined,
        aspectRatio: 2,
        marginVertical: 1,
      },
    container: {
        justifyContent: "center",
        alignItems: "center",
      },
    card: {
      backgroundColor: "#F3E1F5",
      width: "85%",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      marginTop: 20,
    },
    appName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#5E2750",
    },
    appVersion: {
      fontSize: 14,
      color: "#5E2750",
    },
    appPackage: {
      fontSize: 14,
      color: "#5E2750",
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      textAlign: "center",
      color: "#5E2750",
      marginTop: 10,
    },
    footer: {
      fontSize: 14,
      color: "#5E2750",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
    },
  };
  