import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { g as getCitiesThunk, c as getGirlByIdThunk, a as getCityByIdThunk, b as getGirlsByCityThunk, N as Navbar, C as CitySection, F as Footer } from "../main.mjs";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import "react-dom/client";
import "@reduxjs/toolkit";
import "axios";
import "formik";
import "yup";
import "react-toastify";
import "react-icons/ai";
import "react-icons/fi";
import "@mui/material/Drawer";
import "lucide-react";
import "react-icons/io5";
import "react-icons/fa";
import "@heroicons/react/24/outline";
import "@mui/material";
const ReportAbuseSection = () => {
  return /* @__PURE__ */ jsxs("div", { className: "w-full bg-[#fdfdfd] py-10 px-4 md:px-0 flex flex-col items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl w-full bg-white shadow-xl rounded-2xl p-6 md:p-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(ExclamationTriangleIcon, { className: "w-10 h-10 text-[#A3195B]" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-[#c00b5a]", children: "Report Abuse" })
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "mt-4 space-y-3 text-gray-700 text-[16px] leading-relaxed ml-12", children: [
        /* @__PURE__ */ jsx("li", { className: "list-disc", children: "If you come across any inappropriate usage of photos or intellectual property (such as names, addresses, phone numbers, or email addresses), you can report it by sending an email to report@girlswithwine.com." }),
        /* @__PURE__ */ jsx("li", { className: "list-disc", children: "If you come across any content that you think is unlawful or harmful, you may report it by sending an email to report@girlswithwine.com." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl w-full mt-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 px-4 mb-[-10px]", children: /* @__PURE__ */ jsx("span", { className: "px-4 py-1 bg-pink-100 rounded-full text-[#760025] font-semibold text-sm", children: "SECURITY TIPS" }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-[#a0003c] text-white text-center py-4 px-6 rounded-lg font-semibold text-[15px] md:text-[16px]", children: "Be wary of con artists requesting money while pretending to be Girls With Wine. Girls With Wine will not pursue payment from you in any way." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl w-full mt-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-extrabold text-[#A3195B] mb-4", children: "Girls With wine Disclaimer & User Responsibility Statement" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-[16px] leading-relaxed mb-4", children: "By using our site and providing us with feedback, the user is indicating their agreement to our Terms & Conditions. The advertiser took full responsibility for placing these ads in Girls With Wine. It is not necessary for us to personally verify the content of these advertisements before publishing them." }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-[16px] leading-relaxed", children: "We take no responsibility for the advertisers' profiles' adherence to public or moral standards, their respect of intellectual property rights, or any other ethical or moral issues. You may use Girls With Wine to post free online ads and navigate the web. We will not mediate disputes between advertisers and customers." })
    ] })
  ] });
};
const GirlDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);
  const { girlName } = useParams();
  const location = useLocation();
  const { cities } = useSelector((state) => state.city);
  const girlId = location.state?.girlId || null;
  const { singleGirl, cityGirls, loading } = useSelector((s) => s.girls);
  const { singleCity } = useSelector((s) => s.city);
  useEffect(() => {
    if (!girlId) return;
    dispatch(getGirlByIdThunk(girlId));
  }, [girlId]);
  const activeCityId = useMemo(() => {
    if (singleGirl?.city?._id) return singleGirl.city._id;
    if (Array.isArray(singleGirl?.city) && singleGirl.city[0]?._id)
      return singleGirl.city[0]._id;
    return null;
  }, [singleGirl]);
  useEffect(() => {
    if (!activeCityId) return;
    dispatch(getCityByIdThunk(activeCityId));
    dispatch(getGirlsByCityThunk(activeCityId));
  }, [activeCityId]);
  if (!girlId) {
    return /* @__PURE__ */ jsx("p", { className: "text-center py-20 text-red-600 text-xl", children: "Invalid Girl URL — ID missing." });
  }
  if (loading || !singleGirl)
    return /* @__PURE__ */ jsx("p", { className: "text-center py-20 text-gray-600 text-lg", children: "Loading..." });
  const cityData = singleCity || {};
  const shortHeading = (singleGirl.heading || "").slice(0, 100) + ((singleGirl.heading || "").length > 100 ? "..." : "");
  const shortDescription = (singleGirl.description || "").slice(0, 500) + ((singleGirl.description || "").length > 500 ? "..." : "");
  const makeSlug = (name) => name?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: singleGirl.imageUrl,
            alt: singleGirl.heading,
            className: "w-full max-h-[550px] rounded-xl shadow-xl object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 font-medium mb-2", children: [
            singleGirl.age,
            " Years | ",
            cityData.mainCity || "Unknown City"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-4xl font-extrabold text-[#B30059]", children: shortHeading }),
          singleGirl.priceDetails && /* @__PURE__ */ jsx("p", { className: "mt-3 text-[#34A853] text-[15px] lg:text-[18px] font-semibold", children: singleGirl.priceDetails }),
          /* @__PURE__ */ jsx("p", { className: "mt-5 text-gray-700 leading-relaxed text-[15px] whitespace-pre-line", children: shortDescription }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#9C1C4D] mb-4", children: "Contact Advertiser" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
              cityData?.whatsappNumber ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: `https://wa.me/91${cityData.whatsappNumber}`,
                  target: "_blank",
                  className: "w-full bg-green-600 text-white font-bold text-lg px-6 py-4 rounded-md shadow-md text-center",
                  children: "WhatsApp"
                }
              ) : /* @__PURE__ */ jsx("p", { className: "text-red-600 font-semibold w-full", children: "No WhatsApp number" }),
              cityData?.phoneNumber ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: `tel:91${cityData.phoneNumber}`,
                  className: "w-full bg-[#B30059] text-white font-bold text-lg px-6 py-4 rounded-md shadow-md text-center",
                  children: "Call Now"
                }
              ) : /* @__PURE__ */ jsx("p", { className: "text-red-600 font-semibold w-full", children: "No phone number" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl text-center font-extrabold text-[#B30059]", children: "You might be interested in…" }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 flex flex-col gap-7", children: cityGirls?.filter((g) => g._id !== girlId)?.slice(0, 3)?.map((girl) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-white border border-gray-200 shadow-sm hover:shadow-md \r\n                   rounded-xl p-4 transition-all cursor-pointer",
            onClick: () => navigate(`/girl/${makeSlug(girl.name)}`, {
              state: { girlId: girl._id }
            }),
            children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: girl.imageUrl,
                  alt: girl.heading,
                  className: "w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between w-full", children: [
                /* @__PURE__ */ jsx("h3", { className: " text-[10px] lg:text-[20px] font-bold text-[#B30059] leading-tight line-clamp-2", children: girl.heading }),
                /* @__PURE__ */ jsx("p", { className: " text-[10px]  lg:text-[15px] text-gray-700 mt-1 line-clamp-2", children: girl.description }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-[14px] mt-2 font-semibold text-[#B30059]", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    girl.age || "19",
                    " Years"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "|" }),
                  /* @__PURE__ */ jsx("span", { children: "Call Girls" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-3 justify-end", children: [
                  cityData?.whatsappNumber && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: `https://wa.me/91${cityData.whatsappNumber}`,
                      target: "_blank",
                      onClick: (e) => e.stopPropagation(),
                      className: "px-2 py-2 bg-[#25D366] text-white rounded-md \r\n                             text-[10px] font-medium",
                      children: "WhatsApp"
                    }
                  ),
                  cityData?.phoneNumber && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: `tel:91${cityData.phoneNumber}`,
                      onClick: (e) => e.stopPropagation(),
                      className: "px-2 py-2 bg-[#B30059] text-white rounded-md \r\n                             text-[10px] font-medium",
                      children: "Call Now"
                    }
                  )
                ] })
              ] })
            ] })
          },
          girl._id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ReportAbuseSection, {}),
    /* @__PURE__ */ jsx(CitySection, { loading, cities }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  GirlDetailsPage as default
};
