import { HTTPHost, HTTPPort } from '@/consts/http';
import { UserInfoCookie } from '@/consts/cookie';
import cookie from 'react-cookies';

export async function CreateResource(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.admin = userInfo.name;
  data.opt_user = userInfo.name;

  // 删掉 id 字段
  delete data?.id;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/resource/upset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function ListMyResource() {
  const userInfo = cookie.load(UserInfoCookie);
  let response = await fetch(
    `${HTTPHost}:${HTTPPort}/resource/list?admin=${userInfo.name}`,
    {
      method: 'GET',
    },
  );
  return response.json();
}

export async function GetResource(data: { id: number }) {
  if (!data) {
    // const {runAsync} = useRequest(GetResource);
    // 这里好像会在声明的时候莫名其妙调用一次，此时 data 为空导致 400
    // 特判一下，为空的时候直接返回
    return null;
  }
  let response = await fetch(`${HTTPHost}:${HTTPPort}/resource/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
