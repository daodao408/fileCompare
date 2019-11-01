import Vue, { AsyncComponent } from 'vue'
import Router, { RouteConfig, Route, NavigationGuard } from 'vue-router'

const Login: AsyncComponent = (): any => import('@/login/Login.vue')
const CompareFile: AsyncComponent = (): any => import('@/pages/CompareFile.vue')

Vue.use(Router)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'tologin',
    component: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    redirect: '/'
  },
  {
    path: '/compareFile',
    name: 'compareFile',
    meta: {
      requireAuth: true
    },
    component: CompareFile
  }
]

const router: Router = new Router({
  mode: 'hash',
  base: '/',
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
