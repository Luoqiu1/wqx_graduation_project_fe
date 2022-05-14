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
import { Button, message, PageHeader, Tag, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { GetResource } from '@/services/resource';
import {
  CntStatusAudit,
  CntStatusDeny,
  CntStatusDispatch,
  CntStatusFail,
  CntStatusNone,
  CntStatusOnline,
  IsContentCreate,
} from '@/consts/content';
import {
  DeleteContentDetail,
  DenyContentDetail,
  GetStatusInfo,
  PassContentDetail,
  SubmitContentDetail,
} from '@/services/content';
import { sleep } from 'ahooks/es/utils/testingHelpers';
import { PageReloadSleep } from '@/consts/page';

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
  status: number;
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
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    hideInTable: true,
    valueEnum: {
      0: { text: '初始化' },
      1: { text: '待审核' },
      2: { text: '上线' },
      3: { text: '下线' },
      4: { text: '上线中' },
      5: { text: '上线失败' },
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'status',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, entity) => {
      const { color, statusName } = GetStatusInfo(entity.status);
      return (
        //<Space>
        // {/*<Tag color={color} key={name}>*/}
        <Tag color={color}>{statusName}</Tag>
        //</Space>
      );
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (dom, entity) => {
      const contentSubmit = () => {
        let requestData = {
          loc: entity.loc,
          display: entity.display,
          resource: {
            id: entity.res_id,
          },
        };
        SubmitContentDetail(requestData).then((data) => {
          if (data && data.code != 0) {
            let text: string = `code: ${data.code}, ${data.message}`;
            message.error(text);
          } else {
            message.success('提交数据成功');
            sleep(PageReloadSleep).then(() => {
              window.location.reload();
            });
          }
        });
      };

      const contentPass = () => {
        let requestData = {
          loc: entity.loc,
          resource: {
            id: entity.res_id,
          },
        };
        PassContentDetail(requestData).then((data) => {
          if (data && data.code != 0) {
            let text: string = `code: ${data.code}, ${data.message}`;
            message.error(text);
          } else {
            message.success('上线数据成功！');
            sleep(PageReloadSleep).then(() => {
              window.location.reload();
            });
          }
        });
      };

      const contentDeny = () => {
        let requestData = {
          loc: entity.loc,
          resource: {
            id: entity.res_id,
          },
        };
        DenyContentDetail(requestData).then((data) => {
          if (data && data.code != 0) {
            let text: string = `code: ${data.code}, ${data.message}`;
            message.error(text);
          } else {
            message.success('下线数据成功！');
            sleep(PageReloadSleep).then(() => {
              window.location.reload();
            });
          }
        });
      };

      const contentDelete = () => {
        let requestData = {
          loc: entity.loc,
          resource: {
            id: entity.res_id,
          },
        };
        DeleteContentDetail(requestData).then((data) => {
          if (data && data.code != 0) {
            let text: string = `code: ${data.code}, ${data.message}`;
            message.error(text);
          } else {
            message.success('删除数据成功！');
            sleep(PageReloadSleep).then(() => {
              window.location.reload();
            });
          }
        });
      };

      return [
        <a onClick={contentSubmit}>提交</a>,
        <Popconfirm
          title="你确定要上线吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={contentPass}
        >
          <a>上线</a>
        </Popconfirm>,

        <Popconfirm
          title="你确定要下线吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={contentDeny}
        >
          <a>下线</a>
        </Popconfirm>,
        <Popconfirm
          title="你确定要删除吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={contentDelete}
        >
          <a style={{ color: '#FF0000' }}>删除</a>
        </Popconfirm>,
      ];
    },
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
