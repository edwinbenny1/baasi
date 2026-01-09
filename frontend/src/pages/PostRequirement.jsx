import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PostRequirement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    product: "",
    quantity: "",
    description: "",
    contact: "",
    name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  /* READ QUERY PARAMS */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setForm((prev) => ({
      ...prev,
      category: params.get("category") || "",
      subCategory: params.get("subCategory") || "",
    }));
  }, [location.search]);

  /* VALIDATION */
  const validate = (field, value) => {
    switch (field) {
      case "category":
      case "subCategory":
      case "product":
      case "quantity":
      case "name":
        return value ? "" : "Required";
      case "contact":
        return /^\d{10}$/.test(value) ? "" : "Enter 10-digit number";
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
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
      const res = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShowPopup(true);

      // auto redirect
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);

      setForm({
        category: "",
        subCategory: "",
        product: "",
        quantity: "",
        description: "",
        contact: "",
        name: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4 shadow"
      >
        <Input label="Category" value={form.category} disabled />
        <Input label="Sub Category" value={form.subCategory} disabled />

        <Input
          label="Product"
          value={form.product}
          onChange={(v) => handleChange("product", v)}
          error={errors.product}
        />

        <Input
          label="Quantity"
          type="number"
          value={form.quantity}
          onChange={(v) => handleChange("quantity", v)}
          error={errors.quantity}
        />

        <TextArea
          label="Description"
          value={form.description}
          onChange={(v) => handleChange("description", v)}
        />

        <Input
          label="Contact No"
          value={form.contact}
          onChange={(v) => handleChange("contact", v)}
          error={errors.contact}
        />

        <Input
          label="Name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
          error={errors.name}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-black"
          }`}
        >
          {loading ? "Submitting..." : "Submit Requirement"}
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">
              ✅ Submission Confirmed
            </h2>
            <p className="mb-4">
              Your requirement has been successfully submitted.
            </p>
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* COMPONENTS */

const Input = ({ label, value, onChange, error, type = "text", disabled }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="border w-full px-3 py-2 rounded"
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <textarea
      rows="3"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border w-full px-3 py-2 rounded"
    />
  </div>
);

export default PostRequirement;
