import { Typography } from 'antd'
import moment from 'moment'
import React from 'react'
import { fileFormat } from '../lib/features'
import RenderAtachment from './renderAtachment'
import {motion} from 'framer-motion'

const Messagecomponent = ({message , user }) => {

    const {sender , content , attachments =[] , createdAt} = message

    const sameSender = sender?._id === user?._id

    const TimeAgo = moment(createdAt).fromNow()
  return (
    <motion.div 

    initial={{opacity: 0, x:"-100%"}}
    whileInView = {{opacity:1 , x:0}}

    className='bg-red-500'
    style={{
      alignSelf: sameSender ? 'flex-end' : 'flex-start',
      backgroundColor: sameSender ? '#e0f7fa' : '#f1f1f1',
      color: 'black',
      borderRadius: '5px',
        padding: '0.5rem',
        maxWidth: '100%',
        marginBottom: '0.5rem',
        textAlign: sameSender ? 'right' : 'left',
        }}>
           
                {
                   !sameSender && <Typography className="font-semibold text-blue-600">{sender.name}</Typography>
                }
                {
                   sameSender && <Typography className="font-semibold text-blue-600">You</Typography>
                }
                {
                    content && <h1>{content}</h1>
                }
                    {
                        attachments.length > 0 && attachments.map((i , index)=>{
                            const url = i.url 
                            const file = fileFormat(url)
                            return <div className='mt-3'
                            key={index}
                            style={{
                              textAlign: sameSender ? 'right' : 'left',
                              marginBottom: '0.5rem',
                            }}
                          >
                            <a
                              href={url}
                              target='_blank'
                              rel='noopener noreferrer'
                              download
                              className='text-black'
                              style={{
                                display: 'inline-block',
                                textAlign: sameSender ? 'right' : 'left',
                              }}
                              >
                              {RenderAtachment(file, url)}
                            </a>
                          </div>
                        })
                      }
                    <Typography className="font-semibold text-blue-600">{TimeAgo}</Typography>
    </motion.div>
                    
  )
}

export default Messagecomponent
