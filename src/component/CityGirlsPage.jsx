import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

import { getGirlsByCityThunk } from "../store/slices/girlSlice";
import { getCitiesThunk, getCityByIdThunk } from "../store/slices/citySlice";

import Header from "./common/header";
import Footer from "./common/Footer";
import CitySection from "./CitySection";

const CityGirlsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);
  const { cityName } = useParams();        // SEO-friendly name for UI
  const location = useLocation();
  const { cities } = useSelector((state) => state.city);
  // 🔥 The cityId is received from navigate() state (NOT from URL)
  const cityId = location.state?.cityId || null;

  const queryParams = new URLSearchParams(location.search);
  const subCity = queryParams.get("subCity");

  const { cityGirls = [], loading } = useSelector((s) => s.girls);
  const { singleCity } = useSelector((s) => s.city);

  const [searchText, setSearchText] = useState("");

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    // ❌ Do NOT fetch with cityName
    // ✅ Backend ONLY understands cityId
    if (!cityId) return;

    dispatch(getCityByIdThunk(cityId));
    dispatch(getGirlsByCityThunk(cityId));
  }, [cityId, dispatch]);

  /* -------------------- FORMAT TEXT -------------------- */
  const replaceCityName = (text = "", cityName = "") =>
    String(text).replace(/{{cityName}}/g, cityName);

  const createWhatsAppURL = (cityName, number) => {
    const num = String(number || "").replace(/[^0-9]/g, "");
    if (!num) return "#";
    return `https://wa.me/91${num}?text=${encodeURIComponent(
      `Hello, I want booking in ${cityName} city.`
    )}`;
  };

  /* -------------------- SEARCH FILTER -------------------- */
  const filteredGirls = cityGirls.filter((girl) => {
    const txt = searchText.toLowerCase();
    return (
      girl.name?.toLowerCase().includes(txt) ||
      girl.heading?.toLowerCase().includes(txt) ||
      girl.description?.toLowerCase().includes(txt)
    );
  });

  /* -------------------- CITY DATA -------------------- */
  const cityObj = singleCity || {};

  let matchedLocalArea = null;

  if (subCity && Array.isArray(cityObj?.localAreas)) {
    matchedLocalArea = cityObj.localAreas.find(
      (a) => a.name.toLowerCase() === subCity.toLowerCase()
    );
  }

  const finalName = subCity
    ? cityObj?.state?.name || ""
    : matchedLocalArea?.name || cityObj?.mainCity || "";

  const finalDescription =
    matchedLocalArea?.description ||
    cityObj?.description ||
    `<p>No description available for <strong>${finalName}</strong>.</p>`;

  const showRightSidebar = searchText.trim() === "";

  /* -------------------- UI -------------------- */
  return (
    <>
      <Header />

      <div className="px-4 sm:px-6 lg:px-8">

        {/* ---------------- BREADCRUMB ---------------- */}
        <div className="bg-gray-50 py-3 mt-6 rounded-md px-4 flex flex-col sm:flex-row sm:justify-between gap-3 shadow-sm">
          <div className="text-sm text-gray-600 flex items-center gap-1 flex-wrap">
            <span className="text-[#C2185B] font-semibold cursor-pointer">Home</span>
            <span>/</span>

            <span className="text-[#C2185B] font-semibold cursor-pointer">Call-Girls</span>

            {finalName && (
              <>
                <span>/</span>
                <span className="text-[#C2185B] capitalize font-semibold cursor-pointer">
                  {finalName}
                </span>
              </>
            )}

            {subCity && (
              <>
                <span>/</span>
                <span className="text-[#C2185B] capitalize font-semibold cursor-pointer">
                  {subCity}
                </span>
              </>
            )}
          </div>

          {/* SEARCH */}
          <div className="flex w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search models..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border border-gray-300 rounded-l-full px-4 py-2 w-full sm:w-72 text-sm"
            />
            <button className="bg-[#C2185B] px-4 rounded-r-full flex items-center text-white">
              <CiSearch className="text-2xl" />
            </button>
          </div>
        </div>

        {/* ---------------- PAGE HEADING ---------------- */}
        <div className="pt-10 text-center max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#B30059]">
            Enjoy your private Moments with our Beautiful{" "}
            <span className="text-[#C2185B] capitalize">{finalName} Call Girls</span>
          </h1>
          <p className="text-gray-700 max-w-7xl mx-auto mt-4 text-[15px] leading-relaxed">
            One of the top classified advertisements websites for escort services in  <span className="font-semibold text-[#B30059] capitalize"> {finalName} </span>,
            is Girls With Wine Agency, which provides clients looking for enjoyment with first-rate services. Customers can select from a range of beauty with a selection of young females accessible for day and night sessions. The agency promises a sincere encounter that leaves clients feeling content and at ease. Because of their talent, our
            <span className="font-semibold text-[#B30059] capitalize"> {finalName} call girl </span>
            beauty make every moment spent with them feel like paradise. Girls With Wine provides clients with VIP attention, 24/7 services, and facilities that can be customized. To the best of our ability, we strive to meet the needs of the client.

          </p>
        </div>

        {/* ---------------- CONTENT AREA ---------------- */}
        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 ">

          {/* ---------------- GIRL LIST ---------------- */}
          <div>
            {loading ? (
              <p className="text-center py-10">Loading...</p>
            ) : filteredGirls.length > 0 ? (
              <div className="space-y-5 ">
                {filteredGirls.map((girl) => {
                  const wp = girl.whatsappNumber || cityObj?.whatsappNumber;
                  const call = girl.phoneNumber || cityObj?.phoneNumber;

                  return (
                    <div
                      key={girl._id}
                      onClick={() =>
                        navigate(`/girl/${girl.name.replace(/\s+/g, "-").toLowerCase()}`, {
                          state: { girlId: girl._id },
                        })
                      }
                      className="cursor-pointer bg-white rounded-xl p-4 shadow-sm hover:shadow-md 
             transition-all border border-gray-200 flex gap-4"
                    >
                      {/* IMAGE */}
                      <img
                        src={girl.imageUrl}
                        alt={girl.name}
                        className="w-24 h-24 sm:w-40 sm:h-40 object-cover rounded-xl"
                      />

                      {/* RIGHT SIDE CONTENT */}
                      <div className="flex flex-col justify-between w-full">

                        {/* HEADING */}
                        <h3 className=" text-[10px] lg:text-[20px] font-bold text-[#B30059] leading-tight">
                          {replaceCityName(girl.heading, finalName)}
                        </h3>

                        {/* DESCRIPTION */}
                        <p className=" text-[10px]  lg:text-[15px] text-gray-700 mt-1 leading-snug line-clamp-2">
                          {replaceCityName(girl.description, finalName)}
                        </p>

                        {/* AGE + CATEGORY ROW */}
                        <div className="flex flex-wrap gap-3 text-[10px] lg:text-[15px] mt-3 font-semibold text-[#B30059]">
                          {girl.age && <span>{girl.age} Years</span>}
                          <span className="text-gray-400">|</span>
                          <span>Call Girls</span>
                          <span className="text-gray-400">|</span>
                          <span>{finalName}</span>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-3 mt-4 justify-end">
                          {wp && (
                            <a
                              onClick={(e) => e.stopPropagation()}
                              target="_blank"
                              href={createWhatsAppURL(finalName, wp)}
                              className="px-2 py-2 bg-[#25D366] text-white text-[10px] rounded-md "
                            >
                              WhatsApp
                            </a>
                          )}

                          {call && (
                            <a
                              onClick={(e) => e.stopPropagation()}
                              href={`tel:91${call}`}
                              className="px-2 py-2 bg-[#B30059] text-white text-[10px] rounded-md"
                            >
                              Call Us
                            </a>
                          )}
                        </div>

                      </div>
                    </div>

                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">No profiles found.</p>
            )}
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          {showRightSidebar && (
            <div className="hidden lg:block">
              <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100">
                <h3 className="text-center bg-[#B30059] text-white py-2 rounded-lg text-sm font-bold">
                  Ads in {cityObj?.state?.name}
                </h3>

                <ul className="mt-4 text-sm text-gray-700">
                  {(cityObj?.localAreas || []).map((area) => (
                    <li key={area._id} className="border-b py-2">
                      Call Girls in {area.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- CITY DESCRIPTION ---------------- */}
        <div
          className="md:mt-20 mt-5 mb-5 md:mb-14 
             border-t  border-gray-300 
             text-gray-700 text-[14px] pb-4 max-w-7xl mx-auto"
          dangerouslySetInnerHTML={{
            __html: replaceCityName(finalDescription, finalName),
          }}
        />

      </div>

      <CitySection loading={loading} cities={cities} />

      <Footer />
    </>
  );
};

export default CityGirlsPage;
