import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";
import API from "../api/axios";
import { toast } from "sonner";
import getImageUrl from "../utils/getImageUrl";

export default function AdminViewClient() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [previewIndex, setPreviewIndex] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile/client/${clientId}`);
        setProfile(res.data);
      } catch {
        toast.error("Unable to load profile");
        navigate("/admin/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [clientId, navigate]);

  const handleApprove = async () => {
    try {
      await API.patch(`/profile/approve/${profile._id}`);
      toast.success("Profile Approved");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Reject this profile?")) return;
    try {
      await API.patch(`/profile/reject/${profile._id}`);
      toast.success("Profile Rejected");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Rejection failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠ Permanently delete this profile?")) return;
    try {
      await API.delete(`/profile/delete/${profile._id}`);
      toast.success("Profile Deleted");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Deletion failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />   
         {" "}
      </div>
    );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">
            {/* BACK BUTTON */}     {" "}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-6"
      >
                <ArrowLeft /> Back      {" "}
      </button>
           {" "}
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl overflow-hidden">
                {/* IMAGE GRID */}       {" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 bg-black p-2 min-h-[200px]">
                   {" "}
          {profile.profileImages?.length > 0 ? (
            profile.profileImages.map((img, i) => (
              <div key={i} className="relative h-64 sm:h-56 md:h-52 w-full">
                             {" "}
                <img
                  src={getImageUrl(img)}
                  alt={`Image ${i + 1}`}
                  className="h-full w-full object-cover rounded bg-gray-800 cursor-pointer hover:opacity-90 transition"
                  onClick={() => setPreviewIndex(i)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Load+Error";
                  }}
                />
                             {" "}
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-48 text-gray-400">
                            <p>No Images Uploaded</p>           {" "}
            </div>
          )}
                 {" "}
        </div>
                {/* HEADER */}       {" "}
        <div className="p-4 sm:p-6">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>     
             {" "}
          <p className="text-gray-500 text-sm">
                        Client ID:            {" "}
            <span className="font-semibold">{profile.user?.clientId}</span>     
               {" "}
          </p>
                 {" "}
        </div>
                {/* TABS */}       {" "}
        <div className="px-4 sm:px-6 flex gap-3 overflow-x-auto border-b pb-2">
                   {" "}
          {["personal", "lifestyle", "partner"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t font-medium ${
                activeTab === tab
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
                           {" "}
              {tab === "personal"
                ? "Personal Profile"
                : tab === "lifestyle"
                ? "Lifestyle & Background"
                : "Partner Preferences"}
                         {" "}
            </button>
          ))}
                 {" "}
        </div>
                {/* TAB CONTENT */}       {" "}
        <div className="p-4 sm:p-6 space-y-6">
                   {" "}
          {activeTab === "personal" && (
            <TabSection title="">
                            <Field label="Phone" value={profile.user?.phone} />
                            <Field label="Email" value={profile.user?.email} />
                            <Field label="Address" value={profile.address} />
                            <Field label="Gender" value={profile.gender} />
                            <Field label="Birthday" value={profile.birthday} />
                            <Field label="Age" value={profile.age} />
                            <Field label="Height" value={profile.height} />
                            <Field label="Weight" value={profile.weight} />     
                      {/* ✅ FATHER & MOTHER ADDED HERE */}
                           {" "}
              <Field label="Father's Name" value={profile.father} />
                           {" "}
              <Field label="Mother's Name" value={profile.mother} />
              {/* 🚀 NEW FIELD: Father's Occupation */}
              <Field
                label="Father's Occupation"
                value={profile.fatherOccupation}
              />
              {/* 🚀 NEW FIELD: Mother's Occupation */}
              <Field
                label="Mother's Occupation"
                value={profile.motherOccupation}
              />
              {/* 🚀 NEW FIELD: Siblings */}
              <Field label="Siblings" value={profile.siblings} />
                           {" "}
              <Field label="Mother Tongue" value={profile.motherTongue} />
                            <Field label="Career" value={profile.career} />
                            <Field label="Religion" value={profile.religion} />
                            <Field label="Bio" value={profile.bio} full />     
                   {" "}
            </TabSection>
          )}
                   {" "}
          {activeTab === "lifestyle" && (
            <TabSection title="">
                           {" "}
              <Field
                label="Relationship Status"
                value={profile.relationshipStatus}
              />
                            <Field label="Country" value={profile.country} />
                            <Field label="City" value={profile.city} />
                           {" "}
              <Field label="Education" value={profile.education} />
                           {" "}
              <Field
                label="Professional Status"
                value={profile.professionalStatus}
              />
                           {" "}
              <Field label="Other Profession" value={profile.otherProfession} />
                            <Field label="Children" value={profile.children} />
                            <Field label="Smoking" value={profile.smoking} />
                            <Field label="Alcohol" value={profile.alcohol} />   
                     {" "}
            </TabSection>
          )}
                   {" "}
          {activeTab === "partner" && (
            <TabSection title="">
                           {" "}
              <Field
                label="Interested In"
                value={profile.partnerPreferences?.interestedIn}
              />
                           {" "}
              <Field
                label="Height Range"
                value={profile.partnerPreferences?.heightRange}
              />
                           {" "}
              <Field
                label="Weight Range"
                value={profile.partnerPreferences?.weightRange}
              />
                           {" "}
              <Field
                label="Relationship Status"
                value={profile.partnerPreferences?.relationshipStatus}
              />
                           {" "}
              <Field
                label="Alcohol"
                value={profile.partnerPreferences?.alcohol}
              />
                           {" "}
              <Field
                label="Smoking"
                value={profile.partnerPreferences?.smoking}
              />
                           {" "}
              <Field
                label="Children"
                value={profile.partnerPreferences?.children}
              />
                           {" "}
              <Field
                label="Country"
                value={profile.partnerPreferences?.country}
              />
                           {" "}
              <Field
                label="Religion"
                value={profile.partnerPreferences?.religion}
              />
                           {" "}
              <Field
                label="Language"
                value={profile.partnerPreferences?.language}
              />
                           {" "}
              <Field
                label="Education"
                value={profile.partnerPreferences?.education}
              />
                           {" "}
              <Field
                label="Age Min"
                value={profile.partnerPreferences?.ageMin}
              />
                           {" "}
              <Field
                label="Age Max"
                value={profile.partnerPreferences?.ageMax}
              />
                           {" "}
              <Field
                label="Location Preference"
                value={profile.partnerPreferences?.locationPreference}
              />
                         {" "}
            </TabSection>
          )}
                    {/* ACTIONS */}         {" "}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                       {" "}
            <button
              onClick={handleApprove}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
                            <CheckCircle size={18} /> Approve            {" "}
            </button>
                       {" "}
            <button
              onClick={handleReject}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
            >
                            <XCircle size={18} /> Reject            {" "}
            </button>
                       {" "}
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
            >
                            <Trash2 size={18} /> Delete            {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
      {/* IMAGE PREVIEW MODAL */}
{previewIndex !== null && (
  <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
    {/* Close */}
    <button
      onClick={() => setPreviewIndex(null)}
      className="absolute top-6 right-6 text-white text-3xl hover:scale-110 transition"
    >
      ✕
    </button>

    {/* Prev */}
    {profile.profileImages.length > 1 && (
      <button
        onClick={() =>
          setPreviewIndex(
            previewIndex === 0
              ? profile.profileImages.length - 1
              : previewIndex - 1
          )
        }
        className="absolute left-6 text-white text-4xl hover:scale-110 transition"
      >
        ‹
      </button>
    )}

    {/* Image */}
    <img
      src={getImageUrl(profile.profileImages[previewIndex])}
      alt="Preview"
      className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
    />

    {/* Next */}
    {profile.profileImages.length > 1 && (
      <button
        onClick={() =>
          setPreviewIndex(
            previewIndex === profile.profileImages.length - 1
              ? 0
              : previewIndex + 1
          )
        }
        className="absolute right-6 text-white text-4xl hover:scale-110 transition"
      >
        ›
      </button>
    )}
  </div>
)}

    </div>
  );
}

/* COMPONENTS */
function TabSection({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 space-y-4">
           {" "}
      {title && (
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      )}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">{children}</div>
         {" "}
      
    </div>
  );
}

function Field({ label, value, full }) {
  return (
    <p
      className={`text-sm sm:text-base text-gray-700 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
            <strong>{label}:</strong> {value || "N/A"}   {" "}
    </p>
  );
}
