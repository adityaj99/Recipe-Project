import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

export const RoundedOneLoader = () => {
  return (
    <div className="flex justify-center items-center h-fit">
      <Tailspin size="25" stroke="3" speed="0.9" color="white" />
    </div>
  );
};
