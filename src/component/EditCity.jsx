import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "./layout/AdminLayout";
import { getCitiesThunk, updateCityThunk } from "../store/slices/citySlice";
import { getStatesThunk } from "../store/slices/stateSlice";
import RichTextEditor from "./RichTextEditor";

// -------------------------------------------------------
// SKELETON COMPONENT
// -------------------------------------------------------
const SkeletonBox = ({ height = "h-10" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${height}`}></div>
);

const EditCity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cityId } = useParams();

  // REMOVE Redux loading → use your own
  const [loading, setLoading] = useState(false);

  const { cities } = useSelector((s) => s.city);
  const { states } = useSelector((s) => s.states);

  const [form, setForm] = useState({
    mainCity: "",
    state: "",
    whatsappNumber: "",
    phoneNumber: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [localAreas, setLocalAreas] = useState([
    { name: "", description: "" },
  ]);

  const [initialLoaded, setInitialLoaded] = useState(false);

  // Load states & cities
  useEffect(() => {
    dispatch(getStatesThunk());
    dispatch(getCitiesThunk());
  }, []);

  // Load city details
  useEffect(() => {
    if (cities.length > 0) {
      const city = cities.find((c) => c._id === cityId);
      if (!city) return;

      setForm({
        mainCity: city.mainCity || "",
        state: city.state?._id || "",
        whatsappNumber: city.whatsappNumber || "",
        phoneNumber: city.phoneNumber || "",
        description: city.description || "",
      });

      setPreviewImage(city.imageUrl || null);

      if (city.localAreas?.length > 0) {
        setLocalAreas(
          city.localAreas.map((a) => ({
            name: a.name || "",
            description: a.description || "",
          }))
        );
      }

      setInitialLoaded(true);
    }
  }, [cities, cityId]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Submit Handler with LOCAL LOADING
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.state) return toast.error("Please select a State!");

    // before API call → loading true
    setLoading(true);

    const fd = new FormData();
    fd.append("mainCity", form.mainCity.trim());
    fd.append("state", form.state);
    fd.append("whatsappNumber", form.whatsappNumber);
    fd.append("phoneNumber", form.phoneNumber);
    fd.append("description", form.description);
    if (image) fd.append("image", image);

    fd.append("localAreas", JSON.stringify(localAreas));

    const res = await dispatch(updateCityThunk({ cityId, formData: fd }));

    // after API call → loading false
    setLoading(false);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("City updated!");
      navigate("/admin/all-cities");
    } else {
      toast.error("Failed to update city");
    }
  };

  // Local Area Handlers
  const updateLocalArea = (i, key, value) => {
    const arr = [...localAreas];
    arr[i][key] = value;
    setLocalAreas(arr);
  };

  const addLocalArea = () =>
    setLocalAreas([...localAreas, { name: "", description: "" }]);

  const removeLocalArea = (i) =>
    setLocalAreas(localAreas.filter((_, index) => index !== i));

  return (
    <AdminLayout>
      <div className="bg-white p-8 rounded-2xl shadow-xl border max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Edit City</h2>
          <button
            onClick={() => navigate("/admin/all-cities")}
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* SKELETON WHEN DATA IS NOT LOADED */}
        {!initialLoaded ? (
          <div className="space-y-6">
            <SkeletonBox height="h-12" />
            <SkeletonBox height="h-12" />
            <SkeletonBox height="h-12" />
            <SkeletonBox height="h-40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* BASIC FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <Input
                label="Main City Title Name"
                name="mainCity"
                value={form.mainCity}
                onChange={handleInput}
                placeholder="Enter main city"
              />

              {/* STATE SELECT */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Select State *
                </label>

                <select
                  name="state"
                  value={form.state}
                  onChange={handleInput}
                  className="border border-gray-300 px-4 py-3 rounded-lg bg-white cursor-pointer"
                >
                  <option value="">-- Select State --</option>
                  {states?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name?.charAt(0).toUpperCase() + s.name?.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="WhatsApp Number"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleInput}
              />

              <Input
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleInput}
              />

              {/* IMAGE UPLOAD */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-semibold text-gray-700">City Image</label>

                <input
                  type="file"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 cursor-pointer"
                />

                {previewImage && (
                  <img
                    src={previewImage}
                    className="w-48 h-32 object-cover rounded shadow mt-3"
                  />
                )}
              </div>
            </div>

            {/* LOCAL AREAS */}
            <div>
              <label className="font-semibold text-gray-700 text-lg">
                Local Areas
              </label>

              <div className="mt-4 space-y-4">
                {localAreas.map((area, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border"
                  >
                    <Input
                      label="Local Area Name"
                      value={area.name}
                      onChange={(e) =>
                        updateLocalArea(i, "name", e.target.value)
                      }
                    />

                    <Input
                      label="Local Area Description"
                      value={area.description}
                      onChange={(e) =>
                        updateLocalArea(i, "description", e.target.value)
                      }
                    />

                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => removeLocalArea(i)}
                        className="text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLocalArea}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                  + Add Local Area
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="font-semibold text-gray-700 text-lg">
                Description
              </label>

              <div className="border rounded-xl shadow-sm p-2 mt-2 bg-white">
                <RichTextEditor
                  value={form.description}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, description: val }))
                  }
                />
              </div>
            </div>

            {/* UPDATE BUTTON WITH SPINNER (LOCAL LOADING) */}
            <div className="flex mb-10">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-lg shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Updating...
                  </>
                ) : (
                  "Update City"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditCity;

// -----------------------------------------
// INPUT COMPONENT
// -----------------------------------------
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="font-semibold text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
    />
  </div>
);
