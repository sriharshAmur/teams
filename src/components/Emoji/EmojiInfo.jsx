import React, { useRef } from "react";

const EmojiInfo = ({ emoji, setReEmo }) => {
  const { name, emoji: emo } = emoji;
  const emojiRef = useRef(null);
  return (
    <div
      className="text-center cursor-pointer relative flex flex-col items-center "
      onMouseEnter={() => (emojiRef.current.style.display = "block")}
      onMouseLeave={() => (emojiRef.current.style.display = "none")}
      onClick={() => setReEmo(emoji)}
    >
      <div>{emo}</div>
      <div ref={emojiRef} className="absolute hidden -bottom-8  w-14 border-2">
        {name}
      </div>
    </div>
  );
};
export default EmojiInfo;
