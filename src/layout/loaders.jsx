import { Typography } from 'antd'
import React from 'react'

export const LayoutLoaders = () => {
  return (
    <div className="flex justify-center items-center text-center min-h-screen bg-orange-600 p-4">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
        ChatWave
      </h1>
    </div>
  );
};

export const TypingLoader =()=>{
  return (
    <div className='flex justify-center p-2 m-3'>
      <Typography className='font-semibold text-pretty'>Typing..</Typography>
    </div>
  )
}

