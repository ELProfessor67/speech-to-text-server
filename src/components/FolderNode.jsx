import { FILE_MANAGER } from '@/contants';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { FaFolder,FaFolderOpen } from "react-icons/fa6";
import { FaRegFileLines } from "react-icons/fa6";
import { FaPlay,FaPause } from "react-icons/fa6";

const FolderNode = ({name,isFolder,children,handleDragOver,handleDrop,path,handleOnDragEnter,handleOnDragLeave,creationDate,audioPath,platform}) => {
    const [open,setOpen] = useState(false);
    const [play,setPlay] = useState(false);
    const ref = useRef()
    const audioRef = useRef(null);
    const router = useRouter()
   

    const handleOpenFile = (path,name) => {
        router.push(`/file/${name}?path=${path}`)
    }

    const handlePlay = (src) => {
        if(!audioRef.current){
            audioRef.current = new Audio();
            audioRef.current.src = src;
        }
        if(play){
            setPlay(false);
            audioRef.current.pause()
        }else{
            setPlay(true)
            audioRef.current.play();
        }
    }
  return (
    <div className='my-2'>
        {
            isFolder && 
            <div
                onDrop={(e) => handleDrop(e,path)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleOnDragEnter(e,ref)}
                onDragLeave={(e) => handleOnDragLeave(e,ref)}
                ref={ref}
            >
                <p className='text-white text-md flex items-center cursor-pointer my-4 gap-2' onClick={() => setOpen(prev => !prev)}>
                    <span className='text-yellow-400'>{open ? <FaFolderOpen size={20}/> : <FaFolder size={20}/>}</span>
                    {name}
                </p>

                {
                    open &&
                    <div className='pl-5'>
                        {children.map(node => <FolderNode {...node} handleDragOver={handleDragOver} handleDrop={handleDrop} handleOnDragEnter={handleOnDragEnter} handleOnDragLeave={handleOnDragLeave}/>)}
                    </div>
                }
            </div>
        }

        {
            !isFolder &&
         
                <p className='text-white flex items-center cursor-pointer my-3 text-sm gap-2' >
                    
                    <span onClick={() => handleOpenFile(path,name)}>
                        {
                            platform == 'whatsapp' ?
                            <img src='/whatsapp-icon.png' width={20} height={20}/>:
                            platform == 'phone' ? 
                            <img src='/phone-icon.png' width={20} height={20}/>:
                            platform == 'skype' ? 
                            <img src='/skype-icon.png' width={20} height={20}/>:
                            <FaRegFileLines size={20}/>
                        } 
                        
                    </span>
                    <span onClick={() => handleOpenFile(path,name)}>{name}</span>
                    <span className='ml-10 text-white/50'>Created at: {creationDate}</span>
                    <span className='ml-10 text-white/50'>Last modified: {creationDate}</span>
                    {
                        (name?.includes('mp3') || name?.includes('amr'))  &&
                        <span className='ml-10' onClick={() => handlePlay(`${FILE_MANAGER}${audioPath}`)}>{!play ? <FaPlay color='white' size={22}/> : <FaPause color='white' size={22}/>}</span>
                    }
                </p>
           
        }
        
    </div>
  )
}

export default FolderNode