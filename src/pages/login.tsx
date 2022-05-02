import React from 'react';
import NormalLoginForm from '@/components/login';
import { PageHeader } from 'antd';

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="欢迎使用可配置化数据管理平台！"
      />
      <NormalLoginForm />
    </div>
  );
}
