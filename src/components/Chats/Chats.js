import React, { useContext } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import RateReviewIcon from "@mui/icons-material/RateReviewOutlined";
import { Link, useMatch, useParams } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import ChatContext from "../../context/chat/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import ProfileImage from "../ProfileImage";

const Chats = () => {
  const match = useMatch({ path: "/chats/:chatId/", end: false });
  const matchChatId = match?.params?.chatId;
  const chatId = matchChatId === "new" ? null : matchChatId;
  const userContext = useContext(UserContext);
  const { uid, chats } = userContext;

  return (
    <div className="w-2/6 max-w-sm h-full pt-4 bg-gray-100 ">
      <div className=" border-b-2 border-gray-300 pb-4">
        <div className="px-4 flex w-full justify-between items-center">
          <div className="font-bold text-xl">Chat</div>
          <div className="flex justify-between items-center w-12  ">
            <div className="cursor-pointer">
              <FilterListIcon fontSize="small" />
            </div>
            <Link to="/chats/new">
              <div className="cursor-pointer" title="Make a new Chat">
                <RateReviewIcon fontSize="small" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 ">
        {chats.length === 0 && (
          <div className={` my-2  flex flex-col items-center justify-between `}>
            <div className=" px-4 py-2 text-sm bg-gray-100 ">
              No Chats found. Start by adding a Chat
            </div>
            <Link to="/chats/new">
              <button className="flex bg-gray-800 text-white hover:text-black hover:bg-gray-50  mt-4 items-center w-fit px-4 py-2 border-2 ">
                <RateReviewIcon fontSize="small" />

                <div className="ml-2">Add a Chat</div>
              </button>
            </Link>
          </div>
        )}
        {chats.map((chat) => {
          let active = false;
          if (chat.id === chatId) active = true;
          return (
            <Link to={`/chats/${chat.id}`} key={chat.id}>
              <div
                id={chat.id}
                className={`px-4 py-2 my-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                  active ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center">
                  <ProfileImage size={"m"} value={chat.name} />
                  <div className="ml-2 text-sm">{chat.name}</div>
                </div>
                <div className="text-xs text-gray-600">{chat.date}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Chats;
