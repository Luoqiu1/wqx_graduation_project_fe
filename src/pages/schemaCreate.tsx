import React, { useState } from 'react';
import styles from './schemaCreate.css';
import JSONSchemaCreate from '@/components/createSchema';
import { Button, Form, Input, message, PageHeader, Select, Tabs } from 'antd';
import { useRequest } from 'ahooks';
import { CreateResource } from '@/services/resource';
import { Link } from 'umi';
import { SchemaEditor } from '@/components/jsonEditor';
import { CreateSchema } from '@/services/schema';

const { Option } = Select;
const { TabPane } = Tabs;

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
      span: 6,
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
  const [schemaBaseData, setSchemaBaseData] = useState(null);
  const [schemaJSONData, setSchemaJSONData] = useState<string>('');

  const { runAsync, loading } = useRequest(CreateSchema, {
    manual: true,
  });

  // 获取 JSON schema
  const onChangeJSONSchema = (data) => {
    setSchemaJSONData(data);
  };

  // 设置基本的 Schema 表单信息
  const onSetSchemaBaseData = (data) => {
    setSchemaBaseData(data);
    message.success(
      '保存基本信息成功，请完成「JSON Schema 配置」后再点击「创建 Schema」！',
    );
  };

  const onCreateSchema = () => {
    if (schemaBaseData == null) {
      message.warn(
        '请配置完成「Schema 基本信息」并点击「保存基本信息」后再创建！',
      );
      return;
    }
    if (schemaJSONData == '') {
      message.warn('请配置完成「JSON Schema 配置」后再创建');
      return;
    }

    // 如果最外层的 title 的值为 title 的话，视为默认值，删去
    let tmp = JSON.parse(schemaJSONData);
    if (tmp.title == 'title') {
      delete tmp.title;
    }
    let schemaJSONDataRemoveDefaultTitle = JSON.stringify(tmp);
    let schemaInfo = {
      ...schemaBaseData,
      json_schema: schemaJSONDataRemoveDefaultTitle,
    };
    runAsync(schemaInfo).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;

        // 因为名字冲突导致的报错
        if (text.search('uniq_ename') != -1) {
          message.error('Schema 英文名已存在，请修改后再创建！');
        } else {
          message.error(text);
        }
      } else {
        message.success('Schema 创建成功！');
      }
    });

    console.log(schemaBaseData);
    console.log(schemaJSONData);
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.goBack()}
        subTitle="返回上一级"
      />
      <Button type="primary" onClick={onCreateSchema} disabled={loading}>
        创建 Schema
      </Button>
      <span>{' 已完成 Schema 的创建？'}</span>
      <Link to="/resourceCreate"> 去创建项目 </Link>
      <span>或</span>
      <Link to="/resource"> 去项目列表 </Link>
      <span>或</span>
      <Link to="/schema"> 去 Schema 列表 </Link>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Schema 基本信息" key="1">
          <SchemaBaseInfo onSetSchemaBaseData={onSetSchemaBaseData} />
        </TabPane>
        <TabPane tab="JSON Schema 配置" key="2">
          <SchemaEditor showEditor={true} onChange={onChangeJSONSchema} />
        </TabPane>
      </Tabs>
    </div>
  );
}

const SchemaBaseInfo = (props) => {
  const [form] = Form.useForm();
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="resource"
      onFinish={props.onSetSchemaBaseData}
      initialValues={{
        group_id: 1,
        downstream: 10000,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Schema 名称"
        rules={[
          {
            required: true,
            message: '请输入 Schema 名称！',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="ename"
        label="Schema 英文名"
        rules={[
          {
            required: true,
            message: '请输入 Schema 英文名！',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Schema 描述">
        <Input />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          保存基本信息
        </Button>
        {' 在点击「创建 Schema」前请先保存基本信息！'}
      </Form.Item>
    </Form>
  );
};
