import React, { useContext, useRef, useState } from "react";
import { FaSquare } from "react-icons/fa";
import useEmojis from "../../hooks/useEmojis";
import ReplyIcon from "@mui/icons-material/Reply";
import ChatReply from "./reply/ChatReply";
import UserContext from "../../context/user/UserContext";
import Emojis from "../Emoji/Emojis";
import EmojiInfo from "../Emoji/EmojiInfo";
import ProfileImage from "../ProfileImage";

const ChatMessage = ({ id, messageItem, setReply }) => {
  const userContext = useContext(UserContext);
  const { uid } = userContext;
  const { createdBy, name, createdAt, text, emoji, reply } = messageItem;
  const modalRef = useRef(null);
  const messageRef = useRef(null);
  const [reEmo, setReEmo] = useState(null);

  const hoverModalEnter = () => {
    modalRef.current.style.display = "block";
  };
  const hoverModalLeave = () => {
    modalRef.current.style.display = "none";
  };

  const sendReply = () => {
    const replyObj = {
      ref: messageRef,
      messageID: id,
      ...messageItem,
    };
    setReply(replyObj);
  };

  const options = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const OtherChat = (
    <div className="my-4 mx-10 flex items-start w-4/5">
      <div className="mt-2 ml-2">
        <ProfileImage size={"xs"} value={name} />
      </div>
      <div ref={messageRef} className=" ml-4 bg-white w-fit">
        <div
          className="px-4 py-3  relative"
          onMouseEnter={hoverModalEnter}
          onMouseLeave={hoverModalLeave}
        >
          <div
            className="absolute left-3/4 right-0 -top-[2rem] hidden whitespace-nowrap	"
            ref={modalRef}
          >
            <Emojis
              id={id}
              type={"message"}
              reEmo={reEmo}
              setReEmo={setReEmo}
              from={"chat"}
            />
            <span
              className="bg-white p-1 text-center  cursor-pointer border-y-2 border-r-2 hover:border-blue-200 hover:bg-blue-200 hover:scale-150 inline-block hover:mx-1"
              onClick={sendReply}
            >
              <ReplyIcon fontSize="small" />
            </span>
          </div>
          <div className="flex  justify-between items-center ">
            <div className="flex text-xs">
              <div className="font-bold mr-4">{name}</div>
              <div>
                {createdAt.toDate().toLocaleDateString("en-US", options)}
              </div>
            </div>
            <div
              className="flex relative ml-2"
              onMouseEnter={() => (modalRef.current.style.display = "none")}
              onMouseLeave={() => (modalRef.current.style.display = "block")}
            >
              {emoji.map((emo, index) => {
                return (
                  <EmojiInfo
                    key={index}
                    className=""
                    emoji={emo}
                    setReEmo={setReEmo}
                  />
                );
              })}
            </div>
          </div>
          {reply && Object.keys(reply).length !== 0 && (
            <ChatReply messageItem={reply} editable={false} />
          )}
          <div className="text-sm ">{text}</div>
        </div>
      </div>
    </div>
  );

  const MyChat = (
    <div className="my-4 mr-20  ml-auto flex flex-row-reverse items-start  w-9/12 relative">
      <div
        ref={messageRef}
        className="bg-blue-100 "
        onMouseEnter={hoverModalEnter}
        onMouseLeave={hoverModalLeave}
      >
        <div className="absolute top-[-2rem] right-0 hidden" ref={modalRef}>
          <Emojis
            id={id}
            from={"chat"}
            type={"message"}
            reEmo={reEmo}
            setReEmo={setReEmo}
          />
          <span
            className="bg-white p-1 cursor-pointer border-y-2 border-r-2 hover:bg-gray-200 hover:scale-150 inline-block "
            onClick={sendReply}
          >
            <ReplyIcon fontSize="small" />
          </span>
        </div>
        <div className="px-4 py-3">
          <div className="flex  justify-between items-center">
            <div className="flex text-xs">
              <div>
                {createdAt.toDate().toLocaleDateString("en-US", options)}
              </div>
            </div>
            <div
              className="flex relative"
              onMouseEnter={() => (modalRef.current.style.display = "none")}
              onMouseLeave={() => (modalRef.current.style.display = "block")}
            >
              {emoji.map((emo, index) => {
                return (
                  <EmojiInfo
                    key={index}
                    className=""
                    emoji={emo}
                    setReEmo={setReEmo}
                  />
                );
              })}
            </div>
          </div>
          {reply && Object.keys(reply).length !== 0 && (
            <ChatReply messageItem={reply} editable={false} />
          )}
          <div className="text-sm">{text}</div>
        </div>
      </div>
    </div>
  );
  return <div>{createdBy === uid ? MyChat : OtherChat}</div>;
};

export default ChatMessage;
