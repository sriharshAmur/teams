import SearchIcon from "@mui/icons-material/Search";
import {
  arrayRemove,
  collection,
  doc,
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useContext, useState } from "react";
import { MdPersonAdd, MdPersonRemove } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../../context/user/UserContext";
import { db } from "../../../firebase";
import Modal from "../../Modal";
import AddMembers from "../new/AddMembers";
import MemberItem from "./MemberItem";

const Members = (props) => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const { members: memberIDs, owner, deleteTeam } = props;
  const { teamId } = useParams();
  const userContext = useContext(UserContext);
  const { uid } = userContext;
  let navigate = useNavigate();
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    getMeberDetails();
  }, []);

  const getMeberDetails = async () => {
    const userRef = collection(db, "test-user");
    const memberIds = memberIDs.map((member) => member.id);
    const q = query(userRef, where(documentId(), "in", memberIds));
    const querySnapshot = await getDocs(q);
    let memberArr = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      const member = {
        id: doc.id,
        name: data.name,
        email: data.email,
        inVideoCall: data.inVideoCall,
        role: memberIDs.find((member) => member.id === doc.id).role,
      };
      memberArr.push(member);
    });
    setMembers(memberArr);
  };

  const removeMember = async (member) => {
    // remove member from team
    const memberObj = {
      id: member.id,
      role: member.role,
    };
    const teamRef = doc(db, "test-team", teamId);
    await updateDoc(teamRef, {
      members: arrayRemove(memberObj),
    });

    // remove team from member/user
    const userRef = doc(db, "test-user", member.id);
    await updateDoc(userRef, {
      teams: arrayRemove(teamId),
    });

    if (members.length === 1) {
      deleteTeam();
    }

    // check if leave team and navigate
    if (member.id === uid) {
      navigate(`/teams`);
    }
  };
  return (
    <div className="mb-4 overflow-auto">
      {toggleModal && (
        <Modal setToggle={setToggleModal}>
          <AddMembers />
        </Modal>
      )}
      <div className="flex justify-between mb-4">
        <div className=" flex items-center  rounded">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Members..."
            className="px-4 pr-2 py-2 text-sm outline-none"
          />
          <div className="pr-2 self-stretch flex items-center bg-white ">
            <SearchIcon />
          </div>
        </div>
        <div className="flex">
          {owner && (
            <div
              onClick={() => setToggleModal(true)}
              className="flex mr-4 cursor-pointer items-center px-2 py-1 text-sm rounded bg-blue-600 text-white "
            >
              <MdPersonAdd size={15} />
              <div className="ml-2">Add members</div>
            </div>
          )}
          <div
            className="flex cursor-pointer  items-center px-2 py-1 text-sm rounded bg-red-600 text-white "
            onClick={() => removeMember(members.find((m) => m.id === uid))}
          >
            <MdPersonRemove size={15} />
            <div className="ml-2">Leave Team</div>
          </div>
        </div>
      </div>

      <div>
        {search !== "" ? (
          <div className="mt-4">
            <MemberItem
              type={""}
              {...props}
              removeMember={removeMember}
              members={members.filter((member) =>
                (member?.name || member?.email)
                  .toUpperCase()
                  .includes(search.toUpperCase())
              )}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="font-semibold mb-2">
                Owners (
                {memberIDs?.filter((member) => member.role === "owner")?.length}
                )
              </div>
              {members.length > 0 && (
                <div className="mt-4">
                  <MemberItem
                    type={"owner"}
                    owner={owner}
                    members={members}
                    removeMember={removeMember}
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">
                Members (
                {
                  memberIDs?.filter((member) => member.role === "member")
                    ?.length
                }
                )
              </div>
              {/* {members.length > 0 && (
                <MemberItem
                  type={"member"}
                  {...props}
                  removeMember={removeMember}
                />
              )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
