import React from 'react'
import AppLayout from '../layout/appLayout'

const Home = () => {
  return (
    <div className= "flex justify-center p-9 bg-slate-200 h-full">
        <h1 className=" text-left font-semibold text-3xl ">Select a Friend To Chat</h1>
    </div>
  )
}

export default AppLayout()(Home)
