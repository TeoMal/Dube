import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProgressBars({ percentages }) {
  return (
    <View style={styles.container}>
      {Object.entries(percentages).map(([key, value]) => (
        <View key={key} style={styles.barContainer}>
          <Text style={styles.label}>{key} ({value}%)</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${value}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  barContainer: { marginBottom: 8 },
  label: { fontSize: 14, marginBottom: 4 },
  barBackground: { height: 12, backgroundColor: "#ddd", borderRadius: 6, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#4A90E2" },
});
