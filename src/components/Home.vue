<template>
  <!-- 要先在element中导入el-container等组件 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域  -->
        <!-- active-text-color为激活的文本颜色  -->
        <!-- unique-opened为是否只保持一个子菜单的展开，前加冒号代表属性绑定，后面为布尔值 -->
        <!-- collapse是否水平折叠收起菜单，属性绑定布尔值，前面加冒号 -->
        <!-- collapse-transition 是否开启折叠动画 -->
        <!-- router即 :router="true"的简写模式，为整个侧边栏开启路由模式 -->
        <!-- default-active当前激活菜单的index -->
        <el-menu background-color="#333744" text-color="#fff"
          active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse"
          :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 要绑定唯一的key属性，有唯一的id尽量用id -->
          <!-- 要想只操作一个一级菜单展开，其他不同时动作，要指定唯一的index -->
          <!-- index动态数据绑定，前面加冒号。并且index只接收字符串不接收数值，item.id为数值 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 动态绑定类-->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 为防止index重复，也要进行动态数据绑定 -->
            <!-- 通过index属性当做跳转地址 -->
            <!-- saveNavState()保存导航链接状态 -->
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children"
            :key="subitem.id" @click="saveNavState('/'+subitem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -------------------------------------->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        // 每个菜单的id指定具体的图标
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠，默认值为false,不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // 页面刚加载时就应该立即获取左侧菜单，定义一个生命周期函数
  created() {
    // 获取所有的左侧菜单
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单（get函数返回函数是promise，用async await进行简化操作）
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color:#fff;
  font-size: 20px;
}

.el-header div {
  display: flex;
  align-items:center;
  span {
    margin-left: 15px;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right:none
  }
}

.el-main {
  background-color: #EAEDF1;
}

// 图标的类
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.5em;
  // 界面点击到成小手
  cursor:pointer;
}
</style>
