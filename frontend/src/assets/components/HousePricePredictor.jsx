// src/components/HousePricePredictor.jsx
import React, { useState } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import PredictionResult from "./PredictionResult";
import ModelMetrics from "./ModelMetrics";

const initialForm = {
  FullBath: "",
  HalfBath: "",
  GrLivArea: "",
  TotalBsmtSF: "",
  YearBuilt: "",
  YrSold: "",
  MoSold: "",
  GarageArea: "",
  LotArea: "",
  OverallQual: "",
  OverallCond: "",
  Neighborhood: "",
  KitchenQual: "",
  BsmtQual: "",
  YearRemodAdd: "",
  WoodDeckSF: "",
  LotFrontage: "",
};

const neighborhoodOptions = [
  "NAmes",
  "Sawyer",
  "BrkSide",
  "OldTown",
  "IDOTRR",
  "Edwards",
  "MeadowV",
  "Gilbert",
  "Blmngtn",
  "CollgCr",
  "Blueste",
  "Timber",
  "Veenker",
  "GrnHill",
  "StoneBr",
  "Somerst",
  "NridgHt",
  "NoRidge",
  "Greens",
  "NWAmes",
  "BrDale",
  "NPkVill",
  "SawyerW",
  "ClearCr",
  "SWISU",
  "Crawfor",
  "Mitchel",
  "Landmrk",
];
const qualityOptions = ["Ex", "Gd", "TA", "Fa", "Po"];
const bsmtOptions = ["Ex", "Gd", "TA", "Fa", "NA"];

export default function HousePricePredictor() {
  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  function generateRandomForm() {
    return {
      FullBath: Math.floor(Math.random() * 5).toString(), // 0-4
      HalfBath: Math.floor(Math.random() * 7).toString(), // 0-6
      GrLivArea: Math.floor(Math.random() * (6428 / 2)).toString(), // 0-3214
      TotalBsmtSF: Math.floor(Math.random() * (6428 / 2)).toString(), // 0-3214
      YearBuilt: Math.floor(
        Math.random() * (2023 - 1950 + 1) + 1950
      ).toString(), // 1950-2023
      YrSold: Math.floor(Math.random() * (2009 - 2000 + 1) + 2000).toString(), // 2000-2009
      MoSold: Math.floor(Math.random() * 12 + 1).toString(), // 1-12
      GarageArea: Math.floor(Math.random() * 1301).toString(), // 0-1300
      LotArea: Math.floor(Math.random() * 25001).toString(), // 0-25000
      OverallQual: Math.floor(Math.random() * 10 + 1).toString(), // 1-10
      OverallCond: Math.floor(Math.random() * 9 + 1).toString(), // 1-9
      Neighborhood: Math.floor(Math.random() * 4 + 1).toString(), // 1-4
      KitchenQual: ["Fa", "Gd", "Po", "TA", "Ex"][
        Math.floor(Math.random() * 5)
      ],
      BsmtQual: ["NA", "Fa", "Gd", "TA", "Ex"][Math.floor(Math.random() * 5)],
      YearRemodAdd: Math.floor(
        Math.random() * (2005 - 1950 + 1) + 1950
      ).toString(), // 1950-2005
      WoodDeckSF: Math.floor(Math.random() * 161).toString(), // 0-160
      LotFrontage: Math.floor(Math.random() * 181).toString(), // 0-180
    };
  }
  const handleSubmit = async () => {
    // compute derived features
    let totalBath, totalSf, age;
    if (form.FullBath === "" && form.HalfBath === "") totalBath = null;
    else {
      const full = parseFloat(form.FullBath) || 0;
      const half = parseFloat(form.HalfBath) || 0;
      totalBath = full + 0.5 * half;
    }
    if (form.GrLivArea === "" && form.TotalBsmtSF === "") totalSf = null;
    else {
      const gr = parseFloat(form.GrLivArea) || 0;
      const bsmt = parseFloat(form.TotalBsmtSF) || 0;
      totalSf = gr + bsmt;
    }
    if (form.YearBuilt === "" && form.YrSold === "") age = null;
    else {
      const built = parseInt(form.YearBuilt) || 2000;
      const sold = parseInt(form.YrSold) || 2010;
      age = sold - built;
    }
    const processedData = {
      OverallQual: form.OverallQual || null,
      TotalSF: totalSf,
      Age: age,
      YearRemodAdd: form.YearRemodAdd || null,
      LotArea: form.LotArea || null,
      TotalBath: totalBath,
      GarageArea: form.GarageArea || null,
      LotFrontage: form.LotFrontage || null,
      KitchenQual: form.KitchenQual || null,
      OverallCond: form.OverallCond || null,
      WoodDeckSF: form.WoodDeckSF || null,
      MoSold: form.MoSold || null,
      BsmtQual: form.BsmtQual || null,
      Neighborhood: form.Neighborhood || null,
    };
    console.log("Processed Data:", processedData);
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        processedData
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to predict. Check the console for details.");
    }
  };
  //lot frontage and year remodelled is not added
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Ames House Price Predictor</h2>

          <div className="bg-gray-50 p-4 rounded-md mb-6 shadow-sm">
            <h5 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
              Living Area
            </h5>
            <div className="row ">
              <FormInput
                name="GrLivArea"
                label="Above Ground Living Area"
                value={form.GrLivArea}
                onChange={handleChange}
                placeHolder="Enter a number"
              />
              <FormInput
                name="TotalBsmtSF"
                label="Total Basement Area"
                value={form.TotalBsmtSF}
                onChange={handleChange}
                placeHolder="Enter a number"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6 shadow-sm">
            {" "}
            <h5 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
              House Year Info
            </h5>
            <div className="row">
              <FormInput
                name="YrSold"
                label="Year Sold"
                value={form.YrSold}
                onChange={handleChange}
                placeHolder="Enter an Year"
              />
              <FormInput
                name="MoSold"
                label="Month Sold"
                value={form.MoSold}
                onChange={handleChange}
                placeHolder="Enter a number 1-12"
              />
              <FormInput
                name="YearBuilt"
                label="Year Built"
                value={form.YearBuilt}
                onChange={handleChange}
                placeHolder="Enter an Year"
              />
              <FormInput
                name="YearRemodAdd"
                label="Year Remodeled"
                value={form.YearRemodAdd}
                onChange={handleChange}
                placeHolder="Enter year of remodeling"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6 shadow-sm">
            {" "}
            <h5 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
              Bathroom Info
            </h5>
            <div className="row">
              <FormInput
                name="FullBath"
                label="Full Bathrooms"
                value={form.FullBath}
                onChange={handleChange}
                placeHolder="Enter a number"
              />
              <FormInput
                name="HalfBath"
                label="Half Bathrooms"
                value={form.HalfBath}
                onChange={handleChange}
                placeHolder="Enter a number"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6 shadow-sm">
            {" "}
            <h5 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
              Neighborhood and Quality
            </h5>
            <div className="row">
              <FormInput
                name="Neighborhood"
                label="Neighborhood"
                value={form.Neighborhood}
                onChange={handleChange}
                options={neighborhoodOptions}
              />
              <FormInput
                name="KitchenQual"
                label="Kitchen Quality"
                value={form.KitchenQual}
                onChange={handleChange}
                options={qualityOptions}
              />
              <FormInput
                name="BsmtQual"
                label="Basement Quality"
                value={form.BsmtQual}
                onChange={handleChange}
                options={bsmtOptions}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6 shadow-sm">
            {" "}
            <h5 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
              Additional Features
            </h5>
            <div className="row">
              <FormInput
                name="OverallQual"
                label="Overall Quality"
                value={form.OverallQual}
                onChange={handleChange}
                placeHolder="Enter a number 1-10"
              />
              <FormInput
                name="OverallCond"
                label="Overall Condition"
                value={form.OverallCond}
                onChange={handleChange}
                placeHolder="Enter a number 1-9"
              />
              <FormInput
                name="GarageArea"
                label="Garage Area"
                value={form.GarageArea}
                onChange={handleChange}
                placeHolder="Enter a number"
              />
              <FormInput
                name="LotArea"
                label="Lot Area"
                value={form.LotArea}
                onChange={handleChange}
                placeHolder="Enter a number"
              />
              <FormInput
                name="LotFrontage"
                label="Lot Frontage"
                value={form.LotFrontage}
                onChange={handleChange}
                placeHolder="Enter lot frontage"
              />
              <FormInput
                name="WoodDeckSF"
                label="Wood Deck SF"
                value={form.WoodDeckSF}
                onChange={handleChange}
                placeHolder="Enter square feet of wood deck"
              />
            </div>
          </div>

          <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>
            Predict Price
          </button>
          {prediction && <PredictionResult prediction={prediction} />}

          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="mt-4  px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded shadow"
          >
            Clear Form
          </button>
          <button
            type="button"
            onClick={() => setForm(generateRandomForm())}
            className="mt-4  px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded shadow"
          >
            Random
          </button>
        </div>
      </div>

      <ModelMetrics />
    </div>
  );
}
