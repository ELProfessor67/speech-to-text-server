"use client"
import FileNode from '@/components/FilesNode';
import FolderNode from '@/components/FolderNode';
import TransferAnimation from '@/components/TransferAnimation';
import { contactRequest, getAllDirectory, getFileWithDateRequest, getFileWithWordRequest, loginRequest, logoutRequest, uploadHandler } from '@/http/upload';
import { Flamenco } from 'next/font/google';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { FaFile, FaFolder } from 'react-icons/fa6';
import { FaRegFileLines } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";

function parseCustomDateTime(dateTimeStr) {
  // Extract date and time components
  const year = parseInt(dateTimeStr.substring(0, 4));
  const month = parseInt(dateTimeStr.substring(4, 6)) - 1; // Months are 0-based in JS
  const day = parseInt(dateTimeStr.substring(6, 8));
  const hours = parseInt(dateTimeStr.substring(9, 11));
  const minutes = parseInt(dateTimeStr.substring(11, 13));
  const seconds = parseInt(dateTimeStr.substring(13, 15));

  // Create and return the Date object
  return new Date(year, month, day, hours, minutes, seconds);
}

function groupByDate(dataArray) {
  return dataArray.reduce((result, item) => {
      const date = item.date;
      if (!result[date]) {
          result[date] = [];
      }
      result[date].push(item);
      return result;
  }, {});
}


function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
}

const FolderSelector = () => {
  const [folders, setFolder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [date,setDate] = useState('');
  const [queryLoading, setQueryLoading] = useState();
  const [filesWithWords, setFileWithWords] = useState([]);
  const [filesWithDate, setFileWithDate] = useState([]);
  const [dateLoading, setDateLoading] = useState(false);
  const [enddate, setEndDate] = useState('');
  const [contact, setContact] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [files, setFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const emptyDragRef = useRef();
  const DragRef = useRef();

  const handleFolderSelection = async (event) => {
    setLoading(true)
    const selectedFiles = Array.from(event.target.files);
    console.log(selectedFiles);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      const element = selectedFiles[i];
      formData.append('files', element);
      formData.append(`path-${i}`,element.webkitRelativePath);
      formData.append(`date-${i}`,element.lastModified)
    }
    
    const res = await uploadHandler(formData);
    getFolders()
    setLoading(false)
    
  };

  const handleFileSelection = async (event) => {
    setLoading(true)
    const selectedFiles = Array.from(event.target.files);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      const element = selectedFiles[i];
      formData.append('files', element);
      formData.append(`path-${i}`,element.name)
      formData.append(`date-${i}`,element.lastModified)
    }
    
    const res = await uploadHandler(formData);
    getFolders()
    setLoading(false)
  };

  function getFilesDataTransferItems(dataTransferItems) {
    function traverseFileTreePromise(item, path, folder) {
      return new Promise((resolve) => {
        if (item.isFile) {
          item.file((file) => {
            file.filepath = path + file.name; // Save full path
            folder.push(file);
            resolve(file);
          });
        } else if (item.isDirectory) {
          let dirReader = item.createReader();
          dirReader.readEntries((entries) => {
            let entriesPromises = [];
            for (let entr of entries)
              entriesPromises.push(
                traverseFileTreePromise(entr, path + item.name + "/", folder)
              );
            resolve(Promise.all(entriesPromises));
          });
        }
      });
    }

    let files = [];
    return new Promise((resolve, reject) => {
      let entriesPromises = [];
      for (let it of dataTransferItems)
        entriesPromises.push(
          traverseFileTreePromise(it.webkitGetAsEntry(), '', files)
        );
      Promise.all(entriesPromises).then(() => {
        resolve(files);
      });
    });
  }

  const handleDrop = async (event,path=null) => {
    setLoading(true)
    event.preventDefault();
    event.stopPropagation();
    const items = event.dataTransfer.items;
    const data = await getFilesDataTransferItems(items);
   
    const formData = new FormData();
    data.forEach((file,i) => {
  
      const [platform] = file.name.split('_');
      const [filename,ext] = file.name.split('.');
      let dateinfo, phone, _;
      if (platform == 'phone') {
        if(filename.split('_').length >= 4){
          [_, dateinfo, _, phone] = filename.split('_');
          console.log('upar')
        }else{
          [_, dateinfo, phone] = filename.split('_');
          console.log('niche')
        }
        console.log(filename.split('_'),filename)
      } else {
        [_, dateinfo, phone] = filename.split('_');
      }
      console.log(platform, dateinfo, phone)
      let name;
      if (phone) {
        if (isNaN(phone)) {
          name = phone
        } else {
          let number = phone.slice(-10);
          number = number.replaceAll(' ','');

          const contactInfo = contact.filter(contact => contact.number?.replaceAll(' ','')?.includes(number));
          console.log(contactInfo)
          if (contactInfo.length == 0) {
            name = phone;
          } else {
            name = contactInfo[0].name;
          }
          }
      }
      const time = dateinfo.split('-')[1]
      const date = parseCustomDateTime(dateinfo)

      name = name?.replaceAll(' ', '_');
      console.info(name,phone,name || phone)
      const filesname = `${name || phone}/${name || phone}.${ext}`;
      formData.append('files', file)
      formData.append(`path-${i}`, filesname)
      formData.append(`creationdate-${i}`,file.lastModified)
      formData.append(`date-${i}`,date.getTime() || new Date().getTime())
      formData.append(`time-${i}`,time)

      if(path){
        formData.append(`storepath-${i}`,path+`/${name}`)
      }else{
        formData.append(`storepath-${i}`,`/root/file-manager-api/eligindi/Calls/${name}`)
      }
    });

  


    const res = await uploadHandler(formData,setUploadProgress);

    getFolders()
    setUploadProgress(0)
    setLoading(false)
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };


  const handleOnDragEnter = (e,ref) => {
    e.stopPropagation();
    e.preventDefault();
    ref.current.classList.add('bg-highlight')
   
  }

  const handleOnDragLeave = (e,ref) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('calling',ref)
    ref.current.classList.remove('bg-highlight')
  }


 async function getFolders() {
    try {
      const res = await getAllDirectory();
      setFolder(res.data?.folder);
      const data = res.data?.folder;
      const files = data?.filter(file => !file.isFolder);
      const directory = data?.filter(file => file.isFolder);
      setFiles(groupByDate(files));
      setDirectory(directory);
    } catch (error) {
      console.log(error)
    }
  }

  async function getContact() {
    try {
      const res = await contactRequest();
      setContact(res.data?.contact);
    } catch (error) {
      console.log(error)
    }
  }


  async function getFileWithWords (){
    setQueryLoading(true)
    try {
      const res = await getFileWithWordRequest(query);
      setFileWithWords(res.data.files);
      setQueryLoading(false);
    } catch (error) {
      console.log(error.message)
      setQueryLoading(false)
    }
  }



  useEffect(() => {
    getFolders();
    getContact();
  },[]);


  useEffect(() => {
    const timeoutref = setTimeout(() => {
      if(query){
        setDate('');
        setEndDate('');
        getFileWithWords();
      }
    },1000);

    return () => clearTimeout(timeoutref);
  },[query]);


  async function getFileWithDate (){
    setDateLoading(true)
    try {
      const lastDate = enddate || formatDate(new Date())
      const res = await getFileWithDateRequest(date,lastDate);
      setFileWithDate(res.data.files);
      setDateLoading(false);
    } catch (error) {
      console.log(error.message)
      setDateLoading(false)
    }
  }


  useEffect(() => {
    if(date){
      getFileWithDate();
    }
  },[date,enddate])

  const handelLogout = async () => {
    try {
      const res = await logoutRequest();
      if(res.data.success){
        window.location.reload()
      }
    } catch (error) {
      console.log(error.message)
    }
  }


  return (
    <section className="section bg-primary min-h-screen px-10 py-10">
      <div className="container mx-auto">
        <div className='flex items-center justify-between'>

        
        <div className="header flex items-center overflow-x-auto gap-8">
          <label htmlFor="fileupload">
            <div className="w-[7rem] h-[7rem] cursor-pointer flex items-center flex-col justify-center gap-2 bg-secondary rounded-md">
              <h4 className="text-foregroud-primary text-sm">Upload File</h4>
              <span className='text-foregroud-primary/25 text-3xl'><FaFile /></span>
            </div>
          </label>

          <label htmlFor="folderupload">
            <div className="w-[7rem] h-[7rem] cursor-pointer flex items-center justify-center gap-2 flex-col bg-secondary rounded-md">
              <h4 className="text-foregroud-primary text-sm">Upload Folder</h4>
              <span className='text-foregroud-primary/25 text-3xl'><FaFolder /></span>
            </div>
          </label>
        </div>
        <div className='flex items-center gap-5'>

          <button className='py-2 px-4 rounded-3xl text-white bg-secondary' onClick={handelLogout}>Logout</button>
          <Link href='/change-password' className='py-2 px-4 rounded-3xl text-white bg-secondary'>Change Password</Link>
        </div>

        </div>
        <input
          type="file"
          onChange={handleFileSelection}
          id="fileupload"
          hidden
        />

        <input
          type="file"
          webkitdirectory="true"
          multiple
          onChange={handleFolderSelection}
          id="folderupload"
          hidden
        />
        
        {/* while no folders avaiblr  */}
        {
          folders && folders.length == 0 && 
          <div>
          <div
            ref={emptyDragRef}
            onDragEnter={(e) => handleOnDragEnter(e,emptyDragRef)}
            onDragLeave={(e) => handleOnDragLeave(e,emptyDragRef)}
            onDrop={(e) => handleDrop(e,null)}
            onDragOver={handleDragOver}
            className="h-[35rem] mt-10 flex items-center justify-center relative border-2 border-gray-300 border-dashed rounded-lg p-6"
            id="dropzone"
          >
            <div className="text-center">
              <img
                className="mx-auto h-12 w-12"
                src="https://www.svgrepo.com/show/357902/image-upload.svg"
                alt=""
              />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                <label htmlFor="folderupload" className="relative cursor-pointer">
                  <span>Drag and drop</span>
                  <span className="text-indigo-600"> or browse</span>
                  <span> to upload</span>
                </label>
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                mp4, ogg, flac, alac, aiff, wma
              </p>
            </div>
            <img src="" className="mt-4 mx-auto max-h-40 hidden" id="preview" />
          </div>
          {
            loading && <TransferAnimation/>
          }
          
          </div>
        }

        {/* Search  */}
        {
          folders && folders.length != 0 &&
          <div className='flex items-center justify-between  mt-10 -mb-2'>
            <div className='bg-secondary py-2 px-4 rounded-3xl w-[30rem] flex items-center'>
              <input placeholder='Search Words' className='bg-transparent border-none outline-none text-white flex-1' value={query} onChange={(e) => setQuery(e.target.value)}/>
            </div>

            <div className='flex items-center gap-5'>
              <div>
                <label className='text-white ml-2 mb-1'>Start</label>
                <div className='bg-secondary py-2 px-4 rounded-3xl w-[10rem] flex items-center cursor-pointer'>
                  <input type='date' className='bg-transparent border-none outline-none text-white flex-1 cursor-pointer' value={date} onChange={(e) => {setQuery(''); setDate(e.target.value)}}/>
                </div>
              </div>
              <div>
                <label className='text-white ml-2 mb-1'>End</label>
                <div className='bg-secondary py-2 px-4 rounded-3xl w-[10rem] flex items-center cursor-pointer'>
                  <input type='date' className='bg-transparent border-none outline-none text-white flex-1 cursor-pointer' value={enddate} onChange={(e) => {setQuery(''); setEndDate(e.target.value)}}/>
                </div>
              </div>
            </div>
          </div>
        }

        {/* folders  */}
        {
          folders && folders.length != 0 && !query && !date &&
          <div>
          <div
            ref={DragRef}
            onDragEnter={(e) => handleOnDragEnter(e,DragRef)}
            onDragLeave={(e) => handleOnDragLeave(e,DragRef)}
            onDrop={(e) => handleDrop(e,null)}
            onDragOver={handleDragOver}
            className="h-[35rem] mt-10 relative border-2 border-gray-300 border-dashed rounded-lg p-6 overflow-y-auto"
            id="dropzone"
          >
            <div className='py-2'>
              {
                directory?.map((node) => <FolderNode {...node} handleDragOver={handleDragOver} handleDrop={handleDrop} handleOnDragEnter={handleOnDragEnter} handleOnDragLeave={handleOnDragLeave}/>)
              }

              {
                Object.keys(files)?.map((key) => (
                  <div>
                    <h2 className='text-white mb-1'>{key}</h2>
                    {
                      files[key]?.map((file,index) => (
                        <FileNode {...file} index={index+1}/>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
          {
            loading && <TransferAnimation uploadProgress={uploadProgress}/>
          }
          </div>
        }

        {/* by words query  */}
        {
          folders && folders.length != 0 && query && !date &&
          <div
            
            className="h-[35rem] mt-10 relative border-2 border-gray-300 border-dashed rounded-lg p-6 overflow-y-auto"
            id="dropzone"
          >
            {
              queryLoading && 
              <div className='w-full h-full flex items-center justify-center '>
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
                    <div class="wheel"></div>
                    <div class="hamster">
                      <div class="hamster__body">
                        <div class="hamster__head">
                          <div class="hamster__ear"></div>
                          <div class="hamster__eye"></div>
                          <div class="hamster__nose"></div>
                        </div>
                        <div class="hamster__limb hamster__limb--fr"></div>
                        <div class="hamster__limb hamster__limb--fl"></div>
                        <div class="hamster__limb hamster__limb--br"></div>
                        <div class="hamster__limb hamster__limb--bl"></div>
                        <div class="hamster__tail"></div>
                      </div>
                    </div>
                    <div class="spoke"></div>
                  </div>
              </div>
            }

            {
              filesWithWords && filesWithWords.length != 0 && !queryLoading && 
              filesWithWords.map(({content,name,path,creationDate,audioPath,time,platform},i) => (
                <Link href={`/file/${name}?path=${path}&query=${query}&filename=${`${i+1}-${name}`}&audioPath=${audioPath}&creationDate=${creationDate}&time=${time}&platform=${platform}`}>
                  <div className='p-2 bg-secondary rounded-md my-3'>
                    <p className='text-sm text-white/50 mb-2 flex items-center'>{i+1}-{name}  <span className='ml-10 text-white/50'>Created at: {creationDate}</span>
                    <span className='ml-10 text-white/50'>Last modified: {creationDate}</span> </p>
                  <p className='text-white/90 leading-6 font-normal' dangerouslySetInnerHTML={{ __html: content }}>
                    
                    </p>
                  </div>
                </Link>
              ))
              
            }


            {
              !queryLoading && filesWithWords.length == 0 &&
              <div className='w-full h-full flex items-center justify-center flex-col'>
                <h2 className='text-white text-xl'>NO FILE FOUND: <span className='text-foregroud-secondary'>{query}</span></h2>
                <span className='text-white/50 mt-5'><RxCrossCircled size={100}/></span>
              </div>
            }
          </div>
        }

        {/* by dates  */}
       {
          folders && folders.length != 0 && date && !query &&
          <div
            
            className="h-[35rem] mt-10 relative border-2 border-gray-300 border-dashed rounded-lg p-6 overflow-y-auto"
            id="dropzone"
          >
            {
              dateLoading && 
              <div className='w-full h-full flex items-center justify-center '>
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
                    <div class="wheel"></div>
                    <div class="hamster">
                      <div class="hamster__body">
                        <div class="hamster__head">
                          <div class="hamster__ear"></div>
                          <div class="hamster__eye"></div>
                          <div class="hamster__nose"></div>
                        </div>
                        <div class="hamster__limb hamster__limb--fr"></div>
                        <div class="hamster__limb hamster__limb--fl"></div>
                        <div class="hamster__limb hamster__limb--br"></div>
                        <div class="hamster__limb hamster__limb--bl"></div>
                        <div class="hamster__tail"></div>
                      </div>
                    </div>
                    <div class="spoke"></div>
                  </div>
              </div>
            }

            {
              filesWithDate && filesWithDate.length != 0 && !dateLoading && 
              filesWithDate.map(({content,name,path,creationDate,audioPath,time,platform},i) => (
                <Link href={`/file/${name}?path=${path}&filename=${`${i+1}-${name}`}&audioPath=${audioPath}&creationDate=${creationDate}&time=${time}&platform=${platform}`}>
                  <div className='py-2 px-4 bg-secondary rounded-md my-3 flex items-center gap-3'>
                    <span className='text-white/60'><FaRegFileLines size={20}/></span>
                    <p className='text-white/60 mb-0'>{i+1}-{name}</p>
                    <span className='ml-10 text-white/50'>Created at: {creationDate}</span>
                    <span className='ml-10 text-white/50'>Last modified: {creationDate}</span>
                  </div>
                </Link>
              ))
            }


            {
              !dateLoading && filesWithDate.length == 0 &&
              <div className='w-full h-full flex items-center justify-center flex-col'>
                <h2 className='text-white text-xl'>NO FILE FOUND: <span className='text-foregroud-secondary'>{date}</span></h2>
                <span className='text-white/50 mt-5'><RxCrossCircled size={100}/></span>
              </div>
            }
          </div>
        }
        
      </div>
    </section>
  );
};

export default FolderSelector;
