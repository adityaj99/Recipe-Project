import { useNavigate } from "react-router-dom";

const NoPageFound = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen h-screen flex flex-col items-center justify-center bg-[#F5CE35]">
      <h1 className="text-5xl lg:text-9xl font-semibold pb-5">404</h1>
      <h1 className="text-4xl lg:text-6xl font-semibold pb-5">No Page Found</h1>
      <p className="text-sm lg:text-xl">This page is not available.</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-white px-3 py-1 mt-2 text-sm rounded uppercase cursor-pointer"
      >
        Go Back
      </button>
    </div>
  );
};

export default NoPageFound;
