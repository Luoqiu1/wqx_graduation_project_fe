import React from 'react';
import ResourceList from '@/components/resource';
import { PageHeader } from 'antd';

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <ResourceList />
    </div>
  );
}
