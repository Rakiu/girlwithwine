import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCitiesThunk } from "../store/slices/citySlice";
import CitySection from "./CitySection";

const AboutAndReviewsSection = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  const { loading, cities } = useSelector((state) => state.city);

  // ===================== EXTENDED ABOUT CONTENT =====================
  const aboutSections = [
    {
      title: "₹2999 ❤️ Escorts Service, Professional Call Girl A Payment in Cash",
      text: `If you are looking for sexual pleasure and thrillness, you can get really amazing and stunning attractive call girls / Escorts. You are able to engage our call girls for a very reasonable cost or inexpensive pricing, which is in the range of 2999. Simply put, these are genuine and genuine low rates, and whenever you call us, we will provide you with free home delivery within twenty-five minutes. Cash, online payments, credit cards, and a variety of other payment methods are all accepted. You have arrived at the suitable location. India is a very lovely destination, and many people travel here to take pleasure in this location and discover new things while they are here. It is for this reason that we are offering you authentic call girls and gorgeous chicks. Every one of us is aware that ensuring your contentment is our top concern, which is why we are the most successful call girl agency in India. When you book your hottest female companions, you can do so. They are really charming and sophisticated girls, and they are prepared to provide you with genuine service as well as sexual fun. You can hire our escorts and schedule your appointment with us. Your satisfaction is our first priority, and we will provide you our undivided attention. The sexy call girls in India are available for hire if you are interested in trying something new and exciting with your experience. There are a lot of things that these girls can do to make you pleased and sexier. Therefore, you need only contact our Escort Service.`,
    },

    {
      title:
        "Female employee of an information technology multinational corporation working as an escort for the girls with wine agency",
      text: `Do you know about the women who are employed by multinational corporations? They are looking to increase their income, which is why a large number of teenagers are working for our girls with wine escort agency. We never compromise her privacy or her identity in any way. As escort girls, our service is seeing an increase in the number of women who hold degrees in information technology and business administration. The confidential nature of these Escorts girls makes them exclusive to five-star hotels, where they are exclusively available for hire. Therefore, if you want to have a night of pleasure , engage high-profile escorts within thirty minutes. Those who belong to the business class place a high value on these ladies because of their refined appearance. They keep their full body figure in good condition. Many young men in college get in touch with us and hire them. They bring her along on their journey and make the most of the experience. For this reason, if you want to experience boredom, you should consider hiring a regular escort service. If you want to add a new dimension to your pleasure, then you should engage these sophisticated female escorts`,
    },

    {
      title:
        "We have over 1600 real and authentic call girls available around the clock, always waiting for you at your doorstep.",
      text: `Regarding your sexual life, there is no longer any need for you to feel depressed and upset. One of the most stunning cities in India, In this metropolis, everyone wants to experience this night with a female companion who is both delightful and attractive. Call ladies that are capable of providing you with a great deal of love and sexual experience if you are looking for the most stunning and seductive female companion. Where can you find someone who can make your trip and tour more pleasurable and memorable? Therefore, the greatest choice for you would be to hire a call girl. You will receive real services and escort females from our agency during your time with us. You can get the most premium and high-class Call Girl Whatsapp Number from us for your convenience.`,
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
        <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 text-left leading-relaxed">
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

      {/* ✅ CITY SECTION (Unchanged) */}
      <CitySection loading={loading} cities={cities} />
    </section>
  );
};

export default AboutAndReviewsSection;
