<template>
  <el-dialog
  title=""
  :visible.sync="dialogVisible"
  width="11.05rem"
  class="custom-dialog"
  :before-close="close">
  <el-form :model="form" ref="rulesForm" size="mini" label-width=".95rem">
    <section>
      <div class="person-title">个人信息</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="trueName">
            <el-input v-model="form.trueName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </section>
    
    <section>
      <div class="person-title">扩展信息</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="form.companyName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <div class="btn-wrap">
      <el-form-item>
        <el-button type="primary">编辑信息</el-button>
        <el-button type="primary">修改密码</el-button>
      </el-form-item>
    </div>
    <section>
      <el-form-item label="开通时间" prop="time">
        <el-select v-model="form.time" class="w-100">
          <el-option v-for="item in dates" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <div class="dates-list">
          <span :class="['date', form.time === item.value && 'select']" v-for="item in dates" :key="item.value">{{ item.label }}</span>
        </div>
      </el-form-item>

      <div class="btn-wrap">
      <el-form-item>
        <el-button type="primary">立即开通</el-button>
      </el-form-item>
    </div>
    </section>
  </el-form>
</el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dates: [
        { value: 3, label: '三个月' },
        { value: 6, label: '六个月' }
      ],
      form: {
        userName: '',
        trueName: '',
        email: '',
        tel: '',
        address: '',
        companyName: '',
        time: ''
      }
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    }
  },

  watch: {
    dialogVisible: {
      handler(n) {
        if (n) {
          this.form = {
            ...this.form,
            ...this.config.userMessage
          }
        }
      }
    }
  }
}
</script>
<style scoped>
section /deep/ .el-form-item {
  margin-bottom: .24rem;
}
.custom-dialog /deep/ .el-dialog__header {
  display: none;
}
.person-title {
  color: #333;
  font-size: .18rem;
  margin-bottom: .33rem;
  font-weight: 800;
}
.btn-wrap {
  text-align: right;
}

section:not(:first-child) {
  margin-top: .4rem;
}

.dates-list {
  margin-top: .3rem;
}
.dates-list .date {
  display: inline-block;
  height: .36rem;
  line-height: .36rem;
  padding: 0 .3rem;
  border-radius: .18rem;
  border: 1px solid #E3E5EE;
  margin-right: .15rem;
  color: #999;
}
.dates-list .date.select {
  background-color: #576EEC;
  border-color: #576EEC;
  color: #fff;
}
</style>