import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    bus: new Vue()
  }
}).$mount('#app');

Vue.directive('dragscroll', function (el) {
  el.onmousedown = function (ev) {
    const disX = ev.clientX;
    const disY = ev.clientY;
    const originalScrollLeft = el.scrollLeft;
    const originalScrollTop = el.scrollTop;
    const originalScrollBehavior = el.style['scroll-behavior'];
    const originalPointerEvents = el.style['pointer-events'];
    el.style['scroll-behavior'] = 'auto';
    // 鼠标移动事件是监听的整个document，这样可以使鼠标能够在元素外部移动的时候也能实现拖动
    document.onmousemove = function (ev) {
      ev.preventDefault();
      const distanceX = ev.clientX - disX;
      const distanceY = ev.clientY - disY;
      el.scrollTo(originalScrollLeft - distanceX, originalScrollTop - distanceY);
      el.style['pointer-events'] = 'none';
    }
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      el.style['scroll-behavior'] = originalScrollBehavior;
      el.style['pointer-events'] = originalPointerEvents;
    }
  }
})
