import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/view/login/login'], resolve)
    },

    {
      path: '/',
      name: 'frame',
      component: resolve => require(['@/components/frame'], resolve),
      children: [
        {
          path: '/',
          name: 'home',
          component: resolve => require(['@/view/home/home'], resolve)
        },
        {
          path: '/home',
          name: 'home',
          component: resolve => require(['@/view/home/home'], resolve)
        },
        {
          path: '/menu-list',
          name: 'menu-list',
          component: resolve => require(['@/view/menu/menu-list'], resolve)
        },
        {
          path: '/menu-list-detail',
          name: 'menu-list-detail',
          component: resolve => require(['@/view/menu/menu-list-detail'], resolve)
        },
        {
          path: '/dishes-list-detail',
          name: 'dishes-list-detail',
          component: resolve => require(['@/view/dishes/dishes-list-detail'], resolve)
        },
        {
          path: '/supplier-list',
          name: 'supplier-list',
          component: resolve => require(['@/view/supplier/supplier-list'], resolve)
        },
        {
          path: '/supplier-list-fictitious',
          name: 'supplier-list-fictitious',
          component: resolve => require(['@/view/supplier/supplier-list-fictitious'], resolve)
        },
        {
          path: '/approval-list',
          name: 'approval-list',
          component: resolve => require(['@/view/approval/approval-list'], resolve)
        },
        {
          path: '/approval-list-detail',
          name: 'approval-list-detail',
          component: resolve => require(['@/view/approval/approval-list-detail'], resolve)
        },
        {
          path: '/user-detail',
          name: 'user-detail',
          component: resolve => require(['@/view/user/user-detail'], resolve)
        },
        {
          path: '/food-list',
          name: 'food-list',
          component: resolve => require(['@/view/foodType/food-list'], resolve)
        },
        {
          path: '/food-supple',
          name: 'food-supple',
          component: resolve => require(['@/view/foodType/food-supple'], resolve)
        },
        {
          path: '/food-bill',
          name: 'food-bill',
          component: resolve => require(['@/view/foodType/food-bill'], resolve)
        },
        {
          path: '/food-vendor-bill',
          name: 'food-vendor-bill',
          component: resolve => require(['@/view/foodType/food-vendor-bill'], resolve)
        },
        {
          path: '/food-list-detail',
          name: 'food-list-detail',
          component: resolve => require(['@/view/foodType/food-list-detail'], resolve)
        },
        {
          path: '/food-list-add',
          name: 'food-list-add',
          component: resolve => require(['@/view/foodType/food-list-add'], resolve)
        },
        {
          path: '/dishes-list',
          name: 'dishes-list',
          component: resolve => require(['@/view/dishes/dishes-list'], resolve)
        },
        {
          path: '/dishes-supple',
          name: 'dishes-supple',
          component: resolve => require(['@/view/dishes/dishes-supple'], resolve)
        },
        {
          path: '/my-dishes-list',
          name: 'my-dishes-list',
          component: resolve => require(['@/view/dishes/my-dishes-list'], resolve)
        },
        {
          path: '/dishes-list-add',
          name: 'dishes-list-add',
          component: resolve => require(['@/view/dishes/dishes-list-add'], resolve)
        },
        {
          path: '/menu-arrange',
          name: 'menu-arrange',
          component: resolve => require(['@/view/menu/menu-arrange'], resolve)
        },
        {
          path: '/menu-hand',
          name: 'menu-hand',
          component: resolve => require(['@/view/menu/menu-hand'], resolve)
        },
        {
          path: '/menu-hand-new',
          name: 'menu-hand-new',
          component: resolve => require(['@/view/menu/menu-hand-new'], resolve)
        },
        {
          path: '/member-list',
          name: 'member-list',
          component: resolve => require(['@/view/member/member-list'], resolve)
        },
        {
          path: '/dishes-type',
          name: 'dishes-type',
          component: resolve => require(['@/view/dishes/dishes-type'], resolve)
        },
        {
          path: '/food-type',
          name: 'food-type',
          component: resolve => require(['@/view/foodType/food-type'], resolve)
        },
        {
          path: '/basic',
          name: 'basic',
          component: resolve => require(['@/view/basic/basic'], resolve)
        },
        {
          path: '/common-list',
          name: 'common-list',
          component: resolve => require(['@/view/basic/common-list'], resolve)
        },
        {
          path: '/menu-purchase',
          name: 'menu-purchase',
          component: resolve => require(['@/view/menu/menu-purchase'], resolve)
        },
        {
          path: '/menu-purchase-new',
          name: 'menu-purchase-new',
          component: resolve => require(['@/view/menu/menu-purchase-new'], resolve)
        },
        {
          path: '/new-list',
          name: 'new-list',
          component: resolve => require(['@/view/basic/new-list'], resolve)
        },
        {
          path: '/new-detail',
          name: 'new-detail',
          component: resolve => require(['@/view/basic/new-detail'], resolve)
        },
  
      ]
    }
    
  ]
})
