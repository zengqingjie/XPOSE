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
      <BottomParams/>
    </div>
    <div
      v-if="floatStatus"
      class="float-view"
      :class="menuInfo && (menuInfo.id =='004' || menuInfo.id =='005') ? 'hegihter' : ''"
      @click="setParams"
    >
      <img src="../assets/setting_none.png" alt="">
    </div>
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
import BottomParams from '@/components/BottomParams';
export default {
  data() {
    return {
      menuInfo: null,
      floatStatus: true,
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
    BottomParams
  },
  created() {
    this.init();
  },
  methods: {
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
    .hegihter {
      bottom: 220px;
    }
    .float-view:hover {
      background: rgb(22,44,55);
    }
  }
</style>