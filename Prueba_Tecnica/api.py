from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="API de Números Faltantes")

class ConjuntoNumerosNaturales:
    def __init__(self):
        self.numeros = set(range(1, 101))  # Conjunto del 1 al 100
    
    def extract(self, numero: int):
        """Extrae un número del conjunto."""
        if numero < 1 or numero > 100:
            raise ValueError("El número debe estar entre 1 y 100.")
        if numero not in self.numeros:
            raise ValueError("El número ya fue extraído o no existe.")
        self.numeros.remove(numero)
        return {"message": f"Se extrajo el número {numero} correctamente."}
    
    def calcular_numero_faltante(self):
        """Calcula el número faltante."""
        suma_esperada = 5050  # Suma de los primeros 100 números naturales
        suma_actual = sum(self.numeros)
        faltante = suma_esperada - suma_actual
        if faltante == 0:
            return {"message": "No falta ningún número."}
        elif 1 <= faltante <= 100:
            return {"faltante": faltante}
        else:
            return {"message": "Error: El conjunto está corrupto."}

# Instancia global (para simular persistencia entre llamadas)
conjunto = ConjuntoNumerosNaturales()

# Modelo Pydantic para validar el input del usuario
class NumeroInput(BaseModel):
    numero: int

# Endpoints
@app.post("/extraer/", summary="Extrae un número del conjunto")
async def extraer_numero(data: NumeroInput):
    try:
        return conjunto.extract(data.numero)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/calcular-faltante/", summary="Calcula el número faltante")
async def obtener_faltante():
    return conjunto.calcular_numero_faltante()

@app.get("/reset/", summary="Reinicia el conjunto a los primeros 100 números")
async def reset():
    global conjunto
    conjunto = ConjuntoNumerosNaturales()
    return {"message": "Conjunto reiniciado correctamente."}

@app.get("/")
async def root():
    return {
        "message": "Bienvenido a la API de Números Faltantes",
        "endpoints": {
            "extraer_numero": "POST /extraer/",
            "calcular_faltante": "GET /calcular-faltante/",
            "reset": "GET /reset/"
        },
        "documentacion": "/docs"
    }