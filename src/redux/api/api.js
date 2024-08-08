import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({

        reducerPath :"api",
        baseQuery : fetchBaseQuery({baseUrl : `${server}/api/v1/`}),
        tagTypes :["Chat" , "User" , "Message"],

        endpoints : (builder)=>({
                myChats : builder.query(
                    {
                        query : ()=>({
                            url : "chat/mychat" ,credentials : "include"
                        }),
                        providedTags : ["chat"]
                    }
                ),
                searchUser : builder.query(
                    {
                        query : (name)=>({
                            url : `user/search/?name=${name}` ,credentials : "include"
                        }),
                        providedTags : ["User"]
                    }
                ),
                sendFriendRequest  : builder.mutation(
                    {
                        
                            query : (data)=>({
                                url : `user/sendRequest`,
                                credentials : "include",
                                method : "PUT",
                                body : data ,
                            }),
                            providedTags : ["User"]
                        
                    }
                ),
                getNotifications : builder.query(
                    {
                        query : ()=>({
                            url : `user/notifications` ,credentials : "include"
                        }),
                        keepUnusedDataFor : 0
                    }
                ),
                acceptFriendRequest  : builder.mutation(
                    {
                        
                            query : (data)=>({
                                url : `user/acceptRequest`,
                                credentials : "include",
                                method : "PUT",
                                body : data ,
                            }),
                            invalidatesTags: ["Chat"]
                        
                    }
                ),
                chatDetails : builder.query(
                    {
                        query : ({chatId , populate = false})=>{
                                let url = `chat/${chatId}`
                                if(populate) url +="?populate=true";
                            return{
                                url,
                                credentials : "include"
                            }
                            
                        },
                        providesTags : ["Chat"]
                    }),
                  getMessages : builder.query({
                             query : ({chatId , page})=>({
                                    url : `chat/message/${chatId}?page=${page}`,
                                    credentials : "include"
                                }),
                              keepUnusedDataFor : 0
                 }),
                 sendAttachments  : builder.mutation(
                    { 
                            query : (data)=>({
                                url : `chat/message`,
                                credentials : "include",
                                method : "POST",
                                body : data ,
                            })         
                    }
                ),
             myGroups : builder.query({
                query : ()=>({
                    url : `chat/mygroups`,
                    credentials : "include"
                }),
                    providedTags : ["Chat"]
             }),
             MyFriends : builder.query(
                {
                    query : (chatId)=>{
                            let url = `user/friends`
                            if(chatId) url += `?chatId=${chatId}`;
                        return{
                            url,
                            credentials : "include"
                        }
                        
                    },
                    providesTags : ["Chat"]
                }),
            MyGroups : builder.mutation({
                query :({name, members}) =>({
                    url : "chat/new",
                    method : "POST",
                    credentials : "include",
                    body : {name , members},
                }),
                    invalidatesTags : ["Chat"]
            }),
            renameGroup : builder.mutation({
                query :({name, chatId}) =>({
                    url : `chat/${chatId}`,
                    method : "PUT",
                    credentials : "include",
                    body : {name},
                }),
                    invalidatesTags : ["Chat"]
            }),
            removeMember : builder.mutation({
                query :({userId, chatId}) =>({
                    url : `chat/removemember`,
                    method : "PUT",
                    credentials : "include",
                    body : {chatId ,userId},
                }),
                    invalidatesTags : ["Chat"]
            }),
            AddMember : builder.mutation({
                query :({members, chatId}) =>({
                    url : `chat/addmembers`,
                    method : "PUT",
                    credentials : "include",
                    body : {members ,chatId},
                }),
                    invalidatesTags : ["Chat"]
            }),
            deleteChat : builder.mutation({
                query :({chatId}) =>({
                    url : `chat/${chatId}`,
                    method : "DELETE",
                    credentials : "include",
                }),
                    invalidatesTags : ["Chat"]
            }),
            leaveGroup : builder.mutation({
                query :({chatId}) =>({
                    url : `chat/leave/${chatId}`,
                    method : "DELETE",
                    credentials : "include",
                }),
                    invalidatesTags : ["Chat"]
            }),
            adminLogin : builder.mutation({
                query : ({secretKey})=>({
                    url : `admin/verify`,
                    method : "PUT",
                    credentials : "include",
                    body : {secretKey}
                })
            }),
            adminLogOut : builder.query({
                query : ()=>({
                    url : `admin/logout`,
                    credentials : "include",
                })
            }),
            GetAdmin : builder.query({
                query : ()=>({
                    url : `admin/`,
                    credentials : "include",
                })
            }),
            GetStats : builder.query({
                query : ()=>({
                    url : `admin/stats`,
                    credentials : "include",
                })
            }),
            Adminchats : builder.query({
                query : ()=>({
                    url : `admin/chats`,
                    credentials : "include",
                })
            }),
            AdminMessages : builder.query({
                query : ()=>({
                    url : `admin/messages`,
                    credentials : "include",
                })
            }),
            AdminUsers : builder.query({
                query : ()=>({
                    url : `admin/users`,
                    credentials : "include",
                })
            }),





               
        })

})

export default api
export const {useMyChatsQuery , useLazySearchUserQuery , useSendFriendRequestMutation ,useChatDetailsQuery,
     useGetNotificationsQuery , useAcceptFriendRequestMutation , useGetMessagesQuery , useSendAttachmentsMutation,
    useMyGroupsQuery , useMyFriendsQuery, useAdminLoginMutation,useGetStatsQuery , useGetAdminQuery, useAdminLogOutQuery, useLeaveGroupMutation,useDeleteChatMutation , useMyGroupsMutation ,useRenameGroupMutation ,
     useAddMemberMutation ,useRemoveMemberMutation ,useAdminMessagesQuery ,useAdminUsersQuery ,useAdminchatsQuery} = api