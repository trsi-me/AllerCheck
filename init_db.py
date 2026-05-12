# AllerCheck - Database initialization from dataset

import sqlite3
import json
import os
import re
from pathlib import Path

DB_PATH = 'database/allercheck.db'
DATASET_DIR = Path(__file__).parent / 'dataset'


def parse_allergens(raw):
    if not raw or str(raw).strip() in ('[]', ''):
        return []
    raw_str = str(raw).strip()
    if raw_str.startswith('['):
        items = re.findall(r"['\"]([^'\"]+)['\"]", raw_str)
    else:
        items = [x.strip() for x in raw_str.split(',') if x.strip()]
    return list(set(items))


def load_from_food_products(conn):
    paths = [
        DATASET_DIR / 'food_ingredients_and_allergens.csv',
        DATASET_DIR / 'Allergen_Status_of_Food_Products.csv'
    ]
    cursor = conn.cursor()
    count = 0
    for path in paths:
        if not path.exists():
            continue
        import pandas as pd
        df = pd.read_csv(path)
        for _, row in df.iterrows():
            name = str(row.get('Food Product', '')).strip()
            if not name:
                continue
            raw = row.get('Allergens', '')
            allergens = parse_allergens(raw)
            if allergens:
                cursor.execute(
                    'INSERT OR IGNORE INTO products (name, allergens) VALUES (?, ?)',
                    (name, json.dumps(allergens, ensure_ascii=False))
                )
                count += 1
    return count


def load_from_allergies_10k(conn):
    path = DATASET_DIR / 'allergies_10k.csv'
    if not path.exists():
        return 0
    import pandas as pd
    df = pd.read_csv(path)
    cursor = conn.cursor()
    seen = set()
    count = 0
    for _, row in df.iterrows():
        ing = str(row.get('ingredient', '')).strip()
        if not ing or len(ing) < 10:
            continue
        raw = row.get('allergens', '[]')
        allergens = parse_allergens(raw)
        if allergens:
            key = ing[:150]
            if key not in seen:
                seen.add(key)
                cursor.execute(
                    'INSERT OR IGNORE INTO products (name, allergens) VALUES (?, ?)',
                    (ing[:300], json.dumps(allergens, ensure_ascii=False))
                )
                count += 1
    return count


def init_database():
    os.makedirs('database', exist_ok=True)
    try:
        conn = sqlite3.connect(DB_PATH)
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
        cursor.execute('DELETE FROM products')
        c1 = load_from_food_products(conn)
        c2 = load_from_allergies_10k(conn)
        conn.commit()
        conn.close()
        print("Database initialized successfully from dataset")
        print(f"Loaded {c1 + c2} products from dataset/*.csv")
    except Exception as e:
        print(f"Database initialization error: {e}")


if __name__ == '__main__':
    init_database()
