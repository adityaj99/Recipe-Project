import { MdAddAPhoto } from "react-icons/md";
import { useRef } from "react";
import { useState } from "react";

const AvatarUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="md:w-[40%] flex mt-8 p-8 flex-col gap-3 bg-[#F2F3F3] items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {avatarPreview ? (
        <img
          src={avatarPreview}
          alt="Avatar Preview"
          className="object-cover"
        />
      ) : (
        <div>
          <div className="flex items-center justify-center py-2 border-3 border-[#F5CE35] rounded-full">
            <MdAddAPhoto className="text-[#F5CE35]" size={40} />
          </div>
          <p>Take a photo</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AvatarUpload;
