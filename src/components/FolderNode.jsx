import { FILE_MANAGER } from '@/contants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaFolder, FaFolderOpen } from "react-icons/fa6";
import { FaRegFileLines } from "react-icons/fa6";
import { FaPlay, FaPause } from "react-icons/fa6";
import FileNode from './FilesNode';


function groupByDate(dataArray) {
    return dataArray.reduce((result, item) => {
        const date = item.creationDate;
        console.log(date,'ssss')
        if (!result[date]) {
            result[date] = [];
        }
        result[date].push(item);
        return result;
    }, {});
}

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

const FolderNode = ({ name, isFolder, children, handleDragOver, handleDrop, path, handleOnDragEnter, handleOnDragLeave, creationDate, audioPath, platform, time, date }) => {
    const [open, setOpen] = useState(false);
    const [play, setPlay] = useState(false);
    const [directory, setDirectory] = useState();
    const [files, setFiles] = useState();
    const ref = useRef()
    const audioRef = useRef(null);
    const router = useRouter()


    const handleOpenFile = (path, name) => {
        router.push(`/file/${name}?path=${path}`)
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
        }
    }

    useEffect(() => {
        const files = children?.filter(file => !file.isFolder)
        const directory = children?.filter(file => file.isFolder)
        setFiles(groupByDate(files));
        setDirectory(directory)
    }, [])
    return (
        <div className='my-2'>


            <div
                onDrop={(e) => handleDrop(e, path)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleOnDragEnter(e, ref)}
                onDragLeave={(e) => handleOnDragLeave(e, ref)}
                ref={ref}
            >
                <p className='text-white text-md flex items-center cursor-pointer my-4 gap-2' onClick={() => setOpen(prev => !prev)}>
                    <span className='text-yellow-400'>{open ? <FaFolderOpen size={20} /> : <FaFolder size={20} />}</span>
                    {name}
                </p>

                {
                    open &&
                    <div className='py-2'>
                        {
                            directory?.map((dir) => <FolderNode {...dir} data={dir} handleDragOver={handleDragOver} handleDrop={handleDrop} handleOnDragEnter={handleOnDragEnter} handleOnDragLeave={handleOnDragLeave} />)
                        }

                        {
                            Object.keys(files)?.map((key,i) => (
                                <div className='px-4'>
                                     <h2 className={`text-white mb-2 text-xl ${i == 0 ? 'mt-2': 'mt-8'}`}>{key}</h2>
                                    {
                                        files[key]?.map((file,index) => (
                                            <FileNode {...file} index={index+1}/>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>

                }
            </div>


        </div>
    )
}

export default FolderNode