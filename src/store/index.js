import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editContainer: {
      zoom: {
        xRadio: 1,
        yRadio: 1
      }
    }, // 当前编辑的容器
    containers: ['defaultDevice'], // 拓扑图拖出的设备
    showVessels: [], // 显示容器
    shareVessels: [], // 共享容器 （图层管理 && 场景管理）
    displayerList: [
      { id: 1, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 2, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 3, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 4, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 5, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 6, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 7, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 8, name: 'DVI', type: 'DVI', width: 1920, height:1080, status: 'usable' },
      { id: 9, name: 'HDMI', type: 'HDMI', width: 1920, height:1080, status: 'usable' },
      { id: 10, name: 'HDMI', type: 'HDMI', width: 1920, height:1080, status: 'usable' },
      { id: 11, name: 'HDMI', type: 'HDMI', width: 1920, height:1080, status: 'usable' },
      { id: 12, name: 'HDMI', type: 'HDMI', width: 1920, height:1080, status: 'usable' },
      { id: 13, name: 'SDI', type: 'SDI', width: 1920, height:1080, status: 'usable' },
      { id: 14, name: 'SDI', type: 'SDI', width: 1920, height:1080, status: 'usable' },
      { id: 15, name: 'SDI', type: 'SDI', width: 1920, height:1080, status: 'usable' },
      { id: 16, name: 'SDI', type: 'SDI', width: 1920, height:1080, status: 'usable' },
      { id: 17, name: 'HDMI 2.0', type: 'HDMI2.0', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 19, name: 'HDMI 2.0', type: 'HDMI2.0', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 21, name: 'RS1', type: 'RS1', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 22, name: 'RS1', type: 'RS1', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 23, name: 'RS1', type: 'RS1', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 24, name: 'RS1', type: 'RS1', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 25, name: 'HDBaseT', type: 'HDBaseT', width: 1920, height:1080, status: 'usable' },
      { id: 26, name: 'HDBaseT', type: 'HDBaseT', width: 1920, height:1080, status: 'usable' },
      { id: 27, name: 'HDBaseT', type: 'HDBaseT', width: 1920, height:1080, status: 'usable' },
      { id: 28, name: 'HDBaseT', type: 'HDBaseT', width: 1920, height:1080, status: 'usable' },
      { id: 29, name: 'H264', type: 'H264', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 30, name: 'H264', type: 'H264', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 31, name: 'H264', type: 'H264', width: 1920, height:1080, status: 'disable', orChange: 0 },
      { id: 32, name: 'H264', type: 'H264', width: 1920, height:1080, status: 'disable', orChange: 0 },
    ], // 设备列表
    
    bankList: [
      {
        id: 'bank1',
        headColor: '#4F1633',
      },
      {
        id: 'bank2',
        headColor: '#3D4A7C'
      },
      {
        id: 'bank3',
        headColor: '#7C693D'
      },
      {
        id: 'bank4',
        headColor: '#6D9094'
      },
      {
        id: 'bank5',
        headColor: '#07ACAA'
      },
      {
        id: 'bank6',
        headColor: '#403F2D'
      },
      {
        id: 'bank7',
        headColor: '#713E76'
      },
      {
        id: 'bank8',
        headColor: '#763E3E'
      },
      {
        id: 'bank9',
        headColor: '#9C7676'
      },
      {
        id: 'bank10',
        headColor: '#C40609'
      },
      {
        id: 'bank11',
        headColor: '#2F2F4F'
      },
      {
        id: 'bank12',
        headColor: '#3D7453'
      },
      {
        id: 'bank13',
        headColor: '#6A743D'
      },
      {
        id: 'bank14',
        headColor: '#7669B0'
      },
      {
        id: 'bank15',
        headColor: '#64912D'
      },
      {
        id: 'bank16',
        headColor: '#522557'
      }
    ],
    bankIndex: 0,
    sessionId: '',
    ip: '',
  },
  mutations: {
    // 设置拖出的设备列表
    setDevices(state, list) {
      state.containers = list;
    },
    // 设置容器列表
    setContainerList(state, list) {
      state.showVessels = list;
    },
    // 设置共享容器
    setShareContainerList(state, list) {
      state.shareVessels = list;
    },
    // 设置显示器列表
    setDisplayerList(state, list) {
      state.displayerList = list;
    },
    setEditContainer(state, edit) {
      state.editContainer = edit;
    },
    // bank列表
    setBankList(state, list) {
      state.bankList = list;
    },
    // bank选中索引
    setBankIndex(state, num) {
      state.bankIndex = num;
    },
     // 会话id
     setSessionId(state, id) {
      state.sessionId = id;
    },
    // 设置ip
    setIP(state, ip) {
      state.ip = ip
    }
  },
  actions: {
    setDevices(context, list) {
      context.commit('setDevices', list);
    },
    setContainerList(context, list) {
      context.commit('setContainerList', list);
    },
    setShareContainerList(context, list) {
      context.commit('setShareContainerList', list);
    },
    setDisplayerList(context, list) {
      context.commit('setDisplayerList', list);
    },
    setBankList(context, list) {
      context.commit('setBankList', list);
    }
  },
  modules: {
  },
  getters: {
    getCurEditContainer(state) {
      return state.showVessels.find(
        item => item.id === state.editContainer.id
      )
    }
  }
})
