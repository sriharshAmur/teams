import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ children, setToggle }) => {
  return (
    <div className="fixed w-[100vw] h-[100vh] bg-opacity-40 bg-gray-300  top-0 left-0 grid place-items-center">
      <div className="w-[50vw] h-[50vh]  bg-white border-2 border-black rounded ">
        <div
          className="px-4 my-2  ml-auto w-fit cursor-pointer"
          onClick={() => setToggle(false)}
        >
          <FaTimes size={20} />
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
