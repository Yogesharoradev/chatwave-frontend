import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='text-3xl flex flex-col justify-center text-center items-center min-h-screen font-bold'>
       <h1>* Not Found *</h1>
       <Link to={'/'}>
       <h1 className='text-red-400'>Go back to homePage</h1>
       </Link>
    </div>
  )
}

export default NotFound
