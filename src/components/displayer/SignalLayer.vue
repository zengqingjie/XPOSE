<template>
  <div
    class="signal-layer-item"
    v-if="layerInfo"
    :style="setStyle"
    :class="layerInfo.signalType ? layerInfo.signalType : ''"
    :containerId="layerInfo.parentId"
    :signalId="layerInfo.signalId"
    :id="layerInfo.id"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    @click.stop="getLayer(layerInfo)"
  >
    <div class="position-head" v-if="positionHead">
      <img src="../../assets/layer_aoi.png" alt="" v-if="!layerInfo.layerLock" @click="aoiEvent(layerInfo)">
      <img
        :src="layerInfo.layerLock ? require('../../assets/layer_lock.png') : require('../../assets/layer_unlock.png')"
        @click="lockEvent(layerInfo.parentId, layerInfo.signalId, layerInfo.id)"
        alt=""
      >
      <img src="../../assets/layer_tile.png" alt="" v-if="!layerInfo.layerLock">
      <img src="../../assets/layer_maximize.png" alt="" v-if="!layerInfo.layerLock" @click="fullScreen(layerInfo)">
      <img src="../../assets/layer_delete.png" alt="" v-if="!layerInfo.layerLock" @click="deleteLayer(layerInfo)">
    </div>
    <div>信号 {{layerInfo.inputPort}}</div>
    <div>
      <span>x:{{layerInfo.realPos.left}}</span>
      <span>y:{{layerInfo.realPos.top}}</span>
    </div>
    <div>
      <span>w:{{layerInfo.sizeW}}</span>
      <span>h:{{layerInfo.sizeH}}</span>
    </div>
    <div>Order:{{layerInfo.order}}</div>
    <canvas width="192" height="108" :inputPort="layerInfo.inputPort" :format="layerInfo.format"></canvas>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    info: {
      type: Object
    },
    size: {
      type : Object,
    },
    container: {
      type: Object
    },
    clipList: {
      type: Array
    }
  },
  data() {
    return {
      positionHead: false,
      layerInfo: null,
      aoi: false,
      streamMedia: ''
    }
  },
  created() {
    const ip = JSON.parse(window.sessionStorage.getItem("ip"));
    this.streamMedia = `http://${ip}:5005/?action=stream`;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.layerInfo = this.info;
    },
    lockEvent(cId, sId, id) {
      const data = {
        status: !this.layerInfo.layerLock,
        cId,
        sId,
        id
      }
      this.$root.bus.$emit('layerActive', data);
    },
    mouseEnter() {
      this.positionHead = true;
    },
    mouseLeave() {
      this.positionHead = false;
    },
    deleteLayer(layer) {
      this.$root.bus.$emit('deleteLayer', layer);
    },
    fullScreen(layer) {
      this.$root.bus.$emit('fullScreen', layer);
    },
    aoiEvent(layer) {
      this.$root.bus.$emit('aoiEvent', layer);
    },
    getLayer(layer) {
      this.$root.bus.$emit('getLayerInfo', layer);
    }
  },
  computed: {
    setStyle() {
      return {
        width: this.layerInfo.sizeW / 20+ 'px',
        height: this.layerInfo.sizeH / 20 + 'px',
        left: this.layerInfo.position.left + 'px',
        top: this.layerInfo.position.top + 'px',
        background: this.layerInfo.bColor
      }
    }
  },
  watch: {  
    layer() {
      this.init();
    }
  }
}
</script>

<style lang='less' scoped>
  .signal-layer-item {
    position: absolute;
    z-index: 99;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 8px;
    box-sizing: border-box;
    color: #F6FC2E;
    font-size: 12px;
    .position-head {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 28px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 12px;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
      img {
        display: block;
        margin-left: 10px;
        width: 16px;
        height: 16px;
      }
    }
    > div {
      > span {
        margin-right: 8px;
      }
    }
    canvas {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>