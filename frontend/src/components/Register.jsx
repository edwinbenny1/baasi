import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/* ---------- LOCATION DATA ---------- */
const LOCATION_DATA = {
  Kerala: {
    Ernakulam: ["Kochi", "Aluva", "Perumbavoor"],
    Kozhikode: ["Kozhikode City", "Vadakara"],
  },
  Karnataka: {
    Bangalore: ["Bangalore Urban", "Bangalore Rural"],
    Mysore: ["Mysore City"],
  },
  TamilNadu: {
    Chennai: ["Chennai North", "Chennai South"],
    Coimbatore: ["Coimbatore City"],
  },
};

const Register = ({ onClose }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shopName: "",
    state: "",
    district: "",
    city: "",
    category: "",
    subCategory: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------- VALIDATION ---------- */
  const validate = (field, value) => {
    switch (field) {
      case "shopName":
        return value.trim() ? "" : "Shop name is required";
      case "state":
      case "district":
      case "city":
      case "category":
      case "subCategory":
        return value ? "" : "Required";
      case "email":
        return /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email";
      case "password":
        return value.length >= 6 ? "" : "Min 6 characters";
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  /* ---------- REGISTER ---------- */
  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(form).forEach(([k, v]) => {
      const err = validate(k, v);
      if (err) newErrors[k] = err;
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email.trim().toLowerCase(),
        form.password
      );

      await setDoc(doc(db, "shops", userCred.user.uid), {
        shopName: form.shopName,
        state: form.state,
        district: form.district,
        city: form.city,
        category: form.category,
        subCategory: form.subCategory,
        email: form.email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
      });

      alert("✅ Registration successful!");

      // ✅ CLOSE MODAL
      onClose();

      // ✅ REDIRECT TO HOME
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Register error:", err);

      if (err.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else {
        alert("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2">✖</button>

        <h2 className="text-xl font-bold text-center mb-4">Register Shop</h2>

        <form onSubmit={handleRegister}>
          <Input label="Shop Name" value={form.shopName} onChange={(v) => handleChange("shopName", v)} error={errors.shopName} />

          <Select
            label="State"
            value={form.state}
            options={Object.keys(LOCATION_DATA)}
            onChange={(v) => {
              handleChange("state", v);
              handleChange("district", "");
              handleChange("city", "");
            }}
            error={errors.state}
          />

          {form.state && (
            <Select
              label="District"
              value={form.district}
              options={Object.keys(LOCATION_DATA[form.state])}
              onChange={(v) => {
                handleChange("district", v);
                handleChange("city", "");
              }}
              error={errors.district}
            />
          )}

          {form.state && form.district && (
            <Select
              label="City"
              value={form.city}
              options={LOCATION_DATA[form.state][form.district]}
              onChange={(v) => handleChange("city", v)}
              error={errors.city}
            />
          )}

          <Select
            label="Shop Category"
            value={form.category}
            options={["Product", "Services"]}
            onChange={(v) => {
              handleChange("category", v);
              handleChange("subCategory", "");
            }}
            error={errors.category}
          />

          {form.category && (
            <Select
              label={form.category === "Product" ? "Product Type" : "Service Type"}
              value={form.subCategory}
              options={
                form.category === "Product"
                  ? ["Tools & Accessories", "Medical Supplies"]
                  : ["Healthcare", "House Cleaning"]
              }
              onChange={(v) => handleChange("subCategory", v)}
              error={errors.subCategory}
            />
          )}

          <Input label="Email" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} />
          <Input label="Password" type="password" value={form.password} onChange={(v) => handleChange("password", v)} error={errors.password} />

          <button
            disabled={loading}
            className={`bg-black text-white w-full py-2 rounded mt-4 ${loading && "opacity-50"}`}
          >
            {loading ? "Registering..." : "Register →"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ---------- REUSABLE COMPONENTS ---------- */
const Input = ({ label, value, onChange, error, type = "text" }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border px-3 py-2 rounded ${error ? "border-red-500" : "border-gray-300"}`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const Select = ({ label, value, options, onChange, error }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border px-3 py-2 rounded ${error ? "border-red-500" : "border-gray-300"}`}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default Register;
