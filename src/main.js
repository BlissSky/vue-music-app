// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/less/index.less'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.use(VueLazyLoad,{
  loading: require('common/image/default.png')
})

fastclick.attach(document.body)
/*Vue.config.productionTip = false*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

