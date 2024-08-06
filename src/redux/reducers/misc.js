
import {createSlice} from "@reduxjs/toolkit"

const miscSlice = createSlice({

    name : "misc",

    initialState:{
    isNewGroup  :false , 
    isNotification  :false,
    isAddMember : false , 
    isMobile : false ,
    isSearch : false , 
    isFileMenu : false,
    isDeleteMenu : false,
    isUploaadingLoader : false,
    selectedDeleteChat :{
        chatId : "" , 
        groupChat  : false
    },
    },
    reducers  :{
        setIsNewGroup  : (state,action )=>{
            state.isNewGroup = action.payload
        },
        setIsNotification  : (state,action )=>{
            state.isNotification = action.payload
        },
        setIsAddMember : (state,action )=>{
            state.isAddMember = action.payload
        },
        setIsMobile  : (state,action )=>{
            state.isMobile = action.payload
        },
        setIsSearch  : (state,action )=>{
            state.isSearch = action.payload
        },
        setIsFileMenu  : (state,action )=>{
            state.isFileMenu = action.payload
        },
        setIsDeleteMenu  : (state,action )=>{
            state.isDeleteMenu = action.payload
        },
        setIsUploadingLoader : (state,action )=>{
            state.isUploaadingLoader = action.payload
        },
        setSelectedDeleteChat : (state ,action)=>{
            state.selectedDeleteChat = action.payload
        }
        
        
    }
})



export default miscSlice 
export const { 
    setIsNewGroup  ,
    setIsNotification ,
    setIsAddMember , 
    setIsMobile  ,
    setIsSearch  , 
    setIsFileMenu ,
    setIsDeleteMenu ,
    setIsUploadingLoader,
    setSelectedDeleteChat} = miscSlice.actions