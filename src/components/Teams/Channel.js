// import { ComposeIcon } from "@fluentui/react-icons-northstar";
import React, { useState, useRef, useEffect, useContext } from "react";
import { MdOutlineVideocam, MdOutlineInfo, MdInfo } from "react-icons/md";
import RateReviewIcon from "@mui/icons-material/RateReviewOutlined";
import Conversation from "../message/Conversation";
import { useNavigate, useParams } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import UserContext from "../../context/user/UserContext";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import ChannelInfo from "./ChannelInfo";
import TeamContext from "../../context/team/TeamContext";
import ProfileImage from "../ProfileImage";

const Channel = () => {
  const { teamId, channelId } = useParams();
  const [newConversation, setNewConversation] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const userContext = useContext(UserContext);
  const teamContext = useContext(TeamContext);
  const { channels } = teamContext;
  const { uid, name } = userContext;
  const [channelName, setChannelName] = useState();
  const [infoToggle, setInfoToggle] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const conversationsRef = collection(
      db,
      "test-team",
      teamId,
      "channels",
      channelId,
      "conversations"
    );
    const q = query(conversationsRef, orderBy("message.createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempArr = [];
      querySnapshot.forEach((doc) => {
        const temp = {
          id: doc.id,
          ...doc.data(),
        };
        tempArr.push(temp);
      });
      setMessages(tempArr);
    });
    return () => {
      unsubscribe();
    };
  }, [teamId, channelId]);

  useEffect(() => {
    const channelName = channels.find((channel) => channel.id === channelId);
    setChannelName(channelName?.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, channels]);

  const scrollToBottom = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, channelId]);

  const submitMessage = async (e) => {
    e.preventDefault();
    if (text !== "") {
      const messageObj = {
        message: {
          createdBy: uid,
          name,
          createdAt: Timestamp.fromDate(new Date()),
          text,
          emoji: [],
        },
      };
      // console.log("Conversation Object: ", messageObj);
      const conversationRef = await addDoc(
        collection(
          db,
          "test-team",
          teamId,
          "channels",
          channelId,
          "conversations"
        ),
        messageObj
      );
      // setMessages((messages) => messages.concat(messageObj));
      setText("");
      setNewConversation(false);
    } else {
      setError("Message can't be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className=" w-full overflow-hidden  bg-gray-50 drop-shadow">
      <div className="w-full py-2  px-4 border-2 flex justify-between items-center">
        <div className="flex items-center">
          <ProfileImage size={"m"} value={channelName} />
          <div className="ml-2 font-bold text-xl">{channelName}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between px-2 mx-4 border-2 cursor-pointer ">
            <MdOutlineVideocam size={18} />
            <div className="ml-2" onClick={() => navigate("video")}>
              Meet{" "}
            </div>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => setInfoToggle((toggle) => !toggle)}
          >
            {!infoToggle ? <MdOutlineInfo /> : <MdInfo />}
          </div>
        </div>
      </div>
      {/**
       * TODO: Need to fix the height issue - should not be static
       */}
      <div className="flex h-full max-h-[85vh] ">
        {" "}
        {/* Need to Fix This */}
        <div className=" flex flex-col justify-between flex-1 ">
          <div className=" flex-1 overflow-auto ">
            {messages.map((message) => {
              return (
                <div key={message.id}>
                  <Conversation id={message.id} messageItem={message} />
                </div>
              );
            })}
            <div className="" ref={inputRef}></div>
          </div>
          <div className="items-end border-t-2 mx-14 mt-auto">
            {newConversation ? (
              <div className="my-6 w-12/12 mx-auto ml-10">
                <form className="  flex items-center rounded ">
                  <input
                    autoFocus
                    className="border-b-2 border-transparent w-full px-3 py-2 text-sm outline-none focus:border-blue-700"
                    placeholder="Type a new message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-white py-2 px-2 cursor-pointer "
                    onClick={submitMessage}
                  >
                    <SendIcon fontSize="small" />
                  </button>
                </form>
                <div className="text-sm text-red-600">{error}</div>
              </div>
            ) : (
              <div
                className="my-8 mx-10 flex items-center cursor-pointer rounded w-fit p-1 px-4 bg-blue-700 text-white"
                onClick={() => setNewConversation(true)}
              >
                <RateReviewIcon fontSize="small" />
                <div className="ml-2 text-sm">New Conversation</div>
              </div>
            )}
          </div>
        </div>
        {infoToggle && <ChannelInfo />}
      </div>
    </div>
  );
};

export default Channel;
