import { HTTPHost, HTTPPort } from '@/consts/http';

export async function CreateUser(data: {}) {
  let response = await fetch(`${HTTPHost}:${HTTPPort}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function GetUser(data: {}) {
  let response = await fetch(`${HTTPHost}:${HTTPPort}/user/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function CheckUserLogin(userInfo: {
  user: string;
  password: string;
}): Promise<{ isCheck: boolean; message: string }> {
  return getUser(userInfo).then((value) => {
    let checkInfo: { isCheck: boolean; message: string } = {
      isCheck: true,
      message: '登录成功！',
    };
    let userInfoInDB: { id: number; name: string; password: string } =
      value.data;
    if (userInfoInDB.id == 0) {
      checkInfo.isCheck = false;
      checkInfo.message = '用户不存在，请检查用户名或者进行注册！';
    } else if (userInfoInDB.password != userInfo.password) {
      checkInfo.isCheck = false;
      checkInfo.message = '登录密码错误，请仔细检查后重新登录！';
    }
    return checkInfo;
  });
}
