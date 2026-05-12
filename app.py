# AllerCheck - Food Allergen Analysis API

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import json
import os
from pathlib import Path

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)
DB_PATH = 'database/allercheck.db'
PROJECT_ROOT = Path(__file__).parent


def get_db_connection():
    try:
        os.makedirs('database', exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return None


def init_db():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    allergens TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)')
            conn.commit()
            conn.close()
        except sqlite3.Error as e:
            print(f"DB init error: {e}")


def get_product_allergens_from_db(product_name: str) -> tuple:
    """Returns (allergen_list, matched_in_db). matched_in_db is True if any product row matched."""
    conn = get_db_connection()
    if not conn:
        return [], False
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT allergens FROM products WHERE name LIKE ? OR ? LIKE '%' || name || '%' LIMIT 5",
            (f'%{product_name}%', product_name)
        )
        rows = cursor.fetchall()
        conn.close()
        if not rows:
            return [], False
        all_allergens = set()
        for row in rows:
            try:
                data = json.loads(row[0] or '[]')
                if isinstance(data, list):
                    all_allergens.update(data)
            except Exception:
                pass
        return list(all_allergens), True
    except Exception as e:
        print(f"DB query error: {e}")
        if conn:
            conn.close()
        return [], False


def _empty_ai_result():
    return {
        'detectedAllergens': [],
        'analyzed': False,
        'ingredientUnsafe': False,
        'statusAr': 'آمن',
        'statusEn': 'Safe',
        'confidence': 0.0,
        'reason': '',
    }


def analyze_with_ai(product_name: str, ingredient_text: str = '') -> dict:
    try:
        from analyzer import analyze_product
        r = analyze_product(product_name, ingredient_text)
        return r if isinstance(r, dict) else _empty_ai_result()
    except ImportError:
        return _empty_ai_result()
    except Exception as e:
        print(f"AI analyzer error: {e}")
        return _empty_ai_result()


@app.route('/')
def index():
    return send_from_directory(PROJECT_ROOT, 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(PROJECT_ROOT, path)):
        return send_from_directory(PROJECT_ROOT, path)
    return {'error': 'Not found'}, 404


@app.route('/api/check', methods=['POST'])
def check_product():
    try:
        data = request.get_json(silent=True) or {}
        product_name = data.get('productName', '').strip()
        user_allergens = data.get('userAllergens', [])
        ingredient_text = data.get('ingredientText', '').strip()
        lang = (data.get('lang') or 'en').strip().lower()[:2]
        if lang not in ('en', 'ar'):
            lang = 'en'

        err = {
            'product': {'en': 'Product name required', 'ar': 'اسم المنتج مطلوب'},
            'allergens': {'en': 'Allergens required', 'ar': 'مسببات الحساسية مطلوبة'},
            'failed': {'en': 'Request failed', 'ar': 'فشل الطلب'},
        }

        if not product_name:
            return jsonify({'success': False, 'message': err['product'][lang]}), 400
        if not user_allergens or not isinstance(user_allergens, list):
            return jsonify({'success': False, 'message': err['allergens'][lang]}), 400

        found_allergens = []
        product_allergens, matched_in_db = get_product_allergens_from_db(product_name)
        ai_result = None
        if not matched_in_db:
            ai_result = analyze_with_ai(product_name, ingredient_text)
            product_allergens = list(ai_result.get('detectedAllergens') or [])

        # قاعدة البيانات أو نموذج تم تشغيله بنجاح (حتى لو التصنيف «آمن» وقائمة الفئات فارغة)
        product_known = matched_in_db or bool(ai_result and ai_result.get('analyzed'))

        equiv = {'milk': ['milk', 'dairy'], 'nuts': ['nuts', 'tree nuts', 'almonds', 'walnuts'],
                 'wheat': ['wheat', 'gluten'], 'soy': ['soy', 'soybeans'], 'fish': ['fish']}
        if product_known:
            for ua in user_allergens:
                ua_lower = ua.lower()
                for pa in product_allergens:
                    pa_lower = pa.lower()
                    if ua_lower == pa_lower or ua_lower in pa_lower or pa_lower in ua_lower:
                        found_allergens.append(ua)
                        break
                    if ua_lower in equiv:
                        if any(e in pa_lower for e in equiv[ua_lower]):
                            found_allergens.append(ua)
                            break

        is_safe = len(found_allergens) == 0 if product_known else None

        ingredient_status_ar = None
        ingredient_status_en = None
        ai_confidence = None
        ai_reason = None
        if not matched_in_db and ai_result and ai_result.get('analyzed'):
            ingredient_status_ar = ai_result.get('statusAr')
            ingredient_status_en = ai_result.get('statusEn')
            ai_confidence = ai_result.get('confidence')
            ai_reason = ai_result.get('reason')

        return jsonify({
            'success': True,
            'productName': product_name,
            'productKnown': product_known,
            'safe': is_safe,
            'foundAllergens': found_allergens,
            'detectedAllergens': product_allergens,
            'ingredientStatusAr': ingredient_status_ar,
            'ingredientStatusEn': ingredient_status_en,
            'aiConfidence': ai_confidence,
            'aiReason': ai_reason,
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        lang = 'en'
        try:
            d = request.get_json(silent=True) or {}
            lang = (d.get('lang') or 'en').strip().lower()[:2]
            if lang not in ('en', 'ar'):
                lang = 'en'
        except Exception:
            pass
        failed_msg = {'en': 'Request failed', 'ar': 'فشل الطلب'}
        return jsonify({'success': False, 'message': failed_msg.get(lang, failed_msg['en'])}), 500


@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    q = request.args.get('q', '').strip().lower()
    if len(q) < 2:
        return jsonify({'suggestions': []})
    conn = get_db_connection()
    if not conn:
        return jsonify({'suggestions': []})
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT DISTINCT name FROM products WHERE LOWER(name) LIKE ? LIMIT 10",
            (f'%{q}%',)
        )
        suggestions = [row[0] for row in cursor.fetchall()]
        conn.close()
        return jsonify({'suggestions': suggestions[:8]})
    except Exception:
        if conn:
            conn.close()
        return jsonify({'suggestions': []})


@app.route('/api/model/status')
def model_status():
    try:
        from analyzer import get_analyzer
        loaded = get_analyzer().load()
        return jsonify({'modelLoaded': loaded})
    except Exception:
        return jsonify({'modelLoaded': False})


@app.route('/api/stats')
def system_stats():
    conn = get_db_connection()
    product_count = 0
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT COUNT(*) FROM products')
            product_count = cursor.fetchone()[0]
            conn.close()
        except Exception:
            if conn:
                conn.close()
    model_loaded = False
    try:
        from analyzer import get_analyzer
        model_loaded = get_analyzer().load()
    except Exception:
        pass
    return jsonify({
        'productsInDatabase': product_count,
        'modelLoaded': model_loaded
    })


if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', '5000'))
    debug = os.environ.get('FLASK_ENV', 'development') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
