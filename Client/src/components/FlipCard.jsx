import "../card.css";
import SilverBadge from "../../public/SilverBadge.png";
import GoldBadge from "../../public/GoldBadge.png";

const FlipCard = ({ name, awardedAt }) => {
  const silverQuote =
    "“Small steps every day lead to big achievements. Your consistency is your power.”";
  const goldQuote =
    "“Excellence is not a skill, it’s an attitude. You’ve proven that with your dedication.”";

  return (
    <div className="w-[190px] h-[160px] [perspective:1000px] group">
      <div className="relative w-full h-full text-center transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180 cursor-pointer">
        {/* Front Side */}
        <div className="absolute w-full h-full rounded-xl text-white shadow-lg border border-white/80 flex flex-col justify-evenly items-center bg-gradient-to-tr from-[#4158D0] via-[#C850C0] to-[#FFCC70] backface-hidden">
          <div className="before-blur-glow" />
          <img
            className="h-25"
            src={name === "Silver Badge" ? SilverBadge : GoldBadge}
            alt=""
          />
          <div>
            <p className="uppercase tracking-widest text-xl">{name}</p>
            <p>{awardedAt}</p>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full rounded-xl text-white shadow-lg border border-white/80 flex flex-col justify-evenly items-center bg-gradient-to-br from-[#0093E9] to-[#80D0C7] rotate-y-180 backface-hidden">
          <div className="before-blur-glow" />
          <p className=" !font-serif p-3 text-sm">
            {name === "Silver Badge" ? silverQuote : goldQuote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
