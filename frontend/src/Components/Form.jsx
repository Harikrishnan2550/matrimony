import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Languages,
  Briefcase,
  Church,
  FileText,
  Heart,
  GraduationCap,
  Users,
  Cigarette,
  Wine,
  Baby,
  Globe,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Camera,
  Image as ImageIcon,
  X,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Save,
} from "lucide-react";

export default function Form() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Info (Step 1)
    name: "",
    mobile: "",
    address: "",
    gender: "",
    birthday: "",
    height: "",
    weight: "",
    languages: "",
    career: "",
    bio: "",

    // Personal Details (Step 2)
    relationshipStatus: "",
    country: "",
    city: "",
    education: "",
    professionalStatus: "",
    otherProfession: "",
    children: "",
    smoking: "",
    alcohol: "",

    // Partner Preferences (Step 3)
    interestedIn: "",
    heightFrom: "",
    heightTo: "",
    weightFrom: "",
    weightTo: "",
    preferredRelationship: "",
    preferredAlcohol: "",
    preferredSmoking: "",
    preferredChildren: "",
    preferredCountry: "",
    preferredLanguages: "",
    preferredEducation: "",
    ageFrom: "",
    ageTo: "",
    dateLocation: "",
  });

  const [images, setImages] = useState({
    profile: null,
    gallery: [null, null, null],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [forceEdit, setForceEdit] = useState(false);
  const [isNewProfilePending, setIsNewProfilePending] = useState(false);
  const navigate = useNavigate();

  // Check if profile exists and load data
  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      setIsLoading(true);
      const response = await API.get("/profile/me");
      if (response.data) {
        setExistingProfile(response.data);
        setApprovalStatus(response.data.approvalStatus);
        setProfileId(response.data._id);
        
        // Check if this is a new profile that's still pending
        const isPending = response.data.approvalStatus === "pending";
        
        // Only set edit mode if profile is approved OR user explicitly wants to edit
        if (response.data.approvalStatus === "approved") {
          setIsEditMode(true);
          populateFormData(response.data);
          loadExistingImages(response.data.profileImages);
          toast.success("🎉 Your profile has been approved by admin!");
        } else if (isPending) {
          // Profile exists but is pending - don't allow editing
          setIsEditMode(false);
          setIsNewProfilePending(true);
          populateFormData(response.data);
          loadExistingImages(response.data.profileImages);
        }
      }
    } catch (error) {
      console.log("No existing profile found, creating new one");
      setIsEditMode(false);
      setIsNewProfilePending(false);
    } finally {
      setIsLoading(false);
    }
  };

  const populateFormData = (profile) => {
    setFormData((prev) => ({
      ...prev,
      name: profile.name || "",
      mobile: profile.phone || "",
      address: profile.address || "",
      gender: mapGenderToLabel(profile.gender) || "",
      birthday: profile.birthday || "",
      height: profile.height || "",
      weight: profile.weight || "",
      languages: profile.motherTongue || "",
      career: profile.career || "",
      bio: profile.bio || "",

      relationshipStatus:
        mapRelationshipToLabel(profile.relationshipStatus) || "",
      country: profile.country || "",
      city: profile.city || "",
      education: mapEducationToLabel(profile.education) || "",
      professionalStatus: profile.professionalStatus || "",
      otherProfession: profile.otherProfession || "",
      children: mapChildrenToLabel(profile.children) || "",
      smoking: mapSmokingToLabel(profile.smoking) || "",
      alcohol: mapAlcoholToLabel(profile.alcohol) || "",

      interestedIn:
        mapGenderToLabel(profile.partnerPreferences?.interestedIn) || "",
      heightFrom:
        extractHeightRange(profile.partnerPreferences?.heightRange, "from") ||
        "",
      heightTo:
        extractHeightRange(profile.partnerPreferences?.heightRange, "to") || "",
      weightFrom:
        extractWeightRange(profile.partnerPreferences?.weightRange, "from") ||
        "",
      weightTo:
        extractWeightRange(profile.partnerPreferences?.weightRange, "to") || "",
      preferredRelationship:
        mapRelationshipToLabel(
          profile.partnerPreferences?.relationshipStatus
        ) || "",
      preferredAlcohol:
        mapAlcoholToLabel(profile.partnerPreferences?.alcohol) || "",
      preferredSmoking:
        mapSmokingToLabel(profile.partnerPreferences?.smoking) || "",
      preferredChildren:
        mapChildrenToLabel(profile.partnerPreferences?.children) || "",
      preferredCountry: profile.partnerPreferences?.country || "",
      preferredLanguages: profile.partnerPreferences?.language || "",
      preferredEducation:
        mapEducationToLabel(profile.partnerPreferences?.education) || "",
      ageFrom: profile.partnerPreferences?.ageMin || "",
      ageTo: profile.partnerPreferences?.ageMax || "",
      dateLocation:
        mapLocationToLabel(profile.partnerPreferences?.locationPreference) ||
        "",
    }));
  };

  const loadExistingImages = (profileImages) => {
    if (profileImages && profileImages.length > 0) {
      setExistingImages(profileImages);

      if (profileImages[0]) {
        setImages((prev) => ({
          ...prev,
          profile: {
            preview: getFullImageUrl(profileImages[0]),
            isExisting: true,
          },
        }));
      }

      const galleryImages = profileImages.slice(1).map((img, index) => ({
        preview: getFullImageUrl(img),
        isExisting: true,
      }));

      setImages((prev) => ({
        ...prev,
        gallery: [
          ...galleryImages,
          ...Array(3 - galleryImages.length).fill(null),
        ],
      }));
    }
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;
    return `http://localhost:4000/${cleanPath}`;
  };

  // Mapping functions for form labels
  const mapGenderToLabel = (gender) => {
    switch (gender) {
      case "male":
        return "Man";
      case "female":
        return "Woman";
      case "non-binary":
        return "Non-binary";
      default:
        return "";
    }
  };

  const mapRelationshipToLabel = (status) => {
    switch (status) {
      case "single":
        return "Single";
      case "divorced":
        return "Divorced";
      case "widowed":
        return "Widowed";
      case "prefer not to say":
        return "Prefer not to say";
      default:
        return "";
    }
  };

  const mapChildrenToLabel = (children) => {
    switch (children) {
      case "no children":
        return "No children";
      case "have children":
        return "Have children";
      default:
        return "";
    }
  };

  const mapSmokingToLabel = (smoking) => {
    switch (smoking) {
      case "dont smoke":
        return "Don't smoke";
      case "smoke regularly":
        return "Smoke regularly";
      case "smoke occasionally":
        return "Smoke occasionally";
      case "prefer not to say":
        return "Prefer not to say";
      default:
        return "";
    }
  };

  const mapAlcoholToLabel = (alcohol) => {
    switch (alcohol) {
      case "dont drink":
        return "Don't drink";
      case "drink frequently":
        return "Drink frequently";
      case "drink socially":
        return "Drink socially";
      case "prefer not to say":
        return "Prefer not to say";
      default:
        return "";
    }
  };

  const mapLocationToLabel = (location) => {
    switch (location) {
      case "in my city":
        return "In my city";
      case "in my country":
        return "In my country";
      case "in other country":
        return "In other country";
      case "doesn't matter":
        return "Doesn't matter";
      default:
        return "";
    }
  };

  const mapEducationToLabel = (education) => {
    switch (education) {
      case "High School":
        return "High school degree";
      case "Vocational":
        return "Vocational high school degree";
      case "College":
        return "Some college";
      case "Bachelor's degree":
        return "Associate, bachelor's, or master's degree";
      case "Master's degree":
        return "Associate, bachelor's, or master's degree";
      case "Doctoral":
        return "Doctoral degree";
      case "Multiple Degrees":
        return "More than one academic degree";
      default:
        return "";
    }
  };

  const extractHeightRange = (range, type) => {
    if (!range) return "";
    const parts = range.split(" - ");
    return type === "from" ? parts[0] : parts[1] || "";
  };

  const extractWeightRange = (range, type) => {
    if (!range) return "";
    const parts = range.split(" - ");
    return type === "from" ? parts[0] : parts[1] || "";
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload =
    (type, index = null) =>
    (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          return;
        }

        if (!file.type.startsWith("image/")) {
          toast.error("Please upload a valid image file");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          if (type === "profile") {
            setImages((prev) => ({
              ...prev,
              profile: {
                preview: reader.result,
                file: file,
                isExisting: false,
              },
            }));
            toast.success("Profile image uploaded successfully");
          } else {
            setImages((prev) => {
              const newGallery = [...prev.gallery];
              newGallery[index] = {
                preview: reader.result,
                file: file,
                isExisting: false,
              };
              return { ...prev, gallery: newGallery };
            });
            toast.success(`Gallery image ${index + 1} uploaded successfully`);
          }
        };
        reader.readAsDataURL(file);
      }
    };

  const removeImage = (type, index = null) => {
    if (type === "profile") {
      if (images.profile?.isExisting && existingImages[0]) {
        setImagesToRemove(prev => [...prev, existingImages[0]]);
      }
      setImages(prev => ({ ...prev, profile: null }));
      return;
    }

    const imgObj = images.gallery[index];
    if (imgObj?.isExisting) {
      const matched = existingImages.find(path =>
        imgObj.preview.includes(path.replace(/\\/g, "/").split("/").pop())
      );
      if (matched) {
        setImagesToRemove(prev => [...prev, matched]);
      }
    }

    setImages(prev => {
      const newGallery = [...prev.gallery];
      newGallery[index] = null;
      return { ...prev, gallery: newGallery };
    });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const calculateAge = (dobStr) => {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Mapping functions for backend format
  const mapGender = (label) => {
    if (!label) return undefined;
    switch (label) {
      case "Man":
        return "male";
      case "Woman":
        return "female";
      case "Non-binary":
        return "non-binary";
      default:
        return undefined;
    }
  };

  const mapRelationshipStatus = (label) => {
    if (!label) return undefined;
    switch (label) {
      case "Single":
        return "single";
      case "Divorced":
        return "divorced";
      case "Widowed":
        return "widowed";
      case "Prefer not to say":
        return "prefer not to say";
      default:
        return undefined;
    }
  };

  const mapChildren = (label) => {
    if (!label) return undefined;
    switch (label) {
      case "No children":
        return "no children";
      case "Have children":
        return "have children";
      default:
        return undefined;
    }
  };

  const mapSmoking = (label) => {
    if (!label) return undefined;
    switch (label) {
      case "Don't smoke":
        return "dont smoke";
      case "Smoke regularly":
        return "smoke regularly";
      case "Smoke occasionally":
        return "smoke occasionally";
      case "Prefer not to say":
        return "prefer not to say";
      default:
        return undefined;
    }
  };

  const mapAlcohol = (label) => {
    if (!label) return undefined;
    switch (label) {
      case "Don't drink":
        return "dont drink";
      case "Drink frequently":
        return "drink frequently";
      case "Drink socially":
        return "drink socially";
      case "Prefer not to say":
        return "prefer not to say";
      default:
        return undefined;
    }
  };

  const mapLocationPreference = (label) => {
    if (!label) return undefined;
    switch (label) {
      case "In my city":
        return "in my city";
      case "In my country":
        return "in my country";
      case "In other country":
        return "in other country";
      case "Doesn't matter":
        return "doesn't matter";
      default:
        return undefined;
    }
  };

  const mapEducation = (label) => {
    if (!label) return undefined;
    switch (label) {
      case "High school degree":
        return "High School";
      case "Vocational high school degree":
        return "Vocational";
      case "Some college":
        return "College";
      case "Associate, bachelor's, or master's degree":
        return "Bachelor's degree";
      case "Doctoral degree":
        return "Doctoral";
      case "More than one academic degree":
        return "Multiple Degrees";
      default:
        return undefined;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.address || !formData.gender || !formData.birthday || !formData.height) {
        toast.error("Please fill all required fields");
        return;
      }

      if (!images.profile) {
        toast.error("Please upload a profile picture.");
        return;
      }

      setIsSubmitting(true);

      const age = calculateAge(formData.birthday);
      if (!age) {
        toast.error("Invalid birthday. Please select a valid date.");
        setIsSubmitting(false);
        return;
      }

      // CREATE PROFILE
      if (!isEditMode) {
        const loadingToast = toast.loading("Submitting your profile...");
        
        const payload = {
          name: formData.name,
          phone: formData.mobile,
          address: formData.address,
          gender: mapGender(formData.gender),
          birthday: formData.birthday,
          age: age,
          height: formData.height,
          weight: formData.weight || "",
          motherTongue: formData.languages || "",
          career: formData.career || "",
          bio: formData.bio || "",
          relationshipStatus: mapRelationshipStatus(formData.relationshipStatus),
          country: formData.country || "",
          city: formData.city || "",
          education: mapEducation(formData.education) || "",
          professionalStatus: formData.professionalStatus || "",
          otherProfession: formData.otherProfession || "",
          children: mapChildren(formData.children),
          smoking: mapSmoking(formData.smoking),
          alcohol: mapAlcohol(formData.alcohol),
          partnerPreferences: {
            interestedIn: mapGender(formData.interestedIn),
            heightRange: formData.heightFrom && formData.heightTo ? `${formData.heightFrom} - ${formData.heightTo}` : "",
            weightRange: formData.weightFrom && formData.weightTo ? `${formData.weightFrom} - ${formData.weightTo}` : "",
            relationshipStatus: mapRelationshipStatus(formData.preferredRelationship),
            alcohol: mapAlcohol(formData.preferredAlcohol),
            smoking: mapSmoking(formData.preferredSmoking),
            children: mapChildren(formData.preferredChildren),
            country: formData.preferredCountry || "",
            language: formData.preferredLanguages || "",
            education: mapEducation(formData.preferredEducation) || "",
            ageMin: formData.ageFrom ? Number(formData.ageFrom) : undefined,
            ageMax: formData.ageTo ? Number(formData.ageTo) : undefined,
            locationPreference: mapLocationPreference(formData.dateLocation),
          },
        };

        const res = await API.post("/profile", payload);
        console.log("Profile created:", res.data);
        
        if (res.data.profile?._id) {
          const imageFiles = [];
          
          if (images.profile && images.profile.file) {
            imageFiles.push(images.profile.file);
          }
          
          images.gallery.forEach(img => {
            if (img && img.file) imageFiles.push(img.file);
          });

          if (imageFiles.length > 0) {
            toast.loading("Uploading images...", { id: loadingToast });
            
            const uploadFormData = new FormData();
            imageFiles.forEach((file, index) => {
              const filename = index === 0 ? `profile.jpg` : `gallery-${index}.jpg`;
              uploadFormData.append("images", file, filename);
            });

            try {
              await API.post("/profile/upload-images", uploadFormData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              toast.success("Profile submitted successfully! Awaiting admin approval.", { id: loadingToast });
            } catch (uploadError) {
              console.error("Image upload error:", uploadError);
              toast.success("Profile submitted! Some images failed to upload. Awaiting admin approval.", { id: loadingToast });
            }
          } else {
            toast.success("Profile submitted successfully! Awaiting admin approval.", { id: loadingToast });
          }
        }

        setProfileId(res.data.profile?._id);
        setApprovalStatus('pending');
        setIsNewProfilePending(true);
        
        return;
      }

      // EDIT PROFILE
      const formDataToSend = new FormData();

      const payload = {
        name: formData.name,
        phone: formData.mobile,
        address: formData.address,
        gender: mapGender(formData.gender),
        birthday: formData.birthday,
        age: age,
        height: formData.height,
        weight: formData.weight || "",
        motherTongue: formData.languages || "",
        career: formData.career || "",
        bio: formData.bio || "",
        relationshipStatus: mapRelationshipStatus(formData.relationshipStatus),
        country: formData.country || "",
        city: formData.city || "",
        education: mapEducation(formData.education) || "",
        professionalStatus: formData.professionalStatus || "",
        otherProfession: formData.otherProfession || "",
        children: mapChildren(formData.children),
        smoking: mapSmoking(formData.smoking),
        alcohol: mapAlcohol(formData.alcohol),
        partnerPreferences: {
          interestedIn: mapGender(formData.interestedIn),
          heightRange: formData.heightFrom && formData.heightTo ? `${formData.heightFrom} - ${formData.heightTo}` : "",
          weightRange: formData.weightFrom && formData.weightTo ? `${formData.weightFrom} - ${formData.weightTo}` : "",
          relationshipStatus: mapRelationshipStatus(formData.preferredRelationship),
          alcohol: mapAlcohol(formData.preferredAlcohol),
          smoking: mapSmoking(formData.preferredSmoking),
          children: mapChildren(formData.preferredChildren),
          country: formData.preferredCountry || "",
          language: formData.preferredLanguages || "",
          education: mapEducation(formData.preferredEducation) || "",
          ageMin: formData.ageFrom ? Number(formData.ageFrom) : undefined,
          ageMax: formData.ageTo ? Number(formData.ageTo) : undefined,
          locationPreference: mapLocationPreference(formData.dateLocation),
        },
      };

      console.log("Sending payload:", payload);

      formDataToSend.append('data', JSON.stringify(payload));

      const remainingExistingImages = existingImages.filter(img => 
        !imagesToRemove.includes(img)
      ).length;
      
      const availableSlots = 4 - remainingExistingImages;

      const newFiles = [];
      
      if (images.profile && images.profile.file && !images.profile.isExisting) {
        newFiles.push(images.profile.file);
      }
      
      images.gallery.forEach(img => {
        if (img && img.file && !img.isExisting) {
          newFiles.push(img.file);
        }
      });

      if (newFiles.length > availableSlots) {
        toast.error(`You can only upload ${availableSlots} new image(s). Please remove some existing images first.`);
        setIsSubmitting(false);
        return;
      }

      if (imagesToRemove.length > 0) {
        formDataToSend.append('removeImages', JSON.stringify(imagesToRemove));
      }

      newFiles.forEach((file, index) => {
        const filename = index === 0 && images.profile?.file ? 
          `profile-${Date.now()}.jpg` : 
          `gallery-${index}-${Date.now()}.jpg`;
        formDataToSend.append("images", file, filename);
      });

      console.log(`Image info - Existing: ${existingImages.length}, Removing: ${imagesToRemove.length}, Remaining: ${remainingExistingImages}, New: ${newFiles.length}, Available: ${availableSlots}`);

      const loadingToast = toast.loading("Updating profile...");
      const response = await API.put("/profile/edit-profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile updated:", response.data);
      
      if (response.data?.profile) {
        setExistingProfile(response.data.profile);
        setApprovalStatus(response.data.profile.approvalStatus || "approved");
        
        if (response.data.profile.profileImages) {
          loadExistingImages(response.data.profile.profileImages);
        }
      }

      setImagesToRemove([]);
      
      toast.success("Profile updated successfully! Redirecting to gallery...", { id: loadingToast });
      setTimeout(() => {
        navigate('/gallery');
      }, 1500);
      
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Something went wrong while submitting your profile.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid data submitted. Please check your information.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnterGallery = () => {
    navigate("/gallery");
  };

  const checkApprovalStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const response = await API.get("/profile/me");
      if (response.data) {
        setApprovalStatus(response.data.approvalStatus);
        if (response.data.approvalStatus === "approved") {
          toast.success("🎉 Your profile has been approved by admin!");
          setIsEditMode(true);
          setIsNewProfilePending(false);
        }
      }
    } catch (error) {
      console.log("Error checking status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleForceEdit = () => {
    setForceEdit(true);
    setIsEditMode(true);
    setIsNewProfilePending(false);
    toast.info(
      "You are now editing your profile. Changes will require re-approval."
    );
  };

  // If profile is approved AND we're not forcing edit mode, show the approval success screen
  if (approvalStatus === "approved" && !forceEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "white",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          }}
          richColors
          closeButton
        />

        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-center">
            <div className="p-8 md:p-12">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <ShieldCheck className="text-green-600" size={48} />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Profile Approved! 🎉
              </h1>

              <p className="text-gray-600 text-lg mb-2">
                Congratulations! Your profile has been approved by the admin.
              </p>

              <p className="text-gray-500 mb-8">
                You can now access the gallery and start exploring potential
                matches.
              </p>

              <button
                onClick={handleEnterGallery}
                className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 hover:gap-4 mb-4"
              >
                Enter Gallery
                <ArrowRight size={24} />
              </button>

              <button
                onClick={handleForceEdit}
                className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 hover:gap-4"
              >
                Edit My Profile
                <Save size={24} />
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> You can edit your profile anytime.
                  Changes will require re-approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If profile is pending approval AND it's a new profile (not in edit mode), show waiting screen
  if (approvalStatus === "pending" && isNewProfilePending && !isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "white",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          }}
          richColors
          closeButton
        />

        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-center">
            <div className="p-8 md:p-12">
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-6 animate-pulse">
                <ShieldCheck className="text-purple-600" size={48} />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Awaiting Approval
              </h1>

              <p className="text-gray-600 text-lg mb-2">
                Your profile is under review by our admin team.
              </p>

              <p className="text-gray-500 mb-6">
                This usually takes 24-48 hours. We'll notify you as soon as
                you're approved.
              </p>

              <div className="flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-xl mb-6">
                <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>

              <button
                onClick={checkApprovalStatus}
                disabled={isCheckingStatus}
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCheckingStatus ? "Checking..." : "Check Status"}
                <RefreshCw
                  size={20}
                  className={isCheckingStatus ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Toaster position="top-right" richColors closeButton />
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const headerTitle = isEditMode ? "Edit Your Profile" : "Create Your Profile";
  const submitButtonText = isEditMode ? "Update Profile" : "Submit Profile";

  return (
    <div className="min-h-screen bg-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "white",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
        richColors
        closeButton
      />

      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {headerTitle}
          </h1>

          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep === step.num
                        ? "bg-white text-purple-600 shadow-lg scale-110"
                        : currentStep > step.num
                        ? "bg-green-400 text-white"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    {currentStep > step.num ? <Check size={20} /> : step.icon}
                  </div>
                  <span className="text-xs mt-2 font-medium hidden md:block">
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 md:w-24 rounded transition-all ${
                      currentStep > step.num ? "bg-green-400" : "bg-white/30"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {currentStep === 1 && (
              <div className="space-y-8 animate-slideIn">
                <div className="text-center animate-scaleIn">
                  <div className="inline-block p-3 bg-purple-100 rounded-full mb-4 animate-float">
                    <User className="text-purple-600" size={32} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Tell Us About Yourself
                  </h2>
                  <p className="text-gray-500">Let's get to know you better</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 stagger-1">
                  <div className="flex items-center gap-2 mb-6">
                    <Camera className="text-purple-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-800">
                      Your Photos
                    </h3>
                    <span className="text-sm text-purple-600 ml-2">
                      (Required)
                    </span>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Profile Picture *
                    </label>
                    <div className="flex justify-center">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload("profile")}
                          className="hidden"
                          id="profile-upload"
                        />
                        <label
                          htmlFor="profile-upload"
                          className={`flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                            images.profile
                              ? "border-purple-500"
                              : "border-dashed border-gray-300 hover:border-purple-400 bg-white"
                          }`}
                        >
                          {images.profile ? (
                            <>
                              <img
                                src={images.profile.preview}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeImage("profile");
                                }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <Camera
                                className="text-gray-400 mb-2"
                                size={32}
                              />
                              <span className="text-sm text-gray-500 font-medium">
                                Add Profile
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Additional Photos (Add up to 3 more)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {images.gallery.map((img, index) => (
                        <div key={index} className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload("gallery", index)}
                            className="hidden"
                            id={`gallery-upload-${index}`}
                          />
                          <label
                            htmlFor={`gallery-upload-${index}`}
                            className={`flex flex-col items-center justify-center aspect-square rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                              img
                                ? "border-purple-500"
                                : "border-dashed border-gray-300 hover:border-purple-400 bg-white hover:shadow-md"
                            }`}
                          >
                            {img ? (
                              <>
                                <img
                                  src={img.preview}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full rounded-xl object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeImage("gallery", index);
                                  }}
                                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <ImageIcon
                                  className="text-gray-400 mb-1"
                                  size={24}
                                />
                                <span className="text-xs text-gray-500 font-medium">
                                  Add Photo
                                </span>
                              </>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 stagger-2">
                  <InputField
                    icon={<User size={20} />}
                    label="Full Name"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />

                  <InputField
                    icon={<Phone size={20} />}
                    label="Mobile Number"
                    required
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={formData.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                  />
                </div>

                <div className="stagger-3">
                  <InputField
                    icon={<MapPin size={20} />}
                    label="Address"
                    required
                    placeholder="Your current address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </div>

                <div className="stagger-4">
                  <SelectField
                    icon={<User size={20} />}
                    label="Gender"
                    required
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {["Man", "Woman", "Non-binary"].map((option) => (
                        <OptionCard
                          key={option}
                          label={option}
                          selected={formData.gender === option}
                          onClick={() => updateField("gender", option)}
                        />
                      ))}
                    </div>
                  </SelectField>
                </div>

                <div className="stagger-5">
                  <InputField
                    icon={<Calendar size={20} />}
                    label="Birthday"
                    required
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => updateField("birthday", e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 stagger-6">
                  <InputField
                    icon={<Ruler size={20} />}
                    label="Height"
                    required
                    placeholder="e.g., 170 cm"
                    value={formData.height}
                    onChange={(e) => updateField("height", e.target.value)}
                  />

                  <InputField
                    icon={<Weight size={20} />}
                    label="Weight"
                    placeholder="e.g., 65 kg"
                    value={formData.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                  />
                </div>

                <SelectField
                  icon={<Languages size={20} />}
                  label="Languages"
                  required
                >
                  <select
                    className="premium-select"
                    value={formData.languages}
                    onChange={(e) => updateField("languages", e.target.value)}
                  >
                    <option value="">Select your language</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Other">Other</option>
                  </select>
                </SelectField>

                <SelectField
                  icon={<Briefcase size={20} />}
                  label="Career"
                  required
                >
                  <select
                    className="premium-select"
                    value={formData.career}
                    onChange={(e) => updateField("career", e.target.value)}
                  >
                    <option value="">Select your career field</option>
                    <option value="Military">Military</option>
                    <option value="Public sector">Public sector</option>
                    <option value="IT industry">IT industry</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Communications">Communications</option>
                    <option value="Construction">Construction</option>
                    <option value="Service industry">Service industry</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Finance">Finance</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Arts & Design">Arts & Design</option>
                    <option value="Energy industry">Energy industry</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Government">Government</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Security industry">Security industry</option>
                    <option value="Social services">Social services</option>
                    <option value="Sports">Sports</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Other">Other</option>
                  </select>
                </SelectField>

                <SelectField
                  icon={<Church size={20} />}
                  label="Religion"
                  required
                >
                  <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Hinduism
                      </span>
                      <Check className="text-green-600" size={20} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Religion is set to Hinduism as per platform requirements
                    </p>
                  </div>
                </SelectField>

                <SelectField icon={<FileText size={20} />} label="Bio">
                  <textarea
                    className="premium-input min-h-32"
                    placeholder="Write something about yourself..."
                    value={formData.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                  />
                </SelectField>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-sladeIn">
                <div className="text-center animate-scaleIn">
                  <div className="inline-block p-3 bg-pink-100 rounded-full mb-4 animate-float">
                    <Heart className="text-pink-600" size={32} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    More About You
                  </h2>
                  <p className="text-gray-500">Share your lifestyle details</p>
                </div>

                <div className="stagger-1">
                  <SelectField
                    icon={<Heart size={20} />}
                    label="Relationship Status"
                    required
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        "Single",
                        "Divorced",
                        "Widowed",
                        "Prefer not to say",
                      ].map((option) => (
                        <OptionCard
                          key={option}
                          label={option}
                          selected={formData.relationshipStatus === option}
                          onClick={() =>
                            updateField("relationshipStatus", option)
                          }
                          compact
                        />
                      ))}
                    </div>
                  </SelectField>
                </div>

                <div className="grid md:grid-cols-2 gap-6 stagger-2">
                  <InputField
                    icon={<Globe size={20} />}
                    label="Country"
                    required
                    placeholder="Your country"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  />

                  <InputField
                    icon={<MapPin size={20} />}
                    label="City"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>

                <SelectField
                  icon={<GraduationCap size={20} />}
                  label="Education"
                  required
                >
                  <select
                    className="premium-select"
                    value={formData.education}
                    onChange={(e) => updateField("education", e.target.value)}
                  >
                    <option value="">Select education level</option>
                    <option value="High school degree">
                      High school degree
                    </option>
                    <option value="Vocational high school degree">
                      Vocational high school degree
                    </option>
                    <option value="Some college">Some college</option>
                    <option value="Associate, bachelor's, or master's degree">
                      Associate, bachelor's, or master's degree
                    </option>
                    <option value="Doctoral degree">Doctoral degree</option>
                    <option value="More than one academic degree">
                      More than one academic degree
                    </option>
                  </select>
                </SelectField>

                <SelectField
                  icon={<Briefcase size={20} />}
                  label="Professional Status"
                >
                  <select
                    className="premium-select"
                    value={formData.professionalStatus}
                    onChange={(e) =>
                      updateField("professionalStatus", e.target.value)
                    }
                  >
                    <option value="">Select status</option>
                    <option value="Currently unemployed">
                      Currently unemployed
                    </option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Freelancer/Self-employed">
                      Freelancer/Self-employed
                    </option>
                    <option value="Junior manager">Junior manager</option>
                    <option value="Specialist">Specialist</option>
                    <option value="Student">Student</option>
                    <option value="Workman">Workman</option>
                  </select>
                </SelectField>

                <InputField
                  icon={<FileText size={20} />}
                  label="Custom Profession (if not listed)"
                  placeholder="Enter your profession"
                  value={formData.otherProfession}
                  onChange={(e) =>
                    updateField("otherProfession", e.target.value)
                  }
                />

                <SelectField icon={<Baby size={20} />} label="Children">
                  <div className="grid grid-cols-2 gap-4">
                    {["No children", "Have children"].map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={formData.children === option}
                        onClick={() => updateField("children", option)}
                      />
                    ))}
                  </div>
                </SelectField>

                <SelectField icon={<Cigarette size={20} />} label="Smoking">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Don't smoke",
                      "Smoke regularly",
                      "Smoke occasionally",
                      "Prefer not to say",
                    ].map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={formData.smoking === option}
                        onClick={() => updateField("smoking", option)}
                        compact
                      />
                    ))}
                  </div>
                </SelectField>

                <SelectField icon={<Wine size={20} />} label="Alcohol">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Don't drink",
                      "Drink frequently",
                      "Drink socially",
                      "Prefer not to say",
                    ].map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={formData.alcohol === option}
                        onClick={() => updateField("alcohol", option)}
                        compact
                      />
                    ))}
                  </div>
                </SelectField>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-slideIn">
                <div className="text-center animate-scaleIn">
                  <div className="inline-block p-3 bg-rose-100 rounded-full mb-4 animate-float">
                    <Sparkles className="text-rose-600" size={32} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Your Ideal Match
                  </h2>
                  <p className="text-gray-500">
                    Tell us who you're looking for
                  </p>
                </div>

                <div className="stagger-1">
                  <SelectField
                    icon={<Heart size={20} />}
                    label="Interested in"
                    required
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {["Man", "Woman", "Non-binary"].map((option) => (
                        <OptionCard
                          key={option}
                          label={option}
                          selected={formData.interestedIn === option}
                          onClick={() => updateField("interestedIn", option)}
                        />
                      ))}
                    </div>
                  </SelectField>
                </div>

                <SelectField icon={<Ruler size={20} />} label="Height Range">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="premium-input"
                      placeholder="From (cm)"
                      value={formData.heightFrom}
                      onChange={(e) =>
                        updateField("heightFrom", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="premium-input"
                      placeholder="To (cm)"
                      value={formData.heightTo}
                      onChange={(e) => updateField("heightTo", e.target.value)}
                    />
                  </div>
                </SelectField>

                <SelectField icon={<Weight size={20} />} label="Weight Range">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="premium-input"
                      placeholder="From (kg)"
                      value={formData.weightFrom}
                      onChange={(e) =>
                        updateField("weightFrom", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="premium-input"
                      placeholder="To (kg)"
                      value={formData.weightTo}
                      onChange={(e) => updateField("weightTo", e.target.value)}
                    />
                  </div>
                </SelectField>

                <SelectField
                  icon={<Users size={20} />}
                  label="Relationship Status"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Single", "Divorced", "Widowed", "Prefer not to say"].map(
                      (option) => (
                        <OptionCard
                          key={option}
                          label={option}
                          selected={formData.preferredRelationship === option}
                          onClick={() =>
                            updateField("preferredRelationship", option)
                          }
                          compact
                        />
                      )
                    )}
                  </div>
                </SelectField>

                <SelectField icon={<Wine size={20} />} label="Alcohol">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Don't drink",
                      "Drink frequently",
                      "Drink socially",
                      "Prefer not to say",
                    ].map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={formData.preferredAlcohol === option}
                        onClick={() => updateField("preferredAlcohol", option)}
                        compact
                      />
                    ))}
                  </div>
                </SelectField>

                <SelectField icon={<Cigarette size={20} />} label="Smoking">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Don't smoke",
                      "Smoke regularly",
                      "Smoke occasionally",
                      "Prefer not to say",
                    ].map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={formData.preferredSmoking === option}
                        onClick={() => updateField("preferredSmoking", option)}
                        compact
                      />
                    ))}
                  </div>
                </SelectField>

                <SelectField icon={<Baby size={20} />} label="Children">
                  <div className="grid grid-cols-2 gap-4">
                    {["No children", "Have children"].map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={formData.preferredChildren === option}
                        onClick={() => updateField("preferredChildren", option)}
                      />
                    ))}
                  </div>
                </SelectField>

                <InputField
                  icon={<Globe size={20} />}
                  label="Country"
                  placeholder="Preferred country"
                  value={formData.preferredCountry}
                  onChange={(e) =>
                    updateField("preferredCountry", e.target.value)
                  }
                />

                <SelectField
                  icon={<Church size={20} />}
                  label="Preferred Religion"
                  required
                >
                  <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Hinduism
                      </span>
                      <Check className="text-green-600" size={20} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Partner religion is set to Hinduism as per platform
                      requirements
                    </p>
                  </div>
                </SelectField>

                <SelectField
                  icon={<Languages size={20} />}
                  label="Preferred Languages"
                >
                  <select
                    className="premium-select"
                    value={formData.preferredLanguages}
                    onChange={(e) =>
                      updateField("preferredLanguages", e.target.value)
                    }
                  >
                    <option value="">Select language</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Other">Other</option>
                  </select>
                </SelectField>

                <SelectField
                  icon={<GraduationCap size={20} />}
                  label="Preferred Education"
                  required
                >
                  <select
                    className="premium-select"
                    value={formData.preferredEducation}
                    onChange={(e) =>
                      updateField("preferredEducation", e.target.value)
                    }
                  >
                    <option value="">Select education level</option>
                    <option value="High school degree">
                      High school degree
                    </option>
                    <option value="Vocational high school degree">
                      Vocational high school degree
                    </option>
                    <option value="Some college">Some college</option>
                    <option value="Associate, bachelor's, or master's degree">
                      Associate, bachelor's, or master's degree
                    </option>
                    <option value="Doctoral degree">Doctoral degree</option>
                    <option value="More than one academic degree">
                      More than one academic degree
                    </option>
                  </select>
                </SelectField>

                <SelectField icon={<Calendar size={20} />} label="Age Range">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      className="premium-input"
                      placeholder="From"
                      value={formData.ageFrom}
                      onChange={(e) => updateField("ageFrom", e.target.value)}
                    />
                    <input
                      type="number"
                      className="premium-input"
                      placeholder="To"
                      value={formData.ageTo}
                      onChange={(e) => updateField("ageTo", e.target.value)}
                    />
                  </div>
                </SelectField>

                <SelectField icon={<MapPin size={20} />} label="Date Location">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "In my city",
                      "In my country",
                      "In other country",
                      "Doesn't matter",
                    ].map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={formData.dateLocation === option}
                        onClick={() => updateField("dateLocation", option)}
                        compact
                      />
                    ))}
                  </div>
                </SelectField>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-8 md:px-12 py-6 flex items-center justify-between border-t">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-all hover:gap-3 hover:-translate-x-1"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-xl transition-all hover:gap-3 hover:translate-x-1 animate-bounce-subtle"
              >
                Continue
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium hover:shadow-xl transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Submitting..."
                  : submitButtonText}
                {isEditMode ? <Save size={20} /> : <Check size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon,
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span className="text-purple-600">{icon}</span>
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        className="premium-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function SelectField({ icon, label, required, children }) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span className="text-purple-600">{icon}</span>
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function OptionCard({ label, selected, onClick, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        compact ? "py-2.5 px-3" : "py-4 px-4"
      } rounded-xl border-2 transition-all duration-300 font-medium text-sm transform hover:scale-105 ${
        selected
          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-md scale-105"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

const steps = [
  { num: 1, title: "Personal Info", icon: <User size={18} /> },
  { num: 2, title: "Details", icon: <Heart size={18} /> },
  { num: 3, title: "Preferences", icon: <Sparkles size={18} /> },
];