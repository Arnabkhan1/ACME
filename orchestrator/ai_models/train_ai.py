import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier

# 1. Create Dummy Training Data
# Format: [Temperature, Vibration]
X_train = [
    [30, 10], [40, 15], [35, 12], [45, 20], # Normal
    [85, 55], [90, 60], [88, 50], [95, 65], # Failure Case
    [50, 80], [40, 90], [80, 20], [85, 10]  # Mixed/Warning
]

# Labels: 0 = Safe, 1 = Danger/Fail Risk
y_train = [
    0, 0, 0, 0,  # Safe
    1, 1, 1, 1,  # Danger
    1, 1, 0, 0   # High vibration is risky, high temp alone might be ok
]

# 2. Train the Model
print("🧠 Training AI Model...")
clf = RandomForestClassifier(n_estimators=10)
clf.fit(X_train, y_train)

# 3. Save the Brain (.pkl file)
filename = 'factory_model.pkl'
pickle.dump(clf, open(filename, 'wb'))
print(f"✅ Model saved as '{filename}'")

# 4. Test Prediction
test_data = [[90, 55]] # High Temp, High Vib
prediction = clf.predict_proba(test_data)[0][1] # Probability of failure
print(f"Test Risk Score for input [90, 55]: {prediction * 100}%")