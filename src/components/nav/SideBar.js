import React, { useState, useEffect, useContext } from "react";
import { FaBell } from "react-icons/fa";
import { BsFillChatTextFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { IoCall } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { auth, signOutUser } from "../../firebase";
import UserContext from "../../context/user/UserContext";

const IMAGE_SIZE = 20;
const navItems = [
  {
    icon: <FaBell size={IMAGE_SIZE} />,
    name: "Activities",
    link: "activities",
  },
  {
    icon: <BsFillChatTextFill size={IMAGE_SIZE} />,
    name: "Chats",
    link: "chats",
  },
  {
    icon: <RiTeamFill size={IMAGE_SIZE} />,
    name: "Teams",
    link: "teams",
  },
  {
    icon: <IoCall size={IMAGE_SIZE} />,
    name: "Calls",
    link: "calls",
  },
  //   {
  //     icon: <BiLogOut size={IMAGE_SIZE} />,
  //     name: "Sign out",
  //     link: "",
  //   },
];

const SideBar = () => {
  const userContext = useContext(UserContext);
  const { clearUser } = userContext;
  let params = useParams();
  let location = useLocation();
  let navigate = useNavigate();

  let pathname = location.pathname;

  const signOut = () => {
    clearUser();
    const res = signOutUser();
    if (res) {
      navigate("/auth/login");
    }
  };

  return (
    <div className="w-20 border-r-2 bg-gray-300 py-2 h-full  flex flex-col justify-between items-center ">
      <div className="flex flex-col w-full ">
        {navItems.map((nav) => {
          let active = false;
          if (nav.link === pathname.split("/")[1]) {
            active = true;
          }
          return (
            <Link key={nav.link} to={nav.link}>
              <div
                className={`flex flex-col items-center w-full px-2 py-2 cursor-pointer hover:bg-gray-100 ${
                  active ? "border-l-4 border-blue-700 bg-blue-200" : ""
                }`}
              >
                {nav.icon}
                <div className="text-xs ">{nav.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
      <div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => signOut()}
        >
          <BiLogOut size={IMAGE_SIZE} />
          <div className="text-xs ">Sign Out</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
