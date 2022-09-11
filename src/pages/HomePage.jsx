import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineTeam } from "react-icons/ai";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { IoChatbubblesOutline, IoQrCode } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const HomePage = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <div className="bg-blue-300 h-full ">
      <div className="w-9/12 mx-auto ">
        <div className="mt-8 border-2 bg-white p-4 rounded-xl drop-shadow-xl">
          <div className="mb-4 flex items-center mx-auto w-fit">
            <img
              src="/images/teams.svg"
              alt="Teams Logo"
              className="w-10 mr-2"
            />
            <div className="text-4xl font-semibold text-blue-700 font-segoeui">
              Microsoft Teams Clone
            </div>
          </div>
          <div className="flex justify-between items-stretch">
            <div className="flex-1">
              <div className="mb-8">
                <div className=" text-lg mb-2 font-semibold">Featuring</div>
                <div className="ml-4 flex flex-col items-stretch w-fit">
                  <div className="my-1 bg-blue-400 py-2 px-4 rounded text-white flex items-center ">
                    <div className="mr-2">
                      <AiOutlineTeam size={20} />
                    </div>
                    <div>Teams and Channels</div>
                  </div>
                  <div className="my-1 bg-blue-400 py-2 px-4 rounded text-white flex items-center">
                    <div className="mr-2">
                      <IoChatbubblesOutline size={20} />
                    </div>
                    <div>Live Chat</div>
                  </div>
                  <div className="my-1 bg-blue-400 py-2 px-4 rounded text-white flex items-center">
                    <div className="mr-2">
                      <IoQrCode size={20} />
                    </div>
                    <div>Join Team with a Code</div>
                  </div>
                  <div className="my-1 bg-blue-400 py-2 px-4 rounded text-white flex items-center">
                    <div className="mr-2">
                      <MdManageAccounts size={20} />
                    </div>
                    <div>Team Management</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-lg mb-2 font-semibold">
                  Technologies Used
                </div>
                <div className="ml-4  flex flex-col items-stretch w-fit">
                  <div className="flex items-center my-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 py-2 rounded px-4">
                    <img
                      src="/images/react.png"
                      alt="Teams Logo"
                      className="w-8 mr-2"
                    />
                    <div className="font-segoeui text-lg">React</div>
                  </div>
                  <div className="flex items-center my-2 text-white bg-gradient-to-r from-yellow-700  to-yellow-400  py-2 rounded px-4">
                    <img
                      src="/images/firebase.svg"
                      alt="Teams Logo"
                      className="w-8 mr-2"
                    />
                    <div className="font-segoeui text-lg">Firebase</div>
                  </div>
                  <div className="flex items-center my-2 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500  py-2 rounded px-4">
                    <img
                      src="/images/tailwind.png"
                      alt="Teams Logo"
                      className="w-8 mr-2"
                    />
                    <div className="font-segoeui text-lg">Tailwind</div>
                  </div>
                  <div className="flex items-center my-2  text-white bg-gradient-to-r from-pink-500 to-red-500   py-2 rounded px-4">
                    <img
                      src="/images/react-router.png"
                      alt="Teams Logo"
                      className="w-8 mr-2"
                    />
                    <div className="font-segoeui text-lg">React Router</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="">
                  <img src="/images/teams-display.jpg" alt="Teams Display" />
                </div>
                <div className="mx-auto">
                  {user ? (
                    <div className="flex items-center">
                      <Link to="/teams">
                        <div className="cursor-pointer bg-blue-600 text-white text-lg font-segoe py-2 px-4 mx-4">
                          View Teams
                        </div>
                      </Link>
                      <Link to="/chats">
                        <div className="cursor-pointer bg-blue-600 text-white text-lg font-segoe py-2 px-4 mx-4">
                          View Chats
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Link to="/auth/login">
                        <div className="cursor-pointer bg-blue-600 text-white text-lg font-segoe py-2 px-4 mx-4">
                          Signin to Teams
                        </div>
                      </Link>
                      <Link to="/auth/register">
                        <div className="cursor-pointer bg-blue-600 text-white text-lg font-segoe py-2 px-4 mx-4">
                          Signup to Teams
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-col items-center">
                <div className="text-lg ">Made By Sriharsh Amur</div>
                <div className="flex items-center mt-2">
                  <div className="mx-2">
                    <a
                      href="https://github.com/sriharshAmur"
                      alt="Github"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <BsGithub size={25} />
                    </a>
                  </div>
                  <div className="mx-2">
                    <a
                      href="https://www.linkedin.com/in/sriharsh-amur/"
                      alt="LinkedIn"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <BsLinkedin size={25} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
