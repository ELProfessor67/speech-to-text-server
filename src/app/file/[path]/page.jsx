"use client";

import { FILE_MANAGER } from '@/contants';
import { getFile } from '@/http/upload';
import React, { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay, FaRegFileLines } from 'react-icons/fa6';

function formatDateTime(date, time) {
    // Extract day, month, and year from the date part
    const [day, month, year] = date.split('-');

    // Map month number to month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Format the time part
    const hours = time.slice(0, 2);
    const minutes = time.slice(2, 4);
    const seconds = time.slice(4, 6);

    // Combine the formatted components into the desired output format
    const formattedDateTime = `${day} ${monthName} ${year}, ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}

const page = ({ searchParams }) => {
    const [content, setContent] = useState();
    const [contentFilder, setContentFilter] = useState();
    const [query, setQuery] = useState(searchParams.query || '');
    const { filename, audioPath, creationDate,platform,time } = searchParams;
   
    
    const [play, setPlay] = useState(false);
    const audioRef = useRef(null);

    const getFileContent = async () => {
        try {
            const res = await getFile(searchParams.path);
            setContent(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getFileContent()
    }, [searchParams.path])

    const handlePlay = (src) => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.src = src;
        }
        if (play) {
            setPlay(false);
            audioRef.current.pause()
        } else {
            setPlay(true)
            audioRef.current.play();
            audioRef.current.volume = 1;
        }
    }



    useEffect(() => {
        if (query) {
            const filterContentData = content?.toLocaleLowerCase().replaceAll(query.toLocaleLowerCase(), `<span style="background: red;">${query}</span>`)
            setContentFilter(filterContentData)
        } else {
            setContentFilter(content)
        }
    }, [content, query])
    return (
        <section className="section bg-primary min-h-screen px-10 py-10">
            <div className="container mx-auto">
                <div className='bg-secondary py-2 px-4 rounded-3xl w-[60%] mx-auto my-10 flex items-center'>
                    <input placeholder='Search Words' className='bg-transparent border-none outline-none text-white flex-1' value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div className='my-2'>
                    <p className='text-white flex items-center cursor-pointer my-3 text-sm gap-2' >

                        <span>
                            {
                                platform == 'whatsapp' ?
                                    <img src='/whatsapp-icon.png' width={20} height={20} /> :
                                    platform == 'phone' ?
                                        <img src='/phone-icon.png' width={20} height={20} /> :
                                        platform == 'skype' ?
                                            <img src='/skype-icon.png' width={20} height={20} /> :
                                            <FaRegFileLines size={20} />
                            }

                        </span>
                        <span>{audioPath?.replace('/public/Calls/','')?.split('/')[0]}/{filename}</span>
                        <span className='ml-10 text-white/50'>Call On: {formatDateTime(creationDate, time)}</span>
                        <span className='ml-10 text-white/50'>Last modified: {creationDate}</span>
                        <span className='ml-10' onClick={() => handlePlay(`${FILE_MANAGER}${audioPath}`)}>{!play ? <FaPlay color='white' size={22} /> : <FaPause color='white' size={22} />}</span>
                    </p>
                </div>
                <p className='border border-gray-300 rounded-md p-4 h-[80vh] overflow-y-auto text-white/80 leading-6 font-normal' dangerouslySetInnerHTML={{ __html: contentFilder }}>

                </p>
            </div>
        </section>
    )
}

export default page