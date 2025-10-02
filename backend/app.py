from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import os
import json

app = Flask(__name__)
CORS(app)

MEDIA_ROOT = os.path.join(app.root_path, "media")

# ----- USER PROFILES -----
ALL_TYPES = ["reading", "video", "graph", "sound"]

def make_default_user():
    n = len(ALL_TYPES)
    return {
        "probs": {t: 1.0 / n for t in ALL_TYPES},
        "wrong_counts": {t: 0 for t in ALL_TYPES},
        "history": []
    }

user_profiles = {"user1": make_default_user()}


# ----- HELPERS -----
def normalize_probs(probs):
    total = sum(probs.values())
    if total <= 0:
        n = len(probs)
        return {k: 1.0 / n for k in probs}
    return {k: v / total for k, v in probs.items()}

def weighted_choice(probs):
    r = random.random()
    cumulative = 0.0
    for key, p in probs.items():
        cumulative += p
        if r < cumulative:
            return key
    return key  # fallback last

def load_questions(course, chapter):
    """Load questions.json for a given course and chapter"""
    path = os.path.join(MEDIA_ROOT, course.upper(), chapter, "questions.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ----- ROUTES -----
@app.route("/get_courses", methods=["GET"])
def get_courses():
    courses = [
        d for d in os.listdir(MEDIA_ROOT)
        if os.path.isdir(os.path.join(MEDIA_ROOT, d))
    ]
    return jsonify(courses)


@app.route("/get_chapters", methods=["GET"])
def get_chapters():
    course = request.args.get("course")
    if not course:
        return jsonify({"error": "missing course"}), 400

    path = os.path.join(MEDIA_ROOT, course.upper())
    if not os.path.exists(path):
        return jsonify({"error": "course not found"}), 404

    chapters = [
        d for d in os.listdir(path)
        if os.path.isdir(os.path.join(path, d))
    ]
    return jsonify(chapters)


@app.route("/get_question", methods=["GET"])
def get_question():
    user = request.args.get("user", "user1")
    course = request.args.get("course", "HISTORY")
    chapter = request.args.get("chapter", "chapter1")

    if user not in user_profiles:
        user_profiles[user] = make_default_user()

    profile = user_profiles[user]

    q_type = weighted_choice(normalize_probs(profile["probs"]))
    questions = load_questions(course, chapter)
    if not questions:
        return jsonify({"error": "No questions found"}), 404

    filtered = [q for q in questions if q["type"] == q_type]
    if not filtered:
        filtered = questions

    question = random.choice(filtered)

    return jsonify({
        "id": question["id"],
        "type": question["type"],
        "question": question["question"],
        "answers": question["answers"],
        "media_url": f"http://127.0.0.1:5000/media/{course}/{chapter}/{question['media']}"
    })


@app.route("/check_answer", methods=["POST"])
def check_answer():
    data = request.get_json()
    user = data.get("user", "user1")
    course = data.get("course", "HISTORY")
    chapter = data.get("chapter", "chapter1")
    qid = data.get("id")
    chosen_answer = data.get("answer")

    if user not in user_profiles:
        user_profiles[user] = make_default_user()

    questions = load_questions(course, chapter)
    question = next((q for q in questions if q["id"] == qid), None)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    correct = (chosen_answer == question["correct_answer"])
    q_type = question["type"]

    entry = {
        "qid": qid,
        "chosen_answer": chosen_answer,
        "correct": correct,
        "q_type": q_type
    }
    user_profiles[user]["history"].append(entry)

    if not correct:
        user_profiles[user]["wrong_counts"][q_type] += 1
    else:
        ALPHA = 0.1
        probs = normalize_probs(user_profiles[user]["probs"])
        probs[q_type] += ALPHA
        probs = normalize_probs(probs)
        user_profiles[user]["probs"] = probs

    return jsonify({
        "correct": correct,
        "correct_answer": question["correct_answer"],
        "new_profile": user_profiles[user]["probs"]
    })


@app.route("/update_profile", methods=["POST"])
def update_profile():
    """
    Provide a full profile update (replace). Accepts:
    { "user": "user1", "percentages": {"reading":80,"video":10,"graph":5,"sound":5} }
    """
    data = request.get_json()
    user = data.get("user")
    percentages = data.get("percentages")
    if not user or not percentages:
        return jsonify({"error": "missing user or percentages"}), 400

    total = sum(percentages.values())
    if total == 0:
        return jsonify({"error": "sum of percentages is zero"}), 400

    probs = {k: percentages.get(k, 0) / total for k in ALL_TYPES}
    if user not in user_profiles:
        user_profiles[user] = make_default_user()

    user_profiles[user]["probs"] = probs
    return jsonify({"status": "updated", "probs": probs})


@app.route("/media/<course>/<chapter>/<path:filename>")
def serve_media(course, chapter, filename):
    return send_from_directory(
        os.path.join(MEDIA_ROOT, course.upper(), chapter), filename
    )


if __name__ == "__main__":
    app.run(debug=True)
