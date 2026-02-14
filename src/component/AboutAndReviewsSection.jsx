import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCitiesThunk } from "../store/slices/citySlice";
import CitySection from "./CitySection";
import Faq from "./Faq";

const AboutAndReviewsSection = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  const { loading, cities } = useSelector((state) => state.city);

  // ===================== EXTENDED ABOUT CONTENT =====================
  const aboutSections = [
    {
      title: "Premium Escort Services at ₹2999",
      text: `Girls With Wine offers professional services with verified independent escorts suitable for private meetings, events, or travel companionship. The escorts are well-groomed and trained to fit perfectly in an elite environment. Regular services are also available with basic and limited customization. Our escort services include: `,
    },

    {
      title:
        "Why Girls With Wine is a Trusted Choice? ",
      text: `Confused about an agency to book escorts from? Girls With Wine has been serving more than a thousand clients for the past few years. Every profile comprises genuine details with accurate charges. We assure confidentiality using a secure communication channel. We request mutual consent from clients before confirming an independent escort service to avoid any legal discrepancies. `,
    },

    {
      title:
        "24/7 Escort Services in (city/state)",
      text: `Our platform lists profiles suitable for travelers, professionals, or local resident whether it is a day or late at night. Our24/7 support ensures you book escorts near you with flexible booking options. `,
    },
  ];

  return (
    <section className="w-full font-sans bg-white">
      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-16 text-center">

        {/* ✅ MAIN PAGE TITLE */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#00B9BE] mb-10 uppercase tracking-wider pb-3 border-b-4 border-gray-300 inline-block px-4">
          About Girls With Wine
        </h2>

        {/* ✅ CONTENT */}
        <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 text-left leading-relaxed">
          {aboutSections.map((sec, i) => (
            <div key={i} className="mb-10">

              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#00B9BE] mb-4 leading-tight">
                {sec.title}
              </h3>

              {sec.text && (
                <p className="text-gray-700 text-sm sm:text-base md:text-lg whitespace-pre-line mb-4">
                  {sec.text}
                </p>
              )}

              {sec.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm sm:text-base md:text-lg">
                  {sec.bullets.map((li, index) => (
                    <li key={index}>{li}</li>
                  ))}
                </ul>
              )}

            </div>
          ))}
        </div>
      </div>
      
      
      <Faq />
      {/* ✅ CITY SECTION (Unchanged) */}
      <CitySection loading={loading} cities={cities} />
    </section>
  );
};

export default AboutAndReviewsSection;
