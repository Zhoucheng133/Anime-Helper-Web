import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: ()=>import("../pages/home/HomeView.vue")
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
      redirect: 'home'
    }
  ]
})

export default router
