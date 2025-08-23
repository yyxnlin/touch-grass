from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as routes_router

app = FastAPI(title="Touch Grass API 🌱")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include your endpoints
app.include_router(routes_router)

@app.get("/ping")
def ping():
    return {"ok": True, "message": "Touch Grass server running!"}
