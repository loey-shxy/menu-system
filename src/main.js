// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/all.css'
import './assets/css/site.css'
import utils from './assets/js/utils.js'
import config from './assets/js/config.js'
import commons from './assets/js/common.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.utils = utils;
Vue.prototype.config = config;
Vue.prototype.commons = commons;

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
