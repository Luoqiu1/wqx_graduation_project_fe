import React from 'react';
import { PageHeader } from 'antd';
import { ResourceList } from '@/components/resource';

export default function Page(props) {
  const group_id = props.match.params.id;
  // console.log(props.location)
  // console.log(props.match)
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <ResourceList group_id={group_id} />
    </div>
  );
}
