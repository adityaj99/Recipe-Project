import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleUser, makeUserAdmin } from "../api/adminApi";
import { RoundedOneLoader } from "../components/RoundedOneLoader";

const SingleUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await getSingleUser(id);
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    try {
      setUpdating(true);
      const data = await makeUserAdmin(id);
      setUser((prev) => ({
        ...prev,
        role: data.user.role,
      }));
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setUpdating(false);
      setShowConfirm(false);
    }
  };

  const handleShowConfirm = (type) => {
    setShowConfirm(true);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="p-6">
        <RoundedOneLoader />
      </div>
    );
  if (!user) return <div className="p-6 text-red-500">User not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl border shadow-md p-6 flex flex-col sm:flex-row gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={user?.avatar?.url || "/avatar-placeholder.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border shadow-sm"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Role: </span>
              <span className="capitalize">{user.role}</span>
            </div>

            <div>
              <span className="font-medium">Recipes Submitted: </span>
              <span>{user.recipeCount || 0}</span>
            </div>
            <div>
              <span className="font-medium">Joined: </span>
              <span>
                {new Date(user.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-4">
            {/* Make Admin */}
            {user.role !== "admin" && (
              <button
                onClick={() => handleShowConfirm("admin")}
                className="px-5 py-2 rounded-md text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Make Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Make Admin
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to make this user an admin ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={updating}
                className={`px-4 py-2 text-sm rounded text-white bg-indigo-600 hover:bg-indigo-700`}
              >
                {updating ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleUserDetailsPage;
