# House Price Predictor

A full-stack machine learning app that predicts house prices based on the Ames Housing Dataset.  
Built using Flask, React, and a Random Forest regression model.

## How to Use

### 1. Clone or download this repository

### 2. Backend Setup

Location: `/backend/Generate Everything`

- Open and run `GenerateAllDataAndModel.ipynb` (Takes ~1–2 minutes)

Location: `/backend`

- Run `mainServer.py`  
  (Keep it running — this hosts the ML model and handles predictions)

### 3. Frontend Setup

Location: `/frontend/amesHousePricePredictor`

- Open terminal in this folder  
- Run: `npm install`  
- Start dev server: `npm run dev`  
- Open the `localhost` link shown in terminal

## Tech Stack

### Frontend:
- React
- Bootstrap

### Backend:
- Python
- Flask
- Jupyter Notebook

## Machine Learning Details

### Model:
- Random Forest Regression

### Dataset:
- Ames Housing Dataset (cleaned and preprocessed)

## Procedure

- Clean raw data
- Train and test the model
- Save model, score, and feature importance locally
- Create a preprocessor to handle raw input from frontend
- Use saved model and preprocessor to generate predictions on server
- Frontend sends raw data to server → receives predicted price
- Frontend can also request score and feature importance from the server

## 📄 License

This project is licensed under a **proprietary license**.  
It is available for **educational and demonstration purposes only**.  
Use, redistribution, or modification is **not permitted without written consent**.
