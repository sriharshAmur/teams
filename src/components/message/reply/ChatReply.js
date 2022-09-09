import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ChatReply = ({ messageItem, setReply, editable }) => {
  const { name, createdAt, text, ref } = messageItem;

  const scrollToMessage = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      const classLength = ref.current.className.length;
      const bgColor = "  outline outline-blue-800 bg-orange-200";
      ref.current.className += bgColor;
      setTimeout(() => {
        ref.current.className = ref.current.className.substr(0, classLength);
      }, 1500);
    }
  };

  const options = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div className="border-2 w-fit  bg-gray-200 rounded ">
      <div className="  flex items-start border-l-4 border-gray-400 mx-1 ">
        <div
          className="flex-1  ml-4 relative mr-2 cursor-pointer"
          // onClick={scrollToMessage}
        >
          <div className=" py-3">
            <div className="flex  justify-between items-center">
              <div className="flex text-xs">
                <div className="font-bold mr-2">{name}</div>
                <div>
                  {createdAt.toDate().toLocaleDateString("en-US", options)}
                </div>
              </div>
            </div>
            <div className="text-sm">
              {text && text.length > 100
                ? text.slice(0, 100).concat("...")
                : text}
            </div>
          </div>
        </div>
        {editable && (
          <div className="cursor-pointer mt-1" onClick={() => setReply("")}>
            <CloseIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatReply;
