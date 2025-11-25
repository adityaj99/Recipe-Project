import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  RiMenu2Fill,
  RiSearchLine,
  RiBookmarkLine,
  RiUser3Line,
} from "react-icons/ri";
import { LuBell } from "react-icons/lu";

import { RxCross1 } from "react-icons/rx";
import { useAuth } from "../context/AuthContext";
import { getAllCategories } from "../api/recipeApi";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../api/notificationsApi";
import { formatDistanceToNow } from "date-fns";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [openSubIndex, setOpenSubIndex] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(
        data?.notifications.filter((item) => item.isRead !== true)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const singleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.filter((item) => item?._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const AllMarkAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSubMenu = (index) => {
    setOpenSubIndex(openSubIndex === index ? null : index);
  };

  const PremenuItems = [{ name: "About Us", link: "/about" }];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 787);
    };

    // Initial check
    handleResize();

    // Add listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    const cached = JSON.parse(localStorage.getItem("categoriesCache") || "{}");

    const oneDay = 24 * 60 * 60 * 1000;
    const isCacheValid =
      cached.timestamp && Date.now() - cached.timestamp < oneDay;

    if (cached.data && isCacheValid) {
      setMenuItems(cached.data);
      return;
    }

    try {
      const data = await getAllCategories();
      const mainMenuItems = data?.map((item) => ({
        name: item.name,
        link: `/c/${item.slug}`,
        children: item?.children?.map((child) => ({
          name: child?.name,
          link: `/c/${child?.slug}`,
        })),
      }));

      localStorage.setItem(
        "categoriesCache",
        JSON.stringify({ timestamp: Date.now(), data: mainMenuItems })
      );
      setMenuItems(mainMenuItems);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex items-center z-20 justify-between px-4 lg:px-20 xl:px-40 py-4 bg-black">
      {isMobile && (
        <div onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <RxCross1 className="text-white text-xl" />
          ) : (
            <RiMenu2Fill className="text-white text-xl" />
          )}
        </div>
      )}

      <div
        onClick={() => navigate("/")}
        className="text-white text-4xl xl:text-5xl font-bold cursor-pointer handwritten"
      >
        <h1>
          Savorly
          <span className="text-yellow-400 inline-block">․</span>
        </h1>
      </div>

      {!isMobile && (
        <div className="flex gap-6">
          <div className="relative flex gap-6 lg:text-sm xl:text-[16px] font-semibold text-white uppercase">
            {menuItems.map((item, index) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  to={item.link}
                  className="hover:text-[#FFC107] cursor-pointer block transition"
                >
                  {item.name}
                </Link>

                {/* Animated Dropdown */}
                {hoveredIndex === index && item.children?.length > 0 && (
                  <div className="absolute top-full left-0 border-b-4 border-b-amber-300  w-60 bg-black py-4 text-white shadow z-20 animate-fadeInSlide">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.link}
                        className="block px-4 py-2 text-sm hover:bg-gray-700 transition"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="relative flex gap-6 lg:text-sm xl:text-[16px] font-semibold text-white uppercase">
            {PremenuItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.link}
                  className="hover:text-[#FFC107] cursor-pointer block transition"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center text-white lg:text-lg xl:text-2xl gap-2">
        <RiSearchLine
          onClick={() => navigate(`/recipe/all`)}
          className="hover:text-[#0EA5E9] cursor-pointer"
        />
        <RiBookmarkLine
          onClick={() => navigate(`/account/saved`)}
          className="hover:text-[#0EA5E9] cursor-pointer"
        />
        <RiUser3Line
          onClick={() => {
            if (user) setIsProfileOpen(!isProfileOpen);
            if (!user) navigate("/login");
            setIsNotificationsOpen(false);
          }}
          className="hover:text-[#0EA5E9] cursor-pointer"
        />
        <div className="relative cursor-pointer">
          <LuBell
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="hover:text-[#0EA5E9] cursor-pointer"
          />
          {notifications?.length > 0 && (
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400"></div>
          )}
        </div>
      </div>

      <div
        className={`absolute ${
          isProfileOpen && user ? "opacity-100" : "opacity-0 hidden"
        } w-60 flex flex-col border-b-4 border-b-amber-300 transition-all duration-100 ease-in transform items-start text-white pt-1 right-1 xl:right-20 uppercase top-20 bg-black`}
      >
        <p
          onClick={() => {
            if (!user) return;
            navigate(`/${user._id}`);
          }}
          className="w-full py-3 pl-3 pr-10 hover:bg-[#101010] cursor-pointer"
        >
          My Profile
        </p>

        <p
          onClick={() => navigate(`/account/edit-profile`)}
          className="w-full py-3 pl-3 pr-10 hover:bg-[#101010] cursor-pointer"
        >
          Settings
        </p>

        <p
          onClick={() => navigate("/recipe/add-recipe")}
          className="w-full py-3 pl-3 pr-10 hover:bg-[#101010] cursor-pointer"
        >
          Add Recipe
        </p>
        <p
          onClick={() => navigate("/account/saved")}
          className="w-full py-3 pl-3 pr-10 hover:bg-[#101010] cursor-pointer"
        >
          Saved Recipes
        </p>
        <p
          onClick={logout}
          className="w-full py-3 pl-3 pr-10 hover:bg-[#101010] cursor-pointer"
        >
          Logout
        </p>

        {user?.role === "admin" && (
          <p
            onClick={() => navigate(`/admin/dashboard`)}
            className="w-full py-3 pl-3 pr-10 text-amber-400 hover:bg-[#101010] cursor-pointer"
          >
            Admin Panel
          </p>
        )}

        <div className="p-3 text-sm">
          <p>Welcome, {user?.name}</p>
        </div>
      </div>

      <div
        className={`absolute flex z-20 flex-col gap-2 w-[90%] h-[calc(100vh-5rem)] top-20 left-0 bg-black transform transition-all duration-300 ease-in-out
    ${
      isMenuOpen
        ? "translate-x-0 opacity-100"
        : "-translate-x-full opacity-0 pointer-events-none"
    }`}
      >
        {menuItems.map((item, index) => (
          <div
            key={item.name}
            className="px-4 text-white text-xl uppercase py-2"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSubMenu(index)}
            >
              <Link to={item.link}>{item.name}</Link>
              {item.children?.length > 0 && (
                <span
                  className={`transform transition-transform duration-200 text-sm ${
                    openSubIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              )}
            </div>

            {/* Subcategories */}
            {openSubIndex === index &&
              item.children?.map((child) => (
                <Link
                  key={child.name}
                  to={child.link}
                  className="block text-sm text-gray-300 ml-4 mt-1"
                >
                  {child.name}
                </Link>
              ))}
          </div>
        ))}

        {/* Add this section for the "About Us" and "Popular" links */}
        <div className="px-4 flex flex-col gap-6 text-white text-xl uppercase py-2">
          {PremenuItems.map((item) => (
            <Link key={item.name} to={item.link}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div
        ref={notificationsRef}
        className={`absolute right-0 top-18 lg:top-20 px-1 py-2 w-full md:w-100 max-h-100
    overflow-y-auto text-sm flex flex-col gap-1 bg-black shadow-2xl
    transform transition-all duration-300 ease-in-out border-b-4 border-b-amber-300
    ${
      isNotificationsOpen
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 pointer-events-none"
    }`}
      >
        {notifications.length > 0 && (
          <p
            onClick={() => {
              AllMarkAsRead();
            }}
            className="text-white pl-1 cursor-pointer hover:underline"
          >
            mark all as read
          </p>
        )}
        {notifications.length > 0 ? (
          notifications?.map((notif) => {
            return (
              <div
                key={notif?._id}
                className="bg-amber-400 w-full flex justify-center gap-2 p-1 rounded-xl"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    notif.sender?.avatar?.url ||
                    "https://imgs.search.brave.com/LiCXWVwPMbYurSuy_XMT1pm5zcgDINmTSYRQsgKzpBo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2l0eXBuZy5jb20v/cHVibGljL3VwbG9h/ZHMvcHJldmlldy9w/cm9maWxlLXVzZXIt/cm91bmQtYmxhY2st/aWNvbi1zeW1ib2wt/aGQtcG5nLTcwMTc1/MTY5NTAzMzUxMnlj/Z3kwdWR0b2oucG5n/P3Y9MjAyNTA0MjYx/OQ"
                  }
                  alt=""
                />
                <div className="flex flex-col">
                  <p>
                    <span
                      onClick={() => navigate(`/${notif?.sender?._id}`)}
                      className="font-bold cursor-pointer hover:underline"
                    >
                      {notif?.sender?.name}
                    </span>{" "}
                    {notif?.message}{" "}
                    <span
                      onClick={() => navigate(`/recipe/${notif?.recipe?._id}`)}
                      className="font-bold cursor-pointer hover:underline"
                    >
                      {notif?.recipe?.title}
                    </span>
                  </p>
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(notif?.createdAt), {
                      addSuffix: false,
                    })}
                  </span>
                </div>
                <div>
                  <p
                    onClick={() => {
                      singleMarkAsRead(notif?._id);
                    }}
                    className="text-xs cursor-pointer hover:underline"
                  >
                    mark as read
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-20 flex items-center justify-center">
            <p className="text-white">No Notification</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
