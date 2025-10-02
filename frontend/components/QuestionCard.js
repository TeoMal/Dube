import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function QuestionCard({ question }) {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (question.media_url.endsWith(".txt")) {
      fetch(question.media_url)
        .then((res) => res.text())
        .then((data) => setTextContent(data))
        .catch((err) => console.error("Error loading text:", err));
    }
  }, [question]);

  const renderMedia = () => {
    if (!question.media_url) return null;

    if (question.media_url.endsWith(".png") || question.media_url.endsWith(".jpg")) {
      return <img src={question.media_url} style={{ width: 250, height: 150 }} />;
    }

    if (question.media_url.endsWith(".txt")) {
      return <pre>{textContent}</pre>;
    }

    if (question.media_url.endsWith(".mp3")) {
      return <AudioPlayer uri={question.media_url} />;
    }

    if (question.media_url.endsWith(".mp4")) {
      return <VideoPlayer uri={question.media_url} />;
    }

    return <p>Unsupported media type</p>;
  };


  return (
    <View style={styles.card}>
      <Text style={styles.type}>{question.type.toUpperCase()}</Text>
      <Text style={styles.text}>{question.question}</Text>
      {renderMedia()}
    </View>
  );
}

function AudioPlayer({ uri }) {
  return (
    <audio controls style={{ marginTop: 10 }}>
      <source src={uri} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}

function VideoPlayer({ uri }) {
  return (
    <video
      controls
      style={{ width: 250, height: 150, marginTop: 10 }}
      src={uri}
    >
      Your browser does not support the video tag.
    </video>
  );
}


const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: "white", borderRadius: 10, margin: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  type: { fontSize: 12, fontWeight: "bold", color: "#999" },
  text: { fontSize: 16, marginVertical: 10 },
  textFile: { marginTop: 10, fontSize: 14, color: "#333" },
  image: { width: 250, height: 150, marginTop: 10, resizeMode: "contain" },
  video: { width: 250, height: 150, marginTop: 10 },
  audio: { marginTop: 10, fontSize: 16, color: "#4A90E2" },
});
