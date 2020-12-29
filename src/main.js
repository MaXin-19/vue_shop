// main.js为入口文件，进行全局的配置
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入树表
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 对axios进行全局的配置: 1.先导入包, 2.将包挂载到vue的原型对象上(每个vue的组件可以通过this直接访问$http,从而发起ajax请求)
// 挂载完原型的属性后，为axios设置请求的根路径.
import axios from 'axios'
// import { padStart } from 'core-js/fn/string'
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
// 将插件导入到组件中
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
// filter(过滤器名字，过滤器的处理函数(形参也就是要处理的时间数据){})
Vue.filter('dateFormat', function (originVal) {
  // 通过给定的时间得到一个日期对象
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  // 拼接完整的日期字符串
  // return `yyyy-mm-dd hh:mm`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
