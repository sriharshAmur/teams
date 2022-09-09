import React, { useReducer } from "react";
import ChatReducer from "./ChatReducer";
import ChatContext from "./ChatContext";

import { CLEAR_CHAT, LOAD_CHAT_DETAILS } from "../types";

const ChatState = ({ children }) => {
  const initialState = {
    name: "",
    description: "",
    createdAt: "",
    createdBy: "",
    joinID: null,
    members: [],
    owner: false,
  };
  const [state, dispatch] = useReducer(ChatReducer, initialState);

  const clearChat = () => {
    dispatch({ type: CLEAR_CHAT });
  };

  const setChatDetails = (data) => {
    dispatch({ type: LOAD_CHAT_DETAILS, payload: data });
  };

  return (
    <ChatContext.Provider
      value={{
        name: state.name,
        description: state.description,
        createdBy: state.createdBy,
        createdAt: state.createdAt,
        owner: state.owner,
        joinID: state.joinID,
        members: state.members,
        chats: state.chats,

        clearChat,
        setChatDetails,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatState;
