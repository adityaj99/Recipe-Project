import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { HiMenu } from "react-icons/hi";
import { MdOutlineDashboardCustomize, MdOutlineCategory } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiCookingPot, PiMedal } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { BsCollection } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

import { getNotifications } from "../api/notificationsApi";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotiAvailable, setIsNotiAvailable] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    isNotification();
  }, [isNotiAvailable]);

  const isNotification = async () => {
    try {
      const data = await getNotifications();
      const hasUnread = data.notifications.some(
        (noti) => noti.isRead === false
      );
      setIsNotiAvailable(hasUnread);
    } catch (error) {
      console.error(error);
    }
  };

  const isActive = (path) =>
    pathname.includes(path) ? "bg-[#e7edf4]" : "hover:bg-gray-100";

  return (
    <div className="min-h-screen overflow-x-hidden flex bg-slate-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 h-screen w-80 bg-white shadow-md transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <p
          onClick={() => setSidebarOpen(false)}
          className="absolute md:hidden right-0 p-4 text-xl cursor-pointer hover:scale-95"
        >
          <RxCross2 />
        </p>
        <div className="flex flex-col justify-between h-full p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h1 className="text-[#0d141c] text-base font-medium">
                Recipe Admin
              </h1>
              <p className="text-[#49739c] text-sm">Manage your website</p>
            </div>

            <div className="flex flex-col gap-2">
              <SidebarItem
                label="Dashboard"
                icon="House"
                path="/admin/dashboard"
                isActive={isActive("dashboard")}
                onClick={() => navigate("/admin/dashboard")}
              />
              <SidebarItem
                label="Users"
                icon="Users"
                path="/admin/users"
                isActive={isActive("users")}
                onClick={() => navigate("/admin/users")}
              />
              <SidebarItem
                label="Recipes"
                icon="CookingPot"
                path="/admin/recipes"
                isActive={isActive("recipes")}
                onClick={() => navigate("/admin/recipes")}
              />
              <SidebarItem
                label="Category"
                icon="Category"
                path="/admin/category"
                isActive={isActive("category")}
                onClick={() => navigate("/admin/category")}
              />

              <SidebarItem
                label="Collections"
                icon="Collections"
                path="/admin/collections"
                isActive={isActive("collections")}
                onClick={() => navigate("/admin/collections")}
              />

              <div className="relative">
                {isNotiAvailable && (
                  <div className="absolute top-2 left-6 h-[6px] w-[6px] bg-amber-400 rounded-full"></div>
                )}
                <SidebarItem
                  label="Notifications"
                  icon="Bell"
                  path="/admin/notifications"
                  isActive={isActive("notifications")}
                  onClick={() => navigate("/admin/notifications")}
                />
              </div>
            </div>
          </div>

          <div className="self-end mb-10">
            <p
              onClick={() => navigate("/")}
              className="uppercase cursor-pointer hover:text-black/60 hover:underline"
            >
              View Site
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen md:ml-80 w-full">
        {/* Topbar on mobile */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
          <h1 className="text-lg font-semibold text-[#0d141c]">Recipe Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl text-[#0d141c]"
          >
            <HiMenu />
          </button>
        </div>

        {/* Page Content */}
        <div className="px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ label, icon, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${isActive}`}
      onClick={onClick}
    >
      <SidebarIcon icon={icon} />
      <p className="text-[#0d141c] text-sm font-medium">{label}</p>
    </div>
  );
};

const SidebarIcon = ({ icon }) => {
  const icons = {
    House: <MdOutlineDashboardCustomize />,
    Users: <LuUsers />,
    CookingPot: <PiCookingPot />,
    Category: <MdOutlineCategory />,
    Collections: <BsCollection />,
    Bell: <IoMdNotificationsOutline />,
  };
  return <div className="text-[#0d141c]">{icons[icon]}</div>;
};

export default AdminLayout;
