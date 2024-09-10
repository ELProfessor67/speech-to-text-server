import { FILE_MANAGER } from '@/contants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaFolder, FaFolderOpen } from "react-icons/fa6";
import { FaRegFileLines } from "react-icons/fa6";
import { FaPlay, FaPause } from "react-icons/fa6";

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

const FileNode = ({ name, isFolder, children, handleDragOver, handleDrop, path, handleOnDragEnter, handleOnDragLeave, creationDate, audioPath, platform, time, directory, files, isDirectory,fileCreationDate,index }) => {
    const [open, setOpen] = useState(false);
    const [play, setPlay] = useState(false);
    const [directory2, setDirectory] = useState();
    const [files2, setFiles] = useState();
    const ref = useRef()
    const audioRef = useRef(null);
    const router = useRouter()


    const handleOpenFile = (path, name) => {
        router.push(`/file/${name}?path=${path}&filename=${name}&audioPath=${audioPath}&creationDate=${creationDate}&time=${time}&platform=${platform}`)
    }

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

    return (
        <div className='my-2'>
            <p className='text-white flex items-center cursor-pointer my-3 text-sm gap-2' >

                <span onClick={() => handleOpenFile(path, name)}>
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
                <span onClick={() => handleOpenFile(path, name)}>{index}-{name}</span>
                <span className='ml-10 text-white/50'>Call On: {formatDateTime(creationDate, time)}</span>
                <span className='ml-10 text-white/50'>Last modified: {fileCreationDate}</span>
                {
                    (name?.includes('mp3') || name?.includes('amr')) &&
                    <span className='ml-10' onClick={() => handlePlay(`${FILE_MANAGER}${audioPath}`)}>{!play ? <FaPlay color='white' size={22} /> : <FaPause color='white' size={22} />}</span>
                }
            </p>
        </div>
    )
}

export default FileNode