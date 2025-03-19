import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CustomPieChart = ({ data ,totalCount}) => {
  // Calculate total count dynamically
  

  return (
    <View style={styles.container}>
    <PieChart
      data={data}
      width={screenWidth}
      height={120}
      chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="90"
      hasLegend={false} // 🔥 Remove details section (legend)
    />

    {/* White overlay to create donut effect */}
    <View style={styles.centerCircle}>
      <Text style={styles.totalCount}>{totalCount || 0}</Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      centerCircle: {
        position: 'absolute',
        top: 30,
        left: screenWidth / 2.4,
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
      },
      totalCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
    });

export default CustomPieChart;
