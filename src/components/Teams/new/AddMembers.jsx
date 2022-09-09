import { Autocomplete, Chip } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";

const users = [
  {
    id: "1",
    name: "sri 1",
  },
  {
    id: "2",
    name: "sri 2",
  },
  {
    id: "3",
    name: "sri 3",
  },
  {
    id: "4",
    name: "sri 4",
  },
];

const AddMembers = () => {
  const { teamId } = useParams();
  const [filterUsers, setFilterUsers] = useState(users);
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filterSearch = (x) => {
    let result = [];
    result = filterUsers.filter(
      (user) => !usersToAdd.map((u) => u.id).includes(user.id)
    );
    if (searchTerm !== "") {
      if (searchTerm.length < 3) {
        return [{ name: "Please enter at least 3 characters" }];
      }
      result = filterUsers.filter((user) => !usersToAdd.includes(user.id));
      result = result.filter((user) => user.name.includes(searchTerm));
    } else return [{ name: "Please enter at least 3 characters" }];
    return result;
  };

  const getUsers = async () => {
    let allUsers = [];
    const usersRef = collection(db, "test-user");
    const q = query(usersRef, where("name", "==", searchTerm));
    const userDocs = await getDocs(usersRef);
    userDocs.forEach(async (user) => {
      //   const userDoc = doc(db, "test-user", user.id);
      const data = user.data();
      allUsers.push(data);
    });
    console.log(allUsers);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl  text-center ">Add Member</div>
      <div className=" w-80 px-4 py-2 my-8">
        <Autocomplete
          multiple
          filterOptions={(x) => filterSearch(x)}
          id="add-members-input"
          value={usersToAdd}
          onChange={(e, values) => {
            setUsersToAdd(values);
          }}
          inputValue={searchTerm}
          onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
          options={users}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          sx={{ width: 300 }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              return (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              );
            })
          }
          renderOption={(props, option) => (
            <div
              className="w-full cursor-pointer border-1 p-2 my-1 bg-gray-400"
              {...props}
            >
              {option.name}
            </div>
          )}
          renderInput={(params) => <TextField {...params} label="Members" />}
        />
      </div>
      <button
        className="px-6 py-2 border-2 cursor-pointer"
        //   onClick={getUsers}
      >
        Add
      </button>
    </div>
  );
};

export default AddMembers;
