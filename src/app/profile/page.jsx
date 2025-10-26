"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaLock, FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios";

/**
 * User Profile Page Component
 * Displays and edits user profile information
 */
const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/auth/profile/${session.user.id}`);
        if (response.data.success) {
          setUserData(response.data.user);
          setFormData({
            name: response.data.user.name || "",
            phone: response.data.user.phone || "",
            address: response.data.user.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/auth/profile/${session.user.id}`, formData);
      
      if (response.data.success) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
          },
        });

        setUserData(response.data.user);
        setIsEditing(false);
        
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully",
          confirmButtonColor: "#000",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update profile",
        confirmButtonColor: "#000",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html: `
        <input id="currentPassword" type="password" class="swal2-input" placeholder="Current Password">
        <input id="newPassword" type="password" class="swal2-input" placeholder="New Password">
        <input id="confirmPassword" type="password" class="swal2-input" placeholder="Confirm New Password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#000",
      preConfirm: () => {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }

        if (newPassword.length < 6) {
          Swal.showValidationMessage("New password must be at least 6 characters");
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Passwords do not match");
          return false;
        }

        return { currentPassword, newPassword };
      },
    });

    if (formValues) {
      try {
        const response = await axiosInstance.post("/auth/change-password", {
          userId: session.user.id,
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
        });

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Password Changed",
            text: "Your password has been updated successfully",
            confirmButtonColor: "#000",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: error.response?.data?.message || "Failed to change password",
          confirmButtonColor: "#000",
        });
      }
    }
  };

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, sign out",
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/" });
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 rounded-t-2xl px-8 py-10 text-white">
          <h1 className="text-3xl font-black mb-2">My Profile</h1>
          <p className="text-gray-300">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          {/* User Info Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                userData.role === "admin" 
                  ? "bg-purple-100 text-purple-800" 
                  : "bg-blue-100 text-blue-800"
              }`}>
                {userData.role === "admin" ? "Admin" : "Customer"}
              </span>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6 mb-8">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-gray-900"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-gray-900"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                  placeholder="Add phone number"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-gray-900"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                  placeholder="Add your address"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                  <FaEdit /> Edit Profile
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <FaLock /> Change Password
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <FaSave /> {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  <FaTimes /> Cancel
                </button>
              </>
            )}
          </div>

          {/* Account Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Member since:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last updated:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(userData.updatedAt || userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
