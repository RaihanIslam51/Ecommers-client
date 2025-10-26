"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import { FiMoreVertical, FiShield, FiUser, FiTrash2 } from "react-icons/fi";
import RoleBadge from "./RoleBadge";
import UserActionsDropdown from "./UserActionsDropdown";

export default function UserRow({ user, onRefresh, isCurrentUser }) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRoleChange = async (newRole) => {
    const result = await Swal.fire({
      title: "Change User Role?",
      text: `Change ${user.name}'s role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.put(`/users/${user._id}/role`, {
        role: newRole,
        adminId: session.user.id,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Role Updated",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        onRefresh();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update role",
      });
    }
    setIsDropdownOpen(false);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`/users/${user._id}`, {
        data: { adminId: session.user.id },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "User Deleted",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete user",
      });
    }
    setIsDropdownOpen(false);
  };

  const handleViewDetails = () => {
    Swal.fire({
      title: `${user.name}'s Details`,
      html: `
        <div class="text-left space-y-3">
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Name</p>
            <p class="text-gray-900">${user.name || "N/A"}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Email</p>
            <p class="text-gray-900">${user.email || "N/A"}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Phone</p>
            <p class="text-gray-900">${user.phone || "No phone"}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Role</p>
            <p class="text-gray-900 capitalize">${user.role || "user"}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Address</p>
            <p class="text-gray-900">${user.address || "No address"}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Joined Date</p>
            <p class="text-gray-900">${new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</p>
          </div>
          ${user.updatedAt ? `
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Last Updated</p>
            <p class="text-gray-900">${new Date(user.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</p>
          </div>
          ` : ''}
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
      width: "500px"
    });
  };

  const handleEdit = async () => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${user.name}'s Profile`,
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="edit-name" class="swal2-input w-full" value="${user.name || ''}" placeholder="Name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input id="edit-phone" class="swal2-input w-full" value="${user.phone || ''}" placeholder="Phone">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea id="edit-address" class="swal2-input w-full" placeholder="Address" rows="2">${user.address || ''}</textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return {
          name: document.getElementById('edit-name').value,
          phone: document.getElementById('edit-phone').value,
          address: document.getElementById('edit-address').value
        };
      }
    });

    if (formValues) {
      try {
        const response = await axios.put(`/auth/profile/${user._id}`, formValues);
        
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "User profile has been updated successfully",
            timer: 2000,
            showConfirmButton: false,
          });
          onRefresh();
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update profile",
        });
      }
    }
  };

  const handleSendMessage = async () => {
    const { value: message } = await Swal.fire({
      title: `Send Message to ${user.name}`,
      html: `
        <div class="text-left">
          <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea 
            id="message-text" 
            class="swal2-textarea w-full" 
            placeholder="Type your message here..."
            rows="5"
          ></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Send Message",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const messageText = document.getElementById('message-text').value;
        if (!messageText) {
          Swal.showValidationMessage('Please enter a message');
        }
        return messageText;
      }
    });

    if (message) {
      try {
        const response = await axios.post('/messages', {
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          subject: "Message from Admin",
          message: message,
          type: "admin",
          priority: "normal"
        });

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Message Sent",
            text: "Your message has been sent successfully",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to send message",
        });
      }
    }
  };

  const handleResetPassword = async () => {
    const result = await Swal.fire({
      title: "Reset Password?",
      html: `
        <p>Are you sure you want to reset password for <strong>${user.name}</strong>?</p>
        <p class="text-sm text-gray-600 mt-2">A temporary password will be generated and sent to their email.</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F59E0B",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, reset password",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // Generate random password
        const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
        
        const response = await axios.post(`/auth/reset-password`, {
          userId: user._id,
          email: user.email,
          tempPassword: tempPassword,
          adminId: session.user.id
        });

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Password Reset",
            html: `
              <p>Password has been reset successfully!</p>
              <div class="bg-gray-50 p-3 rounded-lg mt-3">
                <p class="text-sm text-gray-600 font-medium mb-1">Temporary Password:</p>
                <p class="text-lg font-mono font-bold text-blue-600">${tempPassword}</p>
                <p class="text-xs text-gray-500 mt-2">Please share this with the user securely.</p>
              </div>
            `,
            confirmButtonText: "Close"
          });
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to reset password",
        });
      }
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.name || "N/A"}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-blue-600 font-semibold">(You)</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email || "N/A"}</div>
        <div className="text-sm text-gray-500">{user.phone || "No phone"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isCurrentUser ? (
          <span className="text-gray-400">No actions</span>
        ) : (
          <UserActionsDropdown
            user={user}
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onSendMessage={handleSendMessage}
            onResetPassword={handleResetPassword}
          />
        )}
      </td>
    </tr>
  );
}
