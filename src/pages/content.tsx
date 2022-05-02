import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { GetSchema } from '@/services/schema';
import ProTable, {
  ActionType,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-table';
import { GetContentDetailURL, UpdateSchemaURL } from '@/services/apiFormat';
import request from 'umi-request';
import { HTTPHost, HTTPPort } from '@/consts/http';
import { Button, message, PageHeader } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { GetResource } from '@/services/resource';
import { IsContentCreate } from '@/consts/content';

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <ContentList query={props.location.query} />
    </div>
  );
}

// 列表页
type ContentItem = {
  loc: string;
  // display: object,
  create_time: number;
  update_time: number;
  create_by: string;
  opt_user: string;
};

const columnsResource: ProColumns<ContentItem>[] = [
  {
    title: 'keyword',
    dataIndex: 'loc',
    render: (dom, entity, index, action, schema) => (
      <a
        href={GetContentDetailURL(
          entity.res_id,
          entity.schema_id,
          entity.loc,
          '',
        )}
      >
        {entity.loc}
      </a>
    ),
  },
  // {
  //   title: '数据内容',
  //   dataIndex: 'display',
  //   ellipsis: true,
  //   copyable: true,
  //   tip: '数据过长会自动收缩',
  //   valueType: "text"
  // },
  {
    title: '创建时间',
    key: 'createShowTime',
    dataIndex: 'create_time',
    valueType: 'dateTime',
    hideInSearch: true,
    sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          create_startTime: value[0],
          create_endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作时间',
    key: 'updateShowTime',
    dataIndex: 'update_time',
    valueType: 'dateTime',
    hideInSearch: true,
    sorter: (a, b) => new Date(a.update_time) - new Date(b.update_time),
  },
  {
    title: '操作时间',
    dataIndex: 'update_time',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          update_startTime: value[0],
          update_endTime: value[1],
        };
      },
    },
  },
  {
    title: '创建人',
    dataIndex: 'create_by',
  },
  {
    title: '操作人',
    dataIndex: 'opt_user',
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

const ContentList = (props) => {
  const [resData, setResData] = useState(null);
  const { runAsync } = useRequest(GetResource);
  const { res_id, schema_id } = props.query;
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    runAsync({ id: parseInt(res_id) }).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;
        message.error(text);
      } else {
        setResData(data.data);
      }
    });
  }, []);

  return (
    <ProTable<ContentItem>
      columns={columnsResource}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        return request<{
          data: ContentItem[];

          // todo
        }>(`${HTTPHost}:${HTTPPort}/content/list?res_id=${res_id}`, {
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
              create_time: [values.createStartTime, values.createEndTime],
              update_time: [values.updateStartTime, values.updateEndTime],
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
      headerTitle={`项目：${resData?.name}`}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          href={GetContentDetailURL(res_id, schema_id, '', IsContentCreate)}
        >
          新建数据内容
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
