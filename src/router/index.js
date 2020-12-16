import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

// export default new VueRouter({
//   routes: [
//     { path: '/', redirect: '/login' },
//     { path: '/login', component: Login },
//     { path: '/home', component: Home }
//   ]
// })

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    // Welcome作为home的子路由规则，嵌套在home中
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行，两种方式：1. next() 放行 2.  next('/login') 强制跳转
  if (to.path === '/login') {
    return next()
  }
  // 先获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
