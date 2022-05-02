import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  message,
} from 'antd';
import { CreateUser } from '@/services/user';
import { useRequest } from 'ahooks';
import { Link } from 'umi';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegisterForm = () => {
  const [form] = Form.useForm();
  const { runAsync, loading } = useRequest(CreateUser, {
    manual: true,
  });

  const onFinish = (values) => {
    runAsync(values).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;

        // 因为名字冲突导致的报错
        if (text.search('uniq_name') != -1) {
          message.error('该用户已存在，请更换用户名重新进行注册！');
        } else {
          message.error(text);
        }
      } else {
        message.success('注册成功！');
      }
    });
  };

  const prefixSelector = (
    <Form.Item name="phone_prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        phone_prefix: '86',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入您的用户名！',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请输入您的密码！',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认您的密码！',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('两次输入的密码不一致！'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            type: 'email',
            message: '输入的邮箱不合法！',
          },
          {
            required: true,
            message: '请输入邮箱！',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          {
            required: true,
            message: '请输入你的手机号！',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="sex"
        label="性别"
        rules={[
          {
            required: true,
            message: '请选择您的性别！',
          },
        ]}
      >
        <Select placeholder="选择您的性别">
          <Option value="男">男</Option>
          <Option value="女">女</Option>
          <Option value="其他">其他</Option>
        </Select>
      </Form.Item>

      <Form.Item name="intro" label="个人介绍">
        <Input.TextArea showCount maxLength={100} />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" disabled={loading}>
          注册
        </Button>
        {' 已注册？'}
        <Link to="/login">去登录</Link>
      </Form.Item>
    </Form>
  );
};

export default () => <RegisterForm />;
