import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/list',
      name: 'list',
      component: ()=>import("../pages/list/ListView.vue")
    },
    {
      path: "/login",
      name: "login",
      component: ()=>import("../pages/login/LoginView.vue")
    },
    {
      path: "/register",
      name: "register",
      component: ()=>import("../pages/register/RegisterView.vue")
    },
    {
      path: "/",
      redirect: 'list'
    },
    {
      path: '/:pathMatch(.*)*',  // Vue Router 4的通配符写法
      name: 'NotFound',
      component: ()=>import("../pages/notfound/NotFoundView.vue"),
    },
  ]
})

export default router
