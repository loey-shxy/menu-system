<template>
  <div class="menu-wrap">
    <div class="menu-list" v-for="item in menus" :key="item.id">
      <div class="content">
        <div class="title">{{ item.title }}</div>
        <div class="desc">{{ item.desc }}</div>
      </div>
      <div class="actions">
        <el-button type="text" class="text-blue">引用</el-button>
        <el-button type="text" class="text-red">忽略</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menus: [
        {
          id: 1, 
          title: '小老虎分享菜谱',
          desc: '如皋市港城初中2022-2023下 第四周 学生教师菜谱'
        },
        {
          id: 2, 
          title: '小老虎分享菜谱',
          desc: '如皋市港城初中2022-2023下 第四周 学生教师菜谱'
        },
        {
          id: 3, 
          title: '小老虎分享菜谱',
          desc: '如皋市港城初中2022-2023下 第四周 学生教师菜谱'
        }
      ]
    }
  },
  methods: {

  }
}
</script>
<style scoped>
.menu-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.menu-list:not(:first-child) {
  margin-top: .6rem;
}
.menu-list .actions {
  width: max-content;
}

.menu-list .content {
  flex: 1;
  display: flex;
}
.menu-list .content .title {
  color: #576EEC;
}
.menu-list .content .desc {
  color: #333;
  margin-left: .35rem;
}
.text-blue {
  color: #576EEC !important;
}
.text-red {
  color: #EC5757 !important;
}
</style>