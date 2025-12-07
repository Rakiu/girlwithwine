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

  // ✅ Filter cities based on state
  const cityList =
    selectedState !== ""
      ? cities
          .filter((c) => c.state?._id === selectedState)
          .map((c) => c.mainCity)
      : [];

  // ✅ Slug Generator
  const makeSlug = (name) =>
    name?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "";

  // ✅ Search Handler
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

    const mainCityRecord = cities.find(
      (c) => c.state?._id === selectedState
    );

    if (!mainCityRecord) {
      alert("No city found for this state.");
      return;
    }

    if (!selectedCity) {
      navigate(`/city/${stateSlug}`, {
        state: { cityId: mainCityRecord._id },
      });
      return;
    }

    navigate(`/city/${stateSlug}?subCity=${selectedCity}`, {
      state: { cityId: mainCityRecord._id },
    });
  };

  return (
    <section className="w-full bg-gradient-to-r from-[#00B9BE] to-[#7CC7EC] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16 md:py-20">

        {/* ✅ HEADINGS */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          Welcome to Girls with Wine
        </h1>

        <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
          An Indian Classifieds Site
          <br />
          <span className="text-lg sm:text-2xl md:text-4xl lg:text-5xl">
            Featuring Call Girl Services
          </span>
        </h2>

        {/* ✅ SEARCH BOX */}
        <div className="w-full bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 mt-8 sm:mt-10 shadow-lg">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Category */}
            <select className="w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base">
              <option>Select Category</option>
              <option>Call Girls</option>
              <option>Massage</option>
            </select>

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
              className="w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base"
            >
              <option value="">Select State</option>
              {states?.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name}
                </option>
              ))}
            </select>

            {/* City */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
              className="w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base disabled:opacity-60"
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
              className="w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-[#A01047] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#A01047] transition cursor-pointer"
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
