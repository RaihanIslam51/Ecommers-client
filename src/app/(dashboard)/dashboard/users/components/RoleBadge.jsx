"use client";

import { FiShield, FiUser } from "react-icons/fi";

export default function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <FiShield className="w-3 h-3" />
        Admin
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
      <FiUser className="w-3 h-3" />
      User
    </span>
  );
}
