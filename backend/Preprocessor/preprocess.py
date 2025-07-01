import joblib
import json
import pandas as pd
import numpy as np
import os


def preprocess_input(raw_data, full_columns):
    top_original_features = [
        "OverallQual",
        "TotalSF",
        "Age",
        "YearRemod/Add",
        "LotArea",
        "TotalBath",
        "GarageArea",
        "LotFrontage",
        "KitchenQual",
        "OverallCond",
        "WoodDeckSF",
        "MoSold",
        "BsmtQual",
        "Neighborhood_ord",
    ]

    if isinstance(raw_data, dict):
        df = pd.DataFrame([raw_data])
    elif isinstance(raw_data, pd.Series):
        df = pd.DataFrame([raw_data.to_dict()])
    else:
        raise ValueError("raw_data should be dict or pandas.Series")

    for f in top_original_features:
        if f not in df.columns:
            df[f] = np.nan

    df = df.replace(["", "NA", None], np.nan)
    df = df.infer_objects(copy=False)

    numeric_features = [
        "OverallQual",
        "TotalSF",
        "Age",
        "YearRemod/Add",
        "LotArea",
        "TotalBath",
        "GarageArea",
        "LotFrontage",
        "OverallCond",
        "WoodDeckSF",
        "MoSold",
    ]

    # empty =  median
    median_values = {
        "OverallQual": 6,
        "TotalSF": 2456,
        "Age": 34,
        "YearRemod/Add": 1993,
        "LotArea": 9464,
        "TotalBath": 2,
        "GarageArea": 480,
        "LotFrontage": 69,
        "OverallCond": 5,
        "WoodDeckSF": 0,
        "MoSold": 6,
    }
    for f in numeric_features:
        df[f] = pd.to_numeric(df[f], errors="coerce").fillna(median_values.get(f, 0))

    if "Neighborhood" in df.columns:
        avg_qual_bins = {
            1: [
                "NAmes",
                "Sawyer",
                "BrkSide",
                "OldTown",
                "IDOTRR",
                "Edwards",
                "MeadowV",
            ],
            3: [
                "Gilbert",
                "Blmngtn",
                "CollgCr",
                "Blueste",
                "Timber",
                "Veenker",
                "GrnHill",
            ],
            4: ["StoneBr", "Somerst", "NridgHt", "NoRidge", "Greens"],
            2: [
                "NWAmes",
                "BrDale",
                "NPkVill",
                "SawyerW",
                "ClearCr",
                "SWISU",
                "Crawfor",
                "Mitchel",
                "Landmrk",
            ],
        }

        def map_neigh(n):
            for bin_val, names in avg_qual_bins.items():
                if n in names:
                    return bin_val
            return 2  # default

        df["Neighborhood_ord"] = df["Neighborhood"].apply(map_neigh)
    else:
        df["Neighborhood_ord"] = 2  # default

    df["KitchenQual"] = df.get("KitchenQual", "TA").fillna("TA")
    df["BsmtQual"] = df.get("BsmtQual", "NA").fillna("NA")

    kitchen_levels = ["Fa", "Gd", "Po", "TA", "Ex"]
    bsmt_levels = ["NA", "Fa", "Gd", "TA", "Ex"]
    df["KitchenQual"] = pd.Categorical(df["KitchenQual"], categories=kitchen_levels)
    df["BsmtQual"] = pd.Categorical(df["BsmtQual"], categories=bsmt_levels)

    if "Neighborhood" in df.columns:
        df.drop(columns=["Neighborhood"], inplace=True)

    df = pd.get_dummies(df, drop_first=False)

    for col in full_columns:
        if col not in df.columns:
            df[col] = 0
    df = df.loc[:, df.columns.isin(full_columns)]
    df = df[full_columns]

    return df


test_input = {
    "OverallQual": 7,
    "TotalSF": 7,
    "Age": 7,
    "YearRemod/Add": 7,
    "LotArea": 7,
    "TotalBath": 7,
    "GarageArea": 7,
    "LotFrontage": 7,
    "OverallCond": 7,
    "WoodDeckSF": 7,
    "MoSold": 7,
    "Neighborhood": "StoneBr",
    "KitchenQual": "Ex",
    "MasVnrArea": 7,
    "OpenPorchSF": 7,
    "BsmtQual": "Ex",
    "Fireplaces": 7,
    "RandomColumn": 999,
}

# test_input = {
#     "OverallQual": "",
#     "TotalSF": "",
#     "Age": "",
#     "YearRemod/Add": "",
#     "LotArea": "",
#     "TotalBath": "",
#     "GarageArea": "",
#     "LotFrontage": "",
#     "OverallCond": "",
#     "WoodDeckSF": "",
#     "MoSold": "",
#     "Neighborhood": "",
#     "KitchenQual": "",
#     "MasVnrArea": "",
#     "OpenPorchSF": "",
#     "BsmtQual": "",
#     "Fireplaces": "",
#     "RandomColumn": "",
# }

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "../Exports", "model_columns_encoded.json"), "r") as f:
    full_cols = json.load(f)


with open(os.path.join(BASE_DIR, "../Exports", "house_price_model.pkl"), "rb") as f:
    model = joblib.load(f)

X_input = preprocess_input(test_input, full_cols)

prediction = model.predict(X_input)
