import React from "react";

const AdminBadges = () => {
  return (
    <div className="layout-content-container flex flex-col max-w-[960px] px-10 py-5 flex-1">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight min-w-72">
          Badges
        </p>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#e7edf4] text-[#0d151c] text-sm font-medium leading-normal">
          <span className="truncate">Create Badge</span>
        </button>
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
              placeholder="Search badges"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-full placeholder:text-[#49749c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value=""
            />
          </div>
        </label>
      </div>
      <div className="px-4 py-3 @container">
        <div className="flex overflow-hidden rounded-xl border border-[#cedce8] bg-slate-50">
          <table className="flex-1">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-120 px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                  Badge Name
                </th>
                <th className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-240 px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                  Description
                </th>
                <th className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-360 px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                  Criteria
                </th>
                <th className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-416 px-4 py-3 text-left text-[#0d151c] w-14 text-sm font-medium leading-normal">
                  Image
                </th>
                <th className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-536 px-4 py-3 text-left text-[#0d151c] w-60 text-[#49749c] text-sm font-medium leading-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-t-[#cedce8]">
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-120 h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal">
                  Recipe Enthusiast
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-240 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  Awarded for creating 10 recipes.
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-360 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  10 Recipes Created
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-416 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVYb3PaWlt1DqW5l9EZ09V_jPCUDMJzDe86Mcwcnm4mmkqtwBWZUrjtlDpAadeVlCaUstYHzoBujx7wdvTWllVewh_A1LFMqDC-Ibpf7fqezpYr_3RiMiNjNO4fVaQNE0VepLZkWw-ZPtdLynhvoZQZB4aiCvpS0-2AW3lntw9-XUI2bQ1axRxUjbwlXb6m16AKqm0ym5M0cRt587-FQDipA8wkanEFPEfTXAqj_n0p9doSoXO4HXJ1shhCc8gLhHC5bl-I_HejvOT");'
                  ></div>
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-536 h-[72px] px-4 py-2 w-60 text-[#49749c] text-sm font-bold leading-normal tracking-[0.015em]">
                  Edit | Delete
                </td>
              </tr>
              <tr className="border-t border-t-[#cedce8]">
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-120 h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal">
                  Culinary Explorer
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-240 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  Awarded for trying 5 new recipes.
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-360 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  5 New Recipes Tried
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-416 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9kXeqmmTaUoe_CM_oXz902nB39R5sh4GB7PuXy-ldAX8y-MgRM0cGVoSK0ei5kVeTmCuxv3hM8GzbrGWGbBnDPxi8ohFocEEp3HEJFCmhMJNKzUQdecaRBdnents0wyY5MqB9PvHgaJnko5OUEPZHh36QZn44YWeIiXfXF4JHm0WUU8oayC2IoN2wvjSp9gB_C8GfvPnBO3cJqxw8o67nULG-dsZmrfWB3nwTmZgq9jh-NSWgUgepGhPa66YGP5QmoeC9wlx6JALu");'
                  ></div>
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-536 h-[72px] px-4 py-2 w-60 text-[#49749c] text-sm font-bold leading-normal tracking-[0.015em]">
                  Edit | Delete
                </td>
              </tr>
              <tr className="border-t border-t-[#cedce8]">
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-120 h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal">
                  Master Chef
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-240 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  Awarded for receiving 100 likes on recipes.
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-360 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  100 Likes Received
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-416 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBIZxr577sGZUpWupjAjTgzQpH-ZYaTo9Dcz7KMXzIPCfH6ajqRlyjwZV194IFwvWlBldQMfF3a0eC2zOzVuYLwiBif0EVReWnZzSOgtOToVuIOFILPwlMpbts9ahK0AP_7O1PAuLk8MH--CNq1jwVc87F_dGINmzWzS3Hvo1Tit-LYr6pv9MFJLJlOtZnqFj-ztYVyANnyM4w1GT7hmxk7seOq1EcMbuWM2XniZvNe5SOwWHtYmg-YWf4W3ydbHQHHyf9RK4bL9bS6");'
                  ></div>
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-536 h-[72px] px-4 py-2 w-60 text-[#49749c] text-sm font-bold leading-normal tracking-[0.015em]">
                  Edit | Delete
                </td>
              </tr>
              <tr className="border-t border-t-[#cedce8]">
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-120 h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal">
                  Community Contributor
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-240 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  Awarded for leaving 50 comments.
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-360 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  50 Comments Left
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-416 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_KzFIyd1M2YZb-z0DWD7bW5bUHQCiyz-28c56yh8z8qDC9VwRPaYq9LJlnV_3x-rf8sRHWiQikUQILWElS-NUg4jm75j5E83Omx3Ld8S_lOQikufSMU4rPEuGssCCrUO_DxAkYPqbeEVjjq76YsdbfQkDfssetPuHqyLsDjQbGvyzRJj4L0xQVmh3q9lHBIRY_glybDlU3Cr2iiOr4yyuLOjHqUfCR0Wqy-1SNqz4BrfYuuAggGAQ7XEp6qICfVrz88HFSJgUDSgW");'
                  ></div>
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-536 h-[72px] px-4 py-2 w-60 text-[#49749c] text-sm font-bold leading-normal tracking-[0.015em]">
                  Edit | Delete
                </td>
              </tr>
              <tr className="border-t border-t-[#cedce8]">
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-120 h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal">
                  Rising Star
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-240 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  Awarded for having a recipe featured.
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-360 h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                  Recipe Featured
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-416 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZSaf-fbE58L61htZ07xUdkLUugypz29y7lcwnhrPZRncebNzsK7boJMiH2RvwFt8GRxzFnr5IB3YRuSBJwLSUF_utLHv8XD-V1Hso5VvNFPHHrHX5Q5ZrxreQIUAYcfVt08wmWGBzK1MQWwLjEULyeRxRL2Rx_ID2gncbtIEuwrWZ2-Olr-fKKbfsKAULniVWHp-BlbyqFvvX-XX05B7tdLLnpRvBlwzSUXngivpA0d2QPzELZjLJ8eQ_2kWXzEBi6tPGcD9v8fPM");'
                  ></div>
                </td>
                <td className="table-59ab5545-40c9-4a45-afd1-2d7361d1d94f-column-536 h-[72px] px-4 py-2 w-60 text-[#49749c] text-sm font-bold leading-normal tracking-[0.015em]">
                  Edit | Delete
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBadges;
