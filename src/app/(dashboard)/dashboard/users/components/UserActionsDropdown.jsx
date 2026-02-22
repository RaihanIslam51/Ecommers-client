"use client";

import { useEffect, useRef } from "react";
import { FiMoreVertical, FiShield, FiUser, FiTrash2, FiEye, FiEdit, FiMail, FiLock } from "react-icons/fi";

export default function UserActionsDropdown({ user, isOpen, onToggle, onRoleChange, onDelete, onViewDetails, onEdit, onSendMessage, onResetPassword }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          {/* View Details */}
          <button
            onClick={() => {
              onViewDetails();
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <FiEye className="w-4 h-4 text-blue-600" />
            View Details
          </button>

          {/* Edit Profile */}
          <button
            onClick={() => {
              onEdit();
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <FiEdit className="w-4 h-4 text-indigo-600" />
            Edit Profile
          </button>

          {/* Send Message */}
          <button
            onClick={() => {
              onSendMessage();
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <FiMail className="w-4 h-4 text-teal-600" />
            Send Message
          </button>

          <hr className="my-1" />

          {/* Role Change */}
          {user.role === "user" ? (
            <button
              onClick={() => {
                onRoleChange("admin");
                onToggle();
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 flex items-center gap-2 transition-colors"
            >
              <FiShield className="w-4 h-4 text-black" />
              Make Admin
            </button>
          ) : (
            <button
              onClick={() => {
                onRoleChange("user");
                onToggle();
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
            >
              <FiUser className="w-4 h-4 text-blue-600" />
              Make User
            </button>
          )}

          {/* Reset Password */}
          <button
            onClick={() => {
              onResetPassword();
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50 flex items-center gap-2 transition-colors"
          >
            <FiLock className="w-4 h-4 text-yellow-600" />
            Reset Password
          </button>

          <hr className="my-1" />

          {/* Delete User */}
          <button
            onClick={() => {
              onDelete();
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}
