from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import os
import json

app = Flask(__name__)
CORS(app)

MEDIA_ROOT = os.path.join(app.root_path, "media")
ICONS_ROOT = os.path.join(app.root_path, "icons")

# ----- USER PROFILES -----
ALL_TYPES = ["reading", "video", "graph", "sound"]

def make_default_user():
    n = len(ALL_TYPES)
    return {
        "probs": {t: 1.0 / n for t in ALL_TYPES},
        "wrong_counts": {t: 0 for t in ALL_TYPES},
        "history": [],
        "completed_chapters": {}  # {"HISTORY": ["chapter1", "chapter2"], "PHYSICS": []}
    }

user_profiles = {"user1": make_default_user()}


# ----- COURSE METADATA -----
COURSE_INFO = {
    "HISTORY": {
        "name": "Ιστορία της Ευρώπης",
        "logo": "history.jpeg",
        "description": "Εξερευνήστε τα σημαντικότερα γεγονότα που διαμόρφωσαν την Ευρώπη από την Αναγέννηση έως σήμερα."
    },
    "PHYSICS": {
        "name": "Εισαγωγή στη Φυσική",
        "logo": "physics_logo.png",
        "description": "Μάθετε τις θεμελιώδεις αρχές της φυσικής μέσα από διαδραστικά μαθήματα και πειράματα."
    }
}

CHAPTER_NAMES = {
    "HISTORY": {
        "chapter1": "Αναγέννηση και Μεσαίωνας",
        "chapter2": "Γαλλική Επανάσταση",
        "chapter3": "Ευρώπη τον 19ο αιώνα",
        "chapter4": "Σύγχρονη Ευρώπη"
    },
    "PHYSICS": {
        "chapter1": "Κίνημα",
        "chapter2": "Δύναμη και Πίεση",
        "chapter3": "Ενέργεια και Θερμότητα",
    }
}

MEDIA_DIR = os.path.join(app.root_path, "media")


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

def calculate_completion_percentage(user, course_key):
    """Calculate percentage of completed chapters for a course"""
    if user not in user_profiles:
        return 0
    
    completed = user_profiles[user]["completed_chapters"].get(course_key, [])
    total_chapters = len(CHAPTER_NAMES.get(course_key, {}))
    
    if total_chapters == 0:
        return 0
    
    return round((len(completed) / total_chapters) * 100, 1)

def calculate_accuracy_stats(user):
    """Calculate overall and per-type accuracy statistics"""
    if user not in user_profiles:
        return {
            "overall_accuracy": 0,
            "total_questions": 0,
            "correct_answers": 0,
            "by_type": {t: {"correct": 0, "total": 0, "accuracy": 0} for t in ALL_TYPES}
        }
    
    history = user_profiles[user]["history"]
    
    if not history:
        return {
            "overall_accuracy": 0,
            "total_questions": 0,
            "correct_answers": 0,
            "by_type": {t: {"correct": 0, "total": 0, "accuracy": 0} for t in ALL_TYPES}
        }
    
    total_questions = len(history)
    correct_answers = sum(1 for entry in history if entry["correct"])
    overall_accuracy = round((correct_answers / total_questions) * 100, 1)
    
    by_type = {t: {"correct": 0, "total": 0, "accuracy": 0} for t in ALL_TYPES}
    
    for entry in history:
        q_type = entry["q_type"]
        if q_type in by_type:
            by_type[q_type]["total"] += 1
            if entry["correct"]:
                by_type[q_type]["correct"] += 1
    
    for q_type in by_type:
        if by_type[q_type]["total"] > 0:
            accuracy = (by_type[q_type]["correct"] / by_type[q_type]["total"]) * 100
            by_type[q_type]["accuracy"] = round(accuracy, 1)
    
    return {
        "overall_accuracy": overall_accuracy,
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "by_type": by_type
    }


# ----- ROUTES -----
@app.route("/get_courses", methods=["GET"])
def get_courses():
    """Return list of available courses with metadata and completion percentage."""
    user = request.args.get("user", "user1")
    
    if user not in user_profiles:
        user_profiles[user] = make_default_user()
    
    if not os.path.exists(MEDIA_DIR):
        return jsonify([])

    course_keys = [
        name for name in os.listdir(MEDIA_DIR)
        if os.path.isdir(os.path.join(MEDIA_DIR, name))
    ]

    courses = []
    for key in course_keys:
        if key in COURSE_INFO:
            courses.append({
                "id": key,
                "name": COURSE_INFO[key]["name"],
                "logo_url": f"http://127.0.0.1:5000/icons/{COURSE_INFO[key]['logo']}",
                "description": COURSE_INFO[key]["description"],
                "total_chapters": len(CHAPTER_NAMES.get(key, {})),
                "chapters_completed": len(user_profiles[user]["completed_chapters"].get(key, [])),
            })
    
    return jsonify(courses)


@app.route("/get_chapters", methods=["GET"])
def get_chapters():
    """
    Example: /get_chapters?course=Ιστορία της Ευρώπης&user=user1
    Returns friendly chapter names with completion status.
    """
    course_name = request.args.get("course")
    user = request.args.get("user", "user1")
    
    if not course_name:
        return jsonify({"error": "Missing course"}), 400

    if user not in user_profiles:
        user_profiles[user] = make_default_user()

    # reverse map: friendly course name -> folder key
    folder_key = None
    for k, v in COURSE_INFO.items():
        if v["name"] == course_name:
            folder_key = k
            break

    if folder_key is None:
        return jsonify({"error": "Unknown course"}), 404

    course_path = os.path.join(MEDIA_DIR, folder_key)
    if not os.path.exists(course_path):
        return jsonify([])

    chapter_keys = [
        name for name in os.listdir(course_path)
        if os.path.isdir(os.path.join(course_path, name))
    ]

    completed = user_profiles[user]["completed_chapters"].get(folder_key, [])
    
    chapters = []
    for ch in chapter_keys:
        chapters.append({
            "id": ch,
            "name": CHAPTER_NAMES.get(folder_key, {}).get(ch, ch),
            "completed": ch in completed
        })
    
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
        "q_type": q_type,
        "course": course,
        "chapter": chapter
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


@app.route("/mark_chapter_complete", methods=["POST"])
def mark_chapter_complete():
    """Mark a chapter as completed for a user"""
    data = request.get_json()
    user = data.get("user", "user1")
    course = data.get("course")
    chapter = data.get("chapter")
    
    if not course or not chapter:
        return jsonify({"error": "Missing course or chapter"}), 400
    
    if user not in user_profiles:
        user_profiles[user] = make_default_user()
    
    if course not in user_profiles[user]["completed_chapters"]:
        user_profiles[user]["completed_chapters"][course] = []
    
    if chapter not in user_profiles[user]["completed_chapters"][course]:
        user_profiles[user]["completed_chapters"][course].append(chapter)
    
    completion = calculate_completion_percentage(user, course)
    
    return jsonify({
        "status": "success",
        "completed_chapters": user_profiles[user]["completed_chapters"][course],
        "completion_percentage": completion
    })


@app.route("/get_user_stats", methods=["GET"])
def get_user_stats():
    """Get comprehensive user statistics"""
    user = request.args.get("user", "user1")
    
    if user not in user_profiles:
        user_profiles[user] = make_default_user()
    
    profile = user_profiles[user]
    accuracy_stats = calculate_accuracy_stats(user)
    
    # Calculate completion stats per course
    course_completion = {}
    for course_key in COURSE_INFO.keys():
        course_completion[course_key] = {
            "name": COURSE_INFO[course_key]["name"],
            "completion_percentage": calculate_completion_percentage(user, course_key),
            "completed_chapters": profile["completed_chapters"].get(course_key, []),
            "total_chapters": len(CHAPTER_NAMES.get(course_key, {}))
        }
    
    return jsonify({
        "user": user,
        "learning_preferences": profile["probs"],
        "accuracy_stats": accuracy_stats,
        "course_completion": course_completion,
        "total_questions_answered": len(profile["history"])
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


@app.route("/icons/<path:filename>")
def serve_icon(filename):
    return send_from_directory(ICONS_ROOT, filename)


if __name__ == "__main__":
    app.run(debug=True)