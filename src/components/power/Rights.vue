<template>
  <div>
    <!-- 面包屑导航区 --------------------->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path:'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 ------------------------->
    <el-card>
      <!-- :data-绑定数据源 border-添加竖边框 stripe-隔行变色-->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <!-- label属性为标题 prop为具体的属性值-->
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!-- 作用域插槽 slot-scope="scope"取得作用域插槽:data绑定的数据--------->
          <template slot-scope="scope">
            <!-- 按需展示，添加v-if判断 -->
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level ==='1'">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有的权限列表
      rightsList: []
    }
  },
  created() {
    // 获取所有权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表函数
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.$message.success('获取成功')
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
