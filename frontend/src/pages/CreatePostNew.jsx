import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Category Selection", icon: "◆" },
  { label: "Issue Details & Upload", icon: "≡" },
  { label: "Department Suggestion", icon: "⊙" },
];

const CATEGORIES = [
  {
    id: "Infrastructure & Roads",
    label: "Infrastructure & Roads",
    img: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&q=80",
  },
  {
    id: "Water & Sanitation",
    label: "Water & Sanitation",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  },
  {
    id: "Education",
    label: "Education",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80",
  },
  {
    id: "Public Transport",
    label: "Public Transport",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&q=80",
  },
  {
    id: "Environment & Waste",
    label: "Environement & Waste",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&q=80",
  },
  {
    id: "Health Care",
    label: "Health care",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80",
  },
  {
    id: "Public Safety",
    label: "Public Safety",
    img: "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=200&q=80",
  },
  {
    id: "Electricity & Power",
    label: "Electricity & Power",
    img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
  },
];

const PROVINCES = [
  "Western", "Central", "Southern", "Northern", "Eastern",
  "North Western", "North Central", "Uva", "Sabaragamuwa",
];

const DISTRICTS_BY_PROVINCE = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Kegalle", "Ratnapura"],
};

// Department suggestions per category
const DEPT_MAP = {
  "Infrastructure & Roads": [
    { id: "rda", name: "Road Development Authority", desc: "Manages national road construction and maintenance", avgResponse: "Avg. Response: 3-5 days", match: 92, recommended: true },
    { id: "mc", name: "Municipal Council", desc: "Handles local road and infrastructure repairs", avgResponse: "Avg. Response: 5-7 days", match: 80, recommended: false },
  ],
  "Public Transport": [
    { id: "sltb", name: "Sri Lanka Transport Board", desc: "Manages public bus services nation wide", avgResponse: "Avg. Response: 2-4 days", match: 89, recommended: true },
    { id: "railways", name: "Department of Railways", desc: "Operates and maintains railway services", avgResponse: "Avg. Response: 3-5 days", match: 85, recommended: false },
  ],
  "Water & Sanitation": [
    { id: "nwsdb", name: "National Water Supply & Drainage Board", desc: "Handles water supply and drainage infrastructure", avgResponse: "Avg. Response: 2-3 days", match: 94, recommended: true },
    { id: "mc_water", name: "Municipal Council - Water Division", desc: "Local water and sanitation services", avgResponse: "Avg. Response: 4-6 days", match: 78, recommended: false },
  ],
  "Electricity & Power": [
    { id: "ceb", name: "Ceylon Electricity Board", desc: "Manages electricity generation and distribution", avgResponse: "Avg. Response: 1-2 days", match: 96, recommended: true },
    { id: "leco", name: "Lanka Electricity Company", desc: "Local electricity distribution services", avgResponse: "Avg. Response: 2-3 days", match: 82, recommended: false },
  ],
  "Health Care": [
    { id: "moh", name: "Ministry of Health", desc: "National health policy and hospital management", avgResponse: "Avg. Response: 5-7 days", match: 90, recommended: true },
    { id: "rdhs", name: "Regional Director of Health Services", desc: "Regional health services and facilities", avgResponse: "Avg. Response: 3-5 days", match: 83, recommended: false },
  ],
  "Education": [
    { id: "moe", name: "Ministry of Education", desc: "National education policy and school management", avgResponse: "Avg. Response: 7-10 days", match: 91, recommended: true },
    { id: "zonal", name: "Zonal Education Office", desc: "Local school and education administration", avgResponse: "Avg. Response: 3-5 days", match: 86, recommended: false },
  ],
  "Environment & Waste": [
    { id: "cea", name: "Central Environmental Authority", desc: "Handles environmental protection and waste management", avgResponse: "Avg. Response: 3-5 days", match: 93, recommended: true },
    { id: "mc_env", name: "Municipal Council - Environment Division", desc: "Local waste collection and disposal", avgResponse: "Avg. Response: 2-4 days", match: 81, recommended: false },
  ],
  "Public Safety": [
    { id: "police", name: "Sri Lanka Police", desc: "Law enforcement and public safety", avgResponse: "Avg. Response: 1-2 days", match: 95, recommended: true },
    { id: "fire", name: "Sri Lanka Fire & Rescue", desc: "Fire safety and emergency response", avgResponse: "Avg. Response: Immediate", match: 84, recommended: false },
  ],
};

// ─── Shared Layout Wrapper ─────────────────────────────────────────────────────

const StepLayout = ({ currentStep, children }) => (
  <div className="h-full overflow-y-auto flex flex-col">
    <div
      className="flex-1 flex"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Mini sidebar */}
      <div className="w-48 flex-shrink-0 bg-white bg-opacity-92 flex flex-col py-5 gap-0.5 shadow-sm">
        <div className="mx-3 mb-5 flex items-center gap-2 bg-green-700 text-white text-xs font-bold px-3 py-2.5 rounded-lg">
          <span className="w-4 h-4 rounded-full bg-white text-green-700 flex items-center justify-center text-xs font-black leading-none">
            !
          </span>
          Report New Issue
        </div>
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs ${
              i === currentStep
                ? "text-green-700 font-semibold"
                : i < currentStep
                ? "text-green-500 font-medium"
                : "text-gray-400 font-medium"
            }`}
          >
            <span className="text-sm leading-none">{step.icon}</span>
            {step.label}
          </div>
        ))}
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>

    {/* Footer */}
    <footer className="bg-slate-900 text-white pt-8 pb-5 flex-shrink-0">
      <div className="max-w-5xl mx-auto px-8 grid grid-cols-3 gap-8 mb-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-300">
            Important Links
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">How it Works</li>
            <li className="hover:text-white cursor-pointer transition-colors">Frequently Asked Questions</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact Us.</li>
          </ul>
        </div>
        <div className="text-center">
          <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-yellow-400">
            Contact Information
          </h4>
          <p className="text-xs text-gray-400">Colombo, Sri Lanka</p>
          <p className="text-xs text-gray-400 mt-1">071-112233445</p>
          <p className="text-xs text-gray-400 mt-1">info@ncirs.gov.lk</p>
        </div>
        <div className="text-right">
          <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-300">
            Follow Us
          </h4>
          <div className="flex justify-end gap-2 mt-1">
            {["f", "𝕏", "▶", "📷"].map((icon, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded bg-gray-700 flex items-center justify-center text-xs cursor-pointer hover:bg-gray-600 transition-colors"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center border-t border-gray-700 pt-5">
        <div className="text-4xl mb-2">🏛️</div>
        <p className="text-xs text-gray-400">@2026 NATIONAL CITIZEN ISSUE RESOULTION SYSTEM</p>
        <p className="text-xs text-gray-500 mt-1">An initiate of the Government of Sri Lanka</p>
        <div className="flex justify-center gap-8 mt-3 text-xs text-gray-500">
          <span className="hover:text-white cursor-pointer">@Sinhala</span>
          <span className="hover:text-white cursor-pointer">@Tamil</span>
          <span className="hover:text-white cursor-pointer">@English</span>
        </div>
      </div>
    </footer>
  </div>
);

// ─── Step 1: Category Selection ───────────────────────────────────────────────

const CategoryStep = ({ onContinue }) => {
  const [selected, setSelected] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const handleContinue = () => {
    if (!selected) return toast.error("Please select a category.");
    onContinue({ category: selected, subCategory });
  };

  return (
    <StepLayout currentStep={0}>
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Select Issue Category
          </h2>
          <p className="text-gray-500 text-sm mb-7">
            Choose the category that best describes your issue
          </p>

          {/* 2-column category grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`flex items-center justify-between rounded-xl overflow-hidden border-2 transition-all text-left h-24 ${
                  selected === cat.id
                    ? "border-green-600 shadow-md ring-1 ring-green-200"
                    : "border-transparent hover:border-green-300"
                }`}
                style={{
                  background: "linear-gradient(135deg, #e0d8c8 55%, #cec4ae)",
                }}
              >
                <span className="px-5 font-semibold text-gray-800 text-sm leading-tight flex-1">
                  {cat.label}
                </span>
                <div className="h-full w-32 flex-shrink-0">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "0 10px 10px 0" }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Sub-category */}
          <div className="mb-7">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Type Sub-Category
            </label>
            <input
              type="text"
              maxLength={30}
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="e.g. Pothole, Water leak..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              {subCategory.length}/30 Characters
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className={`px-10 py-2.5 rounded-lg text-sm font-bold text-white transition-all ${
                selected
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};

// ─── Step 2: Issue Details & Upload ──────────────────────────────────────────

const DetailsStep = ({ onBack, onContinue }) => {
  const fileRef = useRef();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [images, setImages] = useState([]);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(
    (files) => {
      const valid = Array.from(files)
        .filter(
          (f) =>
            ["image/png", "image/jpeg", "image/jpg"].includes(f.type) &&
            f.size <= 5 * 1024 * 1024
        )
        .slice(0, 5 - images.length);
      const previews = valid.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
      setImages((prev) => [...prev, ...previews].slice(0, 5));
    },
    [images]
  );

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleContinue = () => {
    if (!title.trim()) return toast.error("Issue title is required.");
    if (!desc.trim()) return toast.error("Description is required.");
    if (!priority) return toast.error("Please select a priority level.");
    if (!address.trim()) return toast.error("Address / Landmark is required.");
    if (!province) return toast.error("Please select a province.");
    if (!district) return toast.error("Please select a district.");
    onContinue({
      title,
      desc,
      priority,
      location: `${address}, ${district}, ${province}`,
      imageFiles: images.map((i) => i.file),
    });
  };

  const priorities = [
    { val: "low", label: "Low", sub: "can wait" },
    { val: "medium", label: "Medium", sub: "Needs attention" },
    { val: "high", label: "High", sub: "" },
  ];

  return (
    <StepLayout currentStep={1}>
      <div className="px-6 py-8 space-y-4">
        {/* Issue Info card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title of your issue"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Discription <span className="text-red-500">*</span>
            </label>
            <textarea
              maxLength={500}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">{desc.length}/500 Characters</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              Priority Level <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {priorities.map((p) => (
                <button
                  key={p.val}
                  onClick={() => setPriority(p.val)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    priority === p.val
                      ? "border-gray-400 bg-gray-100 text-gray-800 shadow-inner"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                      priority === p.val
                        ? "border-gray-700 bg-gray-700"
                        : "border-gray-400"
                    }`}
                  />
                  <span className="font-semibold">{p.label}</span>
                  {p.sub && (
                    <span className="text-xs text-gray-400">({p.sub})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
            📍 Location Information
          </h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Adress/Nearest Landmark <span className="text-red-500">*</span>
              </label>
              {priority === "high" && (
                <span className="text-xs text-gray-400">(Urgent)</span>
              )}
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Keells Super, Nugegoda"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Province <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={province}
                  onChange={(e) => { setProvince(e.target.value); setDistrict(""); }}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!province}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Select District</option>
                  {(DISTRICTS_BY_PROVINCE[province] || []).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
            🖼️ Upload Image
            <span className="text-gray-400 font-normal text-sm">(optional — max 5, 5MB each)</span>
          </h3>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
            onClick={() => images.length < 5 && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl py-12 text-center cursor-pointer transition-colors ${
              dragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 bg-white"
            } ${images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0-3 3m3-3 3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 3.36 5.89A4.5 4.5 0 0 1 18 19.5H6.75Z" />
              </svg>
              <p className="text-sm text-gray-500">
                {images.length >= 5 ? "Maximum 5 images reached" : "Click to upload images (max 5)"}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              className="hidden"
              onChange={(e) => processFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-7 py-2.5 rounded-lg text-sm transition-colors"
          >
            ‹ Back
          </button>
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-7 py-2.5 rounded-lg text-sm transition-colors"
          >
            Continue ›
          </button>
        </div>
      </div>
    </StepLayout>
  );
};

// ─── Step 3: AI Department Suggestion ────────────────────────────────────────

const DeptStep = ({ formData, onBack }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [selectedDept, setSelectedDept] = useState(() => {
    const depts = DEPT_MAP[formData.category] || DEPT_MAP["Public Transport"];
    return depts.find((d) => d.recommended)?.id || depts[0]?.id;
  });
  const [submitting, setSubmitting] = useState(false);

  const departments = DEPT_MAP[formData.category] || DEPT_MAP["Public Transport"];
  const chosenDept = departments.find((d) => d.id === selectedDept);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("desc", formData.desc);
      fd.append("priority", formData.priority);
      fd.append("location", formData.location);
      fd.append("category", formData.category);
      fd.append("subCategory", formData.subCategory || "");
      fd.append("aiSuggestedDepartment", chosenDept?.name || "");
      // post_type kept for backward compat with existing postRoutes
      fd.append(
        "post_type",
        formData.imageFiles?.length > 0 ? "text_with_image" : "text"
      );
      if (formData.imageFiles?.length) {
        formData.imageFiles.forEach((f) => fd.append("images", f));
      }

      const { data } = await api.post("/api/post/add", fd, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Issue submitted successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const locationParts = formData.location?.split(", ") || [];
  const district = locationParts[1] || "";
  const province = locationParts[2] || "";

  return (
    <StepLayout currentStep={2}>
      <div className="px-6 py-8 space-y-4">
        {/* AI header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Ai Department Recommendation
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Based on your issue details, our system has analyzed and suggested
              the most suitable departments to handle your case
            </p>
          </div>
        </div>

        {/* Issue summary + badge */}
        <div className="flex gap-4">
          <div
            className="flex-1 rounded-2xl shadow-md p-6 relative overflow-hidden"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-78 rounded-2xl" />
            <div className="relative z-10">
              <h3 className="font-bold text-gray-800 mb-3">Issue Summary</h3>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Category :</span>{" "}
                  {formData.category}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Priority :</span>{" "}
                  {formData.priority}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Location :</span>{" "}
                  {district && province ? `${district}, ${province}` : formData.location}
                </p>
              </div>
            </div>
          </div>

          <div className="w-44 flex-shrink-0 flex flex-col items-center justify-center bg-white bg-opacity-85 rounded-2xl shadow-md p-4 text-center gap-2">
            <p className="text-sm font-bold text-gray-700">{formData.category}</p>
            <span
              className={`px-4 py-0.5 rounded-full text-xs font-bold text-white ${
                formData.priority === "high"
                  ? "bg-red-500"
                  : formData.priority === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {formData.priority
                ? formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)
                : "Low"}
            </span>
            {district && province && (
              <p className="text-xs text-gray-500 mt-1">{`${district}, ${province}`}</p>
            )}
          </div>
        </div>

        {/* Department list */}
        <div>
          <h3 className="font-bold text-gray-800 text-base mb-3">Suggested Departments</h3>
          <div className="space-y-3">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`w-full text-left rounded-xl p-5 flex items-center justify-between transition-all border-2 ${
                  selectedDept === dept.id
                    ? dept.recommended
                      ? "border-transparent bg-red-400 bg-opacity-80 text-white shadow-lg"
                      : "border-transparent bg-gray-400 bg-opacity-60 text-white shadow-lg"
                    : "border-transparent bg-white bg-opacity-75 hover:bg-opacity-95"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {selectedDept === dept.id && dept.recommended ? (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      </div>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedDept === dept.id
                            ? "border-white bg-white bg-opacity-30"
                            : "border-gray-400"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${selectedDept === dept.id ? "text-white" : "text-gray-800"}`}>
                      {dept.name}
                    </p>
                    {dept.recommended && (
                      <span className="inline-block mt-1 mb-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded font-semibold">
                        ✦ Ai Recommended
                      </span>
                    )}
                    <p className={`text-xs mt-0.5 ${selectedDept === dept.id ? "text-white text-opacity-80" : "text-gray-500"}`}>
                      {dept.desc}
                    </p>
                    <p className={`text-xs mt-1 flex items-center gap-1 ${selectedDept === dept.id ? "text-white text-opacity-70" : "text-gray-400"}`}>
                      🕐 {dept.avgResponse}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className={`text-sm font-bold ${selectedDept === dept.id ? "text-white" : "text-gray-700"}`}>
                    {dept.match}% Match
                  </p>
                  <p className={`text-xs ${selectedDept === dept.id ? "text-white text-opacity-70" : "text-gray-400"}`}>
                    Confidence
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Important info box */}
        <div className="bg-purple-100 bg-opacity-85 rounded-xl p-4 flex items-start gap-3">
          <span className="text-yellow-600 text-lg flex-shrink-0 mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Important Information</p>
            <ul className="text-xs text-gray-600 space-y-0.5 list-disc list-inside">
              <li>Your issue will be reviewed by the selected department</li>
              <li>You will receive notifications about the progress</li>
              <li>You can track the status in your dashboard</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-7 py-2.5 rounded-lg text-sm transition-colors"
          >
            ‹ Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex items-center gap-2 font-bold px-7 py-2.5 rounded-lg text-sm transition-colors text-white ${
              submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Issue"}
          </button>
        </div>
      </div>
    </StepLayout>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CreatePostNew = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleStep1 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(1);
  };

  const handleStep2 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  if (step === 0) return <CategoryStep onContinue={handleStep1} />;
  if (step === 1)
    return (
      <DetailsStep
        onBack={() => setStep(0)}
        onContinue={handleStep2}
      />
    );
  return (
    <DeptStep
      formData={formData}
      onBack={() => setStep(1)}
    />
  );
};

export default CreatePostNew;
