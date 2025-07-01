from flask import Flask, request, jsonify
import joblib
import os
import importlib.util
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "Exports", "model_columns_encoded.json")) as f:
    full_columns = json.load(f)

with open(os.path.join(BASE_DIR, "Exports", "metrics.json")) as f:
    metrics = json.load(f)

with open(os.path.join(BASE_DIR, "Exports", "important_features.json")) as f:
    feature_importance = json.load(f)

with open(os.path.join(BASE_DIR, "Exports", "house_price_model.pkl"), "rb") as f:
    model = joblib.load(f)

PREPROCESSOR_PATH = os.path.join(BASE_DIR, "Preprocessor", "preprocess.py")

spec = importlib.util.spec_from_file_location("preprocess", PREPROCESSOR_PATH)

preprocessor_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preprocessor_module)
preprocess_input = preprocessor_module.preprocess_input


app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    raw_data = request.get_json()
    df = preprocess_input(raw_data, full_columns)
    prediction = model.predict(df)[0]
    return jsonify({"prediction": round(prediction, 2)})


@app.route("/metrics", methods=["GET"])
def get_metrics():
    return jsonify(metrics)


@app.route("/importance", methods=["GET"])
def get_importance():
    return jsonify(feature_importance)


if __name__ == "__main__":
    app.run(debug=True)
