import React from "react";
import SendIcon from "@mui/icons-material/Send";
import ChatReply from "../../message/reply/ChatReply";

const ChatReplyInput = ({
  setReply,
  reply,
  text,
  setText,
  submitMessage,
  error,
  editable,
}) => {
  return (
    <div className="items-end border-t-2 mx-2 h-36 min-h-28 box-content mb-2">
      {/* mt-10 */}
      <div className=" w-10/12 h-full flex items-center justify-center mx-auto rounded">
        <div className="w-full my-auto py-4  ">
          <form className=" flex items-center ">
            <div className="flex flex-col bg-white pl-4 pr-2 pt-4 w-full">
              <ChatReply
                setReply={setReply}
                messageItem={reply}
                editable={editable}
              />
              <div className="w-full flex items-center ">
                <input
                  className="w-full border-transparentpx-3 py-2 text-sm outline-none border-b-2 focus:border-blue-700"
                  placeholder="Type a new message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-white py-2 pl-2 cursor-pointer "
                  onClick={submitMessage}
                >
                  <SendIcon fontSize="small" />
                </button>
              </div>
            </div>
          </form>
          <div className="text-sm text-red-600">{error}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatReplyInput;
