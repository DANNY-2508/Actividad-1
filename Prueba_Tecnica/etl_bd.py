import sqlite3
import pandas as pd
from datetime import datetime

# -----------------------------------------------
# 1. CREACIÓN DE LA BASE DE DATOS SQLITE (etl_db.db)
# -----------------------------------------------
def create_database():
    """Crea la base de datos SQLite y las tablas necesarias."""
    conn = sqlite3.connect("etl_db.db")  # Nombre actualizado aquí
    cursor = conn.cursor()
    
    # Tabla 'companies'
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS companies (
        id VARCHAR(24) PRIMARY KEY,
        name VARCHAR(130) NOT NULL
    );
    """)
    
    # Tabla 'charges'
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS charges (
        id VARCHAR(24) PRIMARY KEY,
        company_id VARCHAR(24) NOT NULL,
        amount DECIMAL(16, 2) NOT NULL,
        status VARCHAR(30) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        paid_at TIMESTAMP NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );
    """)
    
    conn.commit()
    conn.close()
    print("✅ Base de datos 'etl_db.db' y tablas creadas exitosamente.")

# -----------------------------------------------
# 2. FUNCIONES ETL
# -----------------------------------------------
def extract_data(csv_path, n_rows=50):
    """Extrae los primeros N registros del CSV."""
    try:
        df = pd.read_csv(csv_path, nrows=n_rows)
        print(f"📂 Extraídos {len(df)} registros del CSV.")
        return df
    except FileNotFoundError:
        raise Exception("¡Archivo CSV no encontrado!")

def transform_data(df):
    """Transforma los datos para ajustarse al esquema."""
    required_columns = ["id", "name", "company_id", "amount", "status", "created_at", "paid_at"]
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"❌ Columna '{col}' no encontrada en el CSV.")
    
    # Transformar 'companies'
    df_companies = df[["company_id", "name"]].drop_duplicates()
    df_companies.rename(columns={"company_id": "id"}, inplace=True)  
    # Transformar 'charges'
    df_charges = df[["id", "company_id", "amount", "status", "created_at", "paid_at"]].copy()
    
    # Ajustar tipos de datos
    df_charges["amount"] = df_charges["amount"].astype("float64")
    df_charges["created_at"] = pd.to_datetime(df_charges["created_at"])
    df_charges["paid_at"] = pd.to_datetime(df_charges["paid_at"])
    
    return df_companies, df_charges

def load_data(df_companies, df_charges):
    """Carga los datos transformados en SQLite."""
    conn = sqlite3.connect("etl_db.db")  # Nombre actualizado aquí
    
    # Cargar datos
    df_companies.to_sql("companies", conn, if_exists="replace", index=False)
    df_charges.to_sql("charges", conn, if_exists="replace", index=False)
    
    # Crear vista
    cursor = conn.cursor()
    cursor.execute("""
    CREATE VIEW IF NOT EXISTS daily_transactions AS
    SELECT 
        c.name AS company_name,
        DATE(ch.created_at) AS transaction_date,
        COUNT(ch.id) AS total_transactions,
        SUM(ch.amount) AS total_amount,
        SUM(CASE WHEN ch.status = 'paid' THEN ch.amount ELSE 0 END) AS paid_amount
    FROM charges ch
    JOIN companies c ON ch.company_id = c.id
    GROUP BY c.name, DATE(ch.created_at)
    ORDER BY transaction_date;
    """)
    
    conn.commit()
    conn.close()
    print("✅ Datos cargados en 'etl_db.db' y vista creada exitosamente.")

# -----------------------------------------------
# 3. EJECUCIÓN PRINCIPAL
# -----------------------------------------------
if __name__ == "__main__":
    # Configuración
    CSV_PATH = "data_prueba_tecnica.csv"  # Ruta del archivo CSV
    N_ROWS = 50  # Registros a procesar
    
    try:
        print("\n" + "="*50)
        print("  INICIANDO PROCESO ETL (Base de datos: etl_db.db)")
        print("="*50)
        
        create_database()
        df_raw = extract_data(CSV_PATH, N_ROWS)
        df_companies, df_charges = transform_data(df_raw)
        load_data(df_companies, df_charges)
        
        # Verificación final
        conn = sqlite3.connect("etl_db.db")
        print("\n🔍 Muestra de la vista 'daily_transactions':")
        print(pd.read_sql("SELECT * FROM daily_transactions LIMIT 5;", conn))
        
        print("\n🔍 Muestra de la tabla 'charges':")
        print(pd.read_sql("SELECT id, company_id, amount, status FROM charges LIMIT 5;", conn))
        conn.close()
        
    except Exception as e:
        print(f"\n❌ ¡Error durante el proceso!: {str(e)}")
    finally:
        print("\n" + "="*50)
        print("  PROCESO TERMINADO")
        print("="*50)