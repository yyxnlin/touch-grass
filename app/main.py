from fastapi import FastAPI
from app.routes import router as routes_router

app = FastAPI(title="Touch Grass API 🌱")

# include your endpoints
app.include_router(routes_router)

@app.get("/ping")
def ping():
    return {"ok": True, "message": "Touch Grass server running!"}
