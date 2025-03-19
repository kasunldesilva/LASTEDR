import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const BMIcal = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const [status, setStatus] = useState("");

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // Convert height to meters
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {
      const result = (w / (h * h)).toFixed(2);
      setBMI(result);
      determineStatus(result);
    } else {
      setBMI(null);
      setStatus("");
    }
  };

  const determineStatus = (bmi) => {
    if (bmi < 18.5) setStatus("Underweight");
    else if (bmi < 24.9) setStatus("Normal");
    else if (bmi < 29.9) setStatus("Overweight");
    else setStatus("Obese");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>

      <TextInput
        placeholder="Enter weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        style={styles.input}
      />

      <TouchableOpacity onPress={calculateBMI} style={styles.button}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Your BMI: <Text style={styles.bmiValue}>{bmi}</Text>
          </Text>
          <Text style={[styles.statusText, statusStyles[status]]}>{status}</Text>
        </View>
      )}
    </View>
  );
};

const statusStyles = {
  Underweight: { color: "#00BFFF" },
  Normal: { color: "#32CD32" },
  Overweight: { color: "#FFD700" },
  Obese: { color: "#FF4500" },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#128C7E",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bmiValue: {
    color: "#128C7E",
  },
  statusText: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default BMIcal;
