import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getStatesThunk } from "../store/slices/stateSlice";
import { getCitiesThunk } from "../store/slices/citySlice";

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { states } = useSelector((s) => s.states);
  const { cities } = useSelector((s) => s.city);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    dispatch(getStatesThunk());
    dispatch(getCitiesThunk());
  }, [dispatch]);

  // ---------------------------------------------------
  // ✅ FIX: Get all mainCity names based on selected state
  // ---------------------------------------------------
  const cityList =
    selectedState !== ""
      ? cities
        .filter((c) => c.state?._id === selectedState) // match state
        .map((c) => c.mainCity) // take mainCity field
      : [];

  // Slug Generator
  const makeSlug = (name) =>
    name?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "";

  // ---------------------------------------------------
  // 🔍 SEARCH HANDLER
  // ---------------------------------------------------
  const handleSearch = () => {
    if (!selectedState) {
      alert("Please select a state.");
      return;
    }

    const stateObj = states.find((s) => s._id === selectedState);
    if (!stateObj) {
      alert("State not found.");
      return;
    }

    const stateSlug = makeSlug(stateObj.name);

    // Get any main city row (to use its backend _id as cityId)
    const mainCityRecord = cities.find(
      (c) => c.state?._id === selectedState
    );

    if (!mainCityRecord) {
      alert("No city found for this state.");
      return;
    }

    // If NO city selected → go to STATE PAGE
    if (!selectedCity) {
      navigate(`/city/${stateSlug}`, {
        state: { cityId: mainCityRecord._id },
      });
      return;
    }

    // Redirect with subCity selected
    navigate(`/city/${stateSlug}?subCity=${selectedCity}`, {
      state: { cityId: mainCityRecord._id },
    });
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <section className="w-full bg-linear-to-r from-[#00B9BE] to-[#7CC7EC] text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-20 ">

        <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold leading-snug">
          Welcome to Girls with Wine
        </h1>

        <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug">
          An Indian Classifieds Site
          <br />
          <span className="md:text-5xl">Featuring call girl Girl Services</span>
        </h2>

        {/* SEARCH BOX */}
        <div className="w-full bg-white/20 backdrop-blur-md rounded-xl p-6 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Category Dropdown */}
            <select required className="w-full bg-white text-gray-800 px-3 py-3 rounded-md ">
              <option>Select Category</option>
              <option>Call Girls</option>
              <option>Massage</option>
            </select>

            {/* State Dropdown */}
            <select
              required
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
              className="w-full bg-white text-gray-800 px-3 py-3 rounded-md"
            >
              <option value="">Select State</option>

              {states?.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name}
                </option>
              ))}
            </select>

            {/* City Dropdown (mainCity names) */}
            <select
              required
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
              className="w-full bg-white text-gray-800 px-3 py-3 rounded-md"
            >
              <option value="">Select City</option>

              {cityList.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="What you are looking for"
              className="w-full bg-white text-gray-800 px-3 py-3 rounded-md"
            />

            {/* Button */}
            <button
              onClick={handleSearch}
              className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-[#A01047] hover:text-white transition cursor-pointer"
            >
              SEARCH
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
