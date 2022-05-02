import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  message,
} from 'antd';
import { CreateResource } from '@/services/resource';
import { useRequest } from 'ahooks';
import { sleep } from 'ahooks/es/utils/testingHelpers';
import { Link } from 'umi';
import cookie from 'react-cookies';
import { getGroupList } from '@/services/group';
import { SchemaList } from '@/services/schema';

const { Option } = Select;

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

const CreateResourcePage = () => {
  const [form] = Form.useForm();
  const { runAsync, loading } = useRequest(CreateResource, {
    manual: true,
  });

  const onFinish = (values) => {
    runAsync(values).then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;

        // 因为名字冲突导致的报错
        if (text.search('uniq_name') != -1) {
          message.error('项目名称已存在，请修改后再创建！');
        } else {
          message.error(text);
        }
      } else {
        message.success('项目创建成功！');
      }
    });
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="resource"
      onFinish={onFinish}
      initialValues={{
        downstream: 10000,
      }}
      scrollToFirstError
    >
      {/*项目组*/}
      <GroupFormItem />

      <Form.Item
        name="name"
        label="项目名称"
        rules={[
          {
            required: true,
            message: '请输入项目名称！',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="项目描述">
        <Input />
      </Form.Item>

      {/*schema 列表*/}
      <SchemaFormItem />

      <Form.Item
        name="downstream"
        label="下游"
        rules={[
          {
            required: true,
            message: '请选择项目下游！',
          },
        ]}
      >
        <Select>
          <Select.Option value={2}>Redis</Select.Option>
          <Select.Option value={10000}>空下游（仅做存储）</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" disabled={loading}>
          创建项目
        </Button>
        {' 已完成项目的创建？'}
        <Link to="/resource">去项目列表</Link>
      </Form.Item>
    </Form>
  );
};

export default () => <CreateResourcePage />;

const filterStrNotContainOption = (inputValue, option) => {
  console.log(inputValue, option.children, option.children.search(inputValue));

  // 如果下拉框中的值包含（命中）了输入值，符合条件筛选下来
  if (option.children.search(inputValue) != -1) {
    return true;

    // false，不筛选下来
  } else {
    return false;
  }
};

const GroupFormItem = () => {
  const [groupFormItem, setGroupOption] = useState<any>(null);
  useEffect(() => {
    getGroupList().then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;
        message.error(text);
      } else {
        let groupList = data.data;
        const groupOptionList = groupList.map(
          (group: { id: number; name: string }) => {
            return (
              <Select.Option name="group_id" value={group.id} key={group.id}>
                {group.name}
              </Select.Option>
            );
          },
        );
        setGroupOption(
          <Form.Item
            name="group_id"
            label="项目组"
            rules={[
              {
                required: true,
                message: '请选择项目组！',
              },
            ]}
          >
            <Select showSearch={true} filterOption={filterStrNotContainOption}>
              {groupOptionList}
            </Select>
          </Form.Item>,
        );
      }
    });
  }, []);
  if (groupFormItem == null) {
    return <Select />;
  } else {
    return groupFormItem;
  }
};

const SchemaFormItem = () => {
  const [schemaFormItem, setSchemaFormItem] = useState<any>(null);
  useEffect(() => {
    SchemaList().then((data) => {
      if (data && data.code != 0) {
        let text: string = `code: ${data.code}, ${data.message}`;
        message.error(text);
      } else {
        let schemaList = data.data;
        const schemaOptionList = schemaList.map(
          (schema: { id: number; name: string; admin: string }) => {
            return (
              <Select.Option
                name="schema_id"
                value={schema.id}
                key={schema.id}
              >{`${schema.name}（管理员：${schema.admin}）`}</Select.Option>
            );
          },
        );
        setSchemaFormItem(
          <Form.Item
            name="schema_id"
            label="关联项目配置（Schema）"
            rules={[
              {
                required: true,
                message: '请关联项目配置（Schema）！',
              },
            ]}
          >
            <Select showSearch={true} filterOption={filterStrNotContainOption}>
              {schemaOptionList}
            </Select>
          </Form.Item>,
        );
      }
    });
  }, []);
  if (schemaFormItem == null) {
    return <Select />;
  } else {
    return schemaFormItem;
  }
};
