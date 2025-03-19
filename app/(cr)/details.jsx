import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { Appbar } from "react-native-paper";
import { WebView } from 'react-native-webview';
import { useRouter } from "expo-router";

const pdfUrls = {
  en: `https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/ecedrelections/ecedrelections.github.io/main/resource/Election%20Disputes%20Resolution%20App%20Userguide.pdf`,
  ta: `https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/ecedrelections/ecedrelections.github.io/main/resource/EDR%20APP%20UserGuide(Tamil).pdf`,
  si: `https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/ecedrelections/ecedrelections.github.io/main/resource/EDR%20App%20Userguide(sinhala).pdf`,
};

const HelpGuide = () => {
  const router = useRouter();
  const [expandedStep, setExpandedStep] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const { t, i18n } = useTranslation();
  
  
  const selectedLang = i18n.language || 'en';
  const pdfUrl = pdfUrls[selectedLang] || pdfUrls.en;

  const steps = [
    { 
      title: t('add_complaint.title'), 
      details: `${t('add_complaint.login')}\n${t('add_complaint.home_tap')}\n${t('add_complaint.fill_details')}\n${t('add_complaint.submit')}\n${t('add_complaint.submits')}\n${t('add_complaint.submits1')}`
    },
    { 
      title: t('add_request.title'), 
      details: `${t('add_complaint.login')}\n${t('add_complaint.home_tap')}\n${t('add_request.login')}\n${t('add_request.fill_details')}\n${t('add_complaint.submits1')}`
    },
    { 
      title: t('review_complaints.title'), 
      details: `${t('add_complaint.login')}\n${t('review_complaints.navigate')}\n${t('review_complaints.find')}\n${t('review_complaints.find1')}`
    },
    { 
      title: t('Complaint and Request History View.title'), 
      details: `${t('add_complaint.login')}\n${t('Complaint and Request History View.navigate')}\n${t('Complaint and Request History View.find')}\n${t('Complaint and Request History View.find1')}`
    },
    { 
      title: t('change_language_logout.title'), 
      details: `${t('change_language_logout.settings')}\n${t('change_language_logout.language')}\n${t('change_language_logout.logout')}`
    }
  ];

  const handleBack = () => {
    router.back(); 
  };

  return (
    <>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={handleBack} /> 
        <Appbar.Content /> 
        <Appbar.Action icon="account" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}> {t("Help Guide")}</Text>

        
          <Video
            source={require('../../assets/videos/guidevideo.mp4')}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            shouldPlay={false}
          />

         
          {steps.map((step, index) => (
           
              <View key={index} style={styles.stepContainer}>
                <TouchableOpacity 
                  onPress={() => setExpandedStep(expandedStep === index ? null : index)} 
                  style={styles.stepHeader}
                >
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <MaterialIcons name={expandedStep === index ? 'expand-less' : 'expand-more'} size={24} color="black" />
                </TouchableOpacity>
                {expandedStep === index && <Text style={styles.stepDetails}>{step.details}</Text>}
              </View>
             
          ))}

       
          <TouchableOpacity style={styles.button} onPress={() => setShowPDF(!showPDF)}>
            <Text style={styles.buttonText}>{showPDF ? "Hide PDF" : t("Learn All")}</Text>
          </TouchableOpacity>

          
          {showPDF && (
            <View style={styles.pdfWrapper}>
              <ScrollView style={styles.pdfScroll} nestedScrollEnabled={true}>
                <WebView 
                  source={{ uri: pdfUrl }} 
                  style={styles.pdfViewer} 
                  nestedScrollEnabled={true} 
                />
              </ScrollView>

            </View>
          )}
          <View style={styles.cont}>
            <Text style={styles.text}>
              {t("Thank.title")}
            </Text>
          </View>

        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  container: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: 'purple', marginBottom: 10 },
  video: { width: '100%', height: 200 },
  stepContainer: { width: '100%', marginBottom: 10 },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stepTitle: { fontSize: 16, color: '#94098A', fontWeight: 'bold' },
  stepDetails: { padding: 10, color: '#94098A' },
  button: { backgroundColor: '#94098A', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center', width: '100%' },
  buttonText: { color: 'white', fontSize: 16 },
  pdfWrapper: { width: '100%', height: 500, marginTop: 20 },
  pdfScroll: { flex: 1 },
  pdfViewer: { flex: 1, height: 500 },
  cont: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',     
    padding: 20,
  },
  text: {
    textAlign: 'center',       
    color: '#63075D',         
    fontSize: 14,              
  },
});

export default HelpGuide;
