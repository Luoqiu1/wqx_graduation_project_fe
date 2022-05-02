import groupPage from '@/pages/group';
import { HTTPHost, HTTPPort } from '@/consts/http';

export async function getGroupList() {
  let response = await fetch(`${HTTPHost}:${HTTPPort}/group/list`);
  return response.json();
}

// export function getGroupList() {
//   return new Promise<{ id: number, name: string, orders: number }[]>(resolve => {
//     let groupList: { id: number, name: string, orders: number }[] = [
//       {
//         id: 1,
//         name: '项目组1',
//         orders: 3
//       },
//       {
//         id: 2,
//         name: '项目组2',
//         orders: 2
//       }
//     ]
//     setTimeout(() => {
//       resolve(groupList)
//     }, 50)
//   });
// }

// 获取 group 路由
export async function getGroupListRoutes() {
  // return getGroupList().then(
  //   groupList => {
  //     console.log(groupList)
  //     debugger
  //     let groupRoutes: { path: string, component: any, name: Function, exact: boolean, orders: number }[] = new Array(0)
  //     for (let group of groupList) {
  //       const {id, name, orders} = group
  //       let groupRoutePath = `/group/${id}`
  //       let groupRoute = {
  //         path: groupRoutePath,
  //         component: groupPage,
  //         name: name,
  //         exact: true,
  //         orders: orders,
  //       }
  //       groupRoutes.push(groupRoute)
  //     }
  //
  //     // 根据 orders 排序
  //     return groupRoutes.sort((groupRouteA, groupRouteB) => -groupRouteA.orders + groupRouteB.orders)
  //   }
  // )

  return getGroupList().then((value) => {
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
