import { Button, Card, Form, Input, message } from "antd";

import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminLoginMutation } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { userExists } from "../../redux/reducers/auth";

const AdminLogin = () => {

  const {isAdmin} = useSelector((state)=>state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [AdminForm] = Form.useForm();

  
  const [adminLogin] = useAdminLoginMutation()

  const handleLoginFinish = async (values) => {
    try{
       const res =   await adminLogin({secretKey : values.password}).unwrap()
        dispatch(userExists(true))
        navigate("/admin/dashboard")
        message.success(res?.message)
    }catch(err){
      message.error(err?.data?.message)
    }finally{
      AdminForm.resetFields(); 
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  if(isAdmin) return <Navigate to={'/admin/dashboard'} />
  return (
    <div className=''>
      <Card className='text-center  m-16  rounded-lg flex bg-gradient-to-r from-black via-gray-800 to-black
            justify-center items-center
      '> 
              <div className='flex justify-center items-center flex-col min-h-96'>
                <h1 className='font-semibold text-5xl text-white '>ChatWave</h1>
                <h1 className='font-bold text-2xl my-6 text-white'>Admin Login!</h1>
                        <Form
                            form={AdminForm}
                            onFinish={handleLoginFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            style={{ maxWidth: 400, marginTop: '20px' }}
                          >
                            <Form.Item
                             
                              name="password"
                              rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                              <Input.Password placeholder='Secret Key'/>
                            </Form.Item>

                            <Form.Item>
                              <Button type="primary" htmlType="submit" size='large' className='w-full'>
                                Log In 
                              </Button>
                            </Form.Item>
                         </Form>
                          
              </div>
           
      </Card>
    </div>
  );
};

export default AdminLogin

