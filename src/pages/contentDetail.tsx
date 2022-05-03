import React, { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { GetSchema } from '@/services/schema';
import { Button, message, Input, PageHeader, Card, Tag, Space } from 'antd';
import JSONSchemaForm, { withTheme } from '@rjsf/core';
import { Theme as AntDTheme } from '@rjsf/antd';
import {
  CreateContentDetail,
  GetContentDetail,
  GetStatusInfo,
  SaveContentDetail,
} from '@/services/content';
import { IsContentCreate } from '@/consts/content';
import UserInfo from '@/components/userInfo';

const Form = withTheme(AntDTheme);

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function Page(props) {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <ContentDetail query={props.location.query} />
    </div>
  );
}

const ContentDetail = (props) => {
  const { res_id, schema_id, loc, is_create } = props.query;
  const [schemaData, setSchemaData] = useState({});
  const [contentData, setContentData] = useState({});
  const [keyword, setKeyword] = useState('');
  const { runAsync } = useRequest(GetSchema);

  // 获取 schema
  useEffect(() => {
    runAsync({ id: parseInt(schema_id) }).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;
        message.error(text);
      } else {
        setSchemaData(() => data.data.json_schema);
      }
    });
  }, []);

  // 获取 content
  useEffect(() => {
    // 如果为创建的情况，跳过下面的获取信息
    if (is_create == IsContentCreate) {
      return;
    }

    // 设置上原来的 keyword/loc
    setKeyword(loc);

    let requestData = {
      loc: loc,
      resource: {
        id: parseInt(res_id),
      },
    };
    GetContentDetail(requestData).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;
        message.error(text);
      } else {
        setContentData(data.data);
      }
    });
  }, []);

  const onSubmit = ({ formData }, e) => {
    let requestData = {
      loc: keyword,
      display: formData,
      resource: {
        id: parseInt(res_id),
      },
    };

    // 根据是创建或者非创建来调用不同的函数
    // 创建时会额外添加创建时间、创建人等字段
    const ContentProcessFunc = is_create
      ? CreateContentDetail
      : SaveContentDetail;
    ContentProcessFunc(requestData).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;
        message.error(text);
      } else {
        message.success('保存数据成功！');
      }
    });
  };

  const onInputChange = (event) => {
    console.log(event.target.value);
    setKeyword(event.target.value);
  };
  const { color, statusName } = GetStatusInfo(contentData.status);

  return (
    <div>
      <Card title="数据详情" size="large">
        <div>
          <Space>
            <Tag color={color}>{statusName}</Tag>
          </Space>
        </div>
        <br />
        <div>主键 Keyword：</div>
        <br />
        <Input defaultValue={loc} onChange={onInputChange} />
        <br />
        <br />
        <Form
          schema={schemaData}
          formData={contentData.display}
          onSubmit={onSubmit}
        />
      </Card>
    </div>
  );
};
