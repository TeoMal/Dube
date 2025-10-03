from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import os
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

MEDIA_ROOT = os.path.join(app.root_path, "media")
ICONS_ROOT = os.path.join(app.root_path, "icons")

# ----- USER PROFILES -----
ALL_TYPES = ["reading", "video", "sound"]

def make_default_user():
    n = len(ALL_TYPES)
    return {
        "name": "George",
        "surname": "Papadopoulos",
        #"probs": {t: 1.0 / n for t in ALL_TYPES},
        "probs": {"reading": 0.08, "video": 0.45, "sound": 0.47},
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
        "description": "Εξερευνήστε τα σημαντικότερα γεγονότα που διαμόρφωσαν την Ευρώπη από την Αναγέννηση έως σήμερα.",
        "editing": "false"
    },
    "PHYSICS": {
        "name": "Εισαγωγή στη Φυσική",
        "logo": "physics.jpeg",
        "description": "Μάθετε τις θεμελιώδεις αρχές της φυσικής μέσα από διαδραστικά μαθήματα και πειράματα.",
        "editing": "true"
        
    }
}

CHAPTER_NAMES = {
    "HISTORY": {
        "chapter1": {
            "name": "Γαλλική Επανάσταση",
            "description": "Η Γαλλική Επανάσταση του 1789 αποτέλεσε σταθμό στην παγκόσμια ιστορία, φέρνοντας στο προσκήνιο έννοιες όπως η ελευθερία, η ισότητα και η αδελφοσύνη, και επηρέασε βαθιά την Ευρώπη.",
            "questions_completed": 0,
            "questions_correct": 0,
            "completed": False
        },
        "chapter2": {
            "name": "Αναγέννηση και Μεσαίωνας",
            "description": "Η Αναγέννηση ήταν μια περίοδος αναζωογόνησης της τέχνης, της επιστήμης και της λογοτεχνίας μετά τον Μεσαίωνα. Οι άνθρωποι επανέφεραν το ενδιαφέρον τους για τον άνθρωπο και την κλασική παιδεία.",
            "questions_completed": 0,
            "questions_correct": 0,
            "completed": False
        },
        "chapter3": {
            "name": "Ευρώπη τον 19ο αιώνα",
            "description": "Ο 19ος αιώνας στην Ευρώπη χαρακτηρίστηκε από τη βιομηχανική επανάσταση, την άνοδο των εθνικών κρατών και σημαντικές κοινωνικές και πολιτικές αλλαγές.",
            "questions_completed": 0,
            "questions_correct": 0,
            "completed": False
        },
        "chapter4": {
            "name": "Σύγχρονη Ευρώπη",
            "description": "Η σύγχρονη Ευρώπη συγκροτήθηκε μέσα από πολέμους, συνεργασίες και την πορεία προς την ενοποίηση, οδηγώντας στη δημιουργία της Ευρωπαϊκής Ένωσης.",
            "questions_completed": 0,
            "questions_correct": 0,
            "completed": False
        },
    },
    "PHYSICS": {
        "chapter1": {
            "name": "Κίνηση",
            "description": "Η κίνηση είναι η αλλαγή της θέσης ενός σώματος με την πάροδο του χρόνου και αποτελεί θεμελιώδη έννοια της φυσικής.",
            "questions_completed": 0,
            "questions_correct": 0,
            "completed": False
        },
        "chapter2": {
            "name": "Δύναμη και Πίεση",
            "description": "Η δύναμη προκαλεί μεταβολή στην κίνηση των σωμάτων, ενώ η πίεση είναι το μέτρο της δύναμης που ασκείται σε μια επιφάνεια.",
            "questions_completed": 0,
            "questions_correct": 0,
            "completed": False
        },
        "chapter3": {
            "name": "Ενέργεια και Θερμότητα",
            "description": "Η ενέργεια είναι η ικανότητα ενός συστήματος να παράγει έργο, ενώ η θερμότητα αφορά τη μεταφορά ενέργειας λόγω διαφοράς θερμοκρασίας.",
            "questions_completed": 0,
            "questions_correct": 0,
            "completed": False
            
        },
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
                "editing": COURSE_INFO[key].get("editing", "false")
            })
    
    return jsonify(courses)


@app.route("/get_chapters", methods=["GET"])
def get_chapters():
    """
    Example: /get_chapters?course=Ιστορία της Ευρώπης&user=user1
    Returns chapter info with completion status.
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
        chapter_info = CHAPTER_NAMES.get(folder_key, {}).get(ch, {})
        if isinstance(chapter_info, dict):
            chapters.append({
                "id": ch,
                "name": chapter_info.get("name", ch),
                "description": chapter_info.get("description", ""),
                "completed": ch in completed,
                "questions_completed": chapter_info.get("questions_completed", 0),
                "questions_correct": chapter_info.get("questions_correct", 0)
            })
        else:
            # fallback if chapter is still a string
            chapters.append({
                "id": ch,
                "name": chapter_info,
                "description": "",
                "completed": ch in completed,
                "questions_completed": 0,
                "questions_correct": 0
            })
    
    return jsonify(chapters)

def detect_media_type(filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".txt":
        return "reading"
    elif ext in [".mp4", ".avi", ".mov"]:
        return "video"
    elif ext in [".mp3", ".wav"]:
        return "sound"
    return "unknown"


@app.route("/get_questions", methods=["GET"])
def get_questions():
    user = request.args.get("user", "user1")
    course_name = request.args.get("course")
    chapter_name = request.args.get("chapter")

    if not course_name or not chapter_name:
        return jsonify({"error": "Missing course or chapter"}), 400

    # Ensure user exists
    if user not in user_profiles:
        user_profiles[user] = make_default_user()
    profile = user_profiles[user]

    # Determine preferred media type (highest probability)
    probs = profile.get("probs", {})
    if not probs:
        preferred_type = "reading"  # default fallback
    else:
        preferred_type = max(probs, key=probs.get)

    # Reverse map: Greek course name -> folder key
    folder_key = None
    for key, value in COURSE_INFO.items():
        if value["name"] == course_name:
            folder_key = key
            break
    if folder_key is None:
        return jsonify({"error": "Unknown course"}), 404

    # Reverse map: Greek chapter name -> chapter folder key
    chapter_key = None
    if folder_key in CHAPTER_NAMES:
        for ch_key, ch_value in CHAPTER_NAMES[folder_key].items():
            if ch_value["name"] == chapter_name:
                chapter_key = ch_key
                break
    if chapter_key is None:
        return jsonify({"error": "Unknown chapter"}), 404

    # Load questions.json
    questions = load_questions(folder_key, chapter_key)

    # Filter steps to only include the preferred media type
    for q in questions:
        filtered_steps = []
        for step in q.get("steps", []):
            step_type = step.get("type")
            if step_type == preferred_type or step_type == "question":
                # Update media URLs if applicable
                if step_type in ["reading", "video", "sound"] and step.get("file"):
                    step["file"] = f"http://127.0.0.1:5000/media/{folder_key}/{chapter_key}/{step['file']}"
                filtered_steps.append(step)
        q["steps"] = filtered_steps

    print(f"Serving {len(questions)} questions for {course_name} - {chapter_name} using preferred media: {preferred_type}")
    return jsonify(questions)


    

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

    # update history
    entry = {
        "qid": qid,
        "chosen_answer": chosen_answer,
        "correct": correct,
        "q_type": q_type,
        "course": course,
        "chapter": chapter
    }
    user_profiles[user]["history"].append(entry)

    # update per-type learning stats
    if not correct:
        user_profiles[user]["wrong_counts"][q_type] += 1
    else:
        ALPHA = 0.1
        probs = normalize_probs(user_profiles[user]["probs"])
        probs[q_type] += ALPHA
        probs = normalize_probs(probs)
        user_profiles[user]["probs"] = probs

    # 🔥 update chapter stats
    if course in CHAPTER_NAMES and chapter in CHAPTER_NAMES[course]:
        ch_info = CHAPTER_NAMES[course][chapter]
        ch_info["questions_completed"] = ch_info.get("questions_completed", 0) + 1
        if correct:
            ch_info["questions_correct"] = ch_info.get("questions_correct", 0) + 1

    return jsonify({
        "correct": correct,
        "correct_answer": question["correct_answer"],
        "new_profile": user_profiles[user]["probs"],
        "chapter_stats": CHAPTER_NAMES[course][chapter]
    })



from urllib.parse import unquote

from urllib.parse import unquote

@app.route("/mark_chapter_complete", methods=["POST"])
def mark_chapter_complete():
    """Mark a chapter as completed for a user and update learning probabilities."""
    data = request.get_json()
    user = data.get("user", "user1")
    course_name = data.get("course")
    chapter_name = data.get("chapter")
    step_type = data.get("type")
    percentage = data.get("percentage", 0)  # must be 0-1

    if not course_name or not chapter_name:
        return jsonify({"error": "Missing course or chapter"}), 400

    # Decode URL-encoded names
    decoded_course = unquote(course_name)
    decoded_chapter = unquote(chapter_name)

    # Reverse map: Greek course name -> folder key
    folder_key = None
    for key, value in COURSE_INFO.items():
        if value["name"] == decoded_course:
            folder_key = key
            break
    if folder_key is None:
        return jsonify({"error": "Unknown course"}), 404

    # Reverse map: Greek chapter name -> chapter folder key
    chapter_key = None
    if folder_key in CHAPTER_NAMES:
        for ch_key, ch_value in CHAPTER_NAMES[folder_key].items():
            if ch_value["name"] == decoded_chapter:
                chapter_key = ch_key
                break
    if chapter_key is None:
        return jsonify({"error": "Unknown chapter"}), 404

    if user not in user_profiles:
        user_profiles[user] = make_default_user()

    # Mark chapter as completed
    if folder_key not in user_profiles[user]["completed_chapters"]:
        user_profiles[user]["completed_chapters"][folder_key] = []
    if chapter_key not in user_profiles[user]["completed_chapters"][folder_key]:
        user_profiles[user]["completed_chapters"][folder_key].append(chapter_key)

    # Update global CHAPTER_NAMES
    if folder_key in CHAPTER_NAMES and chapter_key in CHAPTER_NAMES[folder_key]:
        CHAPTER_NAMES[folder_key][chapter_key]["completed"] = True

    # ----- Update learning probabilities based on rule -----
    print(step_type, percentage)
    if step_type in user_profiles[user]["probs"]:
        probs = user_profiles[user]["probs"].copy()
        if percentage > 0.6:
            probs[step_type] += 0.1
        elif percentage < 0.5:
            probs[step_type] -= 0.1
            if probs[step_type] < 0:
                probs[step_type] = 0.0
        # else: between 0.5-0.6 do nothing

        # Normalize probabilities
        total = sum(probs.values())
        if total <= 0:
            n = len(probs)
            probs = {k: 1.0 / n for k in probs}
        else:
            probs = {k: v / total for k, v in probs.items()}

        user_profiles[user]["probs"] = probs

    print(f'New probs for {user}: {user_profiles[user]["probs"]}')
    return jsonify({
        "status": "success",
        "completed_chapters": user_profiles[user]["completed_chapters"][folder_key],
        "chapter_stats": CHAPTER_NAMES[folder_key][chapter_key],
        "updated_probs": user_profiles[user]["probs"]
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
    Provide a full profile update (replace).
    Accepts:
    { "user": "user1", "percentages": {"reading":80,"video":10,"sound":5} }
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

    # 🔥 replace probabilities but keep stats intact
    user_profiles[user]["probs"] = probs

    return jsonify({
        "status": "updated",
        "probs": probs,
        "stats": calculate_accuracy_stats(user),
        "completed_chapters": user_profiles[user]["completed_chapters"]
    })

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