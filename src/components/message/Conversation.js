import React, { useContext, useEffect, useRef, useState } from "react";
import { HiOutlineReply } from "react-icons/hi";
import SendIcon from "@mui/icons-material/Send";
import ConversationReply from "./reply/ConversationReply";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import UserContext from "../../context/user/UserContext";
import Emojis from "../Emoji/Emojis";
import EmojiInfo from "../Emoji/EmojiInfo";
import ProfileImage from "../ProfileImage";

const Conversation = ({ id, messageItem }) => {
  const { teamId, channelId } = useParams();
  const { message } = messageItem;
  const { name, createdAt, text, emoji } = message;
  const modalRef = useRef(null);
  const [reEmo, setReEmo] = useState(null);
  const [replyClick, setReplyClick] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [replies, setReplies] = useState([]);
  const userContext = useContext(UserContext);
  const { name: username, uid } = userContext;

  useEffect(() => {
    const repliesRef = collection(
      db,
      "test-team",
      teamId,
      "channels",
      channelId,
      "conversations",
      id,
      "replies"
    );
    const q = query(repliesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempArr = [];
      querySnapshot.forEach((doc) => {
        const temp = {
          id: doc.id,
          ...doc.data(),
        };
        tempArr.push(temp);
      });
      setReplies(tempArr);
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, channelId]);

  const submitMessage = async (e) => {
    e.preventDefault();
    if (reply !== "") {
      const replyObj = {
        createdBy: uid,
        // image: "",
        name: username,
        createdAt: Timestamp.fromDate(new Date()),
        text: reply,
        emoji: [],
      };
      // Add the reply to the replies array
      await addDoc(
        collection(
          db,
          "test-team",
          teamId,
          "channels",
          channelId,
          "conversations",
          id,
          "replies"
        ),
        replyObj
      );
      setReply("");
      setReplyClick(false);
    } else {
      setError("Message can't be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const options = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  let previousReply = null;
  return (
    <div className="my-4 mx-10 flex items-start">
      <div className="mt-2 ">
        <ProfileImage size={"m"} value={username} />
      </div>
      <div
        className="flex-1 bg-white ml-4 relative"
        onMouseEnter={() => (modalRef.current.style.display = "block")}
        onMouseLeave={() => (modalRef.current.style.display = "none")}
      >
        <div className="absolute  right-0 -top-[1rem] hidden" ref={modalRef}>
          <Emojis id={id} type={"message"} reEmo={reEmo} setReEmo={setReEmo} />
        </div>
        <div className="px-4 pt-2 pb-2">
          <div className="flex  justify-between items-center">
            <div className="flex text-xs">
              <div className="font-bold mr-2">{name}</div>
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
          <div className="text-sm">{text}</div>
        </div>
        {replies.length > 0 && (
          <div
            className="text-sm bg-gray-50 px-3 py-2"
            onMouseEnter={() => (modalRef.current.style.display = "none")}
            onMouseLeave={() => (modalRef.current.style.display = "block")}
          >
            {replies?.map((reply, index) => {
              var sameAuthor = false;
              if (previousReply !== null && reply.createdBy === previousReply) {
                sameAuthor = true;
              }
              previousReply = reply.createdBy;
              return (
                <ConversationReply
                  key={index}
                  // replies={replies}
                  id={id}
                  replyId={reply.id}
                  reply={reply}
                  sameAuthor={sameAuthor}
                />
              );
            })}
          </div>
        )}
        <div
          className=" "
          onMouseEnter={() => (modalRef.current.style.display = "none")}
          onMouseLeave={() => (modalRef.current.style.display = "block")}
        >
          {replyClick ? (
            <div className=" w-full">
              <form className="  flex items-center rounded border-t-2">
                <input
                  autoFocus
                  className="border-b-2 border-transparent w-full px-3 py-2 text-sm outline-none focus:border-blue-700"
                  placeholder="Type a new message"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-white py-2 px-2 cursor-pointer "
                  onClick={submitMessage}
                >
                  <SendIcon fontSize="small" />
                </button>
              </form>
              <div className={`text-sm text-red-600 bg-white `}>{error}</div>
            </div>
          ) : (
            <div
              className="px-4 py-2  flex items-center cursor-pointer bg-gray-200 hover:text-blue-900"
              onClick={() => setReplyClick(true)}
            >
              <HiOutlineReply size={10} />
              <div className="ml-2 text-xs">Reply</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
