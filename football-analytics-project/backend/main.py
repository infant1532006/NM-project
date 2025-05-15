
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dataframe = None

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    global dataframe
    contents = await file.read()
    s = str(contents, 'utf-8')
    dataframe = pd.read_csv(StringIO(s))
    return {"filename": file.filename}

@app.get("/player-metrics")
def player_metrics():
    global dataframe
    if dataframe is None:
        return {"error": "No data uploaded"}
    player_stats = dataframe.groupby('Player').agg({'Goals': 'sum'}).reset_index()
    return player_stats.to_dict(orient="records")

@app.get("/team-stats")
def team_stats():
    global dataframe
    if dataframe is None:
        return {"error": "No data uploaded"}
    team_stats = dataframe.groupby('Team').agg({'Possession': 'mean'}).reset_index()
    return team_stats.to_dict(orient="records")
