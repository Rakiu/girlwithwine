import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { g as getCitiesThunk, a as getCityByIdThunk, b as getGirlsByCityThunk, N as Navbar, C as CitySection, F as Footer } from "../main.mjs";
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
const GirlCardSkeleton = () => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm border flex gap-4 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "w-24 h-24 sm:w-40 sm:h-40 bg-gray-300 rounded-xl" }),
  /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "h-5 bg-gray-300 rounded w-3/4" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-full" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-2/3" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-4 justify-end", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-20 bg-gray-300 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-8 w-20 bg-gray-300 rounded" })
    ] })
  ] })
] });
const CityGirlsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { cityName } = useParams();
  const { cities, singleCity } = useSelector((state) => state.city);
  const { cityGirls = [], loading } = useSelector((state) => state.girls);
  const cityIdFromState = location.state?.cityId || null;
  const queryParams = new URLSearchParams(location.search);
  const subCity = queryParams.get("subCity");
  const [resolvedCityId, setResolvedCityId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);
  useEffect(() => {
    if (cityIdFromState) {
      setResolvedCityId(cityIdFromState);
      return;
    }
    if (!cityName || !cities?.length) return;
    const normalize = (str = "") => str.toLowerCase().replace(/\s+/g, "-");
    const matchedCity = cities.find(
      (c) => normalize(c.mainCity) === normalize(cityName) || normalize(c.name) === normalize(cityName)
    );
    if (matchedCity?._id) {
      setResolvedCityId(matchedCity._id);
    }
  }, [cityIdFromState, cityName, cities]);
  useEffect(() => {
    if (!resolvedCityId) return;
    setPageLoading(true);
    Promise.all([
      dispatch(getCityByIdThunk(resolvedCityId)),
      dispatch(getGirlsByCityThunk(resolvedCityId))
    ]).finally(() => {
      setPageLoading(false);
    });
  }, [resolvedCityId, dispatch]);
  const replaceCityName = (text = "", name = "") => String(text).replace(/{{cityName}}/gi, name);
  const createWhatsAppURL = (cityName2, number) => {
    const num = String(number || "").replace(/[^0-9]/g, "");
    if (!num) return "#";
    return `https://wa.me/91${num}?text=${encodeURIComponent(
      `Hello, I want booking in ${cityName2} city.`
    )}`;
  };
  const filteredGirls = cityGirls.filter((girl) => {
    const txt = searchText.toLowerCase();
    return girl.name?.toLowerCase().includes(txt) || girl.heading?.toLowerCase().includes(txt) || girl.description?.toLowerCase().includes(txt);
  });
  const cityObj = singleCity || {};
  let matchedLocalArea = null;
  if (subCity && Array.isArray(cityObj?.localAreas)) {
    matchedLocalArea = cityObj.localAreas.find(
      (a) => a.name.toLowerCase() === subCity.toLowerCase()
    );
  }
  const finalName = matchedLocalArea?.name || cityObj?.mainCity || cityObj?.state?.name || "";
  const cityHeading = cityObj?.heading || `Enjoy your private moments with our beautiful {{cityName}} call girls`;
  const citySubDescription = cityObj?.subDescription || `One of the top classified advertisement websites for escort services in {{cityName}}.`;
  const finalDescription = matchedLocalArea?.description || cityObj?.description || `<p>No description available for <strong>${finalName}</strong>.</p>`;
  const getCanonicalURL = () => {
    const baseUrl = "https://girlswithwine.in";
    return `${baseUrl}/call-girls/${cityName || ""}`;
  };
  useEffect(() => {
    if (!finalName) return;
    const seoTitle = replaceCityName(cityHeading, finalName);
    const seoDescription = replaceCityName(
      citySubDescription,
      finalName
    ).replace(/<[^>]*>?/gm, "");
    document.title = seoTitle;
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", seoDescription);
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", getCanonicalURL());
  }, [finalName, cityHeading, citySubDescription, cityName]);
  const showRightSidebar = searchText.trim() === "";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 py-3 mt-6 rounded-md px-4 flex flex-col sm:flex-row sm:justify-between gap-3 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 flex items-center gap-1 flex-wrap", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#C2185B] font-semibold", children: "Home" }),
          /* @__PURE__ */ jsx("span", { children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "text-[#C2185B] font-semibold", children: "Call-Girls" }),
          finalName && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { children: "/" }),
            /* @__PURE__ */ jsx("span", { className: "text-[#C2185B] capitalize font-semibold", children: finalName })
          ] }),
          subCity && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { children: "/" }),
            /* @__PURE__ */ jsx("span", { className: "text-[#C2185B] capitalize font-semibold", children: subCity })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full sm:w-auto", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search models...",
              value: searchText,
              onChange: (e) => setSearchText(e.target.value),
              className: "border border-gray-300 rounded-l-full px-4 py-2 w-full sm:w-72 text-sm"
            }
          ),
          /* @__PURE__ */ jsx("button", { className: "bg-[#C2185B] px-4 rounded-r-full text-white", children: /* @__PURE__ */ jsx(CiSearch, { className: "text-2xl" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-10 text-center max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl sm:text-5xl font-extrabold text-[#B30059]", children: replaceCityName(cityHeading, finalName) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 mt-4 text-[15px]", children: replaceCityName(citySubDescription, finalName) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8", children: [
        /* @__PURE__ */ jsx("div", { children: pageLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-5", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(GirlCardSkeleton, {}, i)) }) : filteredGirls.length ? /* @__PURE__ */ jsx("div", { className: "space-y-5", children: filteredGirls.map((girl) => {
          const wp = girl.whatsappNumber || cityObj?.whatsappNumber;
          const call = girl.phoneNumber || cityObj?.phoneNumber;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => navigate(
                `/girl/${girl.name.replace(/\s+/g, "-").toLowerCase()}`,
                { state: { girlId: girl._id } }
              ),
              className: "cursor-pointer bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border flex gap-4",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: girl.imageUrl,
                    alt: girl.name,
                    loading: "lazy",
                    className: "w-24 h-24 sm:w-40 sm:h-40 object-cover rounded-xl"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between w-full", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-[20px] font-bold text-[#B30059]", children: replaceCityName(girl.heading, finalName) }),
                    /* @__PURE__ */ jsx("p", { className: "text-[15px] text-gray-700 mt-1 line-clamp-2", children: replaceCityName(girl.description, finalName) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-[15px] mt-3 font-semibold text-[#B30059]", children: [
                      girl.age && /* @__PURE__ */ jsxs("span", { children: [
                        girl.age,
                        " Years"
                      ] }),
                      /* @__PURE__ */ jsx("span", { children: "|" }),
                      /* @__PURE__ */ jsx("span", { children: "Call Girls" }),
                      /* @__PURE__ */ jsx("span", { children: "|" }),
                      /* @__PURE__ */ jsx("span", { children: finalName })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-4 justify-end", children: [
                    wp && /* @__PURE__ */ jsx(
                      "a",
                      {
                        onClick: (e) => e.stopPropagation(),
                        href: createWhatsAppURL(finalName, wp),
                        target: "_blank",
                        rel: "noreferrer",
                        className: "px-3 py-2 bg-[#25D366] text-white text-xs rounded-md",
                        children: "WhatsApp"
                      }
                    ),
                    call && /* @__PURE__ */ jsx(
                      "a",
                      {
                        onClick: (e) => e.stopPropagation(),
                        href: `tel:91${call}`,
                        className: "px-3 py-2 bg-[#B30059] text-white text-xs rounded-md",
                        children: "Call Us"
                      }
                    )
                  ] })
                ] })
              ]
            },
            girl._id
          );
        }) }) : /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 py-10", children: "No profiles found." }) }),
        showRightSidebar && /* @__PURE__ */ jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-md rounded-xl p-5 border", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-center bg-[#B30059] text-white py-2 rounded-lg text-sm font-bold", children: [
            "Ads in ",
            cityObj?.state?.name
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 text-sm text-gray-700", children: (cityObj?.localAreas || []).map((area) => /* @__PURE__ */ jsxs("li", { className: "border-b py-2", children: [
            "Call Girls in ",
            area.name
          ] }, area._id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "md:mt-20 mt-6 mb-10 border-t pt-6 text-gray-700 text-[14px] max-w-7xl mx-auto",
          dangerouslySetInnerHTML: {
            __html: replaceCityName(finalDescription, finalName)
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsx(CitySection, { loading: pageLoading, cities }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  CityGirlsPage as default
};
