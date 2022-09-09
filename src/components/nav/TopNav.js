import React, { useContext, useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, signOutUser } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import UserContext from "../../context/user/UserContext";
import { BiLogOut } from "react-icons/bi";
import ProfileImage from "../ProfileImage";

const TopNav = () => {
  const [user] = useAuthState(auth);
  const userContext = useContext(UserContext);
  const { name, email, clearUser } = userContext;
  let location = useLocation();
  const page = location.pathname.split("/")[1];
  let navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const ref = useRef();
  const signOut = () => {
    clearUser();
    setToggle(false);

    const res = signOutUser();
    if (res) {
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (toggle && ref.current && !ref.current.contains(e.target)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [toggle]);

  return (
    <div className="px-2 min-h-[6vh] max-h-[6vh]  w-full  flex justify-between items-center border-b-2 bg-blue-600">
      <div className="text-white flex  items-center">
        <img src="/images/teams.svg" alt="Teams Logo" className="w-8" />
        Teams
      </div>
      {user && (
        <div className="w-5/12 flex items-center  rounded">
          <input
            className="flex-1 w-full px-3 py-1 text-sm outline-none"
            placeholder="Search"
          />
          <div className="px-2 self-stretch  cursor-pointer bg-white ">
            <SearchIcon />
          </div>
        </div>
      )}
      <div className="">
        {user ? (
          <div className="mx-4  relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setToggle((tog) => !tog)}
            >
              <ProfileImage size={"s"} value={name} />

              <div className="text-white ml-2">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </div>
            </div>
            {toggle && (
              <div
                ref={ref}
                className="absolute top-14 border-2 right-0 z-10 bg-white"
              >
                <div className="flex items-center border-b-2 border-gray-300 p-4">
                  <ProfileImage size={"m"} value={name} />

                  <div className=" ml-2">
                    <div>{name.charAt(0).toUpperCase() + name.slice(1)}</div>
                    <div className="text-gray-600 text-sm">{email}</div>
                  </div>
                </div>
                <div
                  className="flex items-center  px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <BiLogOut size={20} />
                  <div className="ml-2">Sign Out</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          page !== "auth" && (
            <Link to="/auth/login">
              <div className="border-2 py-1 px-4 text-white hover:bg-white hover:text-blue-500 cursor-pointer">
                Login
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default TopNav;
