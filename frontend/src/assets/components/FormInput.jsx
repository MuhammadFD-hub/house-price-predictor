import React from "react";

export default function FormInput({
  name,
  label,
  value,
  onChange,
  type = "text",
  options,
  placeHolder,
}) {
  return (
    <div className="col-md-6 mb-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-control"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          className="form-control"
          placeholder={placeHolder}
        />
      )}
    </div>
  );
}
