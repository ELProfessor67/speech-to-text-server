'use client'
import { changePasswordRequest, loginRequest } from '@/http/upload';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
    const [oldpassword,setoldpassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter()


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!oldpassword || !newpassword || !cpassword){
                setMessage('Please Enter all fields');
                return
            }

            if(newpassword != cpassword){
                setMessage('Confirm password does not match');
                return
            }
            
            const res = await changePasswordRequest(oldpassword, newpassword);
            if(res.data.success){
                alert("Password change successfully.")
                router.push('/')
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
                            Change Password
                        </h1>
                        <form class="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium  text-white">Old Password</label>
                                <input type="password" name="oldpassword" id="oldpassword" class="bg-gray-50 border outline-none border-gray-300  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500" value={oldpassword} onChange={(e) => setoldpassword(e.target.value)} placeholder="••••••••" required/>
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium  text-white">New Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none  placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500 text-black" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium  text-white">Confirm New Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none  placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500 text-black" value={cpassword} onChange={(e) => setCPassword(e.target.value)} required/>
                            </div>
                            {
                                message && 
                                <p className='text-red-600'>Invalid Details</p>
                            }
                            <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800 bg-foregroud-secondary">Change Password</button>
                            
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default page