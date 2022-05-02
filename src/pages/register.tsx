import React from 'react';
import RegisterForm from '@/components/register';
import { PageHeader } from 'antd';

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <RegisterForm />
    </div>
  );
}
