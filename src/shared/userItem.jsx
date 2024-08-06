import React, { memo } from 'react'
import { Avatar } from 'antd'

const UserItem = ({user , handler , handlerisLogin}) => {

    const {name , _id , avatar} = user
  return (
    <div className='flex gap-3 items-center overflow-hidden'>
            <Avatar src={avatar}></Avatar>
            <h1>{name}</h1>
            <span onClick={()=>handler(_id)}> 
                  icon button
             </span>
    </div>
  )
}

export default memo(UserItem)
