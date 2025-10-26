"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import { FiUsers, FiShield, FiSearch, FiRefreshCw } from "react-icons/fi";
import UserStatsCard from "./components/UserStatsCard";
import UsersTable from "./components/UsersTable";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalRegularUsers: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Check admin access
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session || session.user.role !== "admin") return;

      try {
        setLoading(true);
        const response = await axios.get("/users", {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            search,
            role: roleFilter,
          },
        });

        if (response.data.success) {
          setUsers(response.data.users);
          setStats(response.data.stats);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch users",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, search, roleFilter, pagination.page, pagination.limit]);

  const handleSearch = (value) => {
    setSearch(value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  const handleRefresh = () => {
    setPagination({ ...pagination }); // Trigger re-fetch
  };

  if (status === "loading" || !session || session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage all registered users and their roles</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserStatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FiUsers className="w-6 h-6" />}
          color="blue"
          loading={loading}
        />
        <UserStatsCard
          title="Admins"
          value={stats.totalAdmins}
          icon={<FiShield className="w-6 h-6" />}
          color="green"
          loading={loading}
        />
        <UserStatsCard
          title="Regular Users"
          value={stats.totalRegularUsers}
          icon={<FiUsers className="w-6 h-6" />}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Search by name, email, or phone..." />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleRoleFilter("")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                roleFilter === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleRoleFilter("user")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                roleFilter === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => handleRoleFilter("admin")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                roleFilter === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admins
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        loading={loading}
        onRefresh={handleRefresh}
        currentUserId={session.user.id}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
