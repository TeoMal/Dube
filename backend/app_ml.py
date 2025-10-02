# backend/app_ml.py
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import os
import joblib

app = Flask(__name__)
CORS(app)



History_db = {
    "chapters": [
        {
            "id": 1,
            "title": 'Γαλλική Επανάσταση',
        },
        {
            "id": 2,
            "title": 'Επανάσταση του 1821',
        },
        {
            "id": 3,
            "title": 'Βιομηχανική Επανάσταση',
        },
        {
            "id": 4,
            "title": 'Ψυχρός Πόλεμος',
        }
    ]
    
}



# ----- QUESTIONS DB (example) -----
questions_db = {
    "text": [
        {
            "id": 1,
            "type": "text",
            "question": "Read this passage and choose the correct meaning.",
            "media": "reading1.txt",
            "answers": ["Option A", "Option B", "Option C", "Option D"],
            "answer_types": ["text", "text", "text", "text"],
            "correct_answer": "Option B"
        }
    ],
    "sound": [
        {
            "id": 3,
            "type": "sound",
            "question": "Listen to this audio and identify the sound.",
            "media": "sound1.mp3",
            "answers": ["Dog", "Cat", "Car", "Bird"],
            "answer_types": ["sound", "sound", "sound", "sound"],
            "correct_answer": "Dog"
        }
    ],
    "graph": [
        {
            "id": 4,
            "type": "graph",
            "question": "What does this graph represent?",
            "media": "graph1.png",
            "answers": ["Sales", "Temperature", "Population", "Rainfall"],
            "answer_types": ["graph", "text", "text", "graph"],
            "correct_answer": "Sales"
        }
    ],
    "video": [
        {
            "id": 5,
            "type": "video",
            "question": "What activity is shown in the clip?",
            "media": "video1.mp4",
            "answers": ["Running", "Swimming", "Cycling", "Dancing"],
            "answer_types": ["video", "video", "video", "video"],
            "correct_answer": "Running"
        }
    ]
}

ALL_TYPES = sorted(list(questions_db.keys()))

# ----- Load trained Decision Tree -----
MODEL_PATH = os.path.join(os.path.dirname(__file__), "decision_tree_model.joblib")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Trained model not found: {MODEL_PATH}")

clf = joblib.load(MODEL_PATH)

# ----- User storage -----
def make_default_user():
    n = len(ALL_TYPES)
    return {
        "probs": {t: 1.0/n for t in ALL_TYPES},
        "wrong_counts": {t: 0 for t in ALL_TYPES},
        "history": []
    }

user_profiles = {"user1": make_default_user()}

# ----- Helpers -----
def normalize_probs(probs):
    total = sum(probs.values())
    if total <= 0:
        n = len(probs)
        return {k: 1.0/n for k in probs}
    return {k: v/total for k,v in probs.items()}

def find_question_by_id(qid):
    for qtype, qlist in questions_db.items():
        for q in qlist:
            if q["id"] == qid:
                return q
    return None

def update_probs_with_classifier(user_profile):
    """
    Uses the decision tree to update probabilities based on current probs + wrong_counts.
    """
    features = list(user_profile["probs"].values()) + list(user_profile["wrong_counts"].values())
    predicted_type = clf.predict([features])[0]
    
    # increase predicted_type probability slightly and normalize
    new_probs = user_profile["probs"].copy()
    increment = 0.05
    for t in new_probs:
        if t == predicted_type:
            new_probs[t] += increment
        else:
            new_probs[t] = max(0, new_probs[t] - increment/ (len(new_probs)-1))
    
    new_probs = normalize_probs(new_probs)
    user_profile["probs"] = new_probs
    return predicted_type

# ----- Routes -----
@app.route("/get_profile", methods=["GET"])
def get_profile():
    user = request.args.get("user", "user1")
    profile = user_profiles.get(user)
    if not profile:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "probs": profile["probs"],
        "wrong_counts": profile["wrong_counts"],
        "history_len": len(profile["history"])
    })

@app.route("/get_question", methods=["GET"])
def get_question():
    user = request.args.get("user", "user1")
    if user not in user_profiles:
        user_profiles[user] = make_default_user()

    profile = user_profiles[user]
    # Choose type using classifier
    choice = update_probs_with_classifier(profile)
    question = random.choice(questions_db[choice])

    return jsonify({
        "id": question["id"],
        "type": question["type"],
        "question": question["question"],
        "media_url": f"http://127.0.0.1:5000/media/{question['media']}",
        "answers": question["answers"]
    })

@app.route("/check_answer", methods=["POST"])
def check_answer():
    data = request.get_json()
    user = data.get("user", "user1")
    qid = data.get("id")
    chosen_answer = data.get("answer")

    if user not in user_profiles:
        user_profiles[user] = make_default_user()

    question = find_question_by_id(qid)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    correct = (chosen_answer == question.get("correct_answer"))
    q_type = question["type"]

    # determine chosen_type via answer_types mapping
    chosen_type = None
    if "answers" in question and chosen_answer in question["answers"]:
        idx = question["answers"].index(chosen_answer)
        ans_types = question.get("answer_types", [])
        if idx < len(ans_types):
            chosen_type = ans_types[idx]

    entry = {
        "qid": qid,
        "chosen_answer": chosen_answer,
        "chosen_type": chosen_type,
        "correct": correct,
        "q_type": q_type
    }
    user_profiles[user]["history"].append(entry)

    # update wrong_counts
    if not correct:
        user_profiles[user]["wrong_counts"][q_type] += 1
    else:
        # optionally update probs using classifier again after correct answer
        update_probs_with_classifier(user_profiles[user])

    return jsonify({
        "correct": correct,
        "correct_answer": question.get("correct_answer"),
        "chosen_type": chosen_type,
        "new_profile": {
            "probs": user_profiles[user]["probs"],
            "wrong_counts": user_profiles[user]["wrong_counts"]
        }
    })

@app.route("/media/<path:filename>")
def serve_media(filename):
    return send_from_directory(os.path.join(app.root_path, "media"), filename)

if __name__ == "__main__":
    app.run(debug=True)
