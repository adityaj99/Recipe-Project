import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import { getRecipes } from "../api/adminApi";
import { data, useNavigate } from "react-router-dom";

const AdminRecipes = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("approved");
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, [status]);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes(status);
      setRecipes(data?.recipes);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredRecipes = recipes.filter((item) =>
    item.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 px-10 py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Recipes
          </p>
        </div>
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div
                className="text-[#49749c] flex border-none bg-[#e7edf4] items-center justify-center pl-4 rounded-l-xl border-r-0"
                data-icon="MagnifyingGlass"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Search recipes"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-full placeholder:text-[#49749c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* recipe filter */}
        <div className="w-full sm:w-1/3">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-[#0d151c] mb-1"
          >
            Filter by Approval Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-[#cedce8] rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#49749c]"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="px-4 py-3 @container">
          {filteredRecipes.length > 0 ? (
            <div className="flex overflow-hidden rounded-xl border border-[#cedce8] bg-slate-50">
              <table className="flex-1">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-56 px-4 py-3 text-left text-[#0d151c] w-14 text-sm font-medium leading-normal">
                      Image
                    </th>
                    <th className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-176 px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                      Title
                    </th>
                    <th className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-296 px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                      Author
                    </th>
                    <th className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-416 px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                      Date Created
                    </th>
                    <th className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-536 px-4 py-3 text-left text-[#0d151c] w-60 text-sm font-medium leading-normal">
                      Category
                    </th>
                    <th className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-656 px-4 py-3 text-left text-[#0d151c] w-60 text-sm font-medium leading-normal">
                      Status
                    </th>
                    <th className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-776 px-4 py-3 text-left text-[#0d151c] w-60 text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecipes?.map((dish) => {
                    return (
                      <tr
                        key={dish?._id}
                        className="border-t border-t-[#cedce8]"
                      >
                        <td className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-56 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10">
                            <img src={dish?.image?.url} alt="" />
                          </div>
                        </td>
                        <td className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-176 h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal">
                          {dish?.title}
                        </td>
                        <td className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-296 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                          {dish?.author.name}
                        </td>
                        <td className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-416 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                          {format(new Date(dish?.createdAt), "yyyy-MM-dd")}
                        </td>
                        <td className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-536 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#e7edf4] text-[#0d151c] text-sm font-medium leading-normal w-full">
                            <span className="truncate">Pasta</span>
                          </button>
                        </td>
                        <td className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-656 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#e7edf4] text-[#0d151c] text-sm font-medium leading-normal w-full">
                            <span className="truncate">Published</span>
                          </button>
                        </td>
                        <td
                          onClick={() => navigate(`/admin/recipe/${dish?._id}`)}
                          className="table-3775ad56-80fa-4cee-8723-4936a3d9eabd-column-776 h-[72px] px-4 py-2 w-60 text-[#49749c] text-sm font-bold leading-normal tracking-[0.015em] cursor-pointer"
                        >
                          View
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No recipes</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRecipes;
