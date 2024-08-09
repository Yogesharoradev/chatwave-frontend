import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '../layout/appLayout';
import { Button, Form, Input, Popover, Skeleton, Tooltip, Typography, message } from 'antd';
import { CgAttachment } from 'react-icons/cg';
import { IoSend } from 'react-icons/io5';
import { FaImages, FaFileAlt, FaVideo, FaFile } from "react-icons/fa";
import Messagecomponent from '../shared/messagecomponent';
import { getSocket } from '../socket';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery, useSendAttachmentsMutation } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hooks';
import { useForm } from 'antd/es/form/Form';
import { useInfiniteScrollTop } from '6pp';
import { setIsUploadingLoader } from '../redux/reducers/misc';
import { useDispatch } from 'react-redux';
import { removeNewMessage } from '../redux/reducers/chat';
import { TypingLoader } from '../layout/loaders';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatId, user }) => {
  const [form] = useForm();
  const containerRef = useRef(null);
  const fileRef = useRef(null);
  const VideoRef = useRef(null);
  const AudioRef = useRef(null);
  const ImageRef = useRef(null);
  const [iamTyping, setIamTyping] = useState(false);
  const [UserTyping, setUserTyping] = useState(false);
  const typingTimeOut = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const [sendAttachments] = useSendAttachmentsMutation();
  const oldMessageschunk = useGetMessagesQuery({ chatId, page });

  const members = chatDetails?.data?.chat?.members;
  const [messages, setMessages] = useState([]);

  const { data: oldMessage, setData: setOldMessage } = useInfiniteScrollTop(
    containerRef,
    oldMessageschunk.data?.totalPages,
    page,
    setPage,
    oldMessageschunk?.data?.message
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessageschunk.isError, error: oldMessageschunk.error }
  ];

  const submitMessage = (values) => {
    if (!values.message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message: values.message });
    form.resetFields();
  };

  const newMessages = useCallback((data) => {
    if (data.chatId !== chatId) return;

    setMessages(prev => [...prev, data.message]);

  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(true);
  }, [chatId]);

  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(false);
  }, [chatId]);

  const allMessages = [...oldMessage, ...messages];

  const alertListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    const MessageForAlert = {
      content: data.message,
      sender: {
        _id: "adsakd",
        name: "Admin"
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, MessageForAlert]);
  }, [chatId]);

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessages,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const selectImage = () => ImageRef.current?.click();
  const selectVideo = () => VideoRef.current?.click();
  const selectAudio = () => AudioRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessage(chatId));
    return () => {
      setPage(1);
      setMessages([]);
      setOldMessage([]);
      form.resetFields();
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const messageOnChange = () => {
    if (!iamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) return message.error(`Cannot send more than 5 ${key}`);
  
    dispatch(setIsUploadingLoader(true));
  
    try {
      const myForm = new FormData();
  
      myForm.append("chatId", chatId);
  
      files.forEach((file) => myForm.append("files", file));
  
      const res = await sendAttachments(myForm);
  
      if (res.data) {
       
        message.success({
          content: `${key} successfully sent`,
          duration: 2,     
        });
      } else {
      
        message.error({
          content: `${key} not sent. Error`,
          duration: 2,     
        });
      }
    } catch (err) {
     
      message.error({
        content: err.message,
        duration: 2,   
      });
    } finally {
      dispatch(setIsUploadingLoader(false));
      setPopoverVisible(false);
    }
  };
  

  const content = (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <FaImages />
        <button className='' onClick={selectImage}>Images</button>
        <input
          type='file'
          multiple
          accept='image/png, image/jpeg, image/gif , image/jpg'
          ref={ImageRef}
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Image")}
        />
      </div>
      <hr />
      <div className='flex items-center gap-2'>
        <FaFileAlt />
        <button className='' onClick={selectAudio}>Audio</button>
        <input
          type='file'
          multiple
          accept='audio/mpeg, audio/wav'
          ref={AudioRef}
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Audio")}
        />
      </div>
      <hr />
      <div className='flex items-center gap-2'>
        <FaVideo />
        <button className='' onClick={selectVideo}>Videos</button>
        <input
          type='file'
          multiple
          accept='video/mp4, video/webm, video/ogg'
          ref={VideoRef}
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Video")}
        />
      </div>
      <hr />
      <div className='flex items-center gap-2'>
        <FaFile />
        <button className='' onClick={selectFile}>Files</button>
        <input
          type='file'
          multiple
          ref={fileRef}
          accept='* , application/pdf'
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "File")}
        />
      </div>
    </div>
  );

  return chatDetails.isLoading ? (<Skeleton />) : (
    <>
      <div ref={containerRef} className='p-2 bg-slate-200 h-[90%] rounded-lg overflow-x-hidden overflow-y-auto box-border'>
        {allMessages?.map((i, index) => (
          <Messagecomponent key={index} message={i} user={user} />
        ))}
        {UserTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </div>
      <Form className='h-[10%] w-full' form={form} onFinish={submitMessage}>
        <Form.Item name='message' className="m-2">
          <Input
            placeholder='Type Message'
            className='h-full w-full rounded-2xl bg-slate-100'
            autoComplete='off'
            onChange={messageOnChange}
            autoFocus
            prefix={
              <Popover
                content={content}
                open={popoverVisible}
                onClick={() => setPopoverVisible(!popoverVisible)} 
              >
                <Button className='w-auto' size='small' type='text'>
                  <CgAttachment className='w-10 h-5 text-red-600' />
                </Button>
              </Popover>
            }
            suffix={
              <Tooltip title="Send">
                <Button className='w-auto hover:bg-red-400' size='small' htmlType="submit">
                  <IoSend className='w-10 h-5 text-blue-700' />
                </Button>
              </Tooltip>
            }
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default AppLayout()(Chat);
