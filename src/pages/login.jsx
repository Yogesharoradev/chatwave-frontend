import { useFileHandler } from "6pp";
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import { IconButton } from '@mui/material';
import { Avatar, Button, Card, Form, Input, Space, message } from "antd";
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiddenInput } from '../components/styles/styledComponent';
import { server } from '../constants/config';
import { userExists } from '../redux/reducers/auth';

const Login = () => {

  const [isLogin , setIsLogin] = useState(true)
  const [isLoading ,setIsloading] = useState(false)

 const avatar = useFileHandler("single") 

  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm(); 

  const dispatch = useDispatch()

  const handleLoginFinish = async (values) => {
    setIsloading(true)
    const config = {
      withCredentials : true ,
       headers:{
      "Content-Type" : "application/json"
      }
    }
    try {
     const {data} = await axios.post(`${server}/api/v1/user/login` , 
      {
        username: values.username , 
       
        password : values.password
      },
         config
      )
      dispatch(userExists(data.user))
      message.success(data.message)
      loginForm.resetFields(); 

    } catch (err) {
      const errorMessage = err.response?.data || err || "Something went wrong";
       message.error(errorMessage);
    }finally{
      setIsloading(false)
    }
   
  };

  const handleSignupFinish = async (values) => {
    setIsloading(true)
    const formData = new FormData()
  
    if (avatar.file) {
      formData.append('avatar', avatar.file);
    } else {
      console.error('No file selected');
      return;
    }
    formData.append("name" , values.name)
    formData.append("bio" , values.bio)
    formData.append("username" , values.username)
    formData.append("password" , values.password)

    try{
      const {data} = await axios.post(
        `${server}/api/v1/user/signup`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      dispatch(userExists(data.user))  
      message.success(data.message)
    }catch(err){
      const errorMessage = err.response?.data  || "Something went wrong";
      message.error(errorMessage);
    }finally{
      setIsloading(false)
      signupForm.resetFields(); 
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }
  return (
    <div className=''>
      <Card className='text-center  m-16  rounded-lg flex bg-gradient-to-r from-black via-gray-800 to-black
            justify-center items-center
      '> 
            {
              isLogin ? 
              <div className='flex justify-center items-center flex-col min-h-96'>
                <h1 className='font-semibold text-5xl text-white '>ChatWave</h1>
                <h1 className='font-bold text-2xl my-6 text-white'>Login!</h1>
                        <Form
                            form={loginForm}
                            onFinish={handleLoginFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            style={{ maxWidth: 400, marginTop: '20px' }}
                          >
                            <Form.Item
                              name="username"
                              rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                              <Input placeholder='UserName'/>
                            </Form.Item>

                            <Form.Item
                             
                              name="password"
                              rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                              <Input.Password placeholder='Password'/>
                            </Form.Item>

                            <Form.Item>
                              <Button type="primary" htmlType="submit" size='large' className='w-full' disabled={isLoading}>
                                Log In 
                              </Button>
                            </Form.Item>
                         </Form>
                         <span className=' font-semibold text-sm mb-3 text-white'>Or</span>
                              <Button htmlType="submit" className='w-7/12 font-semibold' onClick={()=>setIsLogin(false)}>
                                Sign Up Instead
                              </Button>
                          
              </div>
               :
              <div className='flex justify-center items-center flex-col'>
              <h1 className='font-bold text-5xl text-white'>ChatWave</h1>
              <h1 className='font-bold text-2xl my-3 text-white'>Signup!</h1>
                  <Form
            form={signupForm}
            onFinish={handleSignupFinish}
            onFinishFailed={(errorInfo) => message.error('Failed:', errorInfo)}
            autoComplete="off"
            style={{ maxWidth: 400, marginTop: '20px' }}
          >
            <div className="flex flex-col justify-center items-center pb-5 relative">
              <Space wrap size={8}>
                <div className="relative">
                  <Avatar 
                    size={96}
                    className="text-white" 
                    icon={<UserOutlined />}
                    src={avatar.preview}
                  />
                  {avatar.error && (
                    <h1 className='text-white p-3'>{avatar.error}</h1>
                  )}
                  <IconButton className="absolute bottom-0 right-0" component="label">
                    <CameraOutlined />
                    <HiddenInput type="file" onChange={avatar.changeHandler}/>
                  </IconButton>
                </div>
              </Space>
            </div>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder='Name'/>
            </Form.Item>
            <Form.Item
              name="bio"
              rules={[{ required: true, message: 'Please input your bio!' }]}
            >
              <Input.TextArea placeholder='Bio'/>
            </Form.Item>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder='Username'/>
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
              <Input placeholder='Your Email' />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder='Password'/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className='w-full' size='large' disabled={isLoading}>
                Submit
              </Button>
            </Form.Item>
                  </Form>
                       <span className='font-semibold text-sm mb-3 text-white'>Already Have an Account</span>
                         
                         <Button className='w-5/12 font-semibold' onClick={()=>setIsLogin(true)} disabled={isLoading}>
                           Log In
                         </Button>
            </div>
            }
      </Card>
    </div>
  );
};

export default Login
