// src/components/DrawOutlineButton.jsx
import React from "react";

const DrawOutlineButton = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className="group relative w-[150px] cursor-pointer px-4 py-2 bg-[#e2f3fcdd] font-medium rounded-md text-[#57708c] transition-colors duration-[400ms] hover:text-[#1e5588] hover:bg-[#cbe2fc]"
    >
      <span>{children}</span>

      {/* TOP */}
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#1e5588] transition-all rounded-md duration-100 group-hover:w-full" />

      {/* RIGHT */}
      <span className="absolute right-0 top-0 h-0 w-[2px] bg-[#1e5588] transition-all rounded-md delay-100 duration-100 group-hover:h-full" />

      {/* BOTTOM */}
      <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-[#1e5588] transition-all rounded-md delay-200 duration-100 group-hover:w-full" />

      {/* LEFT */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-[#1e5588] transition-all rounded-md delay-300 duration-100 group-hover:h-full" />
    </button>
  );
};

export default DrawOutlineButton;
