import { formatDistanceToNow } from "date-fns";

import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import {
  getCounts,
  getPendingRecipes,
  getRecipeStatusCounts,
  getUserGrowth,
} from "../api/adminApi";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// const COLORS = ["#4CAF50", "#FF9800"];
const COLORS = ["#7bf1a8", "#ffef9f", "#da7073"];

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState([]);
  const [totalActiveUsers, setTotalActiveUsers] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);

  const [userGrowthData, setUserGrowthData] = useState([]);
  const [recipeStatusData, setRecipeStatusData] = useState([]);
  const [timeframe, setTimeframe] = useState("week");

  const [userGrowthRate, setUserGrowthRate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, growth } = await getUserGrowth(timeframe);
        const recipes = await getRecipeStatusCounts();
        setUserGrowthData(Array.isArray(data) ? data : []);
        setUserGrowthRate(growth);
        setRecipeStatusData(recipes?.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [timeframe]);

  useEffect(() => {
    getCount();
    fetchPendingRecipes();
  }, []);

  const getCount = async () => {
    try {
      const data = await getCounts();
      setTotalUsers(data?.totalUsers);
      setTotalRecipes(data?.totalRecipes);
      setTotalActiveUsers(data?.totalActiveUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPendingRecipes = async () => {
    try {
      const data = await getPendingRecipes();
      setPendingRecipes(data?.recipes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] px-10 py-5 flex-1">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">
            Dashboard
          </p>
          <p className="text-[#49739c] text-sm font-normal leading-normal">
            Overview of website performance and user engagement
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
          <p className="text-[#0d141c] text-base font-medium leading-normal">
            Total Users
          </p>
          <p className="text-[#0d141c] tracking-light text-2xl font-bold leading-tight">
            {totalUsers}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
          <p className="text-[#0d141c] text-base font-medium leading-normal">
            Total Recipes
          </p>
          <p className="text-[#0d141c] tracking-light text-2xl font-bold leading-tight">
            {totalRecipes}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
          <p className="text-[#0d141c] text-base font-medium leading-normal">
            Active Users
          </p>
          <p className="text-[#0d141c] tracking-light text-2xl font-bold leading-tight">
            {totalActiveUsers}
          </p>
        </div>
      </div>

      <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Website Analytics
      </h2>
      <div className="p-6 flex flex-col gap-4 xl:flex-row">
        {/* User Growth Chart */}
        <div className="flex sm:w-1/2 overflow-y-auto flex-col gap-2 rounded-lg border border-[#cedbe8] p-4 sm:p-6">
          <p className="mb-4">User Growth ({timeframe})</p>

          <div className="flex justify-between items-center">
            <select
              className="px-4 py-2 border rounded-lg bg-white text-sm"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 1 Year</option>
            </select>

            {userGrowthRate !== null && (
              <span
                className={`text-2xl font-semibold px-2 py-1 rounded ${
                  userGrowthRate > 0 ? "text-[#7bf1a8]" : "text-[#da7073]"
                }`}
              >
                {userGrowthRate > 0 ? "+" : ""}
                {userGrowthRate}%{" "}
                <span className="text-gray-500 text-sm">
                  {timeframe === "week"
                    ? "vs last week"
                    : timeframe === "month"
                    ? "vs last month"
                    : "vs last year"}
                </span>
              </span>
            )}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={Array.isArray(userGrowthData) ? userGrowthData : []}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recipe Status Pie Chart */}
        <div className="flex sm:w-1/2 overflow-y-auto flex-col gap-2 rounded-lg border border-[#cedbe8] p-4 sm:p-6">
          <p className="mb-4">Recipe Status Breakdown</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={recipeStatusData.map((item) => ({
                  name: item._id,
                  value: item.count,
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {recipeStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Pending Recipes
      </h2>
      <div className="px-4 py-3 @container">
        <div className="flex  rounded-lg border border-[#cedbe8] bg-slate-50">
          <table className="flex-1">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-120 px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                  Image
                </th>
                <th className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-240 px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                  Title
                </th>
                <th className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-360 px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                  Author
                </th>
                <th className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                  Date Created
                </th>
                <th className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                  Category
                </th>
                <th className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                  Status
                </th>
                <th className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingRecipes.slice(0, 10).map((dish) => {
                return (
                  <tr key={dish?._id} className="border-t border-t-[#cedbe8]">
                    <td className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-120 h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">
                      <img
                        src={
                          dish?.image?.url ||
                          "https://www.allrecipes.com/thmb/mdC1fz9I2f6GbxACbn8PujN2eIA=/400x264/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/46677-Joannes-super-hero-sandwich-KH-AR9505-4x3-f74620e198c2431389b0ac8bff6bc747.jpg"
                        }
                        alt={dish?.title}
                        className="w-20 h-15"
                      />
                    </td>
                    <td className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-240 h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">
                      {dish?.title}
                    </td>
                    <td className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-360 h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">
                      {dish?.author?.name}
                    </td>
                    <td className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">
                      {formatDistanceToNow(new Date(dish?.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">
                      Pasta
                    </td>
                    <td className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">
                      pending
                    </td>
                    <td className="table-fb22a6db-ba69-4c39-8337-bde12a91d0e0-column-480 h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-bold leading-normal">
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
  );
};

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded text-gray-700 font-medium hover:bg-yellow-100 transition ${
        isActive ? "bg-yellow-200" : ""
      }`
    }
  >
    {label}
  </NavLink>
);

const DashboardCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition duration-300">
    <p className="text-sm text-gray-500 font-semibold">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
