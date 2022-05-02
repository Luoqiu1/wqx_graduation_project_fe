import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Descriptions, Badge } from 'antd';
import cookie from 'react-cookies';
import { UserInfoCookie } from '@/consts/cookie';
import { useState, useEffect } from 'react';

const UserInfo = () => {
  const userInfo = cookie.load(UserInfoCookie);
  let createdDate = new Date(userInfo.created_at);
  return (
    <Descriptions bordered={true} column={2}>
      <Descriptions.Item label="用户名">{userInfo.name}</Descriptions.Item>
      <Descriptions.Item label="邮箱">{userInfo.email}</Descriptions.Item>
      <Descriptions.Item label="手机号">{`+${userInfo.phone_prefix} ${userInfo.phone}`}</Descriptions.Item>
      <Descriptions.Item label="性别">{userInfo.sex}</Descriptions.Item>
      <Descriptions.Item label="注册时间" span={2}>
        {`${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`}
      </Descriptions.Item>
      <Descriptions.Item label="个人介绍" span={2}>
        {userInfo.intro}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default () => <UserInfo />;
