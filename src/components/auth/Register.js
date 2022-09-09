import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import UserContext from "../../context/user/UserContext";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required!";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required!";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Required!";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Must match Password";
  }

  return errors;
};

const Register = () => {
  const userContext = useContext(UserContext);
  const { loadNewUser } = userContext;
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: (values) => {
      register(values.email, values.password, values.name);
    },
  });

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const name = user.displayName;
        // const email = user.email;
        // const photoURL = user.photoURL;
        addUser(user, name);
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const register = (email, password, name) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addUser(user, name);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const addUser = async (user, name) => {
    const { uid, email } = user;
    try {
      await setDoc(doc(db, "test-user", `${uid}`), {
        name,
        email,
        inVideoCall: false,
        createdAt: serverTimestamp(),
        teams: {},
        chats: {},
      });
      const docRef = collection(db, "test-user");

      if (user !== null) {
        const userObj = {
          uid,
          name,
          email,
        };
        loadNewUser(userObj);
        navigate(`/teams`);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full ">
      <div className="w-3/12 min-w-[400px]">
        <form
          className="border-2 border-gray-300 flex flex-col px-8 py-4 "
          onSubmit={formik.handleSubmit}
        >
          <div className="text-xl font-bold text-center mb-4">Register</div>
          <div className="my-4">
            <div className="font-sm text-gray-600 mb-1">Name</div>
            <input
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
              type="name"
              placeholder="John Doe"
              className="border-2 w-full p-2 focus:outline-blue-500"
            />
            {formik.errors.name ? (
              <div className="text-sm text-red-600">{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="my-4">
            <div className="font-sm text-gray-600 mb-1">Email Address</div>
            <input
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
              type="email"
              placeholder="John.Doe@gmail.com"
              className="border-2 w-full p-2 focus:outline-blue-500"
            />
            {formik.errors.email ? (
              <div className="text-sm text-red-600">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="my-4">
            <div className="font-sm text-gray-600 ">Password</div>
            <input
              value={formik.values.password}
              onChange={formik.handleChange}
              name="password"
              type="password"
              placeholder="Password..."
              className="border-2 w-full p-2 focus:outline-blue-500"
            />
            {formik.errors.email ? (
              <div className="text-sm text-red-600">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div className="my-4">
            <div className="font-sm text-gray-600 mb-1">Confirm Password</div>
            <input
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              name="confirmPassword"
              type="password"
              placeholder="Password..."
              className="border-2 w-full p-2 focus:outline-blue-500"
            />
            {formik.errors.confirmPassword ? (
              <div className="text-sm text-red-600">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="border-2 py-1 px-4 bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer w-fit mx-auto mt-2"
          >
            Register
          </button>
          <Link to="/auth/login">
            <div className="text-center text-sm text-gray-400 underline mt-4 cursor-pointer hover:text-black w-fit mx-auto px-2 ">
              Click here to Login
            </div>
          </Link>
        </form>
        {/* <button
          className="border-2 py-1 px-4 bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer w-fit mx-auto mt-2"
          onClick={() => {
            addUser({ uid: 1023, email: "testUser1@gmail.com" }, "Test User1");
          }}
        >
          Add User
        </button> */}
        <div className="flex m-4 justify-evenly items-center">
          <div
            className="cursor-pointer border-2 border-transparent hover:border-blue-300 mx-2"
            onClick={signInWithGoogle}
          >
            <img src="/images/auth/google.svg" alt="Sign In with Google" />
          </div>
          <div className="cursor-pointer border-2 border-transparent hover:border-blue-300 mx-2 p-3">
            <img
              src="/images/auth/microsoft.svg"
              alt="Sign In with Microsoft"
            />
          </div>
          <div className="cursor-pointer border-2 border-transparent hover:border-blue-300 mx-2 w-12 p-2">
            <img src="/images/auth/github.png" alt="Sign In with Github" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
