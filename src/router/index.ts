import Vue from "vue";
import VueRouter from "vue-router";
import authModule from "@/store/modules/auth";

import Home from "@/views/Home.vue";
import Live from "@/views/Live.vue";
import Login from "@/views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/live/:id",
    name: "live",
    component: Live,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

/**
 * ナビゲーションガード
 */
router.beforeEach((to, from, next) => {
  const isRequiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 認証が必要なページ
  if (isRequiresAuth) {
    if (authModule.isLoggedIn) {
      // 認証済みなら OK
      next();
    } else {
      // 未認証なら login ページへ遷移
      next({
        name: "login",
        query: {
          redirect: to.fullPath
        }
      });
    }
    return;
  }

  // login ページ
  if (to.name === "login") {
    if (authModule.isLoggedIn) {
      // 認証済みなら home ページへ遷移
      next({ name: "home" });
    } else {
      // 未認証なら OK
      next();
    }
    return;
  }

  next();
});

export default router;
