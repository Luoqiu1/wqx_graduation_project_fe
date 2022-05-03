import groupPage from '@/pages/group';
import { HTTPHost, HTTPPort } from '@/consts/http';

export async function GroupList() {
  let response = await fetch(`${HTTPHost}:${HTTPPort}/group/list`);
  return response.json();
}

// 获取 group 路由
export async function GroupListRoutes() {
  return GroupList().then((value) => {
    let groupList = value.data;
    let groupRoutes: {
      path: string;
      component: any;
      name: Function;
      exact: boolean;
      orders: number;
    }[] = new Array(0);
    for (let group of groupList) {
      const { id, name, orders } = group;
      let groupRoute = {
        path: `/group/${id}`,
        component: groupPage,
        name: name,
        exact: true,
        orders: orders,
      };
      groupRoutes.push(groupRoute);
    }

    // 根据 orders 排序
    // return groupRoutes.sort((groupRouteA, groupRouteB) => -groupRouteA.orders + groupRouteB.orders)

    // 本身后端就根据 orders 排序了，升序
    return groupRoutes;
  });
}
