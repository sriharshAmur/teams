import React from "react";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ text, setText, submitMessage, error }) => {
  return (
    <div className="items-end border-t-2 mx-2 h-28 min-h-28 box-content">
      {/* mt-10 */}
      <div className=" w-10/12 h-full flex items-center justify-center mx-auto rounded">
        <div className="w-full my-auto">
          <form className=" flex items-center ">
            <input
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
      </div>
    </div>
  );
};

export default ChatInput;
