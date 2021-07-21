<template>
  <div class="main-wrap">
    <Aside/>
    <div class="container">
      <Title
        :msg="menuInfo"
      />
      <Topology
        v-if="menuInfo && menuInfo.id == '001'"
      />
      <DetailShow
        v-if="menuInfo && menuInfo.id == '002'"
        :showInfo="floatStatus"
        :nowMenuId="menuInfo && menuInfo.id"
      />
      <ManageShow
        v-if="menuInfo && menuInfo.id == '003'"
        :showInfo="floatStatus"
        :nowMenuId="menuInfo && menuInfo.id"
      />
      <Layer
        v-if="menuInfo && menuInfo.id == '004'"
        :showInfo="floatStatus"
        :nowMenuId="menuInfo && menuInfo.id"
      />
      <Scene
        v-if="menuInfo && menuInfo.id == '005'"
        :showInfo="floatStatus"
        :nowMenuId="menuInfo && menuInfo.id"
      />
      <SystemSettings
        v-if="menuInfo && menuInfo.id == '006'"
        :showInfo="floatStatus"
        :nowMenuId="menuInfo && menuInfo.id"
      />
    </div>
    <div
      v-if="floatStatus"
      class="float-view"
      :class="menuInfo && (menuInfo.id =='004' || menuInfo.id =='005') ? 'hegihter' : ''"
      @click="setParams"
    >
      <img src="../assets/setting_none.png" alt="">
    </div>
    <!-- <div class="save-btn" @click="saveUiData">同步哈哈哈哈</div> -->
  </div>
</template>

<script>
import Aside from '@/components/aside/Aside';
import Title from '@/components/headTitle/Title';
import Topology from '@/components/topology/Topology';
import DetailShow from '@/components/deviceDetailShow/DetailShow';
import ManageShow from '@/components/manageShow/ManageShow';
import Layer from '@/components/layer/Layer';
import Scene from '@/components/scene/Scene';
import SystemSettings from '@/components/SystemSettings';
import Api from '../utils/api';
export default {
  data() {
    return {
      menuInfo: null,
      floatStatus: true,
      sn: '', // 设备sn
      sessionId: '',
    }
  },
  components: {
    Aside,
    Title,
    Topology, // 拓扑图
    DetailShow, // 设备图展示
    ManageShow, // 显示管理
    Layer, // 图层管理
    Scene, // 场景管理
    SystemSettings // 系统设置
  },
  created() {
    this.init();
  },
  mounted() {
    this.sessionId = JSON.parse(sessionStorage.getItem("sessionId"));
    
    // 获取设备sn
    this.getDeviceSN();
    // websocket接收信息
    const that = this;
    window.webSocket.onmessage = function(res) {
      const result = JSON.parse(res.data);
      // 获取设备sn
      if((result.code == 200) && (result.data.eventType == 'getDeviceSN')) {
        that.sn = result.data.sn;
        that.getDeviceInfo();
      }
      // 获取设备概况
      if((result.code == 200) && (result.data.eventType == 'getDeviceSN')) {
        if (result.data.costomInfo && result.data.costomInfo.outputModelInfo) {
          that.$store.commit('setOutputModelInfo', result.data.costomInfo.outputModelInfo);
        }
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.$root.bus.$off('titleInfo');
      this.$root.bus.$on('titleInfo', (data) => {
        this.menuInfo = data;
        this.floatStatus = true;
      });
      // 隐藏右侧视图
      this.$root.bus.$off('hideRightView');
      this.$root.bus.$on('hideRightView', () => {
        this.floatStatus = true;
      });
    },
    // 获取设备sn
    getDeviceSN() {
      const params = {
        eventType: "getDeviceSN",
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
     // 获取设备概况信息
    getDeviceInfo() {
      const params = {
        eventType: "getDeviceInfo",
        sn: this.sn,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    // 生成随机checkKey
    getcheckKey() {
      let arr = new Array;
      const arr1 = new Array("0","1","2","3","4","5","6","7","8","9");
      let nonceStr=''
      for(var i=0; i<8; i++){
        var n = Math.floor(Math.random()*10);
        arr[i] = arr1[n] ;
        nonceStr += arr1[n];
      }
      return parseInt(nonceStr);
    },

    setParams() {
      this.floatStatus = !this.floatStatus;
    }
  }
}
</script>

<style scoped lang='less'>
  .main-wrap {
    position: relative;
    display: flex;
    .container {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100vh;
    }
    .float-view {
      position: absolute;
      right: 32px;
      bottom: 80px;
      width: 64px;
      height: 64px;
      background: rgb(24,31,48);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      cursor: pointer;
      img {
        display: block;
        width: 28px;
        height: 28px;
      }
    }
    .save-btn {
      position: absolute;
      left: 0px;
      bottom: 160px;
      width: 64px;
      height: 64px;
      background: red;
      color: #fff;
      cursor: pointer;
    }
    .hegihter {
      bottom: 220px;
    }
    .float-view:hover {
      background: rgb(22,44,55);
    }
  }
</style>