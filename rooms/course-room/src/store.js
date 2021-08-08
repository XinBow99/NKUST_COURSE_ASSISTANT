import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import Swal from 'sweetalert2'
import router from './router'
Vue.use(Vuex)
const swalAlert = Swal.mixin({
  toast: true,
  position: 'bottom-start',
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
export default new Vuex.Store({
  state: {
    accessToken: JSON.parse(localStorage.getItem('accessToken')) || '',
    Courses: null,
    UserInformation: {},
    currectAction: {},
    alertShow: swalAlert,
    chatsHistory: []
  },
  mutations: {
    login (state, infos) {
      state.Courses = infos.Courses
      state.accessToken = infos.access_token
      state.UserInformation = infos.UserInformation
      Vue.prototype.$http.defaults.headers.common['Authorization'] =
        'Bearer ' + infos.access_token
    },
    setChathistory (state, infos) {
      state.Courses = infos.Courses
      state.accessToken = infos.access_token
      state.UserInformation = infos.UserInformation
      Vue.prototype.$http.defaults.headers.common['Authorization'] =
        'Bearer ' + infos.access_token
    }
  },
  actions: {
    async login ({ commit }, loginInfo) {
      const username = loginInfo.username
      const password = loginInfo.password
      Swal.showLoading(Swal.getDenyButton())
      await Axios.post('/login', { username, password })
        .then((response) => {
          Swal.close()
          if (response.data.status === 1) {
            commit('login', response.data)
            localStorage.setItem(
              'Courses',
              JSON.stringify(response.data.Courses)
            )
            localStorage.setItem(
              'accessToken',
              JSON.stringify(response.data.access_token)
            )
            localStorage.setItem(
              'UserInformation',
              JSON.stringify(response.data.UserInformation)
            )
            Swal.fire('Login', '', 'success')
          } else {
            Swal.fire('Login', response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async setUserinfomation ({ commit }) {
      const Courses = JSON.stringify(localStorage.getItem('Courses'))
      const accessToken = JSON.stringify(localStorage.getItem('accessToken'))
      const UserInformation = JSON.stringify(
        localStorage.getItem('UserInformation')
      )
      commit('setChathistory', { Courses, accessToken, UserInformation })
    },
    async postMessage ({ commit }, messageInfo) {
      const singleMessage = {
        CourseId: messageInfo.CourseId,
        avatar: messageInfo.avatar,
        message: messageInfo.message,
        stdId: messageInfo.stdId,
        stdNickName: messageInfo.stdNickName
      }
      await Axios.post('/postmessage', singleMessage)
        .then((response) => {
          if (response.data.status === 1) {
            console.log(response.data.msg)
          } else {
            Swal.fire('發布留言失敗', response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error.status_text)
          Swal.fire('發布留言失敗', '登入時間過期！', 'error')
          router.push('login')
        })
    },
    async postImage ({ commit }, ImageInfo) {
      const singleMessage = {
        CourseId: ImageInfo.CourseId,
        avatar: ImageInfo.avatar,
        message: ImageInfo.message,
        stdId: ImageInfo.stdId,
        stdNickName: ImageInfo.stdNickName
      }
      await Axios.post(
        `/uploadimage/${singleMessage.CourseId}`,
        singleMessage.message
      )
        .then((response) => {
          if (response.data.status === 1) {
            console.log(response.data.msg)
          } else {
            Swal.fire('發布圖片失敗', response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error.status_text)
          Swal.fire('發布圖片失敗', '登入時間過期！', 'error')
          router.push('login')
        })
    }
  }
})
