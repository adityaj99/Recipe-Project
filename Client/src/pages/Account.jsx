import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { FaUser } from "react-icons/fa";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getUserById } from "../api/userApi";

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-[#F2F3F3] min-h-screen">
      <Navbar />
      {/* Sidebar */}
      <div className="flex min-h-screen flex-col lg:flex-row gap-4 px-1 md:px-4 mt-10 lg:px-40">
        <aside className="lg:sticky top-0 w-full xl:w-70 h-fit flex flex-col gap-6 bg-white py-4 px-4 shadow-sm">
          <div className="flex w-fit gap-2">
            <div className="bg-[#F5CE35] w-fit h-fit p-2 rounded-sm">
              <FaUser size={30} className="text-white" />
            </div>
            <div className="flex flex-col flex-wrap gap-2">
              <h1 className="text-sm text-wrap">Hi, {user?.name}</h1>
              <button
                onClick={() => navigate(`/${user._id}`)}
                className="border-1 text-sm font-semibold border-[#F5CE35] rounded-sm w-fit py-2 px-6 cursor-pointer hover:bg-[#F5CE35] hover:text-white transition-all duration-200 ease-in-out"
              >
                View Profile
              </button>
            </div>
          </div>
          <ul className="space-y-4">
            <li className="py-2">
              <NavLink
                to="edit-profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-600 border-yellow-600 font-semibold "
                    : "text-gray-800"
                }
              >
                Profile Settings
              </NavLink>
            </li>
            <li className="py-2">
              <NavLink
                to="saved"
                className={({ isActive }) =>
                  isActive ? "text-yellow-600 font-semibold" : "text-gray-800"
                }
              >
                Saved Recipies
              </NavLink>
            </li>
            <li className="py-2">
              <NavLink
                to="my-recipies"
                className={({ isActive }) =>
                  isActive ? "text-yellow-600 font-semibold" : "text-gray-800"
                }
              >
                Personal Recipies
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-10 bg-white shadow-sm mb-10">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
