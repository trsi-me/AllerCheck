# AllerCheck — تحليل المكونات: نموذج RandomForest + TF-IDF مع منطق هجين (كما في AllergensDetection.ipynb)

import json
from pathlib import Path

import joblib
import numpy as np

MODEL_DIR = Path(__file__).parent / 'model'
MODEL_PATH = MODEL_DIR / 'allergen_model.pkl'
VECTORIZER_PATH = MODEL_DIR / 'vectorizer.pkl'
ALLERGEN_MAP_PATH = MODEL_DIR / 'allergen_mapping.json'

# قائمة مسببات الحساسية الرئيسية (فلتر أمان) — مطابقة للدفتر
MAJOR_ALLERGENS = [
    'milk', 'egg', 'fish', 'shrimp', 'peanut', 'soy',
    'wheat', 'sesame', 'butter', 'cream', 'nuts', 'cheese', 'yogurt',
]

SAFE_BASES = ['chicken', 'beef', 'lamb', 'turkey', 'lettuce', 'spinach', 'potato']

# ربط الكلمات المكتشفة بفئات واجهة التطبيق (مطابقة checkboxes)
KEYWORD_TO_APP = {
    'milk': 'Milk', 'butter': 'Milk', 'cream': 'Milk', 'cheese': 'Milk', 'yogurt': 'Milk',
    'egg': 'Eggs',
    'fish': 'Fish', 'shrimp': 'Fish',
    'peanut': 'Peanuts',
    'soy': 'Soy',
    'wheat': 'Wheat',
    'sesame': 'Sesame',
    'nuts': 'Nuts',
}

DEFAULT_THRESHOLD = 0.40


class AllergenAnalyzer:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.threshold = DEFAULT_THRESHOLD
        self.status_labels = {
            'safe': {'ar': 'آمن', 'en': 'Safe'},
            'unsafe': {'ar': 'غير آمن', 'en': 'Not safe'},
        }
        self._loaded = False

    def load(self):
        if self._loaded:
            return True
        if not MODEL_PATH.exists() or not VECTORIZER_PATH.exists():
            return False
        try:
            self.model = joblib.load(MODEL_PATH)
            self.vectorizer = joblib.load(VECTORIZER_PATH)
            if ALLERGEN_MAP_PATH.exists():
                with open(ALLERGEN_MAP_PATH, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.threshold = float(data.get('threshold', DEFAULT_THRESHOLD))
                sl = data.get('status_labels') or {}
                if '0' in sl and 'ar' in sl['0']:
                    self.status_labels['safe'] = {'ar': sl['0']['ar'], 'en': sl['0'].get('en', 'Safe')}
                if '1' in sl and 'ar' in sl['1']:
                    self.status_labels['unsafe'] = {'ar': sl['1']['ar'], 'en': sl['1'].get('en', 'Not safe')}
            self._loaded = True
            return True
        except Exception as e:
            print(f"Analyzer load error: {e}")
            return False

    def _proba_positive(self, X_vec) -> float:
        raw = self.model.predict_proba(X_vec)[:, 1]
        arr = np.asarray(raw).ravel()
        return float(arr[0]) if arr.size else 0.0

    def predict_full(self, cleaned_lower_text: str) -> dict:
        """منطق هجين: كلمات خطرة + احتمال النموذج + تصحيح انحياز اللحوم."""
        out = {
            'detectedAllergens': [],
            'analyzed': True,
            'ingredientUnsafe': False,
            'statusAr': self.status_labels['safe']['ar'],
            'statusEn': self.status_labels['safe']['en'],
            'confidence': 0.0,
            'reason': '',
        }
        s = (cleaned_lower_text or '').strip().lower()
        if not s:
            out['analyzed'] = False
            return out

        found_kw = [a for a in MAJOR_ALLERGENS if a in s]
        for kw in found_kw:
            app = KEYWORD_TO_APP.get(kw)
            if app and app not in out['detectedAllergens']:
                out['detectedAllergens'].append(app)

        X = self.vectorizer.transform([s])
        prob = self._proba_positive(X)
        if any(b in s for b in SAFE_BASES) and len(found_kw) == 0:
            prob = prob * 0.5

        out['confidence'] = prob

        if len(found_kw) > 0:
            out['ingredientUnsafe'] = True
            out['statusAr'] = self.status_labels['unsafe']['ar']
            out['statusEn'] = self.status_labels['unsafe']['en']
            out['reason'] = f"major_allergen_keywords: {', '.join(found_kw)}"
        elif prob >= self.threshold:
            out['ingredientUnsafe'] = True
            out['statusAr'] = self.status_labels['unsafe']['ar']
            out['statusEn'] = self.status_labels['unsafe']['en']
            out['reason'] = 'high_statistical_risk'
        else:
            out['ingredientUnsafe'] = False
            out['statusAr'] = self.status_labels['safe']['ar']
            out['statusEn'] = self.status_labels['safe']['en']
            out['reason'] = 'low_risk'

        return out

    def analyze(self, text: str) -> dict:
        """للتوافق مع الكود الداخلي؛ يُفضّل استخدام analyze_product من الخارج."""
        if not text or not str(text).strip():
            return {
                'detectedAllergens': [],
                'analyzed': False,
                'ingredientUnsafe': False,
                'statusAr': self.status_labels['safe']['ar'],
                'statusEn': self.status_labels['safe']['en'],
                'confidence': 0.0,
                'reason': '',
            }
        if not self.load():
            return {
                'detectedAllergens': [],
                'analyzed': False,
                'ingredientUnsafe': False,
                'statusAr': self.status_labels['safe']['ar'],
                'statusEn': self.status_labels['safe']['en'],
                'confidence': 0.0,
                'reason': '',
            }
        try:
            return self.predict_full(str(text).strip().lower())
        except Exception as e:
            print(f"Analyzer predict error: {e}")
            return {
                'detectedAllergens': [],
                'analyzed': False,
                'ingredientUnsafe': False,
                'statusAr': self.status_labels['safe']['ar'],
                'statusEn': self.status_labels['safe']['en'],
                'confidence': 0.0,
                'reason': str(e),
            }


_analyzer = None


def get_analyzer() -> AllergenAnalyzer:
    global _analyzer
    if _analyzer is None:
        _analyzer = AllergenAnalyzer()
    return _analyzer


def analyze_product(product_name: str, ingredient_text: str = '') -> dict:
    """تحليل النص الكامل (اسم المنتج + المكونات) وإرجاع آمن/غير آمن والفئات المكتشفة للمطابقة مع حساسية المستخدم."""
    text = f'{product_name} {ingredient_text}'.strip()
    return get_analyzer().analyze(text)
