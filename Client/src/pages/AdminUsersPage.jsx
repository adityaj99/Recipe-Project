import React, { useEffect, useState } from "react";
import { getAllUsers } from "../api/adminApi";
import { useNavigate } from "react-router-dom";
import { RoundedOneLoader } from "../components/RoundedOneLoader";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    const filters = {
      ...(query && { query }),
      ...(role && { role }),
      ...(status && { status }),
    };
    try {
      const data = await getAllUsers(filters);
      setUsers(data?.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    getUsers();
  };

  if (loading)
    return (
      <div className="pt-10">
        <RoundedOneLoader />
      </div>
    );
  if (!users) return <div className="p-6 text-red-500">Users not found.</div>;

  return (
    <div className="flex flex-1 px-10 py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Users
          </p>
        </div>
        <div className="px-4 py-3 @container">
          {/* filter section */}
          <div className="w-full flex justify-end py-4">
            <div className="flex sm:w-1/2 flex-col justify-end  sm:flex-row sm:items-end gap-4">
              {/* Role Filter */}
              <div className="w-full sm:w-1/3">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-[#0d151c] mb-1"
                >
                  Filter by Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-[#cedce8] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#49749c]"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">Customer</option>
                </select>
              </div>

              {/* Filter Button */}
              <div className="w-full sm:w-auto">
                <button
                  onClick={handleApplyFilters}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#49749c] text-white rounded-lg text-sm font-medium hover:bg-[#3b5f77]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex overflow-hidden rounded-xl border border-[#d4dce2] bg-gray-50">
            <table className="flex-1">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-120 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">
                    User
                  </th>
                  <th className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-240 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">
                    Email
                  </th>
                  <th className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-360 px-4 py-3 text-left text-[#101518] w-60 text-sm font-medium leading-normal">
                    Role
                  </th>
                  <th className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-600 px-4 py-3 text-left text-[#101518] w-60 text-sm font-medium leading-normal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => {
                  return (
                    <tr key={user?._id} className="border-t border-t-[#d4dce2]">
                      <td className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101518] text-sm font-normal leading-normal">
                        {user?.name}
                      </td>
                      <td className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c748a] text-sm font-normal leading-normal">
                        {user?.email}
                      </td>
                      <td className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#eaedf1] text-[#101518] text-sm font-medium leading-normal w-full">
                          <span className="truncate">{user?.role}</span>
                        </button>
                      </td>
                      <td
                        onClick={() => navigate(`/admin/user/${user?._id}`)}
                        className="table-178389c1-b862-445e-a508-6eb8ecb3e54c-column-600 h-[72px] px-4 py-2 w-60 text-[#5c748a] text-sm font-bold leading-normal tracking-[0.015em] cursor-pointer"
                      >
                        View
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
