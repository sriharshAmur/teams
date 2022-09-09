import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import ProfileImage from "../../ProfileImage";

const MemberItem = ({ type, members, creator, owner, removeMember, uid }) => {
  const { chatId } = useParams();
  const options = ["Owner", "Member"];
  const [hover, setHover] = useState(false);

  const changeRole = async (e, member) => {
    const newMembers = members.map((m) => {
      if (m.id === member.id) {
        m.role = e.target.value.toLowerCase();
      }
      return m;
    });
    const chatRef = doc(db, "test-chat", chatId);
    await updateDoc(chatRef, {
      members: newMembers,
    });
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {members
        ?.filter((member) => (type === "" ? true : member.role === type))
        .map((member) => {
          return (
            <div
              key={member.id}
              className="flex justify-between items-center my-2 px-2 py-3   bg-white "
            >
              <div className="flex-1 flex items-center ">
                <ProfileImage size={"m"} value={member.name} />
                <div className="flex flex-col ml-1 text-sm">
                  <div className="flex ">
                    <div className="font-semibold">{member.name}</div>
                    <div className=" ml-2   ">
                      {(!owner && member.role !== "owner") ||
                      member.id === creator ? (
                        <div className="bg-gray-200 px-1">
                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)}
                        </div>
                      ) : (
                        <select
                          className="bg-gray-200 px-1"
                          value={
                            member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)
                          }
                          onChange={(e) => changeRole(e, member)}
                        >
                          {options.map((op) => (
                            <option key={op}>{op}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <div className=" flex-1 ">
                    {member.email.length > 150
                      ? member.email.slice(0, 150).concat("...")
                      : member.email}
                  </div>
                </div>
              </div>
              {hover && (
                <div className="">
                  <div className="ml-auto w-fit">
                    {(owner || member.role === "owner" || uid === member.id) &&
                    member.id !== creator ? (
                      <div
                        className="ml-auto w-fit cursor-pointer"
                        onClick={() => removeMember(member)}
                      >
                        <FaTimes />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default MemberItem;
