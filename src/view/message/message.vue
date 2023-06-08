<template>
  <div class="message-wrap">
    <div class="content" v-if="noteList.length">
      <div class="message-list" v-for="item in noteList" :key="item.id">
        <div class="header">
          <div class="title">{{ item.title }}</div>
          <div class="time">{{ item.createTime }}</div>
        </div>
        <div class="desc">{{ item.desc }}</div>
      </div>
    </div>
    <div class="content empty" v-else>
      <img src="../../assets/img/common/empty.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      noteList: []
    }
  },
  mounted() {
    this.requestNote()
  },
  methods: {
    //请求数据
			requestNote() {
      this.utils.ajax({
        url: '/api/notify/query',
        data:  this.condition,
      },(res) => {
        if(res.success){
          this.noteList = res.data;
        }
      });
    },
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

.empty {
  text-align: center;
  padding: 1rem 0;
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