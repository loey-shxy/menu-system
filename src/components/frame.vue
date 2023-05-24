<template>
  <div class="wrap frame-wrap">
    <el-container class="background-color" style="min-height:100%;">
      <!--左侧  start-->
      <div class="side">
        <div class="logo" @click="backHome"></div>
        <div class="menu">
          <div 
            v-for="item in menu"
            :style="item.sort === activeMenuObj.sort ? item.menustyle : 'margin-bottom:.2rem;'"
            :class="item.sort === activeMenuObj.sort ? 'active-menu menu-div' : 'menu-div'">
            <div 
              :class="item.sort === activeMenuObj.sort ? 'menu-item active-menu-item' : 'menu-item'"
              @click="activeMenu(item)">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
              <i v-if="item.childMenu.length"
                :class="item.sort === activeMenuObj.sort ? 'arrow arrow-active ' : 'arrow'"></i>
              <i v-else class="arrow no-arrow"></i>
            </div>
            <div class="submenu" v-show="item.sort === activeMenuObj.sort">
              <div 
                v-for="submenu in item.childMenu"
                :class="submenu.sort === activeSubMenuObj.sort ? 'active-sub submenu-item' : 'submenu-item'"
                @click="activeSubMenu(submenu, item)">
                <i><b></b> </i>
                <p>{{ submenu.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="person"></div>
      </div>
      <!--左侧  end-->
      <!--中间内容 start-->
      <el-main>
        <div class="overflow-view">
          <div class="header flex justify-end align-item-center">
            <el-input class="search" placeholder="请输入关键字" v-model="searchContent" @keyup.native.enter="search">
              <div slot="suffix" class="search-icon" @click="search"></div>
            </el-input>
            <div class="user-wrap flex">
              <div class="user-logo">
                <img src="../assets/img/home/user.png" alt="">
              </div>
              
              <div class="user-info">
                <el-dropdown :hide-on-click="false" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <p>{{config.userMessage.trueName}} <img src="../assets/img/home/vip.png" alt=""> </p>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <template v-if="config.userMessage.userType !== 1">
                          <el-dropdown-item command="user">个人信息</el-dropdown-item>
                          <el-dropdown-item command="exit">退出系统</el-dropdown-item>
                        </template>
                        <el-dropdown-item v-else command="login">登录系统</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <p>2024.02.23会员到期</p>
              </div>
            </div>
          </div>
          <div class="view ">
            <router-view ref="mychild"></router-view>
          </div>
        </div>
      </el-main>
      <!--中间内容 end-->
    </el-container>

    <PersonInfo ref="personInfo" />
  </div>
</template>

<script>
import PersonInfo from '@/view/person-info/person-info.vue';
export default {
  name: "frame",
  components: {
    PersonInfo
  },
  data() {
    return {
      menu: [],
      menuTourist: [             //游客菜单
        {
          name: '菜谱信息',
          icon: 'icon-menu icon',
          active: false,
          sort: '1',
          menustyle: '',
          childMenu: [
            { name: "手动排菜谱", path: 'menu-hand-new', sort: '11' },
            { name: "智能排菜谱", path: 'menu-arrange', sort: '12' },
            { name: "共享云菜谱", path: 'menu-list?type=share', sort: '13' },
            { name: "我的菜谱", path: 'menu-list?type=my', sort: '14' },
            { name: "智能生成采购单", path: 'menu-list?type=my', sort: '15' },
            { name: "智能营养成分分析", path: 'menu-list?type=my', sort: '16' },
            { name: "菜谱成本价格预测", path: 'menu-list?type=my', sort: '17' },
          ]
        }, {
          name: '菜品信息',
          icon: 'icon-dishes icon',
          active: false,
          sort: '2',
          menustyle: '',
          childMenu: [
            { name: "我的菜品", path: 'my-dishes-list', sort: '21' },
            { name: "共享菜品", path: 'dishes-list?type=share', sort: '22' },
          ]
        }, {
          name: '食材信息',
          active: false,
          sort: '3',
          menustyle: '',
          icon: 'icon-food icon',
          childMenu: [
            { name: "共享食材", path: 'food-list', sort: '31' },
            { name: "食材补充记录", path: 'food-supple', sort: '32' },
          ]
        }, {
          name: '基础功能',
          active: false,
          sort: '4',
          menustyle: '',
          icon: 'icon-basic icon',
          childMenu: [
            { name: "个人信息", path: "user-detail", sort: '41' },
            { name: "供应商列表", path: "supplier-list", sort: '42' },
            { name: "审批记录", path: "approval-list", sort: '43' },
          ]
        }

      ],
      menuMember: [              //会员菜单
        {
          name: '菜谱信息',
          icon: 'icon-menu icon',
          active: false,
          sort: '1',
          menustyle: '',
          childMenu: [
            { name: "我的菜谱", path: 'menu-list?type=my', sort: '11' },
            { name: "智能排菜", path: 'menu-arrange', sort: '12' },
            { name: "手动排菜", path: 'menu-hand-new', sort: '13' },
            { name: "共享菜谱", path: 'menu-list?type=share', sort: '14' },
          ]
        }, {
          name: '菜品信息',
          active: false,
          sort: '2',
          menustyle: '',
          icon: 'icon-basic icon',
          childMenu: [
            { name: "我的菜品", path: 'my-dishes-list', sort: '21' },
            { name: "共享菜品", path: 'dishes-list?type=share', sort: '22' },
            { name: "添加菜品", path: 'dishes-list-add', sort: '23' },
            { name: "菜品类型", path: "dishes-type", sort: '24' },
          ]
        },
        {
          name: '食材信息',
          active: false,
          sort: '3',
          menustyle: '',
          icon: 'icon-basic icon',
          childMenu: [
            { name: "共享食材", path: 'food-list', sort: '31' },
            { name: "食材补充记录", path: 'food-supple', sort: '32' },

          ]
        },
        {
          name: '基础功能',
          active: false,
          sort: '4',
          menustyle: '',
          icon: 'icon-basic icon',
          childMenu: [
            { name: "个人信息", path: "user-detail", sort: '41' },
            { name: "供应商列表", path: "supplier-list", sort: '42' },
            { name: "审批记录", path: "approval-list", sort: '43' },
            { name: "虚拟供应商改名", path: "supplier-list-fictitious", sort: '44' },
          ]
        }
      ],
      menuVendor: [
        {
          name: '个人信息',
          sort: '1',
          active: false,
          menustyle: '',

          path: 'user-detail'
        }, {
          name: '食材列表',
          sort: '2',
          active: false,
          menustyle: '',

          path: 'food-list'
        }, {
          name: '食材补充记录',
          sort: '3',
          active: false,
          menustyle: '',

          path: 'food-supple'
        }, {
          name: '会员采购单',
          sort: '4',
          active: false,
          menustyle: '',

          path: 'food-bill'
        }, {
          name: '供应商采购单',
          sort: '5',
          active: false,
          menustyle: '',

          path: 'food-vendor-bill'
        }, {
          name: '菜品补充记录',
          sort: '6',
          active: false,
          menustyle: '',

          path: 'dishes-supple'
        }
      ],
      menuAdmin: [
        {
          name: '基础功能',
          active: false,
          sort: '1',
          menustyle: '',
          icon: 'icon-basic icon',
          childMenu: [
            { name: "基础信息", path: "basic", sort: '11' },
            { name: "食材类型", path: "food-type", sort: '12' },
            { name: "菜品类型", path: "dishes-type", sort: '13' },
            { name: "食材信息", path: "food-list", sort: '14' },
          ]
        },
        {
          name: '菜品信息',
          active: false,
          sort: '2',
          menustyle: '',
          icon: 'icon-basic icon',
          childMenu: [
            { name: "基础菜品", path: 'dishes-list', sort: '21' },
            { name: "会员菜品", path: 'dishes-list?type=member', sort: '22' },

          ]
        },
        {
          name: '菜谱信息',
          icon: 'icon-menu icon',
          active: false,
          sort: '3',
          menustyle: '',
          childMenu: [
            { name: "分享菜谱", path: 'menu-list?type=share', sort: '31' },
            { name: "会员菜谱", path: 'menu-list', sort: '32' },
          ]
        },
        {
          name: '审批记录',
          active: false,
          sort: '4',
          menustyle: '',
          icon: 'icon-record icon',
          path: 'approval-list'
        },
        {
          name: '会员信息 ',
          active: false,
          sort: '5',
          menustyle: '',
          icon: 'icon-record icon',
          path: 'member-list'
        },
        {
          name: '供应商信息',
          active: false,
          sort: '6',
          menustyle: '',
          icon: 'icon-record icon',
          path: 'supplier-list'
        }
      ],
      searchContent: "",
      activeMenuObj: {},     //当前菜单
      activeSubMenuObj: {},  //当前的子菜单
      noReadNum: 0              //未读的数量
    }
  },

  mounted() {
    this.requestNews();
    this.initMenu();
  },
  methods: {
    initMenu() {
      //userType 2为会员，3为供应商

      if (this.config.userMessage.userType === 2) {
        this.menuMember.forEach((item, index) => {
          item.childMenu = item.childMenu || [];
          item.sort = index;
          item.menustyle = 'margin-bottom:.2rem;height:' + (item.childMenu.length * 0.54 + 0.43) + 'rem';

        })

        this.menu = this.menuMember;
      } else if (this.config.userMessage.userType === 1) {
        this.menuAdmin.forEach((item, index) => {
          item.childMenu = item.childMenu || [];
          item.sort = index;
          item.menustyle = 'margin-bottom:.2rem;height:' + (item.childMenu.length * 0.54 + 0.43) + 'rem';
        })

        this.menu = this.menuAdmin;
      }
      else if (this.config.userMessage.userType === 3) {
        this.menuVendor.forEach((item, index) => {
          item.childMenu = item.childMenu || [];
          item.sort = index;
          item.menustyle = 'margin-bottom:.2rem;height:' + (item.childMenu.length * 0.54 + 0.43) + 'rem';
        })

        this.menu = this.menuVendor;
      }
      else {
        this.menuTourist.forEach((item, index) => {
          item.childMenu = item.childMenu || [];
          item.sort = index;
          item.menustyle = 'margin-bottom:.2rem;height:' + (item.childMenu.length * 0.54 + 0.43) + 'rem';
        })
        this.config.userMessage.trueName = '游客';
        this.menu = this.menuTourist;
      }

    },

    //菜单点击
    activeMenu(itemActive) {
      this.activeMenuObj = itemActive;
      this.activeSubMenuObj = {};
      if (!itemActive.childMenu.length && itemActive.path) {
        this.$router.push({
          path: itemActive.path
        });
      }

    },

    //子菜单点击
    activeSubMenu(itemSubActive, item) {

      this.activeMenuObj = item;
      this.activeSubMenuObj = itemSubActive;
      if (itemSubActive.path)
        this.$router.push({
          path: itemSubActive.path
        });
    },


    //返回首页
    backHome() {
      this.$router.replace({
        path: "home"
      });
    },


    //调整消息列表
    jumpNew() {
      this.$router.push({
        path: "new-list",
      });
    },


    search() {
      this.$router.push({
        path: "common-list",
        query: {
          keywords: this.searchContent

        }
      });
    },

    handleCommand(command) {
      switch(command) {
        case 'user': this.$refs.personInfo.open(); break;
        case 'exit': this.exit(); break;
        default:  
          this.$router.replace({
            path: "login"
          });
      }
    },

    //获取消息
    requestNews() {
      this.utils.ajax({
        url: '/api/notify/unReadNums',
      }, (res) => {
        if (res.success) {
          this.noReadNum = res.data;
        }
      });
    },

    //退出系统
    exit() {
      this.$confirm('确定退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.utils.ajax({
          url: '/api/background/logout',
        }, (res) => {
          if (res.success) {
            this.utils.clearLocalStorage();
            this.config.userMessage = {};
            this.userMessage = {};

            this.$router.replace({
              path: "login"
            });
          }
        });
      });
    }
  },
}
</script>


<style scoped>
.frame-wrap {
  height: 100%;

}

.el-container {
  background-image: url("./../assets/img/home/pic-cloud.png") !important;

  background-size: 2.4rem !important;
  background-repeat: no-repeat !important;
}

.side {
  width: 2.4rem;
  min-height: 11rem;
  position: relative;

}

.logo {
  width: 100%;
  height: 1.88rem;
  background: url("./../assets/img/home/logo.png") no-repeat;
  background-size: .64rem .88rem;
  background-position: 50%;
  cursor: pointer;
}

.menu {
  margin-left: .11rem;
  margin-right: .1rem;
  margin-bottom: .5rem;
  width: 2.17rem;
  text-align: center;
}

.menu-item {
  line-height: .42rem;
  cursor: pointer;
}

.active-menu-item {
  background: #6d7fe5;
  border-radius: .08rem;
}

.menu-item span {
  margin-right: .45rem;
  color: #94aefc;
  font-size: .16rem;
  vertical-align: middle;
}

.active-menu-item span {
  color: #ffffff;
}

.person {
  position: absolute;
  left: .2rem;
  bottom: .5rem;
  width: 2rem;
  height: 3.6rem;
  background: url("./../assets/img/home/pic-person.png") no-repeat;
  background-size: 2rem 3.6rem;
}

.overflow-view {
  /* padding: 0.1px .5rem; */
  background: #F3F4F9;
  height: 100%;
}

.icon {
  margin-right: .16rem;
  width: .16rem;
  height: .16rem;
  display: inline-block;
  vertical-align: middle;
  background-size: .16rem .16rem;
}

.icon-menu {
  background: url("./../assets/img/home/icon-menu.png") no-repeat;
  background-size: .16rem .16rem;
}

.active-menu .icon-menu {
  background: url("./../assets/img/home/icon-menu-active.png") no-repeat;
  background-size: .16rem .16rem;
}

.icon-food {
  background: url("./../assets/img/home/icon-food.png") no-repeat;
  background-size: .16rem .16rem;
}

.active-menu .icon-food {
  background: url("./../assets/img/home/icon-food-active.png") no-repeat;
  background-size: .16rem .16rem;

}

.icon-dishes {
  width: .19rem;
  height: .17rem;
  background: url("./../assets/img/home/icon-dishes.png") no-repeat;
  background-size: .19rem .17rem;
}

.active-menu .icon-dishes {
  background: url("./../assets/img/home/icon-dishes-active.png") no-repeat;
  background-size: .19rem .17rem;
}

.icon-basic {
  background: url("./../assets/img/home/icon-basic.png") no-repeat;
  background-size: .16rem .16rem;
}

.active-menu .icon-basic {
  background: url("./../assets/img/home/icon-basic-active.png") no-repeat;
  background-size: .16rem .16rem;
}

.icon-record {
  width: .19rem;
  height: .17rem;
  background: url("./../assets/img/home/icon-record.png") no-repeat;
  background-size: .19rem .17rem;
}

.active-menu .icon-record {
  background: url("./../assets/img/home/icon-record-active.png") no-repeat;
  background-size: .19rem .17rem;
}

.arrow {

  display: inline-block;
  width: .11rem;
  height: .11rem;
  background: url("./../assets/img/home/pic-arrow1.png") no-repeat;
  background-size: .06rem .11rem;
  vertical-align: middle;
  transition: all .3s;
  transform: rotate(0deg);
}

.no-arrow {
  background: none;
}

.arrow-active {
  width: .11rem;
  height: .06rem;
  background: url("./../assets/img/home/pic-arrow2.png") no-repeat;
  background-size: .11rem .06rem;
}

.menu-div {
  height: .43rem;
  transition: height .3s;
}

.active-menu {
  background: #485fde;
  border-radius: .08rem;
}

.submenu-item {
  display: flex;
  cursor: pointer;
}

.submenu i {
  width: .6rem;
}

.submenu p {
  width: 1.56rem;
  font-size: .14rem;
  line-height: .54rem;
  color: #ffffff;
  text-align: left;
}

.el-main {
  padding: 0;
}

.search {
  width: 3.27rem;
  height: 0.47rem;
  line-height: 0.47rem;
}

.user-wrap {
  width: 3rem;
  height: 0.47rem;
  padding-left: 0.24rem;
  cursor: pointer;
}

.user-wrap .user-logo {
  width: 0.45rem;
  height: 0.45rem;
}

.user-wrap .user-logo img {
  width: 100%;
  height: 100%;
}

.user-wrap .user-info {
  padding-left: 0.1rem;
}

.user-wrap .user-info p {
  font-size: 0.14rem;
  color: #999;
  display: flex;
  align-items: center;
  height: 0.24rem;
}

.user-wrap .user-info p img {
  width: 0.25rem;
  height: 0.22rem;
  margin-left: 0.1rem;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-dropdown-link:hover /deep/ .el-dropdown-menu {
  display: block;
}
.active-sub p {
  color: #6ce9fc;
}

.active-sub b {
  background: #64cdf5;
  width: 4px;
  height: 4px;
  border-radius: 100%;
  display: block;
  margin: 0.25rem auto;
  margin-left: 0.45rem;
}

.el-badge-news {
  margin-right: 0.2rem;
  cursor: pointer;
}

.header {
  background-color: #fff;
  height: .96rem;
}

.view {
  padding: 0.25rem;
  min-height: calc(100% - 1.96rem);
}
</style>
