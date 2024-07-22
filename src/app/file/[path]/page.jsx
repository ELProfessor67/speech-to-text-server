"use client";

import { getFile } from '@/http/upload';
import React, { useEffect, useState } from 'react'

const page = ({ searchParams }) => {
    const [content, setContent] = useState();
    const [contentFilder, setContentFilter] = useState();
    const [query, setQuery] = useState(searchParams.query || '');

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



    useEffect(() => {
        if(query){
            const filterContentData = content?.toLocaleLowerCase().replaceAll(query.toLocaleLowerCase(),`<span style="background: red;">${query}</span>`)
            setContentFilter(filterContentData)
        }else{
            setContentFilter(content)
        }
    },[content,query])
    return (
        <section className="section bg-primary min-h-screen px-10 py-10">
            <div className="container mx-auto">
                <div className='bg-secondary py-2 px-4 rounded-3xl w-[60%] mx-auto my-10 flex items-center'>
                    <input placeholder='Search Words' className='bg-transparent border-none outline-none text-white flex-1' value={query} onChange={(e) => setQuery(e.target.value)}/>
                </div>
                <p className='border border-gray-300 rounded-md p-4 h-[80vh] overflow-y-auto text-white/80 leading-6 font-normal' dangerouslySetInnerHTML={{ __html: contentFilder }}>
                    
                </p>
            </div>
        </section>
    )
}

export default page