import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Breadcrumbs from "./components/Breadcrumbs";

import Home from "./pages/Home";
import Students from "./pages/Students";
import Educators from "./pages/Educators";
import Courses from "./pages/Courses";
import Network from "./pages/Network";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/educators" element={<Educators />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/network" element={<Network />} />
        <Route path="/help" element={<Help />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}




// import React, { useState, useEffect } from "react";
// import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ProgressBars from "./components/ProgressBar";
// import QuestionCard from "./components/QuestionCard";

// export default function App() {
//   const user = "user1";
//   const [percentages, setPercentages] = useState({});
//   const [question, setQuestion] = useState(null);
//   const [message, setMessage] = useState("");
//   const [locked, setLocked] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       const res = await fetch(`http://127.0.0.1:5000/get_profile?user=${user}`);
//       const data = await res.json();
//       if (data.probs) {
//         // convert probabilities (0-1) into percentages
//         const percents = Object.fromEntries(
//           Object.entries(data.probs).map(([k, v]) => [k, Math.round(v * 100)])
//         );
//         setPercentages(percents);
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     }
//   };

//   const fetchQuestion = async () => {
//     try {
//       const res = await fetch(`http://127.0.0.1:5000/get_question?user=${user}`);
//       const data = await res.json();
//       setQuestion(data);
//       setMessage("");
//       setLocked(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const submitAnswer = async (answer, qid) => {
//     try {
//       const res = await fetch("http://127.0.0.1:5000/check_answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user, id: qid, answer }),
//       });

//       const data = await res.json();
//       if (data.correct) {
//         setMessage("✅ Correct!");
//       } else {
//         setMessage(`❌ Wrong! Correct answer was: ${data.correct_answer}`);
//       }

//       // Update progress bars with new profile
//       if (data.new_profile && data.new_profile.probs) {
//         const percents = Object.fromEntries(
//           Object.entries(data.new_profile.probs).map(([k, v]) => [k, Math.round(v * 100)])
//         );
//         setPercentages(percents);
//       }

//       setLocked(true);
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//     fetchQuestion();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Header />
//       <ProgressBars percentages={percentages} />
//       <ScrollView contentContainerStyle={styles.content}>
//         {question ? (
//           <QuestionCard
//             question={question}
//             user={user}
//             onAnswer={submitAnswer}
//             locked={locked}
//           />
//         ) : (
//           <Text>Loading question...</Text>
//         )}
//         {message ? <Text style={styles.message}>{message}</Text> : null}
//         <Button title="Next Question" onPress={fetchQuestion} />
//       </ScrollView>
//       <Footer />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f0f0f0" },
//   content: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
//   message: { fontSize: 16, margin: 10, fontWeight: "bold" },
// });
