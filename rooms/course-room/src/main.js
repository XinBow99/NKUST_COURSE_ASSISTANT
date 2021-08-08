// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { firestorePlugin } from 'vuefire'
//
import store from './store'
import Axios from 'axios'
import VueChatScroll from 'vue-chat-scroll'
// import bootstrap css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(VueChatScroll)
// use firestore
Vue.use(firestorePlugin)
// use bootstap
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.component('system-message', {
  props: ['systemMessageInfo'],
  template: `
  <div
    class="message_box system_message"
    data-id=""
  >
    <div data-id="msg_content">{{systemMessageInfo.message}}</div>
  </div>
  `
})

Axios.defaults.baseURL = 'http://127.0.0.1:5252'
Vue.prototype.$http = Axios
// set axios access token
const accessToken = localStorage.getItem('accessToken')
const Courses = localStorage.getItem('Courses')
const UserInformation = localStorage.getItem('UserInformation')

// check if token is valid
if (accessToken) {
  // set Authorization header
  // Bearer Token
  Vue.prototype.$http.defaults.headers.common['Authorization'] =
    'Bearer ' + JSON.parse(accessToken)
  console.log('Init Token success!')
}
if (Courses) {
  store.state.Courses = JSON.parse(Courses)
}
if (UserInformation) {
  store.state.UserInformation = JSON.parse(UserInformation)
}
new Vue({// eslint-disable-line no-new
  el: '#app',
  router, // add router
  store, // add store
  components: { App },
  template: '<App/>'
})
