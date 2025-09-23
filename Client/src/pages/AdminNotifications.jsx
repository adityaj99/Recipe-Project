import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../api/notificationsApi";
import { formatDistanceToNow } from "date-fns";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotificationsAdmin();
  }, []);

  const getNotificationsAdmin = async () => {
    try {
      const data = await getNotifications();
      setNotifications(
        data?.notifications.filter((notif) => notif?.isRead !== true)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAsReadSingleNorification = async (id) => {
    try {
      const data = await markAsRead(id);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-1 px-10 py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Notifications
          </p>
        </div>
        {notifications.length > 0 && (
          <p className="text- flex justify-end text-[#2c3741] my-2 cursor-pointer hover:underline capitalize text-sm font-bold">
            mark all as read
          </p>
        )}
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            return (
              <div
                key={notif?._id}
                className="flex gap-4 bg-gray-50 px-4 py-3 justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="text-[#101518] flex items-center justify-center rounded-lg bg-[#eaedf1] shrink-0 size-12"
                    data-icon="User"
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
                      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-[#101518] text-base font-medium leading-normal">
                      {notif?.message}
                    </p>
                    <p className="text-[#5c748a] text-sm font-normal leading-normal">
                      {notif?.type === "recipeSubmitted" && "recipe submition"}
                    </p>
                    <p className="text-[#5c748a] text-sm font-normal leading-normal">
                      User {notif?.sender?.name} Submitted recipe for approval.
                    </p>
                    <p
                      onClick={() => markAsReadSingleNorification(notif?._id)}
                      className="text-[#2c3741] text-sm cursor-pointer hover:underline"
                    >
                      mark as read
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-[#5c748a] text-sm font-normal leading-normal">
                    {formatDistanceToNow(new Date(notif?.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex">
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
