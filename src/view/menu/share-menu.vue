<template>
  <div class="share-wrap">
    <el-row :gutter="20">
      <el-col :span="12" v-for="item in userList" :key="item.id">
        <div class="info-wrap">
          <div class="icon-wrap">
            <i :class="['icon', item.select && 'checked']" @click="select(item)"></i>
          </div>
          <div class="logo">
            <img src="../../assets/img/home/user.png" alt=""></img>
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [
        { id: 1, name: '用户昵称' },
        { id: 2, name: '用户昵称' },
        { id: 3, name: '用户昵称' },
        { id: 4, name: '用户昵称' },
        { id: 5, name: '用户昵称' },
        { id: 6, name: '用户昵称' },
        { id: 7, name: '用户昵称' }
      ]
    }
  },
  methods: {
    select(user) {
      if (!user.select) {
        this.$set(user, 'select', true)
      } else {
        this.$set(user, 'select', false)
      }
    }
  }
}
</script>
<style scoped>
.info-wrap {
  display: flex;
  align-items: center;
  margin-bottom: .12rem;
}
.info-wrap .icon-wrap {
  width: .3rem;
  display: flex;
  justify-content: center;
}
.info-wrap .icon {
  display: inline-block;
  background-image: url(../../assets/img/icon/circle.png);
  background-size: 100% 100%;
  cursor: pointer;
  width: .26rem;
  height: .26rem;
}
.info-wrap .icon.checked {
  background-image: url(../../assets/img/icon/circle-checked.png);
  width: .2rem;
  height: .2rem;
}
.info-wrap .logo {
  margin-left: .16rem;
  width: .36rem;
  height: .36rem;
  border-radius: 50%;
  background-color: #fafafa;
}
.info-wrap .logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.info-wrap .name {
  font-size: .16rem;
  color: #333;
  margin-left: .16rem;
}
.footer-btn {
  text-align: right;
}
</style>