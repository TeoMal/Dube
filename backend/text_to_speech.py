# save as tts_recursive.py
import os
from gtts import gTTS

# ---------------- CONFIG ----------------
ROOT_FOLDER = "./HISTORY"  # Root folder to search recursively
LANG = "el"                 # Greek language code
# ----------------------------------------

for dirpath, dirnames, filenames in os.walk(ROOT_FOLDER):
    for filename in filenames:
        if filename.endswith(".txt"):
            txt_path = os.path.join(dirpath, filename)
            mp3_path = txt_path.replace(".txt", ".mp3")  # same folder, same name with .mp3

            # Skip if mp3 already exists
            if os.path.exists(mp3_path):
                print(f"Skipping existing file: {mp3_path}")
                continue

            # Read text
            with open(txt_path, "r", encoding="utf-8") as f:
                text_content = f.read().strip()

            if not text_content:
                print(f"Skipping empty file: {txt_path}")
                continue

            # Convert to speech and save
            tts = gTTS(text=text_content, lang=LANG)
            tts.save(mp3_path)
            print(f"Saved: {mp3_path}")

print("All .txt files converted to .mp3!")
