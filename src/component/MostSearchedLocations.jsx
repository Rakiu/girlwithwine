import React, { useState, useRef, useEffect } from "react";
import { FiChevronRight, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCitiesThunk } from "../store/slices/citySlice";

const MostSearchedLocations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cities, loading } = useSelector((state) => state.city);

  const [locations, setLocations] = useState([]);
  const [index, setIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  const cardWidth = 320;
  const cardGap = 20;

  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  // ✅ GROUP BY STATE + STORE FIRST CITY ID AS cityId
  useEffect(() => {
    if (!Array.isArray(cities)) return;

    const grouped = {};

    cities.forEach((city) => {
      const stateId = city.state?._id;
      const stateName = city.state?.name;

      if (!stateId) return;

      if (!grouped[stateId]) {
        grouped[stateId] = {
          stateId,
          stateName,
          cityId: city._id,        // ✅ यही सही cityId है
          allMainCities: [],
        };
      }

      if (city.mainCity) {
        grouped[stateId].allMainCities.push(city.mainCity.trim());
      }
    });

    const formatted = Object.values(grouped).map((item, idx) => ({
      ...item,
      allMainCities: [...new Set(item.allMainCities)],
      color: idx % 2 === 0 ? "bg-[#A3195B]" : "bg-[#0D86D1]",
    }));

    setLocations(formatted);
  }, [cities]);

  // ✅ RESPONSIVE COLUMN CONTROL
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsToShow(1);
      else if (width < 1024) setCardsToShow(2);
      else if (width < 1400) setCardsToShow(3);
      else setCardsToShow(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ AUTO SLIDE FIX
  useEffect(() => {
    const max = Math.max(0, locations.length - cardsToShow);
    if (index > max) setIndex(max);
  }, [cardsToShow, locations.length]);

  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.style.transform = `translateX(-${index * (cardWidth + cardGap)}px)`;
    sliderRef.current.style.transition = "transform 0.4s ease-in-out";
  }, [index]);

  const maxIndex = Math.max(0, locations.length - cardsToShow);
  const nextSlide = () => setIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setIndex((prev) => Math.max(prev - 1, 0));

  // ✅ MOBILE SWIPE
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 60) nextSlide();
    if (swipeDistance < -60) prevSlide();
  };

  return (
    <section className="bg-[#E9F7FE] py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#A3195B]">
          Most Searched Locations in India
        </h2>

        {!loading && locations.length > 0 && (
          <div
            className="relative flex items-center mt-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={prevSlide}
              disabled={index === 0}
              className="hidden md:flex text-3xl text-[#A3195B] p-3"
            >
              <FiArrowLeft />
            </button>

            <div className="overflow-hidden flex-1">
              <div
                ref={sliderRef}
                className="flex gap-5"
                style={{ width: locations.length * (cardWidth + cardGap) }}
              >
                {locations.map((item) => (
                  <div
                    key={item.stateId}
                    className="bg-white rounded-2xl shadow-lg border flex flex-col py-5 h-[420px] shrink-0"
                    style={{ width: cardWidth }}
                  >
                    <div className="flex justify-center mb-3">
                      <div className={`${item.color} text-white p-3 rounded-xl`}>
                        <IoLocationSharp size={28} />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-center text-[#A3195B] capitalize">
                      {item.stateName}
                    </h3>

                    <ul className="mt-4 text-gray-800 flex-1 border-t pt-2 overflow-y-auto">
                      {item.allMainCities.slice(0, 6).map((city, idx) => (
                        <li
                          key={idx}
                          onClick={() =>
                            navigate(`/city/${city.toLowerCase()}`, {
                              state: { cityId: item.cityId }, // ✅ CORRECT cityId
                            })
                          }
                          className="cursor-pointer px-5 py-2.5 border-b flex justify-between items-center hover:bg-gray-100"
                        >
                          {city} Call Girls <FiChevronRight />
                        </li>
                      ))}
                    </ul>

                    {/* ✅ FINAL FIX: YAHAN SAME cityId JAYEGA */}
                    <div className="mt-4 text-center">
                      <button
                        onClick={() =>
                          navigate(`/city/${item.stateName.toLowerCase()}`, {
                            state: { cityId: item.cityId }, // ✅ यही CityGirlsPage use karega
                          })
                        }
                        className="border px-6 py-2 rounded-full text-sm font-medium text-[#A3195B] hover:bg-[#A3195B] hover:text-white transition"
                      >
                        View State <FiChevronRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              disabled={index >= maxIndex}
              className="hidden md:flex text-3xl text-[#A3195B] p-3"
            >
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MostSearchedLocations;
