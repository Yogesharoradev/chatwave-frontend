import React from 'react'
import { TransformImage } from '../lib/features';

const RenderAtachment = (file ,url) => {

  
      switch (file) {
        case "video":
          return  <video  src={url} preload='none' controls width={"200px"} />
          

         case "image":
             return  <img src={TransformImage(url ,20)} alt='attachment' width={"200px"} height={"150px"} style={{objectFit:"contain"}}/>
              
      case "audio":
       return <audio  src={url} controls preload='none' />
       

        default:
            file
      }
 

}

export default RenderAtachment
