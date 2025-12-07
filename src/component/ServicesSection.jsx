import React from "react";
import { FiChevronRight } from "react-icons/fi";

import imgCallGirls from "../assets/10.jpg";
import imgMassage from "../assets/11.jpg";
import imgMaleEscorts from "../assets/12.jpg";

const ServicesSection = () => {
  const services = [
    {
      title: "Call Girls",
      img: imgCallGirls,
      description:
        "Girls with Wine is an adult classified website for Call girls and women that can help you find single call girls and women to satisfy your desires.",
      cities: ["Bangalore Call Girls", "Mumbai Call Girls", "Jaipur Call Girls"],
    },
    {
      title: "Massage",
      img: imgMassage,
      description:
        "The best massage ads for all kinds of sexy services. The hot massage girls will give you a relaxing full-body rub to make you feel amazing.",
      cities: ["Bangalore Massage", "Mumbai Massage", "Jaipur Massage"],
    },
    {
      title: "Male Escorts",
      img: imgMaleEscorts,
      description:
        "Find the hottest male escorts, boy toys, call boys, and other adult services on the best adult classifieds. Get the best adult experiences.",
      cities: [
        "Bangalore Male Escorts",
        "Mumbai Male Escorts",
        "Jaipur Male Escorts",
      ],
    },
  ];

  return (
    <section className="w-full bg-[#E9F7FE] px-4 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">

        {/* ✅ HEADING */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#A3195B] leading-tight">
          Search Or Post Your Adult Advertisements
        </h2>

        <div className="w-20 sm:w-24 h-1 bg-[#A3195B] mx-auto mt-3 mb-8"></div>

        {/* ✅ DESCRIPTION */}
        <div className="max-w-5xl mx-auto text-center px-2">
          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
            There is no better place in India for discovering professional escort/call girl talent listings than Girls with Wine.
          </p>

          <p className="mt-4 text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
            The platform helps users connect with verified girls in a secure and discreet environment.
          </p>
        </div>

        {/* ✅ SERVICE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mt-12 sm:mt-14">

          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
            >

              {/* ✅ IMAGE + FLOATING TITLE */}
              <div className="relative">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-52 sm:h-64 object-cover"
                />

                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#A3195B] text-white px-6 py-2 rounded-md shadow-lg text-sm sm:text-base font-semibold whitespace-nowrap">
                  {service.title}
                </div>
              </div>

              {/* ✅ DESCRIPTION */}
              <p className="p-4 pt-8 sm:pt-10 text-gray-700 text-sm sm:text-base leading-relaxed">
                {service.description}
              </p>

              {/* ✅ CITY LIST */}
              <ul className="border-t">
                {service.cities.map((city, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center px-4 py-3 text-sm sm:text-base text-gray-800 hover:bg-gray-100 cursor-pointer transition"
                  >
                    {city}
                    <FiChevronRight className="text-gray-500" />
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
