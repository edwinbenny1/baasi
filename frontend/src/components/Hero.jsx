import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

/* -------- SAMPLE LOCATION DATA -------- */
const STATES = ["Kerala", "Tamil Nadu", "Karnataka"];
const DISTRICTS = ["Ernakulam", "Trivandrum", "Chennai"];
const CITIES = ["Kochi", "Aluva", "Chennai"];

const Hero = () => {
  const navigate = useNavigate();

  /* -------- LOCATION -------- */
  const [locationType, setLocationType] = useState("");
  const [locationValue, setLocationValue] = useState("");

  /* -------- CATEGORY -------- */
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  /* -------- ERRORS -------- */
  const [errors, setErrors] = useState({});

  /* -------- HANDLE SEARCH -------- */
  const handleSearch = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!locationType || !locationValue) {
      newErrors.location = "Location is required";
    }
    if (!category) {
      newErrors.category = "Category is required";
    }
    if (!subCategory) {
      newErrors.subCategory = "Sub-category is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // ✅ Build query params
    const query = new URLSearchParams({
      locationType,
      locationValue,
      category,
      subCategory,
    });

    // ✅ Redirect to Post Requirement page
    navigate(`/post-requirement?${query.toString()}`);
  };

  /* -------- LOCATION OPTIONS -------- */
  const getLocationOptions = () => {
    if (locationType === "state") return STATES;
    if (locationType === "district") return DISTRICTS;
    if (locationType === "city") return CITIES;
    return [];
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center px-6"
      style={{
        backgroundImage: `url(${assets.heroBg || "/src/assets/3.jpg"})`,
      }}
    >
      <form
        onSubmit={handleSearch}
        className="bg-white p-6 rounded-xl shadow-lg flex flex-wrap gap-4 max-w-4xl"
      >
        {/* LOCATION TYPE */}
        <div>
          <select
            value={locationType}
            onChange={(e) => {
              setLocationType(e.target.value);
              setLocationValue("");
            }}
            className="border px-3 py-2 rounded w-40"
          >
            <option value="">Location</option>
            <option value="state">State</option>
            <option value="district">District</option>
            <option value="city">City</option>
          </select>
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* LOCATION VALUE */}
        {locationType && (
          <div>
            <select
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              className="border px-3 py-2 rounded w-44"
            >
              <option value="">Select</option>
              {getLocationOptions().map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CATEGORY */}
        <div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
            }}
            className="border px-3 py-2 rounded w-40"
          >
            <option value="">Category</option>
            <option value="Product">Product</option>
            <option value="Services">Services</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* SUB CATEGORY */}
        {category && (
          <div>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border px-3 py-2 rounded w-52"
            >
              <option value="">Sub Category</option>

              {category === "Product" && (
                <>
                  <option value="Tools & Accessories">
                    Tools & Accessories
                  </option>
                  <option value="Medical Supplies">
                    Medical Supplies
                  </option>
                </>
              )}

              {category === "Services" && (
                <>
                  <option value="Healthcare">Healthcare</option>
                  <option value="House Cleaning">House Cleaning</option>
                </>
              )}
            </select>
            {errors.subCategory && (
              <p className="text-red-500 text-xs mt-1">
                {errors.subCategory}
              </p>
            )}
          </div>
        )}

        {/* FIND BUTTON */}
        <button
          type="submit"
          className="bg-black text-white px-8 py-2 rounded self-end"
        >
          Find
        </button>
      </form>
    </div>
  );
};

export default Hero;
