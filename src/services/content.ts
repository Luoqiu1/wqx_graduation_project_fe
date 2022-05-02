import { HTTPHost, HTTPPort } from '@/consts/http';
import cookie from 'react-cookies';
import { UserInfoCookie } from '@/consts/cookie';

export async function GetContentDetail(data: {
  loc: string;
  resource: { id: number };
}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.opt_user = userInfo.name;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/content/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function SaveContentDetail(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.opt_user = userInfo.name;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/content/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function CreateContentDetail(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.opt_user = userInfo.name;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/content/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
