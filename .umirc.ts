import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {
    // 支持任何不需要 dom 的
    // https://procomponents.ant.design/components/layout#prolayout
    name: '可配置化数据管理平台',
    layout: 'side',
  },

  // 没用 name 属性的路由不会显示在左侧导航栏中
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/content', component: '@/pages/content' },
    { path: '/contentDetail', component: '@/pages/contentDetail' },
    { path: '/login', component: '@/pages/login', name: '登录' },
    { path: '/register', component: '@/pages/register', name: '注册' },
    {
      path: '/user',
      component: '@/pages/user',
      name: '个人中心',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/schemaCreate',
      component: '@/pages/schemaCreate',
      name: '新建「Schema」',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/resourceCreate',
      component: '@/pages/resourceCreate',
      name: '新建「项目」',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/schema',
      component: '@/pages/schema',
      name: '「Schema」列表',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/resource',
      component: '@/pages/resource',
      name: '「项目」列表',
      wrappers: ['@/wrappers/auth'],
    },

    // 有一些判断根据这个 name 来的，需要使用 import {RouteGroup} from '@/consts/route'
    { name: '项目组（点击后加载）', routes: [], wrappers: ['@/wrappers/auth'] },
  ],
  fastRefresh: {},
});
