
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Trigger Google OAuth sign-in
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      // Send user data to your backend
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      // Parse the response from backend
      const data = await res.json();

      // Check if the request was successful
    if (res.status === 200) {
      // localStorage.setItem("token", data.token);

        // Navigate to the home page or wherever you'd like
        navigate("/");
      } else {
        console.error("Failed to sign in with Google: ", data.message);
      }
    } catch (error) {
      console.error("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="p-2 bg-red-700 w-full text-white rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
