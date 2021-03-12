import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.min.css';
import globalWs from '@/utils/globalWs';
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

// 容器右侧菜单栏滑动
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
});

// 鼠标长按事件
Vue.directive('longpress', {
  bind: (e, binding, vNode) => {
    if (vNode.elm.className == 'delete-container') {
      let pressTimer = null;
      let start = (e) => {
        if (e.type === 'click') return;
        if (pressTimer === null) {
          pressTimer = setTimeout(() => {
            // 执行函数
            handler();
          }, 3000);
        }
      }

      let cancel = () => {
        if (pressTimer !== null) {
          clearTimeout(pressTimer);
        }
        pressTimer = null;
      }


      const handler = (e) => {
        binding.value(e);
      }
      e.addEventListener("mousedown", start);
      e.addEventListener("mouseout", cancel);
      e.addEventListener("click", cancel);
    }
  }
});

Vue.prototype.websocket = globalWs;
