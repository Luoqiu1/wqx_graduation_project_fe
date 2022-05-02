import React from 'react';
import styles from './user.css';
import UserInfo from '@/components/userInfo';
import EmptyComponent from '@/components/empty';
import { Space, Card, Button, PageHeader } from 'antd';
import { ResourceListMy } from '@/components/resource';
import { SchemaListMy } from '@/components/schema';
import { Link } from 'umi';

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title="我的信息" size="large">
          <UserInfo />
        </Card>

        <Card
          title="我的 Schema"
          size="large"
          extra={
            <Button type="primary">
              <Link to={'/schemaCreate'}>新建我的 Schema</Link>
            </Button>
          }
        >
          <SchemaListMy />
        </Card>

        <Card
          title="我的项目"
          size="large"
          extra={
            <Button type="primary">
              <Link to={'/resourceCreate'}>新建我的项目</Link>
            </Button>
          }
        >
          <ResourceListMy />
        </Card>
      </Space>
    </div>
  );
}
