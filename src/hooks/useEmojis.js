import React, { useState } from "react";
import Emoji from "../components/Emoji/Emoji";

const useEmojis = () => {
  const [emoji, setEmoji] = useState("");
  const Emojis = (
    <span className="bg-white py-1 cursor-pointer border-2 z-20 ">
      <span
        onClick={() => setEmoji(<Emoji symbol="👍🏻" label="Like" />)}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="👍🏻" label="Like" />
      </span>
      <span
        onClick={() => setEmoji(<Emoji symbol="❤️" label="Heart" />)}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="❤️" label="Heart" />
      </span>
      <span
        onClick={() => setEmoji(<Emoji symbol="😀" label="Laugh" />)}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="😀" label="Laugh" />
      </span>
      <span
        onClick={() => setEmoji(<Emoji symbol="😮" label="Surprised" />)}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="😮" label="Surprised" />
      </span>
      <span
        onClick={() => setEmoji(<Emoji symbol="🤯" label="Mind-Blown" />)}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="🤯" label="Mind-Blown" />
      </span>
      <span
        onClick={() => setEmoji(<Emoji symbol="🙁" label="Sad" />)}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="🙁" label="Sad" />
      </span>
      <span
        onClick={() => setEmoji(<Emoji symbol="😡" label="Angry" />)}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="😡" label="Angry" />
      </span>
    </span>
  );

  return [emoji, setEmoji, Emojis];
};

export default useEmojis;
