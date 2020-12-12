import Vue from 'vue'
// Message为弹框提示组件，且需要全局挂载
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 把 Message弹框组件挂载到Vue的原型对象上，这样话每个组件都可以通过this访问到$message，也就是可以进行弹框提示
// $message为自定义属性，可任意改名
Vue.prototype.$message = Message
