// export default function getImageUrl(imagePath) {
//   if (!imagePath) return "/no-profile.png";

//   // Replace Windows backslashes
//   imagePath = imagePath.replace(/\\/g, "/");

//   // Fix duplicate "uploads/uploads"
//   imagePath = imagePath.replace("uploads/uploads", "uploads");

//   // If full URL, return as is
//   if (imagePath.startsWith("http")) return imagePath;

//   // Ensure clean path (remove leading slashes)
//   imagePath = imagePath.replace(/^\/+/, "");

//   // Choose correct server depending on localhost or live
//   const SERVER_URL =
//     window.location.hostname === "localhost"
//       ? "http://localhost:4000"
//       : "https://login.akhilendianadar.in";

//   return `${SERVER_URL}/${imagePath}`;
// }




export default function getImageUrl(imagePath) {
  if (!imagePath) return "/no-profile.png";

  // If backend returns a full URL — DO NOT modify
  if (imagePath.startsWith("http")) return imagePath;

  // 1. Normalize slashes
  imagePath = imagePath.replace(/\\/g, "/");

  // 2. Remove any leading 'uploads/' prefix if it's already there (to be safe)
  imagePath = imagePath.replace(/^uploads\//i, ''); 

  // 3. Force the correct 'uploads/' prefix
  imagePath = "uploads/" + imagePath;

  const SERVER_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://login.akhilendianadar.in";

  // 4. Return the complete URL
  return `${SERVER_URL}/${imagePath}`;
}


