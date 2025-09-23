import { FaArrowUp } from "react-icons/fa6";

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-black py-10 px-40 flex flex-col">
      <div
        onClick={handleBackToTop}
        className=" flex text-white text-sm uppercase items-center gap-1 cursor-pointer hover:text-[#F5CE35]"
      >
        <FaArrowUp />
        <p>Back to top</p>
      </div>
    </div>
  );
};

export default Footer;
