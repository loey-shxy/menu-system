<template>
  <div class="home-wrap">
    <div class="note-wrap">
      <div class="note-info">
        <div class="icon-wrap">
          <img class="icon" src="../../assets/img/home/note-icon.png" alt="">
          <img class="system-note" src="../../assets/img/home/note.png" alt="">
        </div>
        <div class="note-list">
          <div class="note-item" v-for="item in noteList" :key="item.id">{{ item.msg }}</div>
        </div>
      </div>
      <div class="more">全部公告</div>
    </div>

    <!-- 共享菜品 start -->
    <section class="dishes" style="height: auto;">
      <div class="title">共享菜品</div>
      <div class="header">
        <div class="menu-list" :style="{height: dishesMenu ? 'max-content' : '.32rem'}">
          <div class="menu-item active">全部</div>
          <div class="menu-item" v-for="item in typeList">{{ item.name }}</div>
        </div>
        <div class="more" @click="dishesMenu = !dishesMenu">{{ dishesMenu ? '收起' : '更多' }}</div>
      </div>
      <div class="item-content-dishes flex " style="flex-wrap:wrap;">
        <div class="dishes-item" @click="view(item, 2)"
          v-for="item in dishesList">
          <img :src="config.fileUrl + item.picFilePath">
          <p class="ell">{{ item.name }}</p>
          <div class="ingredient">
            <div class="item">猪肉</div>
            <div class="item">茄子</div>
            <div class="item">猪肉</div>
            <div class="item">茄子</div>
            <div class="item">猪肉</div>
            <div class="item">茄子</div>
          </div>
          <div class="footer">
            <div class="time">05.23分享</div>
            <div class="quote">引用</div>
          </div>
        </div>
      </div>
    </section>
    <!--菜品 end-->

    <!-- 共享菜谱 start -->
    <section class="menu">
      <div class="title">共享菜品</div>
      <div class="header flex ">
        <div class="menu-list" :style="{height: cuisineMenu ? 'max-content' : '.32rem'}">
          <div class="menu-item active" @click="moreMenu()">全部</div>
          <div class="menu-item" v-for="item in menuList" @click="moreMenu(item.menuType)">{{ item.menuTypeDesc }}</div>
        </div>
        <div class="more" @click="cuisineMenu = !cuisineMenu">{{ cuisineMenu ? '收起' : '更多' }}</div>
      </div>
      <div class="menu-content flex">
        <div class="item-content" v-for="item in menuList">
          <div class="title flex justify-content">
            <div class="flex">
              <p class="icon"></p>
              <p class="menu-desc ell">{{ item.menuTypeDesc }}</p>
            </div>
            <p class="more hover-font" @click="moreMenu(item.menuType)">更多</p>
          </div>
          <p class="menu-detail ell" @click="view(itemDetails, 1)" v-if="index < 3"
            v-for="(itemDetails, index) in item.details">
            <i></i>
            <span>{{ itemDetails.menuTitle }}</span>
          </p>
        </div>
      </div>
    </section>
    <!--菜谱 end-->

    <!-- 供应商 会员 -->
    <div class="supplier-wrap">
      <div class="supplier">
        <div class="header">供应商
          <div class="more">更多</div>
        </div>
        <div class="supplier-list" v-for="item in suppliers" :key="item.id">
          <div class="supplier-info">
            <i class="icon"></i>
            <div class="name ell">{{ item.name }}</div>
          </div>
          <div class="addr">{{ item.addr }}</div>
        </div>
      </div>
      <div class="supplier">
        <div class="header">会员
          <div class="more">更多</div>
        </div>
        <div class="user-wrap">
          <div class="users" v-for="item in users" :key="item.id">
            <div class="logo">
              <img src="../../assets/img/home/user.png" alt="">
            </div>
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 供应商 会员 end -->

    <!--图表 start-->
    <section class="charts flex">
      <div class="cost">
        <div id="priceChart" class="price-chart"></div>
      </div>
      <div class="nutrition flex-one">
        <div id="nutrientChart" class="nutrient-chart"></div>
      </div>
    </section>
    <!--图表 end-->
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "home",
  data() {
    return {
      dishesMenu: false,
      cuisineMenu: false,
      typeList: [],    //菜品类型
      dishesList: [],  //菜品
      menuList: [],  //菜谱
      noteList: [
        { id: 1, msg: '公告：今日推荐营养搭配饭前炒鸡蛋' },
        { id: 2, msg: '公告：今日推荐营养搭配饭前炒鸡蛋' },
        { id: 3, msg: '公告：今日推荐营养搭配饭前炒鸡蛋' }
      ],
      suppliers: [
        { id: 1, name: '美食供应有限公司', addr: '重庆'},
        { id: 2, name: '美食供应有限公司', addr: '重庆'},
        { id: 3, name: '美食供应有限公司', addr: '重庆'}
      ],
      users: [
        { id: 1, name: '会员昵称' },
        { id: 2, name: '会员昵称' },
        { id: 3, name: '会员昵称' },
        { id: 4, name: '会员昵称' },
        { id: 5, name: '会员昵称' },
        { id: 6, name: '会员昵称' },
        { id: 7, name: '会员昵称' },
        { id: 8, name: '会员昵称' },
        { id: 9, name: '会员昵称' }
      ]
    }
  },
  mounted() {
    this.requestMenuList();
    this.requestType();
    this.requestDishesList();

    this.initCostPrice();
    this.initNutrients();

  },
  methods: {
    //请求菜谱
    requestMenuList() {
      this.utils.ajax({
        url: '/api/background/Menu/sortMenu',
      }, (res) => {
        if (res.success) {
          this.menuList = res.data
        }
      });
    },

    //请求菜品类型
    requestType() {
      this.utils.ajax({
        url: '/api/background/DishesClass/getClasses',
      }, (res) => {
        if (res.success) {
          this.typeList = res.data
        }
      });
    },


    //请求菜品
    requestDishesList() {

      this.utils.ajax({
        url: '/api/background/Dishes/getDishesForHome',
        data: {
          pageNo: 1,
          pageSize: 6
        }
      }, (res) => {
        if (res.success) {
          this.dishesList = res.data;
        }
      });

    },


    //查看更多菜单
    moreMenu(menuType) {

      this.$router.replace({
        path: 'menu-list?type=share',
        query: {
          menuType: menuType
        }
      });
    },
    //初始化成本核算
    initCostPrice(data) {
      let option = {
        title: {
          text: '成本核算',
          left: 'left',
          textStyle: {
            fontSize: '.2rem',
            color: '#333333',
          },
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          textStyle: {
            fontSize: '.14rem',
            color: '#333333',
          },
        },
        color: ['#5972e9', '#dc5f88', '#79bebb',],
        dataset: {
          source: [
            ['product', '早餐', '午餐', '晚餐'],
            ['星期一', 13.3, 85.8, 43.7],
            ['星期二', 13.1, 73.4, 35.1],
            ['星期三', 16.4, 65.2, 32.5],
            ['星期四', 12.4, 53.9, 29.1]
          ]
        },
        grid: {
          top: '60px',
          bottom: '35px',
        },
        xAxis: { type: 'category', name: '时间' },
        yAxis: { name: '价格（元）' },
        series: [
          {
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#4d4d4d",
                  fontSize: '.14rem'
                }
              }
            }
          },
          {
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#4d4d4d",
                  fontSize: '.14rem'
                }
              }
            }
          }, {
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#4d4d4d",
                  fontSize: '.14rem'
                }
              }
            }
          }
        ]
      };

      let priceChart = echarts.init(document.getElementById('priceChart'));
      // 绘制图表
      priceChart.setOption(option);
    },

    //初始化菜单营养成分
    initNutrients(data) {
      let option = {
        title: {
          text: '菜谱营养成分分析',
          left: 'left',
          textStyle: {
            fontSize: '.2rem',
            color: '#333333',
          },
        },
        color: ['#6cddf4', '#a575fc', '#4698f4', '#fa92b3'],
        legend: {
          orient: 'horizontal',
          left: 'right',
          textStyle: {
            fontSize: '.14rem',
            color: '#333333',
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            center: ["50%", "55%"], 　　　　//这个属性调整图像的位置
            data: [
              { value: 1040, name: '维生素' },
              { value: 735, name: '蛋白质' },
              { value: 580, name: '能量' },
            ],
            label: { //去除饼图的指示折线
              normal: {
                show: true,
                formatter: "{d}%"
              }
            }
          }
        ]
      };
      let nutrientChart = echarts.init(document.getElementById('nutrientChart'));
      // 绘制图表
      nutrientChart.setOption(option);
    },
    //查看
    view(data, type) {
      let link;
      if (type === 1)
        link = this.$router.resolve({
          path: 'menu-list-detail',
          query: {
            id: data.menuId
          }
        });
      else {
        link = this.$router.resolve({
          path: 'dishes-list-detail',
          query: {
            id: data.id
          }
        });

      }
      window.open(link.href, '_blank');
    }
  }

}
</script>

<style scoped>
.note-wrap {
  height: .57rem;
  display: flex;
  background-color: #fff;
  border-radius: 0.03rem;
  align-items: center;
}

.note-wrap .note-info {
  flex: 1;
  display: flex;
  box-sizing: border-box;
  padding-left: 0.13rem;
  align-items: center;
}

.note-info .icon-wrap {
  display: flex;
  align-items: center;
}

.note-info .icon {
  width: .26rem;
  height: .26rem;
}

.note-info .system-note {
  width: .72rem;
  height: .17rem;
  margin-left: .1rem;
}

.note-info .note-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 0 .5rem;
}

.note-info .note-list .note-item {
  color: #666;
  font-size: .16rem;
}

.note-wrap .more {
  width: 1.2rem;
  color: #999;
  font-size: .16rem;
  text-decoration: underline;
  cursor: pointer;
  text-align: right;
  padding-right: .26rem;
}

.dishes,
.menu {
  margin-top: .15rem;
  background-color: #fff;
  border-radius: .03rem;
  padding: .24rem .22rem .36rem;
}

.menu .title,
.dishes .title {
  font-size: 20px;
  font-weight: 800;
  color: #333333;
  padding-left: .05rem;
}

.menu .header,
.dishes .header {
  display: flex;
  border-bottom: 1px solid #F3F4F9;
  margin: 0 -.22rem;
  margin-top: .3rem;
  padding: 0 .22rem;
}

.menu .header .more,
.dishes .header .more {
  width: .6rem;
  color: #576EEC;
  cursor: pointer;
}

.header .menu-list {
  flex: 1;
  box-sizing: border-box;
  padding-right: .2rem;
  display: flex;
  flex-wrap: wrap;
  height: .32rem;
  overflow: hidden;
  gap: .2rem;
  transition: height .3s linear;
}
.menu-list .menu-item {
  color: #333;
  padding: 0 .16rem .07rem;
  cursor: pointer;
}

.menu-list .menu-item.active {
  color: #576EEC;
  border-bottom: 1px solid #576EEC;
}

.menu-list .menu-item:hover {
  color: #576EEC;
}

.dishes .item-content-dishes {
  margin-top: .25rem;
  display: flex;
  gap: .28rem;
}

.item-content-dishes .dishes-item {
  width: 2.4rem;
  min-height: 3.7rem;
  box-sizing: border-box;
  border-radius: .03rem;
  border: 1px solid #f3f4f9;
  box-sizing: border-box;
  padding: .1rem .1rem .18rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dishes-item img {
  width: 2.18rem;
  height: 2.18rem;
  border-radius: .03rem;
  overflow: hidden;
  border: none;
}

.dishes-item p {
  align-self: start;
  font-size: .16rem;
  color: #333;
  font-weight: 800;
  margin-top: .18rem;
}

.dishes-item .ingredient {
  overflow: hidden;
  align-self: start;
  margin-top: .1rem;
  text-overflow: ellipsis;
}

.dishes-item .ingredient .item {
  display: inline-block;
  padding: 0 .14rem;
  border-radius: .08rem;
  height: .16rem;
  line-height: .16rem;
  font-size: .12rem;
}

.dishes-item .ingredient .item:nth-of-type(2n+1) {
  background-color: #FFF0F0;
  color: #FF1A1A;
}
.dishes-item .ingredient .item:nth-of-type(2n) {
  background-color: #FBF0FF;
  color: #861AFF;
}

.dishes-item .footer {
  display: flex;
  margin-top: .16rem;
  justify-content: space-between;
  align-self: start;
  width: 100%;
}

.dishes-item .footer .time {
  color: #ABABAB;
  flex: 1;
}

.dishes-item .footer .quote {
  width: .65rem;
  height: .22rem;
  background: #576EEC;
  border-radius: .11rem;
  color: #fff;
  line-height: .22rem;
  text-align: center;
  box-sizing: border-box;
}
.menu-content {
  flex-direction: row;
  flex-wrap: wrap;
  gap: .18rem;
}

.menu-content .item-content {
  height: 1.72rem;
  border-radius: .03rem;
  position: relative;
  width: calc((100% - 0.36rem) / 3);
  box-sizing: border-box;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 .02rem .12rem 0 rgb(0 0 0 / 8%);
  margin-top: .3rem;
  border-left: .08rem solid;
  padding: .2rem .16rem;
}
.menu-content .item-content:nth-of-type(2n+1) {
  border-left-color: #576EEC;
}
.menu-content .item-content:nth-of-type(2) {
  border-left-color: #259BFF;
}
.menu-content .item-content:nth-of-type(4) {
  border-left-color: #FF4683;
}
.menu-content .item-content:nth-of-type(6) {
  border-left-color: #FF802B;
}
.menu-content .item-content:nth-of-type(8) {
  border-left-color: #61D7BA;
}

.menu-detail {
  color: #777c8e;
  font-size: .16rem;
  line-height: .4rem;
  cursor: pointer;
}

.title {
  display: flex;
  align-items: center;
}
.title .flex {
  align-items: center;
}

.item-content .icon {
  background-image: url(../../assets/img/home/person.png);
  width: .23rem;
  height: 0.17rem;
  background-size: 100% 100%;
}

.item-content .title .menu-desc {
  margin-left: .1rem;
  color: #333;
  font-size: .18rem;
}

.item-content .title .more {
  cursor: pointer;
}
.menu-detail {
  display: flex;
  align-items: center;
  margin-top: .2rem;
}
.menu-detail i {
  width: .16rem;
  height: .14rem;
  background-image: url(../../assets/img/home/list-style.png);
  background-size: 100% 100%;
  display: inline-block;
  margin-right: .09rem;
}

.supplier-wrap {
  margin-top: .15rem;
  display: flex;
  gap: .18rem;
}

.supplier {
  flex: 1;
  background-color: #fff;
  border-radius: .03rem;
  box-sizing: border-box;
  padding: .24rem .26rem;
}
.supplier .header {
  color: #333;
  font-size: .2rem;
  font-weight: 800;
}

.supplier .header .more {
  color: #576EEC;
  float: right;
}

.supplier-list {
  padding: .24rem 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.supplier-list:not(:last-child) {
  border-bottom: 1px solid #F3F4F9;
}
.supplier-list .supplier-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.supplier-info .icon {
  display: inline-block;
  width: .34rem;
  height: 0.34rem;
  border-radius: 50%;
  background: url(../../assets/img/home/supplier.png);
  background-size: 100% 100%;
}

.supplier-info .name {
  font-size: .16rem;
  margin-left: .18rem;
  color: #333;
}
.supplier-list .addr {
  font-weight: 500;
  color: #999;
  font-size: .16rem;
  width: max-content;
}

.user-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.user-wrap .users {
  width: 33.333%;
  padding: .24rem 0;
  border-top: 1px solid #F3F4F9;
  display: flex;
  align-items: center;
}
.user-wrap .users .logo {
  width: 0.34rem;
  height: 0.34rem;
  border-radius: 50%;
}
.user-wrap .users .logo img {
  width: 100%;
  height: 100%;
}
.user-wrap .users .name {
  color: #333;
  font-size: .16rem;
  margin-left: .18rem;
}
.user-wrap .users:nth-of-type(1),
.user-wrap .users:nth-of-type(2),
.user-wrap .users:nth-of-type(3) {
  border-top: none;
}

.charts {
  margin-top: .15rem;
}

.charts .cost {
  width: 60%;
  background-color: #fff;
  border-radius: .03rem;
  height: 5.42rem;
}
.nutrition {
  background-color: #fff;
  border-radius: .03rem;
  height: 5.42rem;
  margin-left: .28rem;
}
.more {
  color: #576EEC;
  cursor: pointer;
}
</style>