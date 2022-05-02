import React, { useEffect, useState } from 'react';
import SchemaList from '@/components/schema';
import { PageHeader } from 'antd';

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <SchemaList />
    </div>
  );
}
