'use client';
import Loader from '@/components/Loader';
import Login from '@/components/Login';
import { loadUser } from '@/http/upload';
import React, { useEffect, useState } from 'react'


const ProtectedRouter = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
   

    const checkLogin = async () => {
        try {
            setLoading(true)
            const res = await loadUser();
            if(res.data.success){
                setIsLogin(true)
            }
            setLoading(false)
        } catch (error) {
            setIsLogin(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        checkLogin();
    },[]);

    if(loading){
        return <Loader/>
    }

    if(!loading && !isLogin){
        return <Login setIsLogin={setIsLogin}/>
    }

    return (
        children
    )
}

export default ProtectedRouter