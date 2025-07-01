import React from "react";

export default function PredictionResult({ prediction }) {
  return (
    <div className="alert alert-success mt-4">
      <strong>Predicted Sale Price:</strong> ${prediction.toLocaleString()}
    </div>
  );
}
