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
    containerId: 0, // 容器索引
    outputModelInfo: [], // 输出板信息
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
    layerSwitch: false,
    signalSwitch: false,
    sceneSwitch: false,
    ctrolSwitch: false,
    selectedLayerId: '',
  },
  mutations: {
    // 设置拖出的设备列表
    setDevices(state, list) {
      state.containers = list;
    },
    // 设置容器索引值
    setContainerId(state, id) {
      state.containerId = id
    },
   
    // 设置输出板信息
    setOutputModelInfo(state, list) {
      state.outputModelInfo = list;
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
    // layer
    setLayerSwitch(state, boolean) {
      state.layerSwitch = boolean;
    },
    // signal
    setSignalSwitch(state, boolean) {
      state.signalSwitch = boolean;
    },
    // scene
    setSceneSwitch(state, boolean) {
      state.sceneSwitch = boolean;
    },
    // ctrol
    setCtrolSwitch(state, boolean) {
      state.ctrolSwitch = boolean;
    },
    // selectedLayerId
    setSelectedLayerId(state, id) {
      state.selectedLayerId = id;
    },
  },
  actions: {
    setDevices(context, list) {
      context.commit('setDevices', list);
    },
    setOutputModelInfo(context, list) {
      context.commit('setOutputModelInfo', list);
    },
    setShareContainerList(context, list) {
      context.commit('setShareContainerList', list);
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
