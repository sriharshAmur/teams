import React, { useEffect, useState } from "react";

const ProfileImage = ({ value, size }) => {
  const [dimension, setDimension] = useState("");
  const [textSize, setTextSize] = useState("");

  useEffect(() => {
    let dim = null;
    let text = null;
    switch (size) {
      case "l":
        dim = "w-20 h-20";
        text = "text-2xl";
        break;
      case "m":
        dim = "w-11 h-11";
        text = "text-xl";
        break;
      case "s":
        dim = "w-9 h-9";
        text = "text-lg";
        break;
      case "xs":
        dim = "w-7 h-7";
        text = "text-base  p-1";
        break;
      default:
        dim = "w-9 h-9";
        text = "text-xl";
    }

    setDimension(dim);
    setTextSize(text);
  }, [value, size]);

  return (
    <div
      className={`${dimension} ${textSize} text-white flex items-center justify-center bg-gray-700 rounded `}
    >
      {value && value?.match(/\b(\w)/g).join("")}
    </div>
  );
};

export default ProfileImage;
