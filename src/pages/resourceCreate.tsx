import React from 'react';
import styles from './resourceCreate.css';
import CreateResourcePage from '@/components/createResource';
import { Button, PageHeader } from 'antd';
import { Link } from 'umi';

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <Button type="primary" htmlType="submit">
        创建项目
      </Button>
      {' 已完成项目的创建？'}
      <Link to="/resource">去项目列表</Link>
      <CreateResourcePage />
    </div>
  );
}
