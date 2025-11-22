import React from "react";
import { useRef } from "react";
import { useState } from "react";

import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

import { MdAddAPhoto } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import AvatarUpload from "./AvatarUpload";
import { updateUserProfile } from "../api/userApi";
import { toast } from "react-toastify";

const ProfileSetting = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name);
  const [tag, setTag] = useState(user?.tag);
  const [avatar, setAvatar] = useState(null);
  const [socials, setSocials] = useState({
    facebook: user?.socials?.facebook || "",
    instagram: user?.socials?.instagram || "",
    personalWebsite: user?.socials?.personalWebsite || "",
    tumblr: user?.socials?.tumblr || "",
    x: user?.socials?.x || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (!name.trim()) return toast.error("Name is required.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("tag", tag);
    formData.append("socials", JSON.stringify(socials));
    if (avatar) formData.append("avatar", avatar);

    try {
      setLoading(true);
      const data = await updateUserProfile(formData);
      setUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:sticky top-0 bg-white py-2 flex items-center justify-between">
        <h1 className="flex flex-col md:flex-row md:gap-[6px] text-2xl xl:text-3xl font-bold">
          <span>Profile</span> <span>Settings</span>
        </h1>
        {loading ? (
          <button className="bg-[#F5CE35]/80 h-15 w-30 flex justify-center items-center text-sm font-semibold rounded-md text-center cursor-not-allowed">
            <Ring2
              size="30"
              stroke="3"
              strokeLength="0.25"
              bgOpacity="0.5"
              speed="0.8"
              color="white"
            />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-[#F5CE35] h-15 w-30 flex justify-center items-center flex-col md:flex-row md:gap-[6px] text-sm font-semibold rounded-md text-center cursor-pointer"
          >
            <span>SAVE</span>
            <span>CHANGES</span>
          </button>
        )}
      </div>

      <div>
        <p>
          The information on this page will be displayed on your profile, which
          is visible to other users.
        </p>
      </div>

      <div className="h-[1px] bg-[#F3F3F2]"></div>

      <div className="border-1 border-[#B3B3B2]">
        <div className="border-b-1 p-4 border-[#B3B3B2]">
          <h1 className="text-2xl">About Me</h1>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between p-4">
          <div className="md:w-[50%] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Display Name*</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-1 border-[#B3B3B2] p-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Tagline</label>
              <textarea
                name="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value || null)}
                className="border-1 h-30 border-[#B3B3B2] resize-none p-2"
              />
            </div>
          </div>
          {/* Avatar upload */}
          <AvatarUpload onFileSelect={(file) => setAvatar(file)} />
        </div>
      </div>

      <div className="border-1 border-[#B3B3B2]">
        <div className="border-b-1 p-4 border-[#B3B3B2]">
          <h1 className="text-2xl">Social Media Accounts</h1>
        </div>
        <div className="flex flex-col p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Facebook</label>
              <input
                value={socials.facebook}
                onChange={(e) =>
                  setSocials((prev) => ({
                    ...prev,
                    facebook: e.target.value,
                  }))
                }
                type="text"
                placeholder="Your facebook handle"
                className="border-1 border-[#B3B3B2] p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Instagram</label>
              <input
                type="text"
                value={socials.instagram}
                onChange={(e) =>
                  setSocials((prev) => ({
                    ...prev,
                    instagram: e.target.value,
                  }))
                }
                placeholder="Your instagram handle"
                className="border-1 border-[#B3B3B2] p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Personal Website/Blog</label>
              <input
                type="text"
                value={socials.personalWebsite}
                onChange={(e) =>
                  setSocials((prev) => ({
                    ...prev,
                    personalWebsite: e.target.value,
                  }))
                }
                placeholder="Your website"
                className="border-1 border-[#B3B3B2] p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Tumblr</label>
              <input
                type="text"
                value={socials.tumblr}
                onChange={(e) =>
                  setSocials((prev) => ({
                    ...prev,
                    tumblr: e.target.value,
                  }))
                }
                placeholder="Your tumblr handle"
                className="border-1 border-[#B3B3B2] p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">X</label>
              <input
                type="text"
                value={socials.x}
                onChange={(e) =>
                  setSocials((prev) => ({
                    ...prev,
                    x: e.target.value,
                  }))
                }
                placeholder="Your X handle"
                className="border-1 border-[#B3B3B2] p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
