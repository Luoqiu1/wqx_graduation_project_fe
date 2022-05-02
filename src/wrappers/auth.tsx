import { Redirect } from 'umi';
import cookie from 'react-cookies';
import { message } from 'antd';
import { UserInfoCookie } from '@/consts/cookie';

// 根据 cookie 中是否含有 user 来校验
function useAuth(): boolean {
  let userInfo = cookie.load(UserInfoCookie);
  if (userInfo) {
    return true;
  }
  message.warn('尚未登录，请登录后操作！');
  return false;
}

export default (props) => {
  const isLogin = useAuth();
  if (isLogin) {
    return <div>{props.children} </div>;
  } else {
    return <Redirect to="/login" />;
  }
};
