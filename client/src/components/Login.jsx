import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    
    const [state, setState] = useState('Login');
    const {setShowLogin, backendUrl, setToken, setUser} = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        try {
            if(state === 'Login') {
                console.log('Attempting login...', { email }); // Add logging
                const {data} = await axios.post(`${backendUrl}/api/users/login`, {
                    email, password
                });

                if(data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);
                    toast.success('Logged in successfully!');
                } else {
                    toast.error(data.message || 'Login failed');
                }
            }
            else if(state === 'Sign Up') {
                console.log('Attempting signup...', { name, email }); // Add logging
                const {data} = await axios.post(`${backendUrl}/api/users/register`, {
                    name, email, password
                });
                if(data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);
                    toast.success('Account created successfully!');
                } else {
                    toast.error(data.message || 'Registration failed');
                }
            }
        } catch (err) {
            console.error('Error details:', err);
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(err.response.data?.message || `Error: ${err.response.status}`);
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
            } else if (err.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please check your connection.');
                console.error('No response received:', err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error('Error occurred while processing your request.');
                console.error('Error message:', err.message);
            }
        }
    };





    useEffect(() => {
        // Prevent scrolling when the login modal is open
        document.body.style.overflow = 'hidden';
    
    return () => {
        // Restore scrolling when the login modal is closed
        document.body.style.overflow = 'unset';
    }
    }, []);
    
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0
    z-20 backdrop-blur-sm bg-black/30 flex
    justify-center items-center'>

    <form onSubmit={onSubmitHandler} 
    className='relative bg-white p-20 rounded-xl
    text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
        <p className='text-sm'>Welcome back! Please sign in to continue</p>

        {state !== 'Login' && <div className='border px-6 pt-2 flex items-center gap-2
        rounded-full mt-5'>
            <img src={assets.user_icon} alt=""/>
            <input 
             onChange={e => setName(e.target.value)} value = {name}
             type="text" className='outline-none text-sm' placeholder='Full Name' required/>
        </div>}

        <div className='border px-6 pt-2 flex items-center gap-2
        rounded-full mt-4'>
            <img src={assets.email_icon} alt=""/>
            <input 
             onChange={e => setEmail(e.target.value)} value = {email}
             type="email" className='outline-none text-sm' placeholder='Email Address' required/>
        </div>

        <div className='border px-6 pt-2 flex items-center gap-2
        rounded-full mt-4'>
            <img src={assets.lock_icon} alt=""/>
            <input 
            onChange={e => setPassword(e.target.value)} value = {password}
            type="password" className='outline-none text-sm' placeholder='Password' required/>
        </div>

        <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

        <button className='bg-blue-600 w-full text-white py-2 rounded-full'>{state === 'Login' ? 'Login' : 'Create Account'}</button>

        {
state === 'Login' ?
            <p>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>Sign Up</span></p>
            :
        <p>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span></p>}

        <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer'/>
    </form>
      
    </div>
  )
}

export default Login
