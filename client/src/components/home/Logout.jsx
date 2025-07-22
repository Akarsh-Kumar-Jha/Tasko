import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../axios/axiosInstance";

function Logout() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/user/logout", {}, { withCredentials: true });
      toast.success("🟢 Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("❌ Logout failed!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const cancelLogout = () => {
    toast.info("Logout cancelled");
    setShowPopup(false)
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-white">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-semibold">Logging you out...</div>
          <div className="relative flex h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-white/20 animate-spin"></div>
          </div>
          <p className="text-white/70 text-sm italic">Please wait</p>
        </div>
      ) : showPopup ? (
        <div className="bg-[#1e293b] border border-white/10 px-6 py-8 rounded-xl shadow-lg text-center max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-3">Are you sure you want to logout?</h2>
          <div className="flex justify-center gap-4 mt-5">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded text-white font-medium"
            >
              Yes, Logout
            </button>
            <button
              onClick={cancelLogout}
              className="bg-gray-500 hover:bg-gray-600 transition px-4 py-2 rounded text-white font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Logout;
