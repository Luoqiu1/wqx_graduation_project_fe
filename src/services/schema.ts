import { HTTPHost, HTTPPort } from '@/consts/http';
import { UserInfoCookie } from '@/consts/cookie';
import cookie from 'react-cookies';

export async function CreateSchema(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.admin = userInfo.name;
  data.opt_user = userInfo.name;

  // 删掉 id 字段
  delete data?.id;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/schema/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function ListMySchema() {
  const userInfo = cookie.load(UserInfoCookie);
  let response = await fetch(
    `${HTTPHost}:${HTTPPort}/schema/list?admin=${userInfo.name}`,
    {
      method: 'GET',
    },
  );
  return response.json();
}

export async function GetSchema(data: { id: number }) {
  let response = await fetch(`${HTTPHost}:${HTTPPort}/schema/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function SchemaList() {
  let response = await fetch(`${HTTPHost}:${HTTPPort}/schema/list`, {
    method: 'GET',
  });
  return response.json();
}
