<template>
  <div>
    <!-- 面包屑 ---------------->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path:'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 ---------------->
    <el-card>
      <!-- 添加角色按钮区域 ------>
      <!-- 先放一行再放一列 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 ---------------------------------------->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 页面渲染，栅格系统的布局 (i1为索引)(动态绑定，class前加：)-->
            <el-row :class="['vcenter', 'bdbottom', i1 === 0 ? 'bdtop' : '']" v-for='(item1, i1) in scope.row.children' :key='item1.id'>
              <!-- 渲染一级权限 :span占据列数5列（总共24列）------------------>
              <el-col :span="5">
                <!-- 一级权限的名称 -->
                <el-tag closable @click="removeRightById(scope.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 :span占据24-5列----------->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 i2为索引,:class为动态绑定类名-->
                <el-row :class="['vcenter', i2 === 0 ? '' : 'bdtop']" v-for='(item2, i2) in item1.children' :key='item2.id'>
                  <el-col :span="6">
                    <el-tag type="success" closable @click="removeRightById(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限  closable含义为可移除的标签-->
                    <el-tag type='warning' v-for='(item3) in item2.children' :key='item3.id'
                    closable @click="removeRightById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row.children}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- slot-scope="scope"接收作用域插槽的数据 scope.row获取这一行对应的数据(在分配权限中指当前的角色)-->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 ---------------------------------------------------------->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="addRoleClosed">
      <!-- 内容主体区域 ------------>
      <!-- ref是el-form的引用名称 rules验证规则 :model="addRoleForm"添加的表单项-->
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 ----------->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 ---------------------------------------------------------->
    <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 --------->
      <el-form :model="editRoleForm" ref="editRoleFormRef" :rules="addRoleFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 --------->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 ---------------------------------------------------------->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件  :data数据源  :props属性绑定对象  show-checkbox复选框 -->
      <!-- node-key每个树结点用来作为唯一标识的属性，整棵树里唯一 -->
      <!-- default-expand-all 默认展开所有结点 -->
      <!-- :default-checked-keys="defKeys" 默认勾选的节点的key的数组 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制添加角色对话框的显示与隐藏
      addRoleVisible: false,
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象  label-看到哪个属性所对应的值   children-父子节点通过哪个属性嵌套
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 添加角色的表单数据
      addRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证规则对象
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 控制编辑角色对话框的显示与隐藏
      editRoleVisible: false,
      // 要修改的用户信息对象
      editRoleForm: {}
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      // console.log(this.rolelist)
    },
    // 监听添加角色对话框的关闭事件
    addRoleClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 点击按钮，添加新角色
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.getRolesList()
      this.addRoleVisible = false
      return this.$message.success('添加角色成功')
    },
    // 获取修改的角色信息
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.editRoleForm = res.data
      this.editRoleVisible = true
      // return this.$message.success('获取成功')
    },
    // 修改角色信息并验证提交 validate验证函数,true为验证通过，false为不通过)
    editRoleInfo() {
      this.$refs.editRoleFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          return
        }
        // 发起角色信息的数据请求
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc
        })
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新发生错误')
        }
        this.editRoleVisible = false
        this.getRolesList()
        this.$message.success('更新成功')
      })
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 根据ID删除对应的角色信息
    async removeRoleById(id) {
      // console.log(id)
      // 弹窗询问是否删除数据
      // 返回值为promise 故用async和await修饰
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // 前面小图标的类型
          type: 'warning'
        }
        // 按取消行为会触发错误，所以catch捕获错误 （箭头函数）
      ).catch(err => err)
      // 如果用户确认删除，则返回字符串 confirm
      // 如果用户取消删除，则返回字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // console.log('确定删除')
      // 前面已经加上了async请求
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示是否删除
      console.log('1111')
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // 前面小图标的类型
          type: 'warning'
        }
        // 按取消行为会触发错误，所以catch捕获错误 （箭头函数）
      ).catch(err => err)
      // 如果用户确认删除，则返回字符串 confirm
      // 如果用户取消删除，则返回字符串 cancel
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      console.log('确定删除')
      // 前面已经加上了async请求 用反引号用来表示字符串
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除用户成功')
      // this.getRolesList() 大可不必，会发生页面合起来
      // 把服务器返回的最新权限直接赋值给当前角色的children属性
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 把id保存在data中供后续使用
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      // console.log(this.rightslist)

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中(arr为一数组)
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 循环当前node的所有数组，每循环一项拿到一个子节点item,再根据item再次调用递归函数
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // ...为展开运算符，两个数组合并为新数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 形成以,拼接的字符串
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
