import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./reducers/auth"
import api from "./api/api"
import miscSlice from "./reducers/misc"
import ChatSlice from "./reducers/chat"

const store = configureStore({
    reducer : {
        [authSlice.name] : authSlice.reducer,
        [ChatSlice.name] : ChatSlice.reducer,
        [miscSlice.name] : miscSlice.reducer,
        [api.reducerPath] : api.reducer,
    },
    middleware : (mid)=>[...mid() , api.middleware]
})

export default store