import { useRequest } from 'umi';
import { GroupListRoutes } from '@/services/group';
import { RouteGroup } from '@/consts/route';

let count = 0;

export async function patchRoutes({ routes }) {
  // 增加 RouteGroup 路由
  for (let route of routes[0].routes) {
    if (route.name === RouteGroup) {
      route.routes = await GroupListRoutes();
    }
  }
}
