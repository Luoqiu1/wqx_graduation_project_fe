// import { withTheme } from '@rjsf/core';
// import { Theme as AntDTheme } from '@rjsf/antd';
//
// const Form = withTheme(AntDTheme);
//
// const schema = {
//   "title": "A registration form",
//   "description": "A simple form example.",
//   "type": "object",
//   "required": [
//     "firstName",
//     "lastName"
//   ],
//   "properties": {
//     "firstName": {
//       "type": "string",
//       "title": "First name",
//       "default": "Chuck"
//     },
//     "lastName": {
//       "type": "string",
//       "title": "Last name"
//     },
//     "telephone": {
//       "type": "string",
//       "title": "Telephone",
//       "minLength": 10
//     }
//   }
// }
//
// const SchemaForm = () => {
//   return <Form schema={schema}/>
// };
//
// export default () => <SchemaForm/>

import { SchemaEditor } from '@/components/jsonEditor';

const JSONSchemaCreate = (props) => {
  return <SchemaEditor showEditor={true} onChange={onChange} />;
};

export default () => <JSONSchemaCreate />;
