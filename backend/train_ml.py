# train_decision_tree_probs.py
import random
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.multioutput import MultiOutputRegressor
import joblib

# ----- Config -----
ALL_TYPES = ["text", "sound", "graph", "video"]
ALPHA = 0.02        # mass transfer for correct answer
NUM_SAMPLES = 5000  # number of synthetic training examples
MODEL_FILE = "decision_tree_model.joblib"

# ----- Helpers -----
def normalize(probs):
    total = sum(probs.values())
    if total == 0:
        return {k: 1.0/len(probs) for k in probs}
    return {k: v / total for k,v in probs.items()}

def apply_correct_update(probs, wrong_counts, correct_type, alpha=ALPHA):
    probs = normalize(probs)
    others = [t for t in probs if t != correct_type]
    weights = [wrong_counts.get(t, 0) for t in others]
    if sum(weights) == 0:
        weights = [1]*len(others)
    w_sum = sum(weights)
    
    new_probs = probs.copy()
    removed_total = 0.0
    for t, w in zip(others, weights):
        removed = min(alpha * (w / w_sum), new_probs[t])
        new_probs[t] -= removed
        removed_total += removed
    
    new_probs[correct_type] += removed_total
    return normalize(new_probs)

# ----- Generate synthetic training data -----
data_X = []
data_y = []

for _ in range(NUM_SAMPLES):
    # Random initial probabilities
    probs = {t: random.random() for t in ALL_TYPES}
    probs = normalize(probs)
    
    # Random wrong counts
    wrong_counts = {f'{t}_wrong': random.randint(0, 5) for t in ALL_TYPES}
    
    # Simulate correct answer
    correct_type = random.choice(ALL_TYPES)
    new_probs = apply_correct_update(probs, wrong_counts, correct_type)
    
    # Input features: probs + wrong_counts + correct_type (as one-hot)
    input_row = {**probs, **wrong_counts}
    
    #Append the index of the correct type
    input_row["correct_type"] = ALL_TYPES.index(correct_type)
    

    data_X.append(input_row)
    
    # Target: updated probabilities
    data_y.append(new_probs)


df_X = pd.DataFrame(data_X)
df_y = pd.DataFrame(data_y)

#Print ten random sa

# ----- Train multi-output regression Decision Tree -----
regressor = MultiOutputRegressor(DecisionTreeRegressor())
regressor.fit(df_X, df_y)

# ----- Save the model -----
joblib.dump(regressor, MODEL_FILE)
print(f"Multi-output regression model trained and saved to {MODEL_FILE}")
