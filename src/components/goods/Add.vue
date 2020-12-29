<template>
  <div>
    <!-- 面包屑导航区 ------------------------->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path:'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 --- ---------------------------->
    <el-card>
      <!-- 提示区域 ------------------------------>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 让el-steps和el-tabs两个组件共用同一个数据项activeIndex，形成联动  -->
      <!-- 步骤条区域 --------------------------->
      <!-- 将字符串转换为数字 只用-0； :active当前被激活的进度条  align-center 字居中-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域  --------------------------->
      <!-- label-position为表单域标签的位置  :before-leave切换标签之前的钩子（若返回false或返回promise且被拒绝，则阻止切换） -->
      <!-- @tab-click  tab被选中时触发 -->
      <!-- label-position是标签名与输入框的位置关系 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name='0'>
            <!-- 通过rules属性传入验证规则，prop属性为设置需要校验的字段名 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <!-- type="number"规定类型只能为数值 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- :options指定数据源 :props节点选择器的配置项  v-model双向绑定的数组---->
              <!-- 级联选择器 -------------->
              <el-cascader expandTrigger="hover" v-model="addForm.goods_cat" :options="catelist"
              :props="cateProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name='1'>
            <!-- 渲染表单的item项 ------------->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 border指有边框----->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name='2'>
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name='3'>
            <!-- action指上传图片时需要请求的后台API接口地址 ----->
            <!-- :on-preview指预览图片的事件(点击文件列表中已上传的文件时的钩子) -->
            <!-- :on-remove指单击叉号时调用的事件 -->
            <!-- :file-list指定文件列表 不需要用 -->
            <!-- list-type 指定当前预览组件的呈现方式 名字，缩略图等等-->
            <!-- headers设置上传的请求头 -->
            <!-- :on-success文件上传成功时的钩子 -->
            <el-upload :action="uploadURL"
              :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name='4'>
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        // 商品名称
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: ''
      },
      // 添加商品的表单验证
      addFormRules: {
        // 为商品名称指定校验规则(为数组)
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 获取的商品分类列表（数组）
      catelist: [],
      // 节点选择器的配置对象(商品分类列表的)
      cateProps: {
        // 看到的属性
        label: 'cat_name',
        // 选中的是谁的值
        value: 'cat_id',
        // 哪个属性有父子节点的嵌套
        children: 'children'
      },
      // 动态参数列表数据（第二个面板）
      manyTableData: [],
      // 静态属性列表数据（第三个面板）
      onlyTableData: [],
      // 上传图片的URL地址,后台地址拼接upload
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象(为每次上传图片的ajax请求提供了token验证)
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的路径
      previewPath: '',
      // 图片预览对话框是否可见
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品的分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据错误')
      }
      this.$message.success('成功获取商品分类数据')
      this.catelist = res.data
      // console.log(this.catelist)
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 阻止页签切换的函数
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('要离开' + oldActiveName)
      // console.log('要进入' + activeName)
      // 标签页名字为0即第一页，且当前选中项的长度（级联选择器）不为3
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // tab栏切换触发的函数
    async tabClicked() {
      // console.log(this.activeIndex)
      // 证明访问的是动态参数面板，即第二个面板
      if (this.activeIndex === '1') {
        // console.log('商品参数动态属性面板')
        // 要获取三级分类的id这样太麻烦，可以通过计算属性得到
        // this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`)
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        // this.$message.success('成功获取动态参数列表')
        // console.log(res.data)
        // 遍历后 attr_vals由字符串变为了数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态参数列表失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      // console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功后的事件 response为服务器返回的数据对象
    handleSuccess(response) {
      // console.log(response)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
      // console.log(picInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add() {
      // 拿到表单的引用对象，首先进行预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        // goods_cat 由数组变为字符串，但前面级联选择器绑定了goods_cat，所以需要深拷贝
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 深拷贝 lodash  cloneDeep(obj),括号里为拷贝的对象
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  // 计算属性
  computed: {
    // 获取三级分类的Id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
