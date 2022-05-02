import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import { useRequest } from 'ahooks';
import { GetUser } from '@/services/user';
import cookie from 'react-cookies';
import { UserInfoCookie } from '@/consts/cookie';

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 4,
      offset: 8,
    },
  },
};

const NormalLoginForm = () => {
  const { runAsync, loading } = useRequest(GetUser, {
    manual: true,
  });
  const onFinish = (values) => {
    runAsync(values).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;

        // 因为名字冲突导致的报错
        if (text.search('record not found') != -1) {
          message.error('该用户不存在，请先进行注册！');
        } else {
          message.error(text);
        }
      } else if (data.data.password != values.password) {
        message.error('密码错误！');
      } else {
        message.success('登录成功！');

        // 跳转到个人中心页
        history.push('/user');

        // 设置用户信息的 cookie，一小时
        cookie.save(UserInfoCookie, data.data, {
          path: '/',
          expires: new Date(new Date().getTime() + 1000 * 60 * 60),
        });

        // 当勾选「记住我」时，添加用户、密码 cookie
        if (values.remember) {
          cookie.save('remember_user', values.name, {});
          cookie.save('remember_password', values.password, {});
        } else {
          cookie.remove('remember_user');
          cookie.remove('remember_password');
        }
      }
    });
  };

  return (
    <Form
      {...tailFormItemLayout}
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
        name: cookie.load('remember_user'),
        password: cookie.load('remember_password'),
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: '请输入用户名！',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住我</Checkbox>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          disabled={loading}
        >
          登录
        </Button>
        {' 尚未注册？'}
        <Link to="/register">去注册</Link>
      </Form.Item>
    </Form>
  );
};

export default () => <NormalLoginForm />;
