// main.js为入口文件，进行全局的配置
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 对axios进行全局的配置: 1.先导入包, 2.将包挂载到vue的原型对象上(每个vue的组件可以通过this直接访问$http,从而发起ajax请求)
// 挂载完原型的属性后，为axios设置请求的根路径.
import axios from 'axios'
// 挂载完原型的属性后，为axios设置请求的根路径.
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置一个拦截器(axios请求拦截)
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将包挂载到vue的原型对象上
Vue.prototype.$http = axios

// 运行的Vu是开发模式。为生产部署时，请确保启用生产模式。
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
