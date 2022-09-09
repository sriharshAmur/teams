import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../context/user/UserContext';

const validate = (values) => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Required!';
    }

    return errors;
};

const Login = () => {
    let navigate = useNavigate();
    const userContext = useContext(UserContext);
    const { loadToken } = userContext;
    const [loginError, setLoginError] = useState('');
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate,
        onSubmit: (values) => {
            login(values.email, values.password);
        },
    });

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        auth.signInWithPopup(provider).then((userCredential) => {
            const user = userCredential.user;
            if (user !== null) {
                user.getIdToken().then((token) => {
                    loadToken(token);
                });
                navigate(`/teams`);
            }
        });
    };

    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user !== null) {
                    user.getIdToken().then((token) => {
                        loadToken(token);
                    });
                    navigate(`/teams`);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setLoginError(errorMessage);
                setTimeout(() => {
                    setLoginError('');
                }, 2000);
            });
    };

    return (
        <div className='flex flex-col justify-center items-center h-full '>
            <div className='w-3/12 min-w-[400px]'>
                <form
                    className='border-2 border-gray-300 flex flex-col px-8 py-4 '
                    onSubmit={formik.handleSubmit}
                >
                    <div className='text-xl font-bold text-center mb-4'>
                        Login
                    </div>
                    <div className='my-4'>
                        <div className='font-sm text-gray-600 mb-1'>
                            Email Address
                        </div>
                        <input
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            name='email'
                            type='email'
                            placeholder='John.Doe@gmail.com'
                            className='border-2 w-full p-2 focus:outline-blue-500'
                        />
                        {formik.errors.email ? (
                            <div className='text-sm text-red-600'>
                                {formik.errors.email}
                            </div>
                        ) : null}
                    </div>
                    <div className='my-4'>
                        <div className='font-sm text-gray-600 mb-1'>
                            Password
                        </div>
                        <input
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            name='password'
                            type='password'
                            placeholder='Password...'
                            className='border-2 w-full p-2 focus:outline-blue-500'
                        />
                        {formik.errors.email ? (
                            <div className='text-sm text-red-600'>
                                {formik.errors.password}
                            </div>
                        ) : null}

                        <div className='text-xs font-light text-blue-500 text-right mt-1 hover:text-black cursor-pointer'>
                            Forgot Password? Click Here
                        </div>
                    </div>
                    <div className='text-sm text-red-600 text-center'>
                        {loginError}
                    </div>

                    <button
                        type='submit'
                        className='border-2 py-1 px-4 bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer w-fit mx-auto mt-2'
                    >
                        Login
                    </button>
                    <Link to='/auth/register'>
                        <div className='text-center text-sm text-gray-400 underline mt-4 cursor-pointer hover:text-black w-fit mx-auto px-2 '>
                            Click here to Register
                        </div>
                    </Link>
                </form>
                <div className='flex m-4 justify-evenly items-center'>
                    <div className='cursor-pointer border-2 border-transparent hover:border-blue-300 mx-2'>
                        <img
                            src='/images/auth/google.svg'
                            alt='Sign In with Google'
                        />
                    </div>
                    <div
                        onClick={signInWithGoogle}
                        className='cursor-pointer border-2 border-transparent hover:border-blue-300 mx-2 p-3'
                    >
                        <img
                            src='/images/auth/microsoft.svg'
                            alt='Sign In with Microsoft'
                        />
                    </div>
                    <div className='cursor-pointer border-2 border-transparent hover:border-blue-300 mx-2 w-12 p-2'>
                        <img
                            src='/images/auth/github.png'
                            alt='Sign In with Github'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
