import Vue from 'vue'
import Router from 'vue-router'
import message from '@/components/message'
import white from '@/components/white'
import Login from '@/components/auth/LoginForm'
import store from '../store'
import Axios from 'axios'
Vue.use(Router)
const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/white'
  },
  {
    path: '/white',
    component: white,
    meta: { requiresAuth: true }
  },
  {
    path: '/*/login',
    redirect: '/login'
  },
  {
    path: '/course/:courseId',
    props: true,
    name: 'message',
    component: message,
    meta: { requiresAuth: true }
  }
]

const router = new Router({
  mode: 'history',
  routes: routes
})
// check login
// ref https://github.com/AngCosmin/flask-vue-auth/blob/master/vue/src/router.js
function clearStorage () {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('Courses')
  localStorage.removeItem('UserInformation')
  store.state.accessToken = null
  store.state.Courses = null
  store.state.UserInformation = null
}
router.beforeEach((to, from, next) => {
  // get JWT token
  let token = localStorage.getItem('accessToken')

  let requireAuth = to.matched.some((record) => record.meta.requiresAuth)
  // if requiresAuth is false or not
  if (!requireAuth) {
    next()
  }
  // if requiresAuth but token is missing
  if (requireAuth && !token) {
    next('/login')
  }
  // check login status but path is login, so i u have verify u dont need to login
  if (to.path === '/login') {
    // check token is valid and correct?
    if (token) {
      Axios.post('/verify-token')
        .then(() => {
          next('/white')
        })
        .catch(() => {
          clearStorage()
          next()
        })
    } else {
      next()
    }
  }
  // check login status
  if (requireAuth && token) {
    Axios.post('/verify-token')
      .then(() => {
        next()
      })
      .catch(() => {
        clearStorage()
        next('/login')
      })
  }
})

export default router
