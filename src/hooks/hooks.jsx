import { useEffect } from "react"
import { message } from "antd"

const useErrors =(errors =[])=>{
useEffect(()=>{
    errors.forEach(({isError , error ,fallback})=>{
            if(isError){
                if(fallback) fallback()
                else message.error(error?.data?.message || "something went wrong")
            }
    })
},[])
}

const useSocketEvents = (socket , handlers)=>{
    useEffect(()=>{
         if (socket && typeof socket.on === 'function') 
        Object.entries(handlers).forEach(([event,handler])=>{
            socket.on(event , handler)
          })
         return ()=>{
            if (socket && typeof socket.on === 'function') 
             Object.entries(handlers).forEach(([event ,handler])=>{
                  socket.off(event,handler)
                })
            }
     
    },[socket , handlers])
}
export {useErrors , useSocketEvents}