
import {createSlice} from "@reduxjs/toolkit"
import { getorSaveFromStorage } from "../../lib/features"
import { NEW_MESSAGE_ALERT } from "../../constants/events"

const ChatSlice = createSlice({

    name : "chat",

    initialState:{
        NotificationCount : 0,
        NewMessageAlert :  getorSaveFromStorage({
            key: NEW_MESSAGE_ALERT ,
             get: true,
            }) ||    [
            {
                 chatId: "",
                 count : 0
             }
        ]
    },
    reducers  :{
        incrementNotificationCount  : (state)=>{
            state.NotificationCount += 1     
             },
        resetNotficationCount : (state)=>{
            state.NotificationCount = 0 
        },
        setNewMessageAlert : (state , action)=>{
            const chatId = action.payload.chatId
         const index =  state.NewMessageAlert.findIndex(
            (item)=> item.chatId === chatId
         )
         if(index !== -1){
                    state.NewMessageAlert[index].count += 1
         }else{
            state.NewMessageAlert.push({
                chatId ,
                count : 1
            })
         }
        },
        removeNewMessage :(state, action)=>{
            state.NewMessageAlert = state.NewMessageAlert.filter((item)=> item.chatId !== action.payload)
        }
}
})



export default ChatSlice 
export const { 
    incrementNotificationCount,
    resetNotficationCount,
    setNewMessageAlert,
    removeNewMessage
    } = ChatSlice.actions