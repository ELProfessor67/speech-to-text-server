import { loginRequest } from '@/http/upload';
import React, { useState } from 'react'

const Login = ({setIsLogin}) => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!email || !password){
                setMessage('Please Enter all fields');
                return
            }
            
            const res = await loginRequest(email,password);
            if(res.data.success){
                setIsLogin(true)
            }
        } catch (error) {
            setMessage(error?.response?.data?.message);
        }
    }

    return (
        <section class="bg-primary">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div class="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-secondary ">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 class="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                            Sign in to your account
                        </h1>
                        <form class="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium  text-white">Your email</label>
                                <input type="email" name="email" id="email" class="bg-gray-50 border outline-none border-gray-300  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required/>
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium  text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none  placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500 text-black" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                            </div>
                            {
                                message && 
                                <p className='text-red-600'>Invalid Details</p>
                            }
                            <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 bg-foregroud-secondary">Sign in</button>
                            
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login