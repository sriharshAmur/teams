import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import { db } from "../../firebase";
import Emoji from "./Emoji";

const Emojis = ({ id, replyId, type, reEmo, setReEmo, from }) => {
  const userContext = useContext(UserContext);
  const { name, uid } = userContext;
  const { teamId, channelId, chatId } = useParams();
  const setEmoji = async (emo) => {
    const emoObj = {
      createdBy: uid,
      name,
      emoji: emo,
    };
    if (from === "chat") {
      const chatRef = doc(db, "test-chat", chatId, "messages", id);
      await updateDoc(chatRef, {
        emoji: arrayUnion(emoObj),
      });
    } else {
      if (type === "replies") {
        const replyRef = doc(
          db,
          "test-team",
          teamId,
          "channels",
          channelId,
          "conversations",
          id,
          "replies",
          replyId
        );
        await updateDoc(replyRef, {
          emoji: arrayUnion(emoObj),
        });
      } else {
        const conversationRef = doc(
          db,
          "test-team",
          teamId,
          "channels",
          channelId,
          "conversations",
          id
        );
        await updateDoc(conversationRef, {
          [`${type}.emoji`]: arrayUnion(emoObj),
        });
      }
    }
  };

  useEffect(() => {
    removeEmoji();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reEmo]);

  const removeEmoji = async () => {
    if (reEmo && Object.keys(reEmo).length > 0) {
      if (from === "chat") {
        const chatRef = doc(db, "test-chat", chatId, "messages", id);
        await updateDoc(chatRef, {
          emoji: arrayRemove(reEmo),
        });
      } else {
        if (type === "replies") {
          const replyRef = doc(
            db,
            "test-team",
            teamId,
            "channels",
            channelId,
            "conversations",
            id,
            "replies",
            replyId
          );
          await updateDoc(replyRef, {
            emoji: arrayRemove(reEmo),
          });
        } else {
          const conversationRef = doc(
            db,
            "test-team",
            teamId,
            "channels",
            channelId,
            "conversations",
            id
          );
          await updateDoc(conversationRef, {
            [`${type}.emoji`]: arrayRemove(reEmo),
          });
        }
      }

      setReEmo([]);
    }
  };

  return (
    <span className="bg-white py-1 cursor-pointer border-2 z-20 ">
      <span
        // onClick={() => setEmoji(<Emoji symbol="👍🏻" label="Like" />)}
        onClick={() => setEmoji("👍🏻")}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="👍🏻" label="Like" />
      </span>
      <span
        onClick={() => setEmoji("❤️")}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="❤️" label="Heart" />
      </span>
      <span
        onClick={() => setEmoji("😀")}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="😀" label="Laugh" />
      </span>
      <span
        onClick={() => setEmoji("😮")}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="😮" label="Surprised" />
      </span>
      <span
        onClick={() => setEmoji("🤯")}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="🤯" label="Mind-Blown" />
      </span>
      <span
        onClick={() => setEmoji("🙁")}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="🙁" label="Sad" />
      </span>
      <span
        onClick={() => setEmoji("😡")}
        className="hover:scale-150 inline-block hover:mx-1"
      >
        <Emoji symbol="😡" label="Angry" />
      </span>
    </span>
  );
};

export default Emojis;
