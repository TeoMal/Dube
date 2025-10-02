import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2025 My Learning App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { padding: 10, backgroundColor: "#4A90E2" },
  text: { fontSize: 14, color: "white", textAlign: "center" },
});
