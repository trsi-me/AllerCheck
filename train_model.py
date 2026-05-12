# AllerCheck — تدريب نموذج ثنائي (آمن / غير آمن) متوافق مع AllergensDetection.ipynb والتقرير الفني
# Dataset: dataset/Allergen_Status_of_Food_Products.csv — عمودا Ingredient و Prediction

import json
import os
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

DATASET_PATH = Path(__file__).parent / 'dataset' / 'Allergen_Status_of_Food_Products.csv'
MODEL_DIR = Path(__file__).parent / 'model'
MODEL_PATH = MODEL_DIR / 'allergen_model.pkl'
VECTORIZER_PATH = MODEL_DIR / 'vectorizer.pkl'
MAPPING_PATH = MODEL_DIR / 'allergen_mapping.json'


def train():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    df.columns = df.columns.str.strip()

    df['Prediction'] = df['Prediction'].astype(str).str.lower().str.strip()
    df['Target'] = df['Prediction'].map({'contains': 1, 'does not contain': 0})
    df = df.dropna(subset=['Target'])
    df['Target'] = df['Target'].astype(int)
    df['Ingredient'] = df['Ingredient'].astype(str).str.lower().str.strip()

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    X = vectorizer.fit_transform(df['Ingredient'])
    y = df['Target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=200, max_depth=20, random_state=42)
    model.fit(X_train, y_train)

    def metrics_block(X_data, y_true, label):
        y_pred = model.predict(X_data)
        y_prob = model.predict_proba(X_data)[:, 1]
        m = {
            'Accuracy': accuracy_score(y_true, y_pred),
            'Precision': precision_score(y_true, y_pred, zero_division=0),
            'Recall': recall_score(y_true, y_pred, zero_division=0),
            'F1-Score': f1_score(y_true, y_pred, zero_division=0),
            'ROC-AUC': roc_auc_score(y_true, y_prob),
        }
        print(f"\n--- {label} Performance Metrics ---")
        for name, val in m.items():
            print(f"{name:<12} : {val:.2%}")
        return m

    train_m = metrics_block(X_train, y_train, 'TRAINING')
    test_m = metrics_block(X_test, y_test, 'TESTING')
    gap = train_m['Accuracy'] - test_m['Accuracy']
    print('\n' + '=' * 40)
    print(f"Generalization Gap (Train-Test): {gap:.2%}")
    print('Status: Healthy Model (Generalized well)' if gap < 0.10 else 'Status: Potential Overfitting')
    print('=' * 40)

    tn, fp, fn, tp = confusion_matrix(y_test, model.predict(X_test)).ravel()
    print('\n[Test Set] Confusion Matrix Summary:')
    print(f'- Correct Allergy Detections (TP): {tp}')
    print(f'- Correct Safe Detections    (TN): {tn}')
    print(f'- Dangerous Failures         (FN): {fn}')
    print(f'- Safe but Flagged as Risk   (FP): {fp}')

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)

    meta = {
        'model_type': 'binary_rf_ingredient',
        'threshold': 0.4,
        'n_samples': int(len(df)),
        'target_map': {'does not contain': 0, 'contains': 1},
        'status_labels': {
            '0': {'ar': 'آمن', 'en': 'Safe', 'meaning': 'does not contain (dataset)'},
            '1': {'ar': 'غير آمن', 'en': 'Not safe', 'meaning': 'contains (dataset)'},
        },
        'train_accuracy': float(train_m['Accuracy']),
        'test_accuracy': float(test_m['Accuracy']),
    }
    with open(MAPPING_PATH, 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    print(f"\n[SUCCESS] Model -> {MODEL_PATH}")
    print(f"[SUCCESS] Vectorizer -> {VECTORIZER_PATH}")
    print(f"[SUCCESS] Metadata -> {MAPPING_PATH}")
    return model, vectorizer, meta


if __name__ == '__main__':
    train()
