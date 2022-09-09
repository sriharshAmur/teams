import React, { useRef, useState } from "react";
import EmojiInfo from "../../Emoji/EmojiInfo";
import Emojis from "../../Emoji/Emojis";
import ProfileImage from "../../ProfileImage";

const ConversationReply = ({ id, reply, sameAuthor, replyId }) => {
  const { name, createdAt, text, emoji } = reply;
  const modalRef = useRef(null);
  // const [emoji, setEmoji, Emojis] = useEmojis();
  const [reEmo, setReEmo] = useState(null);

  const hoverModalEnter = () => {
    modalRef.current.style.display = "block";
  };
  const hoverModalLeave = () => {
    modalRef.current.style.display = "none";
  };

  const options = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div className={`flex items-start bg-gray-50 px-2 ${sameAuthor && "ml-8"}`}>
      {!sameAuthor && (
        <div className="mt-2 ">
          <ProfileImage size={"xs"} value={name} />
        </div>
      )}
      <div
        className="flex-1 bg-white relative"
        onMouseEnter={hoverModalEnter}
        onMouseLeave={hoverModalLeave}
      >
        <div className="absolute  right-0 -top-[1rem] hidden" ref={modalRef}>
          <Emojis
            id={id}
            type={"replies"}
            reEmo={reEmo}
            setReEmo={setReEmo}
            replyId={replyId}
          />
        </div>
        <div className="px-4 pt-2 pb-2">
          <div className="flex  justify-between items-center">
            <div className="flex text-xs">
              {!sameAuthor && <div className="font-bold mr-2">{name}</div>}
              <div>
                {createdAt.toDate().toLocaleDateString("en-US", options)}
              </div>
            </div>
            <div
              className="flex "
              // onClick={() => setEmoji("")}
            >
              {emoji.map((emo, index) => {
                return (
                  <EmojiInfo
                    key={index}
                    setReEmo={setReEmo}
                    className=""
                    emoji={emo}
                  />
                );
              })}
            </div>
          </div>
          <div className="text-sm">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default ConversationReply;
