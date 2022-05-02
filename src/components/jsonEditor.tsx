import 'antd/dist/antd.css';

require('json-schema-editor-visual/dist/main.css');
const option = {
  lang: 'zh_CN',
};
const schemaEditor = require('json-schema-editor-visual/dist/main.js');
export const SchemaEditor = schemaEditor(option);
