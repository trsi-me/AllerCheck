# AllerCheck — نظام تحليل مسببات الحساسية بالذكاء الاصطناعي

## 1. نظرة عامة

AllerCheck هو نظام ويب متكامل لتحليل مسببات الحساسية في المنتجات الغذائية باستخدام **ذكاء اصطناعي مُدرَّب** وقاعدة بيانات حقيقية. يعتمد على نموذج ML مُدرَّب من داتاسيت فعلية، بدون محاكاة أو بيانات وهمية.

### الأهداف
- مساعدة أصحاب الحساسية الغذائية في التحقق من سلامة المنتجات
- تحليل نصوص المكونات والمنتجات باستخدام نموذج NLP
- توفير واجهة بسيطة مع ميزات متقدمة (سجل الفحوصات، إحصائيات، تصدير التقارير)

---

## 2. هيكل المشروع

```
AllerCheck/
├── app.py                 # خادم Flask + API + تقديم الواجهة
├── train_model.py         # تدريب نموذج الذكاء الاصطناعي
├── analyzer.py            # وحدة التحليل بالذكاء الاصطناعي
├── init_db.py             # تهيئة قاعدة البيانات من الداتاسيت
├── requirements.txt
├── README.md
├── index.html             # الصفحة الرئيسية
├── check.html             # فحص المنتج
├── profile.html           # الملف الشخصي
├── history.html           # سجل الفحوصات
├── dashboard.html         # لوحة الإحصائيات
├── about.html             # نبذة عن المشروع
├── style.css
├── script.js              # منطق صفحة الفحص
├── profile.js
├── history.js
├── dashboard.js
├── dataset/               # الداتاسيت
│   ├── food_ingredients_and_allergens.csv
│   ├── allergies_10k.csv
│   └── Allergen_Status_of_Food_Products.csv
├── model/                 # النموذج المُدرَّب
│   ├── allergen_model.pkl
│   ├── vectorizer.pkl
│   └── allergen_mapping.json
├── assets/fonts/
└── database/
    └── allercheck.db
```

---

## 3. الداتاسيت (Dataset)

### 3.1 الملفات المستخدمة

| الملف | الوصف | الأعمدة الرئيسية |
|-------|-------|------------------|
| `food_ingredients_and_allergens.csv` | منتجات غذائية مع مكونات ومسببات حساسية | Food Product, Main Ingredient, Sweetener, Fat/Oil, Seasoning, Allergens |
| `allergies_10k.csv` | ~10,000 عينة مكونات مع تسميات مسببات الحساسية | ingredient, allergens |
| `Allergen_Status_of_Food_Products.csv` | حالة مسببات الحساسية للمنتجات | Food Product, Allergens, ... |

### 3.2 تنسيق البيانات

**food_ingredients_and_allergens.csv:**
```csv
Food Product,Main Ingredient,Sweetener,Fat/Oil,Seasoning,Allergens,Prediction
Almond Cookies,Almonds,Sugar,Butter,Flour,"Almonds, Wheat, Dairy",Contains
Chicken Noodle Soup,Chicken broth,None,None,Salt,"Chicken, Wheat, Celery",Contains
```

**allergies_10k.csv:**
```csv
,ingredient,allergens
0,pepperoni: pork,[]
3,almonds natural,['tree nuts']
4,"cheddar club cheese (...)",['dairy']
```

---

## 4. الخوارزميات المستخدمة

### 4.1 TF-IDF (Term Frequency-Inverse Document Frequency)

**ما هو:** خوارزمية لتحويل النص إلى تمثيل رقمي (vector) يعكس أهمية الكلمات في النص بالنسبة لمجموعة النصوص.

**الصيغة:**
- **TF** = تكرار الكلمة في المستند / عدد كلمات المستند
- **IDF** = log(عدد المستندات / عدد المستندات التي تحتوي الكلمة)
- **TF-IDF** = TF × IDF

**لماذا نستخدمه:**
- يحول النص غير المنظم إلى أرقام قابلة للمعالجة
- يقلل وزن الكلمات الشائعة (مثل "the", "and")
- يزيد وزن الكلمات المميزة (مثل "milk", "wheat")

**الكود:**
```python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(
    max_features=5000,      # أعلى 5000 كلمة أهمية
    ngram_range=(1, 3),    # كلمات مفردة، ثنائية، ثلاثية
    min_df=2,               # تجاهل الكلمات التي تظهر أقل من مرتين
    stop_words='english'   # إزالة كلمات التوقف الإنجليزية
)
X_train_vec = vectorizer.fit_transform(X_train)
```

### 4.2 OneVsRestClassifier

**ما هو:** استراتيجية لتحويل مشكلة التصنيف متعدد التسميات (Multi-label) إلى عدة مسائل تصنيف ثنائي (Binary). لكل فئة (مسبب حساسية)، يُدرَّب مصنف مستقل: "هل النص يحتوي هذا المسبب أم لا؟"

**لماذا نستخدمه:**
- المنتج قد يحتوي أكثر من مسبب حساسية (مثلاً حليب + قمح)
- كل مسبب يُعتبر فئة مستقلة
- OneVsRest يسمح بتوقع عدة فئات لنفس النص

**الكود:**
```python
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression

clf = OneVsRestClassifier(LogisticRegression(max_iter=500, C=0.5, random_state=42))
clf.fit(X_train_vec, y_train)
```

### 4.3 Logistic Regression

**ما هو:** خوارزمية تصنيف خطية. تحسب احتمال انتماء النص لفئة معينة باستخدام دالة sigmoid.

**الصيغة:** P(y=1|x) = 1 / (1 + e^(-z)) حيث z = w·x + b

**لماذا نستخدمه:**
- سريع في التدريب والتنبؤ
- يعمل جيداً مع TF-IDF
- أقل عرضة لـ overfitting مع بيانات محدودة (~4000 عينة)
- سهل التفسير

**الكود:**
```python
LogisticRegression(max_iter=500, C=0.5, random_state=42)
# C=0.5: قوة التنظيم (أصغر = تنظيم أقوى)
# max_iter=500: الحد الأقصى لتكرار التحسين
```

### 4.4 ملخص مسار التحليل

```
نص المنتج/المكونات
       ↓
   TF-IDF Vectorizer (تحويل إلى أرقام)
       ↓
   OneVsRestClassifier (11 مصنف ثنائي)
       ↓
   قائمة مسببات الحساسية المكتشفة
```

---

## 5. عملية التدريب

### 5.1 خطوات التدريب

```bash
python train_model.py
```

### 5.2 الكود الرئيسي للتدريب

```python
def train():
    # 1. تحميل البيانات
    t1, l1 = load_products_dataset()   # من food_ingredients و Allergen_Status
    t2, l2 = load_allergies_10k()     # من allergies_10k.csv
    texts = t1 + t2
    labels = l1 + l2

    # 2. تحويل إلى صيغة Multi-label
    X, y, allergen_classes = build_multilabel_data(texts, labels)
    # y: مصفوفة ثنائية، كل صف = نصوص، كل عمود = مسبب حساسية (0 أو 1)

    # 3. تقسيم البيانات
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

    # 4. TF-IDF
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 3), min_df=2, stop_words='english')
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # 5. تدريب المصنف
    clf = OneVsRestClassifier(LogisticRegression(max_iter=500, C=0.5, random_state=42))
    clf.fit(X_train_vec, y_train)

    # 6. حفظ النموذج
    pickle.dump(clf, open(MODEL_PATH, 'wb'))
    pickle.dump(vectorizer, open(VECTORIZER_PATH, 'wb'))
```

### 5.3 معايرة المسببات (parse_allergens)

الداتاسيت تستخدم تسميات مختلفة (dairy, milk, tree nuts, ...). الدالة `parse_allergens` توحّدها إلى أسماء قياسية:

```python
ALLERGEN_NORMALIZE = {
    'dairy': 'Milk', 'milk': 'Milk', 'cheese': 'Milk',
    'tree nuts': 'Nuts', 'almonds': 'Nuts',
    'wheat': 'Wheat', 'gluten': 'Wheat',
    'soybeans': 'Soy', 'soya': 'Soy',
    # ...
}
```

### 5.4 مخرجات التدريب

- `model/allergen_model.pkl` — المصنف المُدرَّب
- `model/vectorizer.pkl` — مُحوّل TF-IDF
- `model/allergen_mapping.json` — فئات المسببات وخرائط التوحيد

**مثال allergen_mapping.json:**
```json
{
  "classes": ["Celery", "Eggs", "Fish", "Milk", "Mustard", "Nuts", "Peanuts", "Sesame", "Soy", "Sulphites", "Wheat"],
  "n_samples": 4279
}
```

---

## 6. قاعدة البيانات

### 6.1 نظام إدارة القاعدة

- **SQLite** — قاعدة بيانات ملفية، لا تحتاج خادم منفصل

### 6.2 جدول products

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    allergens TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_name ON products(name);
```

| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INTEGER | المفتاح الأساسي |
| name | TEXT | اسم المنتج أو نص المكونات |
| allergens | TEXT | مصفوفة JSON لمسببات الحساسية |
| created_at | TIMESTAMP | وقت الإدخال |

### 6.3 تهيئة القاعدة

```bash
python init_db.py
```

**الكود:**
```python
# يحمّل من food_ingredients_and_allergens.csv و Allergen_Status_of_Food_Products.csv
# يحمّل من allergies_10k.csv (مكونات طويلة كـ name)
cursor.execute('INSERT INTO products (name, allergens) VALUES (?, ?)', (name, json.dumps(allergens)))
```

### 6.4 الاستعلام

```python
# البحث عن منتج
cursor.execute(
    "SELECT allergens FROM products WHERE name LIKE ? OR ? LIKE '%' || name || '%' LIMIT 5",
    (f'%{product_name}%', product_name)
)
```

---

## 7. واجهة برمجة التطبيقات (API)

### 7.1 POST /api/check

فحص منتج من حيث مسببات الحساسية.

**الطلب:**
```json
{
  "productName": "Chocolate Cake",
  "userAllergens": ["Milk", "Eggs", "Wheat"],
  "ingredientText": "wheat flour, milk, eggs, butter, sugar"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "productName": "Chocolate Cake",
  "safe": false,
  "foundAllergens": ["Milk", "Eggs", "Wheat"],
  "detectedAllergens": ["Milk", "Wheat", "Dairy"]
}
```

**منطق الفحص:**
1. البحث في قاعدة البيانات أولاً
2. إن لم يُعثر على نتائج، استخدام نموذج الذكاء الاصطناعي
3. مطابقة مسببات المنتج مع مسببات المستخدم (مع مراعاة المرادفات مثل dairy↔Milk)

### 7.2 GET /api/suggestions?q=choc

اقتراح منتجات تبدأ أو تحتوي على النص.

**الاستجابة:**
```json
{
  "suggestions": ["Chocolate Cake", "Chocolate Mousse", "Chocolate Cookies"]
}
```

### 7.3 GET /api/model/status

التحقق من تحميل نموذج الذكاء الاصطناعي.

**الاستجابة:**
```json
{
  "modelLoaded": true
}
```

### 7.4 GET /api/stats

إحصائيات النظام.

**الاستجابة:**
```json
{
  "productsInDatabase": 4521,
  "modelLoaded": true
}
```

---

## 8. وحدة التحليل (analyzer.py)

### 8.1 آلية العمل

```python
def analyze_product(product_name: str, ingredient_text: str = '') -> list:
    text = f"{product_name} {ingredient_text}".strip()
    return get_analyzer().analyze(text)
```

### 8.2 خطوات التحليل

```python
def analyze(self, text: str) -> list:
    # 1. تحميل النموذج (مرة واحدة)
    self.load()

    # 2. تحويل النص بـ TF-IDF
    X = self.vectorizer.transform([text.strip()])

    # 3. التنبؤ
    pred = self.model.predict(X)[0]  # مصفوفة 0/1 لكل فئة

    # 4. استخراج المسببات المكتشفة
    for i, prob in enumerate(pred):
        if prob > 0 and i < len(self.classes):
            detected.append(self._to_app_allergen(self.classes[i]))

    return detected
```

### 8.3 توحيد أسماء المسببات

مخرجات النموذج (مثل "Dairy", "Tree Nuts") تُحوَّل إلى أسماء التطبيق ("Milk", "Nuts") عبر `_to_app_allergen`.

---

## 9. الميزات

| الميزة | الوصف |
|--------|-------|
| فحص المنتج | إدخال اسم المنتج وقائمة المكونات للتحليل |
| الملف الشخصي | حفظ الاسم ومسببات الحساسية في المتصفح |
| سجل الفحوصات | عرض آخر 100 فحص مع التاريخ والنتيجة |
| لوحة الإحصائيات | إجمالي الفحوصات، آمن/تحذير، تكرار المسببات |
| المفضلة | حفظ المنتجات الآمنة للرجوع السريع |
| تصدير التقرير | تحميل JSON (الملف الشخصي، السجل، المفضلة) |

---

## 10. خطوات التشغيل

### 10.1 المتطلبات

- Python 3.8+
- متصفح ويب حديث

### 10.2 التثبيت والتشغيل

```bash
# 1. تثبيت الحزم
pip install -r requirements.txt

# 2. تدريب النموذج (مرة واحدة)
python train_model.py

# 3. تهيئة قاعدة البيانات
python init_db.py

# 4. تشغيل الخادم
python app.py
```

### 10.3 الوصول

افتح المتصفح على: **http://localhost:5000**

---

## 11. requirements.txt

```
Flask==3.0.0
flask-cors==4.0.0
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
```

---

## 12. استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| الخادم لا يعمل | `pip install Flask flask-cors` |
| قاعدة البيانات فارغة | تشغيل `python init_db.py` |
| النموذج غير محمّل | تشغيل `python train_model.py` |
| خطأ CORS | التأكد من تشغيل `app.py` على المنفذ 5000 |

---

## 13. الخلاصة

- **الداتاسيت:** 3 ملفات CSV، آلاف العينات
- **الخوارزميات:** TF-IDF + Logistic Regression + OneVsRest
- **قاعدة البيانات:** SQLite، جدول products
- **التدفق:** قاعدة البيانات أولاً، ثم نموذج الذكاء الاصطناعي
- **المخرجات:** آمن / تحذير مع قائمة مسببات الحساسية
