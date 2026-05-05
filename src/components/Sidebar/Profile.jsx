'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { getUserInfo } from '@/services/dataAPI';
import { MdLogout } from 'react-icons/md';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';


const Profile = ({setShowNav}) => {
    const router = useRouter();
    const { status, data, logout } = useAuth();

    
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserInfo();
            // console.log('user',res);
            setUser(res);
        }
        fetchUser();
    }, [status]);
  return (
    <div className=' text-white'>
        {
        status === 'loading' ? <div className=' ml-16'> <span className="loading"></span> </div> :
            <div>
                {
                    status === 'unauthenticated' ? 
                    (
                        <div className='flex flex-col gap-3 w-full px-4 py-2'>
                            <button onClick={()=>{
                                setShowNav(false);
                                router.push('/login');
                            }} className='w-full bg-white text-black font-bold py-3 rounded-full hover:scale-105 transition-transform duration-200'>
                            Log in
                            </button>
                            <button onClick={()=>{
                                setShowNav(false);
                                router.push('/signup');
                            }} className='w-full bg-transparent text-white border border-gray-500 font-bold py-3 rounded-full hover:border-white transition-colors duration-200'>
                            Sign up
                            </button>
                        </div>
                    ):
                    (
                        <div className=' flex gap-4 ml-1'>
                            <img src={data?.imageUrl || user?.imageUrl} alt='user' width={50} height={50} className='rounded-full' />
                            <div className='flex flex-col gap-1 w-full truncate'>
                                <div className='flex justify-between items-center'>
                            <h1 className='text-lg font-semibold truncate'>{data?.userName || user?.userName}</h1>
                            <MdLogout size={20} onClick={()=>{
                                setShowNav(false);
                                logout();
                            }} className='cursor-pointer text-white hover:text-[#00e6e6]' />
                            </div>
                            <h2 className='text-[10px] truncate'>{data?.email || user?.email }</h2>
                            </div>
                        </div>
                    )
                }
            </div>
        }
    </div>
  )
}

export default Profile