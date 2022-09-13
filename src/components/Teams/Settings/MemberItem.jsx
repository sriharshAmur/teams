import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import ProfileImage from "../../ProfileImage";

const MemberItem = ({ type, members, creator, owner, removeMember }) => {
  const { teamId } = useParams();
  const options = ["Owner", "Member"];

  const changeRole = async (e, member) => {
    const newMembers = members.map((m) => {
      if (m.id === member.id) {
        m.role = e.target.value.toLowerCase();
      }
      return m;
    });
    const teamRef = doc(db, "test-team", teamId);
    await updateDoc(teamRef, {
      members: newMembers,
    });
  };
  return (
    <div className="">
      {members?.filter((member) => (type === "" ? true : member.role === type))
        .length > 0 && (
        <div className=" mx-4 mb-2 flex justify-between text-sm text-gray-700">
          <div className="flex-1">Name</div>
          <div className="flex-1">Email</div>
          <div className="flex-1">Role</div>
          <div className="flex-1"></div>
        </div>
      )}
      <div>
        {members
          ?.filter((member) => (type === "" ? true : member.role === type))
          .map((member) => {
            return (
              <div
                key={member.id}
                className="flex justify-between items-center my-2 px-4 py-3   bg-white "
              >
                <div className="flex-1 flex">
                  <ProfileImage size={"xs"} value={member.name} />
                  <div className="ml-1">{member.name}</div>
                </div>
                <div className=" flex-1 ">
                  {member.email.length > 150
                    ? member.email.slice(0, 150).concat("...")
                    : member.email}
                </div>
                <div className=" flex-1">
                  {(!owner && member.role !== "owner") ||
                  member.id === creator ? (
                    <div>
                      {member.role.charAt(0).toUpperCase() +
                        member.role.slice(1)}
                    </div>
                  ) : (
                    <select
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
                <div className="flex-1">
                  <div className="ml-auto w-fit">
                    {(owner || member.role === "owner") &&
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
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MemberItem;
