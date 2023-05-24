<template>
  <div class="message-wrap">
    <div class="content">
      <div class="message-list" v-for="item in messageList" :key="item.id">
        <div class="header">
          <div class="title">{{ item.title }}</div>
          <div class="time">{{ item.createTime }}</div>
        </div>
        <div class="desc">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messageList: [
        {
          id: 1,
          title: '公告：今日推荐营养搭配饭前炒鸡蛋',
          createTime: '2023.05.24',
          desc: '最近看到好多人都在说海参营养价值比较高，也建议多吃点海参，说是有滋补元气的功效，对身体特好！海参有什么功效？适合什么人吃？？'
        },
        {
          id: 2,
          title: '公告：今日推荐营养搭配饭前炒鸡蛋',
          createTime: '2023.05.24',
          desc: '最近看到好多人都在说海参营养价值比较高，也建议多吃点海参，说是有滋补元气的功效，对身体特好！海参有什么功效？适合什么人吃？？'
        },
        {
          id: 3,
          title: '公告：今日推荐营养搭配饭前炒鸡蛋',
          createTime: '2023.05.24',
          desc: '最近看到好多人都在说海参营养价值比较高，也建议多吃点海参，说是有滋补元气的功效，对身体特好！海参有什么功效？适合什么人吃？？'
        }
      ]
    }
  }
}
</script>
<style scoped>
.message-wrap {
  background-color: #fff;
  border-radius: .03rem;
  color: #ABABAB;
}
.content {
  padding: .3rem .48rem;
}
.message-list:not(:first-child) {
  margin-top: .4rem;
}
.message-list:not(:last-child) {
  border-bottom: 1px solid #EFEEF3;
  padding-bottom: .45rem;
}

.message-list .header {
  display: flex;
  align-items: center;
}
.message-list .header .title {
  color: #666;
  font-size: .16rem;
  font-weight: bold;
}
.message-list .header .time {
  margin-left: .16rem;
  font-size: .16rem;
}
.message-list .desc {
  margin-top: .24rem;
  line-height: .24rem;
}
</style>