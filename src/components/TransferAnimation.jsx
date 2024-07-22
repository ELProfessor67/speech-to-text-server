import React from 'react'

const TransferAnimation = () => {
  return (
    <div className='flex items-center justify-end mt-2'>
        <div className='flex items-center gap-5'>
            <p className='text-white'>uploading...</p>
            <div className='flex items-center gap-2 ml-3'>
                <span className='w-[.6rem] h-[.6rem] rounded-full bg-red-500 animate-red'></span>
                <span className='w-[.6rem] h-[.6rem] rounded-full bg-green-500 animate-green'></span>
            </div>
        </div>
    </div>
  )
}

export default TransferAnimation