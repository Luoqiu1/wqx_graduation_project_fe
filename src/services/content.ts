import { HTTPHost, HTTPPort } from '@/consts/http';
import cookie from 'react-cookies';
import { UserInfoCookie } from '@/consts/cookie';
import {
  CntStatusAudit,
  CntStatusDeny,
  CntStatusDispatch,
  CntStatusFail,
  CntStatusNone,
  CntStatusOnline,
} from '@/consts/content';

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

export async function SubmitContentDetail(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.opt_user = userInfo.name;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/content/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function PassContentDetail(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.opt_user = userInfo.name;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/content/pass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function DenyContentDetail(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.opt_user = userInfo.name;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/content/deny`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function DeleteContentDetail(data: {}) {
  const userInfo = cookie.load(UserInfoCookie);
  data.opt_user = userInfo.name;
  let response = await fetch(`${HTTPHost}:${HTTPPort}/content/del`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export function GetStatusInfo(status: number): {
  color: string;
  statusName: string;
} {
  if (status == undefined) {
    return { color: 'blue', statusName: '?????????' };
  }
  let statusName: string;
  let color: string;
  switch (status) {
    case CntStatusOnline:
      color = 'green';
      break;
    case CntStatusFail:
      color = 'red';
      break;
    default:
      color = 'blue';
  }
  switch (status) {
    case CntStatusNone:
      statusName = '?????????';
      break;
    case CntStatusAudit:
      statusName = '?????????';
      break;
    case CntStatusOnline:
      statusName = '??????';
      break;
    case CntStatusDeny:
      statusName = '??????';
      break;
    case CntStatusDispatch:
      statusName = '?????????';
      break;
    case CntStatusFail:
      statusName = '????????????';
      break;
  }
  return { color: color, statusName: statusName };
}
