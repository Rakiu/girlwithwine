import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import imgCallGirls from "../assets/10.jpg";
import imgMassage from "../assets/11.jpg";

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Call Girls",
      img: imgCallGirls,
      description:
        "Girls with Wine is an adult classified website for Call girls and women that can help you find single call girls and women to satisfy your desires.",
      cities: [
        { id: "bangalore", name: "Bangalore Call Girls" },
        { id: "mumbai", name: "Mumbai Call Girls" },
        { id: "jaipur", name: "Jaipur Call Girls" },
      ],
    },
    {
      title: "Massage",
      img: imgMassage,
      description:
        "The best massage ads for all kinds of sexy services. The hot massage girls will give you a relaxing full-body rub to make you feel amazing.",
      cities: [
        { id: "gurugram", name: "gurugram Massage" },
        { id: "indore", name: "indore Massage" },
        { id: "udaipur", name: "udaipur Massage" },
      ],
    },
  ];

  const handleCityClick = (cityId) => {
    navigate(`/city/${cityId}`);
  };

  return (
    <section className="w-full bg-[#E9F7FE] px-4 py-12">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-3xl font-extrabold text-[#A3195B]">
          Search Or Post Your Adult Advertisements
        </h2>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md w-full sm:w-[340px]"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-56 object-cover"
              />

              <p className="p-4 text-gray-700">{service.description}</p>

              <ul className="border-t">
                {service.cities.map((city) => (
                  <li
                    key={city.id}
                    onClick={() => handleCityClick(city.id)}
                    className="flex justify-between items-center px-4 py-3 cursor-pointer
                               hover:bg-gray-100 transition"
                  >
                    {city.name}
                    <FiChevronRight />
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
