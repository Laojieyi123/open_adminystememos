import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home"),
  },
  {
    path: "/mall",
    name: "mall",
    component: () => import("@/views/Mall"),
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/views/User"),
  },
  {
    path: "/other",
    name: "other",
    component: () => import("@/views/Others"),
    redirect: "/other/editor",
    children: [
      {
        path: "/other/editor",
        name: "editor",
        component: () => import("@/views/Others/Editor"),
      },
      {
        path: "/other/dragsort",
        name: "dragsort",
        component: () => import("@/views/Others/DragSort"),
      },
      {
        path: "/other/demos",
        name: "demos",
        component: () => import("@/views/Others/Demos"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});
//解决重复点击跳转路由错误问题
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

export default router;
