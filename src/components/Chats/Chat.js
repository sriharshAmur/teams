// import { ComposeIcon } from "@fluentui/react-icons-northstar";
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaSquare } from "react-icons/fa";
import {
  MdOutlineVideocam,
  MdOutlineInfo,
  MdInfo,
  MdSettings,
  MdEdit,
  MdDone,
} from "react-icons/md";
import ChatMessage from "../message/ChatMessage";
import { Link, useParams } from "react-router-dom";
import ChatInput from "./ChatInputs/ChatInput";
import ChatReplyInput from "./ChatInputs/ChatReplyInput";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import UserContext from "../../context/user/UserContext";
import ChatInfo from "./About/ChatInfo";
import ChatContext from "../../context/chat/ChatContext";
import ProfileImage from "../ProfileImage";

const Chat = () => {
  const { chatId } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [infoToggle, setInfoToggle] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");

  const userContext = useContext(UserContext);
  const chatContext = useContext(ChatContext);
  const { uid, name } = userContext;

  const inputRef = useRef(null);

  const { setChatDetails, clearChat, name: chatName, joinID } = chatContext;

  const scrollToBottom = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatId]);

  useEffect(() => {
    const chatRef = doc(db, "test-chat", chatId);
    const unsub = onSnapshot(chatRef, (doc) => {
      const data = doc.data();
      const ownersArr = data.members
        .filter((m) => m.role === "owner")
        .map((m) => m.id);
      const ownerBool = ownersArr.includes(uid);
      setChatDetails({ ...data, owner: ownerBool });
    });
    return () => {
      unsub();
      clearChat();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, uid]);

  useEffect(() => {
    const chatRef = collection(db, "test-chat", chatId, "messages");
    const q = query(chatRef, orderBy("createdAt", "asc"));
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
  }, [chatId]);

  const submitMessage = async (e) => {
    e.preventDefault();
    if (text !== "") {
      const messageObj = {
        createdBy: uid,
        name,
        createdAt: Timestamp.fromDate(new Date()),
        text,
        emoji: [],
        reply: {},
      };
      if (reply !== "") {
        console.log("reply not empty");
        const replyObj = {
          messageID: reply.messageID,
          createdBy: reply.createdBy,
          name: reply.name,
          createdAt: reply.createdAt,
          text: reply.text,
        };
        messageObj.reply = replyObj;
        setReply("");
      }
      // console.log(messageObj);
      await addDoc(collection(db, "test-chat", chatId, "messages"), messageObj);

      setText("");
    } else {
      setError("Message can't be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleEditName = async () => {
    setEditName(false);
    console.log(newName);

    // update chat name
    const chatDoc = doc(db, "test-chat", chatId);
    await updateDoc(chatDoc, {
      name: newName,
    });
  };

  return (
    <div className=" w-full  overflow-hidden   drop-shadow  bg-gray-50 box-border">
      <div className="py-2  px-4 border-2 h-16 flex justify-between items-center">
        <div className="flex items-center">
          <ProfileImage size={"m"} value={chatName} />
          {editName ? (
            <div className=" ">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="outline-0 ml-2 py-2 px-2 bg-gray-200"
                autoFocus
              />
            </div>
          ) : (
            <div className="ml-2 font-bold text-xl">{chatName}</div>
          )}
          {editName ? (
            <div className="ml-2 cursor-pointer " onClick={handleEditName}>
              <MdDone />
            </div>
          ) : (
            <div
              className="ml-2 cursor-pointer "
              onClick={() => {
                setNewName(chatName);
                setEditName(true);
              }}
            >
              <MdEdit />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-between px-2 mx-4 border-2 cursor-pointer ">
            <MdOutlineVideocam size={18} />
            <div className="ml-2">Join </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setInfoToggle((toggle) => !toggle)}
          >
            {!infoToggle ? <MdOutlineInfo /> : <MdInfo />}
          </div>
        </div>
      </div>
      <div className="flex h-full max-h-[86vh]">
        <div className="flex flex-col justify-between flex-1 h-full ">
          <div className=" flex-1 overflow-auto pt-2">
            {messages.map((message) => {
              return (
                <div key={message.id}>
                  <ChatMessage
                    messageItem={message}
                    setReply={setReply}
                    reply={reply}
                    id={message.id}
                  />
                </div>
              );
            })}
            <div ref={inputRef}></div>
          </div>
          <div className="">
            {reply !== "" ? (
              <ChatReplyInput
                setReply={setReply}
                reply={reply}
                text={text}
                setText={setText}
                s
                submitMessage={submitMessage}
                error={error}
                editable={true}
              />
            ) : (
              <ChatInput
                text={text}
                setText={setText}
                submitMessage={submitMessage}
                error={error}
              />
            )}
          </div>
        </div>
        {infoToggle && <ChatInfo />}
      </div>
    </div>
  );
};

export default Chat;
