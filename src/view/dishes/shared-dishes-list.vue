<template>
  <div class="share-wrap dishes">
    <div class="item-content-dishes flex">
        <div class="dishes-item" v-for="item in dishesList">
            <img :src="config.fileUrl + item.picFilePath">
            <p class="ell">{{item.name}}</p>
            <!-- <div class="ingredient">
              <div class="item">猪肉</div>
              <div class="item">茄子</div>
              <div class="item">猪肉</div>
              <div class="item">茄子</div>
              <div class="item">猪肉</div>
              <div class="item">茄子</div>
            </div> -->
            <div class="footer">
              <div class="time"></div>
              <div class="quote" @click="quote(item)">引用</div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dishesList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    //引用
    quote(dishes) {
      this.commons.delTIP({
        title: "确定要引用该菜品？",
        successMessage: "引用成功",
        errorMessage:"引用失败",
        data:{
          id: dishes.id
        },
        url:'/api/background/Dishes/checkReferMenu'
      },()=> {
      })
    }
  }
}
</script>
<style scoped>
  .share-wrap {
    background-color: #fff;
    min-height: calc(100% - 1rem);
    padding: .3rem .22rem;
    box-sizing: border-box;
  }
  .item-content-dishes {
    margin-top: 0;
  }
</style>