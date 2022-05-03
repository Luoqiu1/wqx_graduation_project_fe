import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown, Card, List, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';
import { HTTPHost, HTTPPort } from '@/consts/http';
import { Link } from 'umi';
import { useRequest } from 'ahooks';
import { ListMyResource } from '@/services/resource';
import EmptyComponent from '@/components/empty';
import { GetContentListURL } from '@/services/apiFormat';

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

type ResourceItem = {
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

const columnsResource: ProColumns<ResourceItem>[] = [
  {
    title: '项目 ID',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '项目名称',
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
      <a href={GetContentListURL(entity.id, parseInt(entity.schema_id))}>
        {entity.name}
      </a>
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
  // {
  //   title: '创建时间',
  //   dataIndex: 'created_at',
  //   valueType: 'dateRange',
  //   hideInTable: true,
  //   search: {
  //     transform: (value) => {
  //       return {
  //         startTime: value[0],
  //         endTime: value[1],
  //       };
  //     },
  //   },
  // },
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

const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '项目名称',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tip: '项目名称过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
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

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);

export const ResourceList: React.FC<{ group_id: number }> = (props) => {
  let url: string;
  let group_id = props.group_id;
  if (group_id != 0) {
    url = `${HTTPHost}:${HTTPPort}/resource/list?group_id=${group_id}`;
  } else {
    url = `${HTTPHost}:${HTTPPort}/resource/list`;
  }
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<ResourceItem>
      // todo！！！！ key 的重要性！
      // 没有这个 key 的时候，路由变化了不刷新！
      // 例如从 /group/4、变化为 /group/1、/group/2 等等等等，都不刷新！
      key={group_id}
      columns={columnsResource}
      actionRef={actionRef}
      cardBordered
      request={(params = {}, sort, filter) => {
        return request<{
          data: ResourceItem[];
        }>(url, {
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
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          href={'/resourceCreate'}
        >
          新建项目
        </Button>,
      ]}
    />
  );
};

// export default () => <ResourceList/>;

export const ResourceListMy = () => {
  const [data, setData] = useState([]);
  const { runAsync } = useRequest(ListMyResource);
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
            <Button href={GetContentListURL(item.id, item.schema_id)}>
              {item.name}
            </Button>
          </List.Item>
        )}
      />
    );

    // 返回空列表
  } else {
    return <EmptyComponent link="/resourceCreate" desc="暂无我的项目" />;
  }
};
