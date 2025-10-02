import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>My Learning App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, backgroundColor: "#4A90E2" },
  title: { fontSize: 20, fontWeight: "bold", color: "white", textAlign: "center" },
});
