import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editContainer: {}, // 当前编辑的容器
    containers: ['defaultDevice'], // 拓扑图拖出的设备
    showVessels: [], // 显示容器
    shareVessels: [] // 共享容器 （图层管理 && 场景管理）
  },
  mutations: {
    // 设置拖出的设备列表
    setDevices(state, list) {
      state.containers = list;
    }
  },
  actions: {
    setDevices(context, list) {
      context.commit('setChatHistory', list);
    }
  },
  modules: {
  },
  getters: {}
})
