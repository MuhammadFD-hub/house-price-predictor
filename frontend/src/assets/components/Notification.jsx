import React, { useState } from "react";

export default function Notification() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-5 pr-10 mb-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-xl">⚠️</div>
        <div className="flex-1 text-sm leading-relaxed">
          <h5 className="font-semibold text-base mb-1">Heads up</h5>
          <p>
            Empty values will be automatically filled with the{" "}
            <strong>median</strong> (most of the time). If you want to enter{" "}
            <strong>zero</strong>, write it as{" "}
            <code className="bg-white px-1 rounded text-sm">0</code> explicitly.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-3 text-yellow-700 hover:text-yellow-900 text-lg font-bold focus:outline-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
