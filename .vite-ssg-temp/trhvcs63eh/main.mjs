import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef, lazy, Suspense, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useLocation, useNavigate, Link, NavLink, Navigate, useParams, Routes, Route, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector, Provider } from "react-redux";
import { createAsyncThunk, createSlice, configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineMail, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiPlus, FiMenu, FiSearch, FiChevronRight, FiArrowLeft, FiArrowRight, FiX, FiMap, FiMapPin, FiUsers, FiMail, FiLogOut, FiSend, FiCopy } from "react-icons/fi";
import Drawer from "@mui/material/Drawer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IoLocationSharp } from "react-icons/io5";
import { FaFacebookF, FaTwitter, FaYoutube, FaPinterestP, FaLinkedinIn, FaArrowUp } from "react-icons/fa";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormControl, InputLabel, Select as Select$2, MenuItem, Chip, OutlinedInput } from "@mui/material";
const BASE_URL = "https://api.girlswithwine.in";
const timeout = Number("20000");
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout,
  headers: {
    "Content-Type": "application/json"
  }
});
const authExcludedPaths = ["/api/admin/login"];
axiosInstance.interceptors.request.use(
  (config) => {
    const isExcluded = authExcludedPaths.some(
      (path) => config.url?.includes(path)
    );
    if (!isExcluded) {
      const token = localStorage.getItem("tokenId");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
const LOGIN_ADMIN_URL = "/api/admin/login";
const ADD_CITY_URL = "/api/cities/create";
const GET_CITIES_URL = "/api/cities/list";
const DELETE_CITY_URL = "/api/cities/delete";
const CITY_STATUS_URL = "/api/cities/status";
const UPDATE_CITY_URL = "/api/cities/update";
const GET_CITY_BY_ID_URL = "/api/cities";
const ADD_GIRL_URL = "/api/girls/add";
const GET_ALL_GIRLS_URL = "/api/girls/all";
const GET_GIRLS_BY_CITY_URL = "/api/girls/city";
const DELETE_GIRL_URL = "/api/girls/delete";
const UPDATE_GIRL_URL = "/api/girls/update";
const TOGGLE_GIRL_STATUS_URL = "/api/girls/status";
const GET_SINGLE_GIRL_URL = "/api/girls";
const ADD_STATE_URL = "/api/states/create";
const GET_STATES_URL = "/api/states/list";
const GET_STATE_BY_ID_URL = "/api/states";
const UPDATE_STATE_URL = "/api/states/update";
const DELETE_STATE_URL = "/api/states/delete";
const TOGGLE_STATE_STATUS_URL = "/api/states/status";
const CREATE_CONTACT_URL = "/api/contact/create";
const GET_ALL_CONTACTS_URL = "/api/contact/all";
const GET_CONTACT_BY_ID_URL = "/api/contact";
const DELETE_CONTACT_URL = "/api/contact/delete";
const TOGGLE_CONTACT_STATUS_URL = "/api/contact/status";
const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(LOGIN_ADMIN_URL, {
        email,
        password
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Try again."
      );
    }
  }
);
const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    token: localStorage.getItem("tokenId") || null,
    role: localStorage.getItem("role") || null,
    loading: false,
    error: null
  },
  reducers: {
    adminLogout: (state) => {
      state.token = null;
      state.role = null;
      localStorage.removeItem("tokenId");
      localStorage.removeItem("role");
    }
  },
  extraReducers: (builder) => {
    builder.addCase(adminLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(adminLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem("tokenId", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    }).addCase(adminLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
const { adminLogout } = adminAuthSlice.actions;
const adminAuthReducer = adminAuthSlice.reducer;
const getCityByIdThunk = createAsyncThunk(
  "city/getById",
  async (cityId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${GET_CITY_BY_ID_URL}/${cityId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch city"
      );
    }
  }
);
const addCityThunk = createAsyncThunk(
  "city/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(ADD_CITY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round(e.loaded * 100 / e.total);
          console.log("Upload:", percent + "%");
        }
      });
      return res.data.data;
    } catch (error) {
      let message = error.response?.data?.message || error.message || "Failed to add city";
      if (error.response?.data?.message?.includes("E11000") || error.response?.data?.message?.toLowerCase().includes("duplicate")) {
        message = "City name already exists!";
      }
      return rejectWithValue(message);
    }
  }
);
const getCitiesThunk = createAsyncThunk(
  "city/getAll",
  async (_, { rejectWithValue, getState }) => {
    const { city } = getState();
    if (city.cities.length > 0) {
      return city.cities;
    }
    try {
      const res = await axiosInstance.get(GET_CITIES_URL);
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cities"
      );
    }
  }
);
const deleteCityThunk = createAsyncThunk(
  "city/delete",
  async (cityId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${DELETE_CITY_URL}/${cityId}`);
      return cityId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete city"
      );
    }
  }
);
const updateCityThunk = createAsyncThunk(
  "city/update",
  async ({ cityId, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `${UPDATE_CITY_URL}/${cityId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update city"
      );
    }
  }
);
const updateCityStatusThunk = createAsyncThunk(
  "city/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`${CITY_STATUS_URL}/${id}`, {
        status
      });
      return res.data.city;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);
const citySlice = createSlice({
  name: "city",
  initialState: {
    cities: [],
    singleCity: null,
    listLoading: false,
    addLoading: false,
    deleteLoading: false,
    updateLoading: false,
    statusLoading: false,
    error: null,
    success: null
  },
  reducers: {
    resetCityState: (state) => {
      state.error = null;
      state.success = null;
      state.singleCity = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addCityThunk.pending, (state) => {
      state.addLoading = true;
    }).addCase(addCityThunk.fulfilled, (state, action) => {
      state.addLoading = false;
      state.cities.unshift(action.payload);
      state.success = true;
    }).addCase(addCityThunk.rejected, (state, action) => {
      state.addLoading = false;
      state.error = action.payload;
    }).addCase(getCitiesThunk.pending, (state) => {
      state.listLoading = true;
    }).addCase(getCitiesThunk.fulfilled, (state, action) => {
      state.listLoading = false;
      state.cities = action.payload;
    }).addCase(getCitiesThunk.rejected, (state, action) => {
      state.listLoading = false;
      state.error = action.payload;
    }).addCase(getCityByIdThunk.pending, (state) => {
      state.updateLoading = true;
    }).addCase(getCityByIdThunk.fulfilled, (state, action) => {
      state.updateLoading = false;
      state.singleCity = action.payload;
    }).addCase(getCityByIdThunk.rejected, (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    }).addCase(deleteCityThunk.pending, (state) => {
      state.deleteLoading = true;
    }).addCase(deleteCityThunk.fulfilled, (state, action) => {
      state.deleteLoading = false;
      state.cities = state.cities.filter(
        (c) => c._id !== action.payload
      );
    }).addCase(deleteCityThunk.rejected, (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    }).addCase(updateCityThunk.pending, (state) => {
      state.updateLoading = true;
    }).addCase(updateCityThunk.fulfilled, (state, action) => {
      state.updateLoading = false;
      state.cities = state.cities.map(
        (city) => city._id === action.payload._id ? action.payload : city
      );
    }).addCase(updateCityThunk.rejected, (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    }).addCase(updateCityStatusThunk.pending, (state, action) => {
      state.statusLoading = true;
      const { id, status } = action.meta.arg;
      state.cities = state.cities.map(
        (city) => city._id === id ? { ...city, status } : city
      );
    }).addCase(updateCityStatusThunk.fulfilled, (state, action) => {
      state.statusLoading = false;
      state.cities = state.cities.map(
        (city) => city._id === action.payload._id ? action.payload : city
      );
    }).addCase(updateCityStatusThunk.rejected, (state, action) => {
      state.statusLoading = false;
      state.error = action.payload;
    });
  }
});
const { resetCityState } = citySlice.actions;
const cityReducer = citySlice.reducer;
const getAllGirlsThunk = createAsyncThunk(
  "girls/getAll",
  async (_, { rejectWithValue, getState }) => {
    const { girls } = getState().girls;
    if (girls.length > 0) {
      return girls;
    }
    try {
      const res = await axiosInstance.get(GET_ALL_GIRLS_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load girls");
    }
  }
);
const getGirlsByCityThunk = createAsyncThunk(
  "girls/getByCity",
  async (cityId, { rejectWithValue, getState }) => {
    const { cityGirlsById } = getState().girls;
    if (cityGirlsById[cityId]) {
      return { cityId, data: cityGirlsById[cityId] };
    }
    try {
      const res = await axiosInstance.get(`${GET_GIRLS_BY_CITY_URL}/${cityId}`);
      return { cityId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load city girls");
    }
  }
);
const getGirlByIdThunk = createAsyncThunk(
  "girls/getOne",
  async (id, { rejectWithValue, getState }) => {
    const { singleGirlCache } = getState().girls;
    if (singleGirlCache[id]) {
      return singleGirlCache[id];
    }
    try {
      const res = await axiosInstance.get(`${GET_SINGLE_GIRL_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load girl details");
    }
  }
);
const addGirlThunk = createAsyncThunk(
  "girls/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(ADD_GIRL_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add girl");
    }
  }
);
const deleteGirlThunk = createAsyncThunk(
  "girls/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axiosInstance.delete(`${DELETE_GIRL_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete girl");
    }
  }
);
const updateGirlThunk = createAsyncThunk(
  "girls/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axiosInstance.put(
        `${UPDATE_GIRL_URL}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update girl");
    }
  }
);
const toggleGirlStatusThunk = createAsyncThunk(
  "girls/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axiosInstance.patch(
        `${TOGGLE_GIRL_STATUS_URL}/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return { id, status: res.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Status update failed");
    }
  }
);
const girlSlice = createSlice({
  name: "girls",
  initialState: {
    girls: [],
    cityGirls: [],
    cityGirlsById: {},
    // ✅ cache by cityId
    singleGirl: null,
    singleGirlCache: {},
    // ✅ cache by girlId
    listLoading: false,
    cityLoading: false,
    singleLoading: false,
    addLoading: false,
    deleteLoading: false,
    updateLoading: false,
    statusLoading: false,
    error: null,
    success: null
  },
  reducers: {
    resetGirlState: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllGirlsThunk.pending, (state) => {
      state.listLoading = true;
    }).addCase(getAllGirlsThunk.fulfilled, (state, action) => {
      state.listLoading = false;
      state.girls = action.payload;
    }).addCase(getAllGirlsThunk.rejected, (state, action) => {
      state.listLoading = false;
      state.error = action.payload;
    });
    builder.addCase(getGirlsByCityThunk.pending, (state) => {
      state.cityLoading = true;
    }).addCase(getGirlsByCityThunk.fulfilled, (state, action) => {
      state.cityLoading = false;
      state.cityGirls = action.payload.data;
      state.cityGirlsById[action.payload.cityId] = action.payload.data;
    }).addCase(getGirlsByCityThunk.rejected, (state, action) => {
      state.cityLoading = false;
      state.error = action.payload;
    });
    builder.addCase(getGirlByIdThunk.pending, (state) => {
      state.singleLoading = true;
      state.singleGirl = null;
    }).addCase(getGirlByIdThunk.fulfilled, (state, action) => {
      state.singleLoading = false;
      state.singleGirl = action.payload;
      state.singleGirlCache[action.payload._id] = action.payload;
    }).addCase(getGirlByIdThunk.rejected, (state, action) => {
      state.singleLoading = false;
      state.error = action.payload;
    });
    builder.addCase(addGirlThunk.pending, (state) => {
      state.addLoading = true;
    }).addCase(addGirlThunk.fulfilled, (state, action) => {
      state.addLoading = false;
      state.success = "Girl added successfully";
      state.girls.unshift(action.payload);
    }).addCase(addGirlThunk.rejected, (state, action) => {
      state.addLoading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteGirlThunk.pending, (state) => {
      state.deleteLoading = true;
    }).addCase(deleteGirlThunk.fulfilled, (state, action) => {
      state.deleteLoading = false;
      state.girls = state.girls.filter((g) => g._id !== action.payload);
    }).addCase(deleteGirlThunk.rejected, (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    });
    builder.addCase(updateGirlThunk.pending, (state) => {
      state.updateLoading = true;
    }).addCase(updateGirlThunk.fulfilled, (state, action) => {
      state.updateLoading = false;
      const updatedGirl = action.payload;
      state.girls = state.girls.map(
        (g) => g._id === updatedGirl._id ? updatedGirl : g
      );
      if (state.singleGirl?._id === updatedGirl._id) {
        state.singleGirl = updatedGirl;
      }
      state.singleGirlCache[updatedGirl._id] = updatedGirl;
    }).addCase(updateGirlThunk.rejected, (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    });
    builder.addCase(toggleGirlStatusThunk.pending, (state, action) => {
      state.statusLoading = true;
      const { id, status } = action.meta.arg;
      state.girls = state.girls.map(
        (g) => g._id === id ? { ...g, status } : g
      );
    }).addCase(toggleGirlStatusThunk.fulfilled, (state) => {
      state.statusLoading = false;
    }).addCase(toggleGirlStatusThunk.rejected, (state, action) => {
      state.statusLoading = false;
      state.error = action.payload;
    });
  }
});
const { resetGirlState } = girlSlice.actions;
const girlReducer = girlSlice.reducer;
const createStateThunk = createAsyncThunk(
  "states/create",
  async ({ name, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(ADD_STATE_URL, { name, status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);
const getStatesThunk = createAsyncThunk(
  "states/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(GET_STATES_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch states");
    }
  }
);
const getStateByIdThunk = createAsyncThunk(
  "states/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${GET_STATE_BY_ID_URL}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "State not found");
    }
  }
);
const updateStateThunk = createAsyncThunk(
  "states/update",
  async ({ id, name, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`${UPDATE_STATE_URL}/${id}`, {
        name,
        status
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);
const deleteStateThunk = createAsyncThunk(
  "states/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`${DELETE_STATE_URL}/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);
const toggleStateStatusThunk = createAsyncThunk(
  "states/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`${TOGGLE_STATE_STATUS_URL}/${id}`);
      return { id, status: data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Status change failed");
    }
  }
);
const stateSlice = createSlice({
  name: "states",
  initialState: {
    states: [],
    singleState: null,
    loading: false,
    message: null
  },
  reducers: {
    clearStateMessage: (state) => {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createStateThunk.pending, (state) => {
      state.loading = true;
    }).addCase(createStateThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.message = { type: "success", text: action.payload.message };
      state.states.push(action.payload.data);
    }).addCase(createStateThunk.rejected, (state, action) => {
      state.loading = false;
      state.message = { type: "error", text: action.payload };
    }).addCase(getStatesThunk.pending, (state) => {
      state.loading = true;
    }).addCase(getStatesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.states = action.payload;
    }).addCase(getStatesThunk.rejected, (state, action) => {
      state.loading = false;
      state.message = { type: "error", text: action.payload };
    }).addCase(getStateByIdThunk.pending, (state) => {
      state.loading = true;
    }).addCase(getStateByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.singleState = action.payload;
    }).addCase(getStateByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.message = { type: "error", text: action.payload };
    }).addCase(updateStateThunk.pending, (state) => {
      state.loading = true;
    }).addCase(updateStateThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.message = { type: "success", text: "State updated successfully" };
      state.states = state.states.map(
        (item) => item._id === action.payload.data._id ? action.payload.data : item
      );
    }).addCase(updateStateThunk.rejected, (state, action) => {
      state.loading = false;
      state.message = { type: "error", text: action.payload };
    }).addCase(deleteStateThunk.pending, (state) => {
      state.loading = true;
    }).addCase(deleteStateThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.message = { type: "success", text: "State deleted" };
      state.states = state.states.filter(
        (item) => item._id !== action.payload.id
      );
    }).addCase(deleteStateThunk.rejected, (state, action) => {
      state.loading = false;
      state.message = { type: "error", text: action.payload };
    }).addCase(toggleStateStatusThunk.pending, (state) => {
      state.loading = true;
    }).addCase(toggleStateStatusThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.message = { type: "success", text: "Status updated" };
      state.states = state.states.map(
        (item) => item._id === action.payload.id ? { ...item, status: action.payload.status } : item
      );
    }).addCase(toggleStateStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.message = { type: "error", text: action.payload };
    });
  }
});
const { clearStateMessage } = stateSlice.actions;
const stateReducer = stateSlice.reducer;
const createContactThunk = createAsyncThunk(
  "contact/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(CREATE_CONTACT_URL, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit contact form");
    }
  }
);
const getAllContactsThunk = createAsyncThunk(
  "contact/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(GET_ALL_CONTACTS_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch contacts");
    }
  }
);
const getContactByIdThunk = createAsyncThunk(
  "contact/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${GET_CONTACT_BY_ID_URL}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch contact details");
    }
  }
);
const deleteContactThunk = createAsyncThunk(
  "contact/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${DELETE_CONTACT_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete contact");
    }
  }
);
const toggleContactStatusThunk = createAsyncThunk(
  "contact/status",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`${TOGGLE_CONTACT_STATUS_URL}/${id}`);
      return { id, status: data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);
const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    error: null,
    contacts: [],
    singleContact: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createContactThunk.pending, (state) => {
      state.loading = true;
    }).addCase(createContactThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    }).addCase(createContactThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).addCase(getAllContactsThunk.pending, (state) => {
      state.loading = true;
    }).addCase(getAllContactsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload;
    }).addCase(getAllContactsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).addCase(getContactByIdThunk.pending, (state) => {
      state.loading = true;
    }).addCase(getContactByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.singleContact = action.payload;
    }).addCase(getContactByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).addCase(deleteContactThunk.fulfilled, (state, action) => {
      state.contacts = state.contacts.filter((c) => c._id !== action.payload);
    }).addCase(toggleContactStatusThunk.fulfilled, (state, action) => {
      const updated = state.contacts.find((c) => c._id === action.payload.id);
      if (updated) updated.status = action.payload.status;
    });
  }
});
const contactReducer = contactSlice.reducer;
const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    city: cityReducer,
    girls: girlReducer,
    states: stateReducer,
    contacts: contactReducer
    // ⭐ REGISTER CONTACT SLICE
  }
});
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
      // smooth scroll
    });
  }, [pathname]);
  return null;
}
const LoginImage = "/assets/LoginImage-DNhDRCUf.avif";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.adminAuth);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Min 6 chars").required("Required")
    }),
    onSubmit: async (values) => {
      const result = await dispatch(adminLogin(values));
      if (adminLogin.fulfilled.match(result)) {
        toast.success("Admin Login Successful!");
        setTimeout(() => {
          navigate("/admin/all-state");
          window.location.reload();
        }, 500);
      } else {
        toast.error(result.payload);
      }
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen flex items-center justify-center bg-linear-to-r from-[#FEF1FA] to-[#DD86C1]", children: [
    /* @__PURE__ */ jsx(ToastContainer, {}),
    /* @__PURE__ */ jsx("div", { className: "absolute w-full md:w-2/3 h-[650px] md:h-[750px] left-4 md:left-0", children: /* @__PURE__ */ jsx("img", { src: LoginImage, alt: "Foxtale", className: "w-full h-full object-cover" }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-1/2 right-4 md:right-0 transform -translate-y-1/2 bg-[#FEDCF3] p-10 rounded-lg shadow-2xl w-[90%] sm:w-[70%] md:w-[40%] z-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-center text-2xl font-bold text-pink-700 mb-2", children: "Welcome" }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 text-sm mb-6", children: "Admin Login" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: formik.handleSubmit, className: "flex flex-col items-center space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm", children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              placeholder: "Enter email",
              ...formik.getFieldProps("email"),
              className: `w-full px-4 py-2 pr-12 border rounded-md ${formik.errors.email ? "border-red-500" : "border-gray-300"}`
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute top-[25px] right-0 bg-[#FF7DDD] w-10 h-10 flex items-center justify-center rounded-md", children: /* @__PURE__ */ jsx(AiOutlineMail, { className: "text-white text-lg" }) }),
          formik.errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: formik.errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm", children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              placeholder: "Enter password",
              ...formik.getFieldProps("password"),
              className: `w-full px-4 py-2 pr-10 border rounded-md ${formik.errors.password ? "border-red-500" : "border-gray-300"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => setShowPassword(!showPassword),
              className: "absolute top-[25px] right-0 bg-[#FF7DDD] w-10 h-10 rounded-md flex items-center justify-center text-white cursor-pointer",
              children: showPassword ? /* @__PURE__ */ jsx(AiFillEye, {}) : /* @__PURE__ */ jsx(AiFillEyeInvisible, {})
            }
          ),
          formik.errors.password && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: formik.errors.password })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full max-w-sm bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md",
            children: loading ? "Logging in..." : "Submit"
          }
        )
      ] })
    ] })
  ] });
};
const logo$1 = "/assets/logo1-DOs2jvim.png";
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  return /* @__PURE__ */ jsxs("nav", { className: "w-full bg-gradient-to-r from-[#00B9BE] to-[#7CC7EC] py-4 shadow-md", children: [
    /* @__PURE__ */ jsx(
      Drawer,
      {
        anchor: "left",
        open: drawerOpen,
        onClose: toggleDrawer(false),
        PaperProps: {
          sx: {
            width: 260,
            backgroundColor: "#00B9BE",
            color: "white",
            paddingTop: "20px"
          }
        },
        children: /* @__PURE__ */ jsxs("div", { className: "px-6 space-y-6 mt-7", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contact",
              className: "block text-lg font-semibold hover:opacity-80",
              onClick: toggleDrawer(false),
              children: "CONTACT US"
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "#",
              className: "flex items-center gap-3 bg-[#FFE7E7] text-black font-semibold rounded-full px-5 py-3 shadow-md hover:bg-[#fadada] transition",
              onClick: toggleDrawer(false),
              children: [
                /* @__PURE__ */ jsx("span", { className: "bg-[#A01047] text-white rounded-full p-1 flex items-center justify-center", children: /* @__PURE__ */ jsx(FiPlus, { size: 20 }) }),
                "POST YOUR AD"
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: logo$1,
          alt: "Girls with Wine Logo",
          className: "w-52 md:w-64 h-auto object-contain"
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-10", children: [
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-white text-xl font-semibold hover:opacity-80", children: "CONTACT US" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "#",
            className: "flex items-center gap-3 bg-[#FFE7E7] text-black font-semibold rounded-full px-6 py-3  shadow-md hover:bg-[#fadada] transition",
            children: [
              /* @__PURE__ */ jsx("span", { className: "bg-[#A01047] text-white rounded-full p-1 flex items-center justify-center", children: /* @__PURE__ */ jsx(FiPlus, { size: 20 }) }),
              "POST YOUR AD"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleDrawer(true),
          className: "md:hidden text-white text-3xl ",
          children: /* @__PURE__ */ jsx(FiMenu, {})
        }
      )
    ] })
  ] });
};
const model1 = "/assets/2-CPRf406p.jpg";
const model2 = "/assets/3-CKqjJxAm.jpg";
const model3 = "/assets/4--FnlwIzi.jpg";
const model4 = "/assets/5-D9MEeiRr.jpg";
const FeaturedModelsSection = () => {
  const models = [
    { id: 1, name: "Aisha Sharma", location: "Mumbai • Editorial", image: model1 },
    { id: 2, name: "Priya Kumari", location: "Mumbai • Editorial", image: model2 },
    { id: 3, name: "Payal Joshi", location: "Mumbai • Editorial", image: model3 },
    { id: 4, name: "Supriya Agarwal", location: "Mumbai • Editorial", image: model4 },
    { id: 5, name: "Komal", location: "Mumbai • Editorial", image: model1 }
  ];
  const scrollLeft = () => {
    document.getElementById("scrollContainer").scrollBy({ left: -350, behavior: "smooth" });
  };
  const scrollRight = () => {
    document.getElementById("scrollContainer").scrollBy({ left: 350, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsx("section", { className: "relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 sm:px-10 lg:px-3 py-10 md:py-14", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between mb-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "ttext-3xl md:text-5xl  font-libre font-semibold text-[#A3195B] tracking-wide", children: "Best Call Girls" }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: scrollLeft,
            className: "bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-md transition",
            children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: scrollRight,
            className: "bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-md transition",
            children: /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        id: "scrollContainer",
        className: "flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4",
        children: models.map((model) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group relative min-w-[240px] md:min-w-[280px] lg:min-w-[300px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500",
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: model.image,
                  alt: model.name,
                  className: "w-full h-[320px] md:h-[350px] object-cover transform\r\n                md:group-hover:scale-105 transition-transform duration-500"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/30 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 \r\n                bg-[#0F7BAC] text-white px-5 py-2 rounded-md text-sm font-medium \r\n                hover:bg-purple-900 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500",
                  children: "Book Now"
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "\r\n                  absolute bottom-0 left-0 right-0 bg-[#EFFAFF] px-4 py-3 text-left \r\n                  md:translate-y-full md:group-hover:translate-y-0 \r\n                  transition-all duration-500\r\n                ",
                  children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-[16px] md:text-[18px] font-semibold text-black mb-1", children: model.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: model.location })
                  ]
                }
              )
            ]
          },
          model.id
        ))
      }
    )
  ] }) });
};
const modelBottom = "/assets/6-B7a65Q6N.jpg";
const imgCallGirls = "/assets/10-CRBLIJB7.jpg";
const imgMassage = "/assets/11-DhxpyFeA.jpg";
const ModelAboutSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "w-full font-sans bg-white mt-10 md:mt-16", children: /* @__PURE__ */ jsxs("div", { className: "relative py-16 md:py-20 px-6 md:px-12 lg:px-20 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-full h-[120px] bg-white z-0" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12", children: [
      /* @__PURE__ */ jsx("div", { className: "relative flex-1 w-full max-w-lg", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: modelBottom,
          alt: "Ozge Pose",
          className: "w-full h-[520px] object-cover rounded-xl shadow-xl"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 text-black lg:pl-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-serif font-bold tracking-tight mb-8", children: "Ankita Sharma" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-x-10 gap-y-6 border-t border-b border-[#b05591] py-8 text-base font-medium", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold block", children: "HEIGHT" }),
            /* @__PURE__ */ jsx("span", { children: `5'10"` })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold block", children: "WEIGHT" }),
            /* @__PURE__ */ jsx("span", { children: "140" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold block", children: "WAIST" }),
            /* @__PURE__ */ jsx("span", { children: '25"' })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold block", children: "INSEAM" }),
            /* @__PURE__ */ jsx("span", { children: '32"' })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold block", children: "EYES" }),
            /* @__PURE__ */ jsx("span", { children: "BROWN" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold block", children: "HAIR" }),
            /* @__PURE__ */ jsx("span", { children: "BROWN" })
          ] })
        ] })
      ] })
    ] })
  ] }) });
};
const CitySection = ({ loading, cities = [] }) => {
  const navigate = useNavigate();
  const handleCityClick = (city) => {
    if (!city?._id) return;
    navigate(`/city/${city.mainCity}`, {
      state: { cityId: city._id }
      // Hidden ID
    });
  };
  const skeletonItems = new Array(10).fill(0);
  return /* @__PURE__ */ jsx("section", { className: "w-full bg-white px-4 sm:px-8 lg:px-20 mb-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-8", children: "Available Cities" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: skeletonItems.map((_, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse",
        "aria-hidden": true
      },
      i
    )) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ", children: cities.length > 0 ? cities.map((city) => {
      const label = city?.mainCity ? `Call girls in ${city.mainCity}` : "Unknown city";
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleCityClick(city),
          type: "button",
          className: "w-full flex items-center gap-3 justify-center px-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm\r\n                               hover:bg-[#00B9BE] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#00B9BE] transition-transform transform\r\n                               active:translate-y-0.5 disabled:opacity-60 cursor-pointer ",
          "aria-label": label,
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex items-center justify-center shrink-0 rounded-full w-9 h-9 bg-[#F7EEF6] text-[#630C50] \r\n                                 group-hover:bg-white group-hover:text-white",
                "aria-hidden": true,
                children: /* @__PURE__ */ jsx(FiSearch, { className: "text-lg" })
              }
            ),
            /* @__PURE__ */ jsx(
              "p",
              {
                className: "font-medium text-sm text-center  ",
                title: label,
                children: label
              }
            )
          ]
        },
        city._id || label
      );
    }) : /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600 col-span-full", children: "No cities found." }) })
  ] }) });
};
const AboutAndReviewsSection = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);
  const { loading, cities } = useSelector((state) => state.city);
  const aboutSections = [
    {
      title: "₹2999 ❤️ Escorts Service, Professional Call Girl A Payment in Cash",
      text: `If you are looking for sexual pleasure and thrillness, you can get really amazing and stunning attractive call girls / Escorts. You are able to engage our call girls for a very reasonable cost or inexpensive pricing, which is in the range of 2999. Simply put, these are genuine and genuine low rates, and whenever you call us, we will provide you with free home delivery within twenty-five minutes. Cash, online payments, credit cards, and a variety of other payment methods are all accepted. You have arrived at the suitable location. India is a very lovely destination, and many people travel here to take pleasure in this location and discover new things while they are here. It is for this reason that we are offering you authentic call girls and gorgeous chicks. Every one of us is aware that ensuring your contentment is our top concern, which is why we are the most successful call girl agency in India. When you book your hottest female companions, you can do so. They are really charming and sophisticated girls, and they are prepared to provide you with genuine service as well as sexual fun. You can hire our escorts and schedule your appointment with us. Your satisfaction is our first priority, and we will provide you our undivided attention. The sexy call girls in India are available for hire if you are interested in trying something new and exciting with your experience. There are a lot of things that these girls can do to make you pleased and sexier. Therefore, you need only contact our Escort Service.`
    },
    {
      title: "Female employee of an information technology multinational corporation working as an escort for the girls with wine agency",
      text: `Do you know about the women who are employed by multinational corporations? They are looking to increase their income, which is why a large number of teenagers are working for our girls with wine escort agency. We never compromise her privacy or her identity in any way. As escort girls, our service is seeing an increase in the number of women who hold degrees in information technology and business administration. The confidential nature of these Escorts girls makes them exclusive to five-star hotels, where they are exclusively available for hire. Therefore, if you want to have a night of pleasure , engage high-profile escorts within thirty minutes. Those who belong to the business class place a high value on these ladies because of their refined appearance. They keep their full body figure in good condition. Many young men in college get in touch with us and hire them. They bring her along on their journey and make the most of the experience. For this reason, if you want to experience boredom, you should consider hiring a regular escort service. If you want to add a new dimension to your pleasure, then you should engage these sophisticated female escorts`
    },
    {
      title: "We have over 1600 real and authentic call girls available around the clock, always waiting for you at your doorstep.",
      text: `Regarding your sexual life, there is no longer any need for you to feel depressed and upset. One of the most stunning cities in India, In this metropolis, everyone wants to experience this night with a female companion who is both delightful and attractive. Call ladies that are capable of providing you with a great deal of love and sexual experience if you are looking for the most stunning and seductive female companion. Where can you find someone who can make your trip and tour more pleasurable and memorable? Therefore, the greatest choice for you would be to hire a call girl. You will receive real services and escort females from our agency during your time with us. You can get the most premium and high-class Call Girl Whatsapp Number from us for your convenience.`
    }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "w-full font-sans bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-16 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#00B9BE] mb-10 uppercase tracking-wider pb-3 border-b-4 border-gray-300 inline-block px-4", children: "About Girls With Wine" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto bg-white p-4 sm:p-6 text-left leading-relaxed", children: aboutSections.map((sec, i) => /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-2xl md:text-3xl font-bold text-[#00B9BE] mb-4 leading-tight", children: sec.title }),
        sec.text && /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm sm:text-base md:text-lg whitespace-pre-line mb-4", children: sec.text }),
        sec.bullets && /* @__PURE__ */ jsx("ul", { className: "list-disc pl-6 space-y-2 text-gray-700 text-sm sm:text-base md:text-lg", children: sec.bullets.map((li, index) => /* @__PURE__ */ jsx("li", { children: li }, index)) })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsx(CitySection, { loading, cities })
  ] });
};
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
  const cityList = selectedState !== "" ? cities.filter((c) => c.state?._id === selectedState).map((c) => c.mainCity) : [];
  const makeSlug = (name) => name?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "";
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
        state: { cityId: mainCityRecord._id }
      });
      return;
    }
    navigate(`/city/${stateSlug}?subCity=${selectedCity}`, {
      state: { cityId: mainCityRecord._id }
    });
  };
  return /* @__PURE__ */ jsx("section", { className: "w-full bg-gradient-to-r from-[#00B9BE] to-[#7CC7EC] text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16 md:py-20", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight", children: "Welcome to Girls with Wine" }),
    /* @__PURE__ */ jsxs("h2", { className: "mt-3 sm:mt-4 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight", children: [
      "An Indian Classifieds Site",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("span", { className: "text-lg sm:text-2xl md:text-4xl lg:text-5xl", children: "Featuring Call Girl Services" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 mt-8 sm:mt-10 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxs("select", { className: "w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base", children: [
        /* @__PURE__ */ jsx("option", { children: "Select Category" }),
        /* @__PURE__ */ jsx("option", { children: "Call Girls" }),
        /* @__PURE__ */ jsx("option", { children: "Massage" })
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: selectedState,
          onChange: (e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          },
          className: "w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select State" }),
            states?.map((st) => /* @__PURE__ */ jsx("option", { value: st._id, children: st.name }, st._id))
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: selectedCity,
          onChange: (e) => setSelectedCity(e.target.value),
          disabled: !selectedState,
          className: "w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base disabled:opacity-60",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select City" }),
            cityList.map((city, i) => /* @__PURE__ */ jsx("option", { value: city, children: city }, i))
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "What you are looking for",
          className: "w-full bg-white text-gray-800 px-3 py-3 rounded-md text-sm sm:text-base"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSearch,
          className: "w-full bg-[#A01047] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#A01047] transition cursor-pointer",
          children: "SEARCH"
        }
      )
    ] }) })
  ] }) });
};
const ServicesSection = () => {
  const services = [
    {
      title: "Call Girls",
      img: imgCallGirls,
      description: "Girls with Wine is an adult classified website for Call girls and women that can help you find single call girls and women to satisfy your desires.",
      cities: ["Bangalore Call Girls", "Mumbai Call Girls", "Jaipur Call Girls"]
    },
    {
      title: "Massage",
      img: imgMassage,
      description: "The best massage ads for all kinds of sexy services. The hot massage girls will give you a relaxing full-body rub to make you feel amazing.",
      cities: ["Bangalore Massage", "Mumbai Massage", "Jaipur Massage"]
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "w-full bg-[#E9F7FE] px-4 py-12 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-center text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#A3195B] leading-tight", children: "Search Or Post Your Adult Advertisements" }),
    /* @__PURE__ */ jsx("div", { className: "w-20 sm:w-24 h-1 bg-[#A3195B] mx-auto mt-3 mb-8" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center px-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed", children: "There is no better place in India for discovering professional escort/call girl talent listings than Girls with Wine." }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed", children: "The platform helps users connect with verified girls in a secure and discreet environment." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 sm:mt-14", children: services.map((service, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300\r\n                 w-full sm:w-[320px] lg:w-[350px] flex flex-col",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: service.img,
                alt: service.title,
                className: "w-full h-52 sm:h-64 object-cover"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#A3195B] text-white px-6 py-2 rounded-md shadow-lg text-sm sm:text-base font-semibold whitespace-nowrap", children: service.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "p-4 pt-8 sm:pt-10 text-gray-700 text-sm sm:text-base leading-relaxed flex-grow", children: service.description }),
          /* @__PURE__ */ jsx("ul", { className: "border-t mt-auto", children: service.cities.map((city, i) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex justify-between items-center px-4 py-3 text-sm sm:text-base text-gray-800 hover:bg-gray-100 cursor-pointer transition",
              children: [
                city,
                /* @__PURE__ */ jsx(FiChevronRight, { className: "text-gray-500" })
              ]
            },
            i
          )) })
        ]
      },
      index
    )) })
  ] }) });
};
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
          cityId: city._id,
          // ✅ यही सही cityId है
          allMainCities: []
        };
      }
      if (city.mainCity) {
        grouped[stateId].allMainCities.push(city.mainCity.trim());
      }
    });
    const formatted = Object.values(grouped).map((item, idx) => ({
      ...item,
      allMainCities: [...new Set(item.allMainCities)],
      color: idx % 2 === 0 ? "bg-[#A3195B]" : "bg-[#0D86D1]"
    }));
    setLocations(formatted);
  }, [cities]);
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
  return /* @__PURE__ */ jsx("section", { className: "bg-[#E9F7FE] py-12 sm:py-16 md:py-20 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-center text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#A3195B]", children: "Most Searched Locations in India" }),
    !loading && locations.length > 0 && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative flex items-center mt-10",
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: prevSlide,
              disabled: index === 0,
              className: "hidden md:flex text-3xl text-[#A3195B] p-3",
              children: /* @__PURE__ */ jsx(FiArrowLeft, {})
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden flex-1", children: /* @__PURE__ */ jsx(
            "div",
            {
              ref: sliderRef,
              className: "flex gap-5",
              style: { width: locations.length * (cardWidth + cardGap) },
              children: locations.map((item) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "bg-white rounded-2xl shadow-lg border flex flex-col py-5 h-[420px] shrink-0",
                  style: { width: cardWidth },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-3", children: /* @__PURE__ */ jsx("div", { className: `${item.color} text-white p-3 rounded-xl`, children: /* @__PURE__ */ jsx(IoLocationSharp, { size: 28 }) }) }),
                    /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold text-center text-[#A3195B] capitalize", children: item.stateName }),
                    /* @__PURE__ */ jsx("ul", { className: "mt-4 text-gray-800 flex-1 border-t pt-2 overflow-y-auto", children: item.allMainCities.slice(0, 4).map((city, idx) => /* @__PURE__ */ jsxs(
                      "li",
                      {
                        onClick: () => navigate(`/city/${city.toLowerCase()}`, {
                          state: { cityId: item.cityId }
                          // ✅ CORRECT cityId
                        }),
                        className: "cursor-pointer px-5 py-2.5 border-b flex justify-between items-center hover:bg-gray-100",
                        children: [
                          city,
                          " Call Girls ",
                          /* @__PURE__ */ jsx(FiChevronRight, {})
                        ]
                      },
                      idx
                    )) }),
                    /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => navigate(`/city/${item.stateName.toLowerCase()}`, {
                          state: { cityId: item.cityId }
                          // ✅ यही CityGirlsPage use karega
                        }),
                        className: "border px-6 py-2 rounded-full text-sm font-medium text-[#A3195B] hover:bg-[#A3195B] hover:text-white transition flex items-center gap-2 mx-auto",
                        children: [
                          "View State ",
                          /* @__PURE__ */ jsx(FiChevronRight, {})
                        ]
                      }
                    ) })
                  ]
                },
                item.stateId
              ))
            }
          ) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: nextSlide,
              disabled: index >= maxIndex,
              className: "hidden md:flex text-3xl text-[#A3195B] p-3",
              children: /* @__PURE__ */ jsx(FiArrowRight, {})
            }
          )
        ]
      }
    )
  ] }) });
};
const logo = "/assets/LOGO-CFHo90yK.PNG";
const rta = "/assets/RTA-Dbms08Re.png";
const Footer = () => {
  return /* @__PURE__ */ jsxs("footer", { className: "bg-black text-white pt-20 pb-10 relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "pr-8", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: logo,
              alt: "Girls with Wine Logo",
              className: "w-60 object-contain mb-5"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[15px] leading-relaxed opacity-90 max-w-sm", children: "The number 1 website for Adult ADS in India for Female Escorts and massage ads." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5 mt-7", children: [
            /* @__PURE__ */ jsx(FaFacebookF, { className: "text-xl cursor-pointer hover:text-gray-300" }),
            /* @__PURE__ */ jsx(FaTwitter, { className: "text-xl cursor-pointer hover:text-gray-300" }),
            /* @__PURE__ */ jsx(FaYoutube, { className: "text-xl cursor-pointer hover:text-gray-300" }),
            /* @__PURE__ */ jsx(FaPinterestP, { className: "text-xl cursor-pointer hover:text-gray-300" }),
            /* @__PURE__ */ jsx(FaLinkedinIn, { className: "text-xl cursor-pointer hover:text-gray-300" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold text-[20px] mb-6", children: "Girls With Wine" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-[15px] opacity-90", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-gray-300", children: "Home" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", className: "hover:text-gray-300", children: "About Us" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/professional-accounts", className: "hover:text-gray-300", children: "Professional Accounts" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold text-[20px] mb-6", children: "HELP / INFO" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-[15px] opacity-90", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/terms", className: "hover:text-gray-300", children: "Terms And Conditions" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "hover:text-gray-300", children: "Privacy Policy" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold text-[20px] mb-6", children: "USEFUL LINKS" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-[15px] opacity-90", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/contact", className: "hover:text-gray-300", children: "Contact Us" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/post-ad", className: "hover:text-gray-300", children: "Post your Ad" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/blog", className: "hover:text-gray-300", children: "Blog" }) })
          ] }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: rta,
              alt: "RTA Badge",
              className: "w-56 mt-3 ml-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-[14px] mt-16 leading-relaxed opacity-60 max-w-4xl mx-auto", children: "This website's only purpose is to advertise, and it can also be used to find information. We have nothing to do with the people or sites that are listed on the page, and we are not responsible for them. We offer online space as a service. Because of this, we have never had any dealings with the prostitution business or escort services. We are not responsible for the content of third-party websites." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70", children: "© 2025 Girls with Wine — All Rights Reserved" }),
        /* @__PURE__ */ jsx("button", { className: "flex items-center gap-2 bg-pink-700 hover:bg-pink-600 px-5 py-2 rounded-full text-sm font-medium", children: "🌐 Girls with Wine Network" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        className: "fixed bottom-6 right-6 bg-pink-700 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg",
        children: /* @__PURE__ */ jsx(FaArrowUp, {})
      }
    )
  ] });
};
const Home = () => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(HeroSection, {}),
    /* @__PURE__ */ jsx(FeaturedModelsSection, {}),
    /* @__PURE__ */ jsx(ServicesSection, {}),
    /* @__PURE__ */ jsx(ModelAboutSection, {}),
    /* @__PURE__ */ jsx(MostSearchedLocations, {}),
    /* @__PURE__ */ jsx(AboutAndReviewsSection, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLogoutPopup(false);
    navigate("/admin/login");
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 min-h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "hidden md:flex fixed top-0 left-0 w-full h-[72px] bg-white shadow z-30 px-6 items-center", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-700", children: "Admin Panel" }) }),
    /* @__PURE__ */ jsxs("div", { className: "md:hidden fixed top-0 left-0 w-full h-[64px] bg-pink-600 text-white flex items-center justify-between px-4 z-30 shadow", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold", children: "Girls Panel" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(true), children: /* @__PURE__ */ jsx(FiMenu, { size: 26 }) })
    ] }),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `
          fixed
          top-[64px] md:top-[72px]
          left-0
          h-[calc(100vh-64px)] md:h-[calc(100vh-72px)]
          w-64
          bg-gradient-to-b from-pink-600 to-pink-400
          text-white
          p-6
          z-40
          overflow-y-auto
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "md:hidden absolute top-4 right-4",
              onClick: () => setIsOpen(false),
              children: /* @__PURE__ */ jsx(FiX, { size: 28 })
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-10 text-center", children: "Girls" }),
          /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-3 font-medium", children: [
            { to: "/admin/all-state", icon: /* @__PURE__ */ jsx(FiMap, {}), label: "State" },
            { to: "/admin/all-cities", icon: /* @__PURE__ */ jsx(FiMapPin, {}), label: "City" },
            { to: "/admin/model-girl", icon: /* @__PURE__ */ jsx(FiUsers, {}), label: "Model Girl" },
            { to: "/admin/all-contacts", icon: /* @__PURE__ */ jsx(FiMail, {}), label: "Contact" }
          ].map((item) => /* @__PURE__ */ jsxs(
            NavLink,
            {
              to: item.to,
              onClick: () => setIsOpen(false),
              className: ({ isActive }) => `px-4 py-2 rounded-md flex items-center gap-3 transition ${isActive ? "bg-white text-pink-600 font-semibold shadow" : "hover:bg-pink-300"}`,
              children: [
                item.icon,
                item.label
              ]
            },
            item.to
          )) }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto pt-10", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setLogoutPopup(true),
              className: "w-full bg-white text-pink-600 font-semibold py-2 rounded-md shadow hover:bg-gray-100 flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(FiLogOut, { size: 18 }),
                "Logout"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "main",
      {
        className: "\r\n          pt-[64px] md:pt-[72px]\r\n          md:ml-64\r\n          p-4 md:p-6\r\n          min-h-screen\r\n        ",
        children
      }
    ),
    logoutPopup && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-[420px] rounded-2xl p-8 text-center shadow-xl", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Are you sure?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-2", children: "You will be logged out." }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center my-6", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-red-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FiLogOut, { size: 40, className: "text-red-500" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setLogoutPopup(false),
            className: "px-6 py-2 border rounded-lg",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleLogout,
            className: "px-6 py-2 bg-red-600 text-white rounded-lg",
            children: "Logout"
          }
        )
      ] })
    ] }) })
  ] });
};
const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const joditInstance = useRef(null);
  useEffect(() => {
    if (window.Jodit && editorRef.current && !joditInstance.current) {
      joditInstance.current = window.Jodit.make(editorRef.current, {
        height: 400,
        readonly: false,
        placeholder: "Write your blog content..."
      });
      joditInstance.current.value = value || "";
      joditInstance.current.events.on("change", () => {
        onChange(joditInstance.current.value);
      });
    }
    return () => {
      if (joditInstance.current) {
        joditInstance.current.destruct();
        joditInstance.current = null;
      }
    };
  }, []);
  return /* @__PURE__ */ jsx("textarea", { ref: editorRef, defaultValue: value });
};
const AddCity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success } = useSelector((s) => s.city);
  const { states } = useSelector((s) => s.states);
  const [form, setForm] = useState({
    mainCity: "",
    heading: "",
    subDescription: "",
    state: "",
    whatsappNumber: "",
    phoneNumber: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [localAreas, setLocalAreas] = useState([
    { name: "", description: "" }
  ]);
  useEffect(() => {
    dispatch(getStatesThunk());
  }, [dispatch]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.state) return toast.error("Please select a State");
    const fd = new FormData();
    fd.append("heading", form.heading.trim());
    fd.append("subDescription", form.subDescription.trim());
    fd.append("mainCity", form.mainCity.trim());
    fd.append("state", form.state);
    fd.append("whatsappNumber", form.whatsappNumber.trim());
    fd.append("phoneNumber", form.phoneNumber.trim());
    fd.append("description", form.description);
    fd.append("localAreas", JSON.stringify(localAreas));
    if (image) fd.append("image", image);
    dispatch(addCityThunk(fd));
  };
  useEffect(() => {
    if (success) {
      toast.success("City added successfully!");
      dispatch(resetCityState());
      navigate("/admin/all-cities");
    }
  }, [success, dispatch, navigate]);
  const updateLocalArea = (i, key, val) => {
    const clone = [...localAreas];
    clone[i][key] = val;
    setLocalAreas(clone);
  };
  const addLocalArea = () => setLocalAreas([...localAreas, { name: "", description: "" }]);
  const removeLocalArea = (i) => {
    const clone = [...localAreas];
    clone.splice(i, 1);
    setLocalAreas(clone);
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { children: [
    loading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: /* @__PURE__ */ jsx("div", { className: "animate-spin h-14 w-14 border-4 border-white border-t-transparent rounded-full" }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl border p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-gray-800", children: "Add New City" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/admin/all-cities"),
            className: "self-start sm:self-auto px-5 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 font-medium",
            children: "← Back"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12", children: [
        /* @__PURE__ */ jsxs(Section$1, { title: "Basic Information", children: [
          /* @__PURE__ */ jsx(
            Input$4,
            {
              label: "City Heading",
              placeholder: "e.g. Best Escort Services in Jaipur",
              value: form.heading,
              onChange: (e) => setForm((p) => ({ ...p, heading: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsx(
            Textarea$4,
            {
              label: "Sub Description",
              rows: 3,
              placeholder: "Short city description shown below heading",
              value: form.subDescription,
              onChange: (e) => setForm((p) => ({
                ...p,
                subDescription: e.target.value
              }))
            }
          ),
          /* @__PURE__ */ jsxs(Grid$1, { children: [
            /* @__PURE__ */ jsx(
              Input$4,
              {
                label: "Main City Title Name",
                placeholder: "Enter main city (e.g. Jaipur)",
                value: form.mainCity,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  mainCity: e.target.value
                }))
              }
            ),
            /* @__PURE__ */ jsxs(
              Select$1,
              {
                label: "Select State *",
                value: form.state,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  state: e.target.value
                })),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "-- Select State --" }),
                  states?.map((st) => /* @__PURE__ */ jsx("option", { value: st._id, children: st.name.charAt(0).toUpperCase() + st.name.slice(1) }, st._id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Grid$1, { children: [
            /* @__PURE__ */ jsx(
              Input$4,
              {
                label: "WhatsApp Number",
                placeholder: "Enter WhatsApp number",
                value: form.whatsappNumber,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  whatsappNumber: e.target.value
                }))
              }
            ),
            /* @__PURE__ */ jsx(
              Input$4,
              {
                label: "Phone Number",
                placeholder: "Enter phone number",
                value: form.phoneNumber,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  phoneNumber: e.target.value
                }))
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            FileInput$1,
            {
              label: "City Image *",
              onChange: (e) => setImage(e.target.files[0])
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Section$1, { title: "Local Areas", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          localAreas.map((area, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border",
              children: [
                /* @__PURE__ */ jsx(
                  Input$4,
                  {
                    label: "Local Area Name",
                    placeholder: "Area name",
                    value: area.name,
                    onChange: (e) => updateLocalArea(
                      i,
                      "name",
                      e.target.value
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Input$4,
                  {
                    label: "Local Area Description",
                    placeholder: "Short description",
                    value: area.description,
                    onChange: (e) => updateLocalArea(
                      i,
                      "description",
                      e.target.value
                    )
                  }
                ),
                i > 0 && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeLocalArea(i),
                    className: "text-red-600 font-medium text-sm",
                    children: "Remove"
                  }
                )
              ]
            },
            i
          )),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: addLocalArea,
              className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-fit",
              children: "+ Add Local Area"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(Section$1, { title: "Description", children: /* @__PURE__ */ jsx("div", { className: "border rounded-xl p-2", children: /* @__PURE__ */ jsx(
          RichTextEditor,
          {
            value: form.description,
            onChange: (val) => setForm((p) => ({
              ...p,
              description: val
            }))
          }
        ) }) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            disabled: loading,
            className: "bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-lg shadow-lg disabled:opacity-50 w-full sm:w-auto",
            children: loading ? "Adding..." : "Add City"
          }
        ) })
      ] })
    ] }) })
  ] });
};
const Section$1 = ({ title, children }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800", children: title }),
  children
] });
const Grid$1 = ({ children }) => /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children });
const Input$4 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      className: "w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
    }
  )
] });
const Textarea$4 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "textarea",
    {
      ...props,
      className: "w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none"
    }
  )
] });
const Select$1 = ({ label, children, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "select",
    {
      ...props,
      className: "w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer",
      children
    }
  )
] });
const FileInput$1 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "input",
    {
      type: "file",
      ...props,
      className: "w-full border px-4 py-3 rounded-lg bg-gray-50"
    }
  )
] });
const TableSkeleton = () => {
  return /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs("tr", { className: "animate-pulse border-b", children: [
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-10" }) }),
    /* @__PURE__ */ jsxs("td", { className: "p-4 border", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-40 mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded w-32" })
    ] }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-28" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 bg-gray-200 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 bg-gray-200 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 bg-gray-200 rounded" })
    ] }) })
  ] }, i)) });
};
const AllCities = () => {
  const dispatch = useDispatch();
  const { cities, loading } = useSelector((s) => s.city);
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = cities?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedCities = cities?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);
  const toggleDrawer = (value) => setOpen(value);
  const handleDelete = async (cityId) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    const action = await dispatch(deleteCityThunk(cityId));
    if (action.meta.requestStatus === "fulfilled") {
      toast.success("City deleted successfully");
      dispatch(getCitiesThunk());
    } else {
      toast.error("Failed to delete city");
    }
  };
  const updateStatusInDrawer = async (city) => {
    const newStatus = city.status === "Active" ? "Inactive" : "Active";
    const action = await dispatch(
      updateCityStatusThunk({ id: city._id, status: newStatus })
    );
    if (action.meta.requestStatus === "fulfilled") {
      toast.success("Status updated");
      dispatch(getCitiesThunk());
      toggleDrawer(false);
    } else {
      toast.error("Failed to update status");
    }
  };
  const handleView = (city) => {
    setSelectedCity(city);
    toggleDrawer(true);
  };
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-8 border border-gray-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800 mt-8", children: "All Cities" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/admin/create-city",
          className: "px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer mt-14",
          children: "+ Add New City"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-gray-200 shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left border", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-100 border", children: /* @__PURE__ */ jsxs("tr", { className: "text-gray-700 border font-semibold", children: [
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r", children: "S.no" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r", children: "City Details" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r", children: "Created At" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 text-center", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y border", children: loading ? /* @__PURE__ */ jsx(TableSkeleton, {}) : paginatedCities.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "text-center py-6 text-gray-500", children: "No cities found" }) }) : paginatedCities.map((city, index) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: "hover:bg-gray-50 transition border",
          children: [
            /* @__PURE__ */ jsx("td", { className: "p-3 text-gray-800 font-semibold border", children: (currentPage - 1) * pageSize + (index + 1) }),
            /* @__PURE__ */ jsxs("td", { className: "p-3 border", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
                "City: ",
                city.mainCity
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
                "State:",
                " ",
                city.state?.name ? city.state.name.charAt(0).toUpperCase() + city.state.name.slice(1) : "Not Assigned"
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-gray-700 border", children: new Date(city.createdAt).toLocaleDateString() }),
            /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleView(city),
                  className: "p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow cursor-pointer",
                  children: /* @__PURE__ */ jsx(EyeIcon, { className: "w-5 h-5 text-gray-700" })
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: `/admin/edit-city/${city._id}`,
                  className: "p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow cursor-pointer",
                  children: /* @__PURE__ */ jsx(PencilSquareIcon, { className: "w-5 h-5 text-white" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(city._id),
                  className: "p-2 bg-red-600 rounded-lg hover:bg-red-700 transition shadow cursor-pointer",
                  children: /* @__PURE__ */ jsx(TrashIcon, { className: "w-5 h-5 text-white" })
                }
              )
            ] }) })
          ]
        },
        city._id
      )) })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-2 mt-5", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage - 1),
          disabled: currentPage === 1,
          className: `px-4 py-2 rounded-lg border ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Prev"
        }
      ),
      Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(num),
          className: `px-4 py-2 rounded-lg border ${currentPage === num ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`,
          children: num
        },
        num
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage + 1),
          disabled: currentPage === totalPages,
          className: `px-4 py-2 rounded-lg border ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Next"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Drawer, { anchor: "right", open, onClose: () => toggleDrawer(false), children: /* @__PURE__ */ jsx("div", { className: "w-[430px] p-6 bg-white h-full overflow-y-auto shadow-xl", children: selectedCity && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 text-center mb-2", children: selectedCity.mainCity }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 mb-6", children: "City Information Overview" }),
      /* @__PURE__ */ jsx("hr", { className: "my-4 border-gray-200" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => updateStatusInDrawer(selectedCity),
          className: `w-full py-3 rounded-xl text-white font-semibold text-lg mb-6 cursor-pointer transition ${selectedCity.status === "Active" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`,
          children: selectedCity.status
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-gray-800", children: "State:" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: selectedCity.state?.name || "No State Assigned" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-gray-800", children: "Local Areas:" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc ml-6 text-gray-600 mt-1", children: selectedCity.localAreas?.map((area, index) => /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: area.name }),
            " –",
            " ",
            area.description
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-gray-800", children: "Description:" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "prose mt-2 text-gray-600",
              dangerouslySetInnerHTML: {
                __html: selectedCity.description
              }
            }
          )
        ] })
      ] })
    ] }) }) })
  ] }) });
};
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("tokenId");
  if (!token) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true });
  }
  return children;
};
const GirlsSkeleton = () => {
  return /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxs("tr", { className: "animate-pulse border-b", children: [
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gray-200 rounded-lg" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-24 mb-2" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-10" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-32" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-40" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-20" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded-full w-20" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-14 bg-gray-200 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-8 w-14 bg-gray-200 rounded" })
    ] }) })
  ] }, i)) });
};
const AllGirlsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, girls, error } = useSelector((state) => state.girls);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = girls?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedGirls = girls?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(getAllGirlsThunk());
  }, [dispatch]);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this girl?")) {
      dispatch(deleteGirlThunk({ id }));
    }
  };
  const handleStatusChange = async (girl) => {
    setStatusLoadingId(girl._id);
    await dispatch(
      toggleGirlStatusThunk({
        id: girl._id,
        status: girl.status === "Active" ? "Inactive" : "Active"
      })
    );
    setStatusLoadingId(null);
  };
  const renderCities = (cityArray) => {
    if (!Array.isArray(cityArray)) return "—";
    return cityArray.map((c) => c.mainCity).join(", ");
  };
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-xl rounded-xl p-6 w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-800 mt-16", children: "Girls Management" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/admin/add-girl",
          className: "bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg shadow-md transition cursor-pointer mt-16",
          children: "+ Add Girl"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-center text-red-500", children: error }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-gray-300 shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full border border-gray-300", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-100 text-gray-700 text-left border-b border-gray-300", children: [
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Image" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Name" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Age" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Cities" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Heading" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Price" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 text-center", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx(GirlsSkeleton, {}) : paginatedGirls?.length > 0 ? paginatedGirls.map((girl, index) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: "hover:bg-gray-50 transition border-b border-gray-300",
          children: [
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: girl.imageUrl && girl.imageUrl.trim() !== "" ? girl.imageUrl : "https://placehold.co/150x150?text=No+Image",
                alt: girl.name,
                className: "w-14 h-14 rounded-lg object-cover border shadow-sm"
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300 font-medium capitalize", children: girl.name }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: girl.age }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300 text-gray-700 font-medium capitalize", children: renderCities(girl.city) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: girl.heading?.length > 20 ? girl.heading.substring(0, 20) + "..." : girl.heading }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: girl.priceDetails }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300 text-center", children: statusLoadingId === girl._id ? /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto" }) : /* @__PURE__ */ jsx(
              "span",
              {
                onClick: () => handleStatusChange(girl),
                className: `px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition 
                            ${girl.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`,
                children: girl.status
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigate(`/admin/edit-girl/${girl._id}`),
                  className: "bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm shadow transition",
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(girl._id),
                  className: "bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm shadow transition",
                  children: "Delete"
                }
              )
            ] }) })
          ]
        },
        girl._id
      )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "p-6 text-center text-gray-500", children: "No Girls Found" }) }) })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-2 mt-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage - 1),
          disabled: currentPage === 1,
          className: `px-4 py-2 rounded-lg border ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Prev"
        }
      ),
      Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(num),
          className: `px-4 py-2 rounded-lg border ${currentPage === num ? "bg-pink-600 text-white" : "bg-white hover:bg-gray-100"}`,
          children: num
        },
        num
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage + 1),
          disabled: currentPage === totalPages,
          className: `px-4 py-2 rounded-lg border ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Next"
        }
      )
    ] })
  ] }) });
};
const AddGirlForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cities } = useSelector((state) => state.city);
  const { loading } = useSelector((state) => state.girls);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    heading: "",
    city: [],
    description: "",
    priceDetails: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleCityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value
    }));
  };
  const handleImageChange = (e) => {
    const img = e.target.files[0];
    setImageFile(img);
    if (img) setPreviewImage(URL.createObjectURL(img));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("age", formData.age);
    fd.append("heading", formData.heading);
    fd.append("city", JSON.stringify(formData.city));
    fd.append("description", formData.description);
    fd.append("priceDetails", formData.priceDetails);
    if (imageFile) fd.append("image", imageFile);
    dispatch(addGirlThunk(fd)).then((res) => {
      if (!res.error) {
        navigate("/admin/model-girl");
      }
    });
  };
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", { className: "relative bg-white p-8 shadow-xl rounded-2xl mt-6", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate(-1),
        className: "mb-5 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 shadow-sm cursor-pointer",
        children: "← Back"
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-800 mb-6", children: "Add New Girl" }),
    loading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsx(Input$3, { label: "Name", name: "name", value: formData.name, onChange: handleChange }),
        /* @__PURE__ */ jsx(
          Input$3,
          {
            label: "Age",
            name: "age",
            type: "number",
            value: formData.age,
            onChange: handleChange
          }
        ),
        /* @__PURE__ */ jsx(Input$3, { label: "Heading", name: "heading", value: formData.heading, onChange: handleChange }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-1", children: "Select Cities" }),
          /* @__PURE__ */ jsxs(FormControl, { fullWidth: true, size: "small", children: [
            /* @__PURE__ */ jsx(InputLabel, { id: "city-select", children: "Cities" }),
            /* @__PURE__ */ jsx(
              Select$2,
              {
                labelId: "city-select",
                multiple: true,
                value: formData.city,
                onChange: handleCityChange,
                input: /* @__PURE__ */ jsx(OutlinedInput, { label: "Cities" }),
                renderValue: (selected) => /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: selected.map((id) => {
                  const c = cities.find((ct) => ct._id === id);
                  return /* @__PURE__ */ jsx(Chip, { label: c?.mainCity || "Unknown" }, id);
                }) }),
                children: cities.map((city) => /* @__PURE__ */ jsx(MenuItem, { value: city._id, children: city.mainCity }, city._id))
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Textarea$3, { label: "Description", name: "description", value: formData.description, onChange: handleChange }),
      /* @__PURE__ */ jsx(Textarea$3, { label: "Price Details", name: "priceDetails", value: formData.priceDetails, onChange: handleChange }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-1", children: "Upload Image" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            onChange: handleImageChange,
            className: "w-full px-4 py-2 border rounded-lg"
          }
        ),
        previewImage && /* @__PURE__ */ jsx(
          "img",
          {
            src: previewImage,
            className: "w-32 h-32 object-cover rounded-lg mt-4 border shadow-md",
            alt: "Preview"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg shadow text-lg",
          children: loading ? "Uploading..." : "Add Girl"
        }
      )
    ] })
  ] }) });
};
const Input$3 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-1", children: label }),
  /* @__PURE__ */ jsx("input", { ...props, required: true, className: "w-full px-4 py-2 border rounded-lg" })
] });
const Textarea$3 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-1", children: label }),
  /* @__PURE__ */ jsx("textarea", { ...props, rows: "4", className: "w-full px-4 py-2 border rounded-lg" })
] });
const EditGirlForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { girls, loading } = useSelector((state) => state.girls);
  const { cities } = useSelector((state) => state.city);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    heading: "",
    city: [],
    description: "",
    priceDetails: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    dispatch(getAllGirlsThunk());
    dispatch(getCitiesThunk());
  }, []);
  useEffect(() => {
    const girl = girls.find((g) => g._id === id);
    if (girl) {
      setFormData({
        name: girl.name,
        age: girl.age,
        heading: girl.heading,
        city: Array.isArray(girl.city) ? girl.city.map((c) => c._id) : [],
        description: girl.description,
        priceDetails: girl.priceDetails
      });
      setPreviewImage(girl.imageUrl);
    }
  }, [girls, id]);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const toggleCitySelection = (cityId) => {
    setFormData((prev) => {
      const alreadySelected = prev.city.includes(cityId);
      return {
        ...prev,
        city: alreadySelected ? prev.city.filter((id2) => id2 !== cityId) : [...prev.city, cityId]
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("age", formData.age);
    fd.append("heading", formData.heading);
    fd.append("city", JSON.stringify(formData.city));
    fd.append("description", formData.description);
    fd.append("priceDetails", formData.priceDetails);
    if (imageFile) fd.append("image", imageFile);
    dispatch(updateGirlThunk({ id, formData: fd })).then((res) => {
      if (!res.error) navigate("/admin/model-girl");
    });
  };
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", { className: "relative bg-white shadow-xl rounded-xl p-8 mt-6", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate(-1),
        className: "mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 shadow-sm flex items-center gap-2 cursor-pointer",
        children: "← Back"
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-800 mb-6", children: "Edit Girl Details" }),
    loading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-xl", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsx(Input$2, { label: "Name", name: "name", value: formData.name, onChange: handleChange }),
        /* @__PURE__ */ jsx(Input$2, { label: "Age", name: "age", type: "number", value: formData.age, onChange: handleChange }),
        /* @__PURE__ */ jsx(Input$2, { label: "Heading", name: "heading", value: formData.heading, onChange: handleChange }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-2 font-medium", children: "Select Cities" }),
          /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-2 bg-white", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-2", children: [
              formData.city.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-sm", children: "No cities selected" }),
              formData.city.map((cityId) => {
                const cityObj = cities.find((c) => c._id === cityId);
                if (!cityObj) return null;
                return /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm flex items-center gap-2",
                    children: [
                      cityObj.mainCity,
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => toggleCitySelection(cityId),
                          className: "text-pink-700 hover:text-pink-900",
                          children: "×"
                        }
                      )
                    ]
                  },
                  cityId
                );
              })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-h-48 overflow-y-auto border-t pt-2", children: cities.map((city) => /* @__PURE__ */ jsxs(
              "label",
              {
                className: "flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded",
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: formData.city.includes(city._id),
                      onChange: () => toggleCitySelection(city._id),
                      className: "w-4 h-4"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: city.mainCity })
                ]
              },
              city._id
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Textarea$2,
        {
          label: "Description",
          name: "description",
          value: formData.description,
          onChange: handleChange
        }
      ),
      /* @__PURE__ */ jsx(
        Textarea$2,
        {
          label: "Price Details",
          name: "priceDetails",
          value: formData.priceDetails,
          onChange: handleChange
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-2 font-medium", children: "Upload Image (Optional)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            onChange: (e) => {
              const file = e.target.files[0];
              setImageFile(file);
              if (file) setPreviewImage(URL.createObjectURL(file));
            },
            className: "w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-pointer"
          }
        ),
        previewImage && /* @__PURE__ */ jsx(
          "img",
          {
            src: previewImage,
            className: "w-32 h-32 object-cover rounded-lg mt-4 shadow-md border",
            alt: "preview"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "bg-pink-600 hover:bg-pink-700 text-white py-3 px-10 rounded-lg shadow text-lg cursor-pointer disabled:opacity-50 mb-12",
          children: loading ? "Updating..." : "Update Girl"
        }
      )
    ] })
  ] }) });
};
const Input$2 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("label", { className: "block text-gray-700 font-medium mb-1", children: label }),
  /* @__PURE__ */ jsx("input", { ...props, required: true, className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" })
] });
const Textarea$2 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("label", { className: "block text-gray-700 font-medium mb-1", children: label }),
  /* @__PURE__ */ jsx("textarea", { ...props, required: true, rows: "4", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" })
] });
const SkeletonBox = ({ height = "h-10" }) => /* @__PURE__ */ jsx("div", { className: `bg-gray-200 rounded-lg animate-pulse ${height}` });
const EditCity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cityId } = useParams();
  const { cities } = useSelector((s) => s.city);
  const { states } = useSelector((s) => s.states);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [form, setForm] = useState({
    heading: "",
    subDescription: "",
    mainCity: "",
    state: "",
    whatsappNumber: "",
    phoneNumber: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [localAreas, setLocalAreas] = useState([
    { name: "", description: "" }
  ]);
  useEffect(() => {
    dispatch(getStatesThunk());
    dispatch(getCitiesThunk());
  }, [dispatch]);
  useEffect(() => {
    if (!cities.length) return;
    const city = cities.find((c) => c._id === cityId);
    if (!city) return;
    setForm({
      heading: city.heading || "",
      subDescription: city.subDescription || "",
      mainCity: city.mainCity || "",
      state: city.state?._id || "",
      whatsappNumber: city.whatsappNumber || "",
      phoneNumber: city.phoneNumber || "",
      description: city.description || ""
    });
    setPreviewImage(city.imageUrl || null);
    if (city.localAreas?.length) {
      setLocalAreas(
        city.localAreas.map((a) => ({
          name: a.name || "",
          description: a.description || ""
        }))
      );
    }
    setInitialLoaded(true);
  }, [cities, cityId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.state) return toast.error("Please select a State");
    setLoading(true);
    const fd = new FormData();
    fd.append("heading", form.heading.trim());
    fd.append("subDescription", form.subDescription.trim());
    fd.append("mainCity", form.mainCity.trim());
    fd.append("state", form.state);
    fd.append("whatsappNumber", form.whatsappNumber);
    fd.append("phoneNumber", form.phoneNumber);
    fd.append("description", form.description);
    fd.append("localAreas", JSON.stringify(localAreas));
    if (image) fd.append("image", image);
    const res = await dispatch(
      updateCityThunk({ cityId, formData: fd })
    );
    setLoading(false);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("City updated successfully!");
      navigate("/admin/all-cities");
    } else {
      toast.error("Failed to update city");
    }
  };
  const updateLocalArea = (i, key, value) => {
    const arr = [...localAreas];
    arr[i][key] = value;
    setLocalAreas(arr);
  };
  const addLocalArea = () => setLocalAreas([...localAreas, { name: "", description: "" }]);
  const removeLocalArea = (i) => setLocalAreas(localAreas.filter((_, idx) => idx !== i));
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-2xl shadow-xl border", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-gray-800", children: "Edit City" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/admin/all-cities"),
          className: "px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border",
          children: "← Back"
        }
      )
    ] }),
    !initialLoaded ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(SkeletonBox, { height: "h-12" }),
      /* @__PURE__ */ jsx(SkeletonBox, { height: "h-12" }),
      /* @__PURE__ */ jsx(SkeletonBox, { height: "h-40" })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-12", children: [
      /* @__PURE__ */ jsxs(Section, { title: "Basic Information", children: [
        /* @__PURE__ */ jsx(
          Input$1,
          {
            label: "City Heading",
            name: "heading",
            value: form.heading,
            onChange: handleChange
          }
        ),
        /* @__PURE__ */ jsx(
          Textarea$1,
          {
            label: "Sub Description",
            rows: 3,
            name: "subDescription",
            value: form.subDescription,
            onChange: handleChange
          }
        ),
        /* @__PURE__ */ jsxs(Grid, { children: [
          /* @__PURE__ */ jsx(
            Input$1,
            {
              label: "Main City Title Name",
              name: "mainCity",
              value: form.mainCity,
              onChange: handleChange
            }
          ),
          /* @__PURE__ */ jsxs(
            Select,
            {
              label: "Select State *",
              name: "state",
              value: form.state,
              onChange: handleChange,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "-- Select State --" }),
                states?.map((s) => /* @__PURE__ */ jsx("option", { value: s._id, children: s.name.charAt(0).toUpperCase() + s.name.slice(1) }, s._id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Grid, { children: [
          /* @__PURE__ */ jsx(
            Input$1,
            {
              label: "WhatsApp Number",
              name: "whatsappNumber",
              value: form.whatsappNumber,
              onChange: handleChange
            }
          ),
          /* @__PURE__ */ jsx(
            Input$1,
            {
              label: "Phone Number",
              name: "phoneNumber",
              value: form.phoneNumber,
              onChange: handleChange
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FileInput,
          {
            label: "City Image",
            onChange: (e) => {
              setImage(e.target.files[0]);
              setPreviewImage(URL.createObjectURL(e.target.files[0]));
            }
          }
        ),
        previewImage && /* @__PURE__ */ jsx(
          "img",
          {
            src: previewImage,
            alt: "preview",
            className: "w-48 h-32 object-cover rounded-lg shadow"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "Local Areas", children: [
        localAreas.map((area, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border mb-4",
            children: [
              /* @__PURE__ */ jsx(
                Input$1,
                {
                  label: "Local Area Name",
                  value: area.name,
                  onChange: (e) => updateLocalArea(i, "name", e.target.value)
                }
              ),
              /* @__PURE__ */ jsx(
                Input$1,
                {
                  label: "Local Area Description",
                  value: area.description,
                  onChange: (e) => updateLocalArea(i, "description", e.target.value)
                }
              ),
              i > 0 && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeLocalArea(i),
                  className: "text-red-600 text-sm",
                  children: "Remove"
                }
              )
            ]
          },
          i
        )),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: addLocalArea,
            className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg",
            children: "+ Add Local Area"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "Description", children: /* @__PURE__ */ jsx("div", { className: "border rounded-xl p-2", children: /* @__PURE__ */ jsx(
        RichTextEditor,
        {
          value: form.description,
          onChange: (val) => setForm((p) => ({ ...p, description: val }))
        }
      ) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-lg shadow-lg flex items-center gap-3 disabled:opacity-50",
          children: [
            loading && /* @__PURE__ */ jsx("span", { className: "animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" }),
            loading ? "Updating..." : "Update City"
          ]
        }
      ) })
    ] })
  ] }) }) });
};
const Section = ({ title, children }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800", children: title }),
  children
] });
const Grid = ({ children }) => /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children });
const Input$1 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      className: "w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
    }
  )
] });
const Textarea$1 = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "textarea",
    {
      ...props,
      className: "w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none"
    }
  )
] });
const Select = ({ label, children, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "select",
    {
      ...props,
      className: "w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer",
      children
    }
  )
] });
const FileInput = ({ label, ...props }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
  /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsx(
    "input",
    {
      type: "file",
      ...props,
      className: "w-full border px-4 py-3 rounded-lg bg-gray-50"
    }
  )
] });
const AboutUs = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-10 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto    p-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-5xl font-bold text-[#A3195B] mb-6", children: "About Girls With wine Network" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Girls With wine Network is India’s safest and most private platform for posting adult classified advertisements. Our platform is designed for independent professionals, agencies, and verified service providers who want a secure place to promote their services in a respectful and dignified manner." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A3195B] mt-8 mb-3", children: "A Secure Space Built for Privacy" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Privacy is the foundation of our platform. Every feature — from ad posting to renewal — is built to ensure complete user control. You decide what information to display, when your ad goes live, and how your profile appears to potential clients." }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "While we host classified ads for eligible professionals, we do not operate, manage, or arrange escort services. We simply provide a secure online space for advertising and visibility." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A3195B] mt-8 mb-3", children: "What We Offer" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2 text-gray-700", children: [
        /* @__PURE__ */ jsx("li", { children: "Verified listings to help users connect with real service providers" }),
        /* @__PURE__ */ jsx("li", { children: "Simple ad creation tools with photos, details, pricing, and location tags" }),
        /* @__PURE__ */ jsx("li", { children: "Free ad posting with optional premium visibility upgrades" }),
        /* @__PURE__ */ jsx("li", { children: "A safe, private, and user-friendly interface" }),
        /* @__PURE__ */ jsx("li", { children: "Hands-off & no-interference policy — full control remains with you" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A3195B] mt-8 mb-3", children: "A Platform Designed for Growth" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Girls With wine is more than just an advertising site — it’s a digital gateway that helps professionals increase visibility and attract genuine customers. Ads from major cities such as Mumbai, Delhi, Jaipur, and Bengaluru reach thousands of verified visitors looking for trusted services." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A3195B] mt-8 mb-3", children: "Safety, Verification & User Protection" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "User safety is extremely important to us. All ads go through basic verification and monitoring to prevent misuse, ensure authenticity, and create a reliable environment for everyone. We encourage all users to interact only in legal, consensual, and respectful ways." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A3195B] mt-8 mb-3", children: "Support That Truly Cares" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Our support team is always available to assist you—from creating an effective profile to resolving technical issues. We aim to provide a smooth, safe, and stress-free experience for all users." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A3195B] mt-8 mb-3", children: "Built for Discretion, Designed for Success" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Every feature at Girls With wine is crafted with discretion and professionalism in mind. Whether you're a service provider or a business, you get the tools needed to manage your brand, visibility, and engagement — all while keeping your information protected." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-[#A3195B] mt-8 mb-3", children: "Join Thousands Across India" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Individuals and professionals from all major cities trust Girls With wine to promote their services. Become part of a growing network built on safety, privacy, and genuine connections." }),
      /* @__PURE__ */ jsx("p", { className: "mt-10 text-gray-600 italic", children: "© 2025 Girls With wine Network — A trusted platform for secure adult classifieds in India." })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const TermsAndConditions = ({ lastUpdated = "August 2025", jurisdiction = "[Insert Location]" }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-10 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto  p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
        "Last Updated: ",
        lastUpdated
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "prose prose-sm lg:prose-lg text-gray-700 leading-relaxed [&_p]:text-gray-700 [&_p]:text-base [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#A3195B] [&_h2]:mt-8 [&_h2]:mb-3", children: [
        /* @__PURE__ */ jsx("p", { children: "Welcome to Girls With Wine. By accessing or using our website (https://girlswithwine.com), you agree to comply with and be bound by the Terms and Conditions described below. Please read these terms carefully. If you do not accept them in full, you may not use the platform." }),
        /* @__PURE__ */ jsx("p", { children: "We act only as a digital advertising platform and do not employ, manage, verify, schedule, or coordinate interactions between users. All listings are user-generated, and all communications or engagements occur directly between users without the platform’s involvement." }),
        /* @__PURE__ */ jsx("h2", { children: "1. Platform Purpose" }),
        /* @__PURE__ */ jsx("p", { children: "This platform provides a space for independent providers to advertise their personal or professional services. We operate strictly as a listing and promotional platform. We do not verify, endorse, manage, or participate in any arrangements users may make with one another. Our role is limited to hosting advertisements and facilitating visibility." }),
        /* @__PURE__ */ jsx("h2", { children: "2. Eligibility" }),
        /* @__PURE__ */ jsx("p", { children: "To use this platform, you must be at least 18 years old or meet the legal age of majority in your jurisdiction. Users may be required to submit proof of age. Providing false age information may result in immediate account removal." }),
        /* @__PURE__ */ jsx("p", { children: "By creating an account or posting content, you confirm that you meet legal requirements and that accessing such a platform is permissible in your location. Users are solely responsible for ensuring compliance with their local laws." }),
        /* @__PURE__ */ jsx("h2", { children: "3. User Responsibilities" }),
        /* @__PURE__ */ jsx("p", { children: "Users must behave respectfully and responsibly. All information posted—profiles, images, descriptions, and communications—must be truthful, current, and accurate. Users may not share misleading, harmful, illegal, or offensive content." }),
        /* @__PURE__ */ jsx("p", { children: "You are responsible for safeguarding your account credentials and any activity occurring under your account. All applicable laws regarding user rights, privacy, and online content must be followed." }),
        /* @__PURE__ */ jsx("h2", { children: "4. Prohibited Content" }),
        /* @__PURE__ */ jsx("p", { children: "Users may not post content that:" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: "Involves or suggests minors ." }),
          /* @__PURE__ */ jsx("li", { children: "Promotes coercion, exploitation, or non-consensual behavior" }),
          /* @__PURE__ */ jsx("li", { children: "Contains threats, hate speech, harassment, or abusive language" }),
          /* @__PURE__ */ jsx("li", { children: "Encourages the use of illegal goods or services." }),
          /* @__PURE__ */ jsx("li", { children: "Violates intellectual property rights" }),
          /* @__PURE__ */ jsx("li", { children: "Includes stolen, falsified, or manipulated images or data" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Violation of this policy may result in immediate removal of content and permanent account suspension." }),
        /* @__PURE__ */ jsx("h2", { children: "5. Age Verification Procedure" }),
        /* @__PURE__ */ jsx("p", { children: "Service providers may be required to undergo an age-validation process. Verification may involve automated tools, third-party services, or manual checks when necessary. Documents submitted during this process are handled in accordance with our Privacy Policy." }),
        /* @__PURE__ */ jsx("p", { children: "Impersonation, identity misuse, or falsification of verification data is strictly prohibited and may lead to permanent account closure and legal consequences." }),
        /* @__PURE__ */ jsx("h2", { children: "6. Acceptable Use Policy" }),
        /* @__PURE__ */ jsx("p", { children: "Users must not upload or promote material that is unlawful, offensive, discriminatory, defamatory, obscene, fraudulent, or incites violence. All content must comply with local and national regulations." }),
        /* @__PURE__ */ jsx("p", { children: "Users must have the rights or permissions to post any content involving personal data, photos, or information of others." }),
        /* @__PURE__ */ jsx("p", { children: "If a user includes publicly visible contact details (such as email), the platform is not responsible for messages they may receive." }),
        /* @__PURE__ */ jsx("h2", { children: "7. Content Ownership and Usage" }),
        /* @__PURE__ */ jsx("p", { children: "Users maintain ownership of all content they post. However, by submitting content to the platform, users grant us a non-exclusive, worldwide, royalty-free license to display, store, distribute, and modify content for operational, promotional, and optimization purposes." }),
        /* @__PURE__ */ jsx("p", { children: "We may edit, remove, or reject content that violates our policies or appears misleading." }),
        /* @__PURE__ */ jsx("h2", { children: "8. Third-Party Content" }),
        /* @__PURE__ */ jsx("p", { children: "Our website may display advertisements, listings, or links from third-party sources. These external services are independent of us, and we do not monitor or endorse their content. Users access third-party websites at their own risk." }),
        /* @__PURE__ */ jsx("h2", { children: "9. No Guarantee of Services" }),
        /* @__PURE__ */ jsx("p", { children: "All listings are user-generated. We do not verify, guarantee, or take responsibility for the accuracy, reliability, quality, or availability of services advertised on the platform. Any communication or transaction between users is conducted independently." }),
        /* @__PURE__ */ jsx("p", { children: "We are not liable for disputes, losses, or misunderstandings between users." }),
        /* @__PURE__ */ jsx("h2", { children: "10. Payment and Refund Policy" }),
        /* @__PURE__ */ jsx("p", { children: "Listings may be posted for free or through paid promotional options. Paid listings are non-refundable except in cases of verified technical failure preventing ad display. We do not facilitate payments between users." }),
        /* @__PURE__ */ jsx("p", { children: "We may modify pricing or features at any time." }),
        /* @__PURE__ */ jsx("h2", { children: "11. Account Suspension or Termination" }),
        /* @__PURE__ */ jsx("p", { children: "We reserve the right to suspend or permanently terminate accounts that:" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: "Violate our Terms and Conditions" }),
          /* @__PURE__ */ jsx("li", { children: "Post unlawful, deceptive, or harmful content" }),
          /* @__PURE__ */ jsx("li", { children: "Engage in fraudulent or unsafe behavior" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "All decisions regarding account actions are final and non-negotiable." }),
        /* @__PURE__ */ jsx("h2", { children: "12. Legal Compliance" }),
        /* @__PURE__ */ jsx("p", { children: "Users must comply with the Information Technology Act (2000), relevant IPC sections, and all applicable state, national, and international laws. Illegal activities or serious violations may be reported to authorities when required." }),
        /* @__PURE__ */ jsx("h2", { children: "13. Limitation of Liability" }),
        /* @__PURE__ */ jsx("p", { children: "To the fullest extent permitted by law, we are not responsible for any direct or indirect losses resulting from:" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: "Use or inability to use the platform" }),
          /* @__PURE__ */ jsx("li", { children: "Errors, delays, or interruptions" }),
          /* @__PURE__ */ jsx("li", { children: "User interactions or disputes" }),
          /* @__PURE__ */ jsx("li", { children: "Data inaccuracies or omissions" })
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "14. Indemnification" }),
        /* @__PURE__ */ jsx("p", { children: "By using this platform, you agree to indemnify and protect the website, its staff, and partners from any claims, damages, liabilities, or expenses arising from:" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: "Your use of the site" }),
          /* @__PURE__ */ jsx("li", { children: "Your posted content" }),
          /* @__PURE__ */ jsx("li", { children: "Violations of these Terms" }),
          /* @__PURE__ */ jsx("li", { children: "Interactions with other users" })
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "15. Modifications to Terms" }),
        /* @__PURE__ */ jsx("p", { children: "We may revise these Terms at any time. Updates take effect immediately once posted. Continued use of the platform constitutes acceptance of the updated Terms. Users should review these Terms regularly." }),
        /* @__PURE__ */ jsx("h2", { children: "16. Privacy Policy" }),
        /* @__PURE__ */ jsx("p", { children: "Your privacy is important to us. Our Privacy Policy explains how we collect, store, use, and protect your personal information. By using the platform, you agree to the practices described in our Privacy Policy." }),
        /* @__PURE__ */ jsx("h2", { children: "17. Contact Information" }),
        /* @__PURE__ */ jsx("p", { children: "For questions or legal notices, contact us at:" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Email",
          /* @__PURE__ */ jsx("a", { href: "mailto:info@girlswithwine.com", className: "text-blue-600", children: "info@girlswithwine.com" }),
          ".",
          /* @__PURE__ */ jsx("br", {}),
          "Phone: +919000000000"
        ] }),
        /* @__PURE__ */ jsx("p", { children: "© 2025 Girls With Wine. All Rights Reserved" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const PrivacyPolicy = ({ lastUpdated = "December 2025" }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-10 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
        "Last Updated: ",
        lastUpdated
      ] }) }),
      /* @__PURE__ */ jsxs(
        "section",
        {
          className: "\r\n              prose prose-sm lg:prose-lg text-gray-700 leading-relaxed\r\n              [&_p]:text-gray-700 [&_p]:text-base [&_p]:mb-4\r\n              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#A3195B] [&_h2]:mt-8 [&_h2]:mb-3\r\n              [&_ul]:list-disc [&_ul]:pl-6\r\n            ",
          children: [
            /* @__PURE__ */ jsx("p", { children: "We are dedicated to protecting the personal information of all users and advertisers who interact with our platform. In order to comply with applicable Data Protection Laws, every piece of data you share with us is managed with strict confidentiality and used only for legitimate operational purposes. While we take full responsibility for safeguarding the information you provide privately, any details an Offeror User chooses to make public on their profile remain under their own control, and the platform cannot be held liable if such openly shared information is accessed or misused by unintended parties. This Privacy Policy may be modified occasionally to align with new legal requirements or regulatory directives, and any important updates will be communicated through revised links or on-site notices." }),
            /* @__PURE__ */ jsx("p", { children: "The information we collect may include personal details such as your name, phone number, email address, and identification documents, as well as payment-related data such as your transaction history and purchase records. You may also voluntarily provide additional details like your age, gender, profile images, or other information you choose to share. In some cases, preference-based categories may be collected if you submit them willingly. Technical information may also be gathered automatically, including your IP address, device type, browser information, and cookie data. Along with this, non-identifiable aggregated data may be gathered to help us understand user behavior and improve the performance of our services." }),
            /* @__PURE__ */ jsx("p", { children: "Your personal information is used for several lawful purposes, including enabling account creation, allowing the smooth use of the website, communicating with other users, publishing advertisements, and completing verification requirements. It also helps us process payments, send promotional messages when you have agreed to receive them, enhance our services through analytics, protect the platform from fraud or misuse, and comply with legal obligations or court orders. We obtain this information when you browse the site, create an account, post or respond to an advertisement, contact customer support, or undergo age-verification checks. If you provide information on behalf of someone else, you must ensure they have reviewed this Privacy Policy, agree to its terms, and that you inform us promptly of any changes to their data." }),
            /* @__PURE__ */ jsx("p", { children: "To protect your information, we rely on multiple security measures such as encrypted systems, secure servers, and restricted access controls, ensuring that your data is shielded from unauthorized access. We retain your information only for the duration required for each purpose: account and browsing data may be stored for up to two years of inactivity; advertisement data for up to one year after expiration; verification records for up to one year after account deletion; and transaction records for at least ten years as required by law. Data used for marketing or analytics may be kept for up to two years unless you withdraw consent earlier, while information necessary for legal or compliance purposes may be retained as long as regulations demand." }),
            /* @__PURE__ */ jsx("p", { children: "Your information may be accessed only by authorized employees or trusted third-party service providers who support us with essential tasks such as age verification and technical support. You may request a complete list of these external partners at any time. As a user, you have the right to access the information we hold about you, request corrections, withdraw consent, object to certain types of data processing, or file a complaint with our Grievance Officer. All such requests can be made free of charge." }),
            /* @__PURE__ */ jsx("p", { className: "mt-8 text-gray-600 italic", children: "© 2025 Girls With Wine. All Rights Reserved." })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const ContactPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contacts);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
    captchaInput: ""
  });
  function generateCaptcha(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const handleRefreshCaptcha = () => setCaptcha(generateCaptcha());
  const copyEmail = () => {
    navigator.clipboard.writeText("info@girlswithwine.com");
    alert("Email copied!");
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) {
      alert("Please fill Name, Mobile, and Message.");
      return;
    }
    if (formData.captchaInput.trim() !== captcha.trim()) {
      alert("Invalid CAPTCHA!");
      handleRefreshCaptcha();
      return;
    }
    const payload = { ...formData, captcha };
    dispatch(createContactThunk(payload)).then((res) => {
      if (!res.error) {
        alert("Your message has been submitted!");
        setFormData({
          name: "",
          mobile: "",
          email: "",
          subject: "",
          message: "",
          captchaInput: ""
        });
        handleRefreshCaptcha();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-8 rounded-xl shadow-md", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-[#B30059] mb-5", children: "Telegram" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 mb-10", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 bg-[#00B9BE] text-white px-5 py-2 rounded-lg shadow hover:opacity-90 cursor-pointer", children: [
          /* @__PURE__ */ jsx(FiSend, {}),
          " Contact for Inquiry"
        ] }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[#B30059]", children: "Email" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2 mb-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: "info@girlswithwine.com" }),
          /* @__PURE__ */ jsx("button", { className: "text-[#B30059] cursor-pointer", onClick: copyEmail, children: /* @__PURE__ */ jsx(FiCopy, { size: 18 }) }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: "Click to copy" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[#B30059]", children: "Phone" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-800 mt-2", children: "0000000000" })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          className: "bg-gradient-to-r from-[#00B9BE] to-[#7CC7EC] p-8 rounded-xl shadow-lg",
          children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                label: "Name",
                name: "name",
                value: formData.name,
                onChange: handleChange,
                placeholder: "Enter your name"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                label: "Mobile No.",
                name: "mobile",
                value: formData.mobile,
                onChange: handleChange,
                placeholder: "Enter mobile number"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                label: "Email",
                name: "email",
                type: "email",
                value: formData.email,
                onChange: handleChange,
                placeholder: "Enter your email"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                label: "Subject",
                name: "subject",
                value: formData.subject,
                onChange: handleChange,
                placeholder: "Enter subject"
              }
            ),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                label: "Message",
                name: "message",
                value: formData.message,
                onChange: handleChange,
                placeholder: "Write your message"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-white font-semibold text-lg tracking-widest", children: captcha }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "captchaInput",
                  placeholder: "Enter CAPTCHA",
                  value: formData.captchaInput,
                  onChange: handleChange,
                  className: "w-full mt-2 px-4 py-2 rounded-lg focus:outline-none border",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "text-white mt-3 text-sm hover:underline cursor-pointer",
                  onClick: handleRefreshCaptcha,
                  children: "Refresh CAPTCHA"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-white text-[#B30059] w-full py-3 rounded-lg font-bold mt-4 shadow hover:bg-gray-100 cursor-pointer",
                disabled: loading,
                children: loading ? "Submitting..." : "Submit"
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Input = ({ label, className = "", ...props }) => /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
  /* @__PURE__ */ jsx("label", { className: "text-white font-semibold", children: label }),
  /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      className: `w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none ${className}`
    }
  )
] });
const Textarea = ({ label, className = "", ...props }) => /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
  /* @__PURE__ */ jsx("label", { className: "text-white font-semibold", children: label }),
  /* @__PURE__ */ jsx(
    "textarea",
    {
      ...props,
      className: `w-full mt-1 px-4 py-2 h-28 rounded-lg border focus:outline-none ${className}`
    }
  )
] });
const AddStateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message } = useSelector((state) => state.states);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createStateThunk({ name, status })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setName("");
        setStatus("Active");
        navigate("/admin/all-state");
      }
    });
  };
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearStateMessage());
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate("/admin/all-state"),
        className: "mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded",
        children: "← Back"
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Add New State" }),
    message && /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
        children: message.text
      }
    ),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "grid grid-cols-1 sm:grid-cols-3 gap-6 items-end",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block font-medium mb-1", children: "State Name *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Enter state name",
                className: "w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200",
                value: name,
                onChange: (e) => setName(e.target.value),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block font-medium mb-1", children: "Status" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200",
                value: status,
                onChange: (e) => setStatus(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
                  /* @__PURE__ */ jsx("option", { value: "Inactive", children: "Inactive" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-start sm:justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "w-full sm:w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50",
              children: loading ? "Saving..." : "Create State"
            }
          ) })
        ]
      }
    )
  ] }) });
};
const StateSkeleton = () => {
  return /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs("tr", { className: "animate-pulse", children: [
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-4 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "w-32 h-4 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-5 bg-gray-200 rounded-full" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-4 border text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-8 bg-gray-200 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "w-16 h-8 bg-gray-200 rounded" })
    ] }) })
  ] }, i)) });
};
const StateList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { states, loading, message } = useSelector((state) => state.states);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = states?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedStates = states?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(getStatesThunk());
  }, [dispatch]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearStateMessage()), 3e3);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      dispatch(deleteStateThunk(id));
    }
  };
  const handleToggle = (id) => {
    dispatch(toggleStateStatusThunk(id));
  };
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-lg rounded-2xl p-8 border border-gray-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mt-14", children: "All States" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/admin/add-state"),
          className: "bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer mt-14",
          children: "+ Add State"
        }
      )
    ] }),
    message && /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-4 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
        children: message.text
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left border", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-100 text-gray-700 font-semibold border", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border", children: "S.no" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border", children: "State Name" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 text-center border", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y", children: loading ? /* @__PURE__ */ jsx(StateSkeleton, {}) : paginatedStates?.length > 0 ? paginatedStates.map((st, index) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition", children: [
        /* @__PURE__ */ jsx("td", { className: "p-3 border-r border", children: (currentPage - 1) * pageSize + (index + 1) }),
        /* @__PURE__ */ jsx("td", { className: "p-3 border-r border capitalize", children: st.name }),
        /* @__PURE__ */ jsx("td", { className: "p-3 border-r border", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `px-3 py-1 rounded-full text-sm font-medium ${st.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
            children: st.status
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "p-3 text-center border", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleToggle(st._id),
              className: "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg transition",
              children: "Toggle"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(st._id),
              className: "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition",
              children: "Delete"
            }
          )
        ] }) })
      ] }, st._id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "p-5 text-center text-gray-500", colSpan: "4", children: "No states found." }) }) })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-2 mt-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage - 1),
          disabled: currentPage === 1,
          className: `px-4 py-2 rounded-lg border ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Prev"
        }
      ),
      Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(num),
          className: `px-4 py-2 rounded-lg border ${currentPage === num ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`,
          children: num
        },
        num
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage + 1),
          disabled: currentPage === totalPages,
          className: `px-4 py-2 rounded-lg border ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Next"
        }
      )
    ] })
  ] }) });
};
const ContactSkeleton = () => {
  return /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxs("tr", { className: "animate-pulse border-b", children: [
    /* @__PURE__ */ jsx("td", { className: "p-3 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-32 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-3 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-24 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-3 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-36 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-3 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-20 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-3 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-40 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-3 border", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-16 bg-gray-200 rounded" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-3 border", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-20 bg-gray-200 rounded-full" }) }),
    /* @__PURE__ */ jsx("td", { className: "p-3 border text-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-16 bg-gray-200 rounded mx-auto" }) })
  ] }, i)) });
};
const AllContactsList = () => {
  const dispatch = useDispatch();
  const { contacts, loading } = useSelector((state) => state.contacts);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = contacts?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedContacts = contacts?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(getAllContactsThunk());
  }, [dispatch]);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      dispatch(deleteContactThunk({ id }));
    }
  };
  const handleStatus = async (contact) => {
    setStatusLoadingId(contact._id);
    await dispatch(toggleContactStatusThunk({ id: contact._id }));
    setStatusLoadingId(null);
  };
  return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-xl rounded-xl p-6 w-full", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-800 mb-6", children: "Contact Enquiries" }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-gray-300 shadow", children: /* @__PURE__ */ jsxs("table", { className: "w-full border border-gray-300", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-100 text-gray-700 font-semibold text-left border-b border-gray-300", children: [
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Name" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Mobile" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Email" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Subject" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Message" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Captcha" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 border-r border-gray-300", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 text-center", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx(ContactSkeleton, {}) : paginatedContacts?.length > 0 ? paginatedContacts.map((c, index) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: "hover:bg-gray-50 transition border-b border-gray-300",
          children: [
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300 capitalize", children: c.name }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: c.mobile }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: c.email }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: c.subject?.length > 20 ? c.subject.slice(0, 20) + "..." : c.subject }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: c.message?.length > 30 ? c.message.slice(0, 30) + "..." : c.message }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300", children: c.captcha }),
            /* @__PURE__ */ jsx("td", { className: "p-3 border-r border-gray-300 text-center", children: statusLoadingId === c._id ? /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto" }) : /* @__PURE__ */ jsx(
              "span",
              {
                onClick: () => handleStatus(c),
                className: `px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition
                            ${c.status === "New" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : c.status === "Seen" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`,
                children: c.status
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(c._id),
                className: "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow-md transition cursor-pointer",
                children: "Delete"
              }
            ) })
          ]
        },
        c._id
      )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "py-6 text-center text-gray-500", children: "No contacts found" }) }) })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-2 mt-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage - 1),
          disabled: currentPage === 1,
          className: `px-4 py-2 rounded-lg border 
                ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Prev"
        }
      ),
      Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(num),
          className: `px-4 py-2 rounded-lg border ${currentPage === num ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`,
          children: num
        },
        num
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => changePage(currentPage + 1),
          disabled: currentPage === totalPages,
          className: `px-4 py-2 rounded-lg border 
                ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`,
          children: "Next"
        }
      )
    ] })
  ] }) });
};
const CityGirlsPage = lazy(() => import("./assets/CityGirlsPage-BaU0PsR4.js"));
const GirlDetailsPage = lazy(() => import("./assets/GirlDetailsPage-Cvkec-Ns.js"));
function App() {
  const location = useLocation();
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "text-center mt-20 text-xl", children: "Loading..." }), children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(ContactPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/city/:cityName", element: /* @__PURE__ */ jsx(CityGirlsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/girl/:girlName", element: /* @__PURE__ */ jsx(GirlDetailsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(AboutUs, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(TermsAndConditions, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(PrivacyPolicy, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/all-state",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(StateList, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/add-state",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(AddStateForm, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/all-cities",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(AllCities, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/edit-city/:cityId",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(EditCity, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/create-city",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(AddCity, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/model-girl",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(AllGirlsList, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/add-girl",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(AddGirlForm, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/edit-girl/:id",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(EditGirlForm, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/admin/all-contacts",
          element: /* @__PURE__ */ jsx(AdminProtectedRoute, { children: /* @__PURE__ */ jsx(AllContactsList, {}) })
        }
      )
    ] }, location.pathname) })
  ] });
}
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: "top-right",
        autoClose: 2500,
        pauseOnHover: true,
        theme: "colored"
      }
    ),
    /* @__PURE__ */ jsx(App, {})
  ] }) }) })
);
export {
  CitySection as C,
  Footer as F,
  Navbar as N,
  getCityByIdThunk as a,
  getGirlsByCityThunk as b,
  getGirlByIdThunk as c,
  getCitiesThunk as g
};
