import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { ListMySchema } from '@/services/schema';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, List, message } from 'antd';
import { UpdateSchemaURL } from '@/services/apiFormat';
import request from 'umi-request';
import EmptyComponent from '@/components/empty';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { HTTPHost, HTTPPort } from '@/consts/http';

type SchemaItem = {
  id: number;
  created_at: string;
  name: string;
  downstream: number;
  schema_id: number;
  opt_user: string;
  admin: string;
  description: string;
  group_id: number;
  group_order: number;
  ext: any;
};

const columnsResource: ProColumns<SchemaItem>[] = [
  {
    title: 'Schema ID',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Schema 名称',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    render: (dom, entity, index, action, schema) => (
      // <a href={UpdateSchemaURL(entity.id)}>{entity.name}</a>
      <a>{entity.name}</a>
    ),
  },
  {
    title: '描述',
    dataIndex: 'description',
    ellipsis: true,
    tip: '描述过长会自动收缩',
  },
  {
    title: '管理员',
    dataIndex: 'admin',
    tip: '项目创建者即为管理员',
  },
  {
    title: '操作人',
    dataIndex: 'opt_user',
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    hideInSearch: true,
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

const SchemaList = () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<SchemaItem>
      columns={columnsResource}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        return request<{
          data: SchemaItem[];

          // todo
        }>(`${HTTPHost}:${HTTPPort}/schema/list`, {
          params,
        });
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 160,
        defaultCollapsed: false,
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          href={'/schemaCreate'}
        >
          新建 Schema
        </Button>,
        // <Dropdown key="menu" overlay={menu}>
        //   <Button>
        //     <EllipsisOutlined/>
        //   </Button>
        // </Dropdown>,
      ]}
    />
  );
};

export default () => <SchemaList />;

export const SchemaListMy = () => {
  const [data, setData] = useState([]);
  const { runAsync } = useRequest(ListMySchema);
  useEffect(() => {
    runAsync().then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;
        message.error(text);
      } else {
        setData(data.data);
      }
    });
  }, []);

  // 用长度大于 0 来进行判断，初始化的时候给一个空数组，防止意外 bug
  if (data.length > 0) {
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            {/*todo，先不跳转*/}
            {/*<Button href={UpdateSchemaURL(item.id)}>{item.name}</Button>*/}
            <Button>{item.name}</Button>
          </List.Item>
        )}
      />
    );

    // 返回空列表
  } else {
    return <EmptyComponent link="/schemaCreate" desc="暂无我的 Schema" />;
  }
};
