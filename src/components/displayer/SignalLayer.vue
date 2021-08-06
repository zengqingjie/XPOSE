<template>
  <div
    class="signal-layer-item"
    v-if="layer"
    :style="setStyle"
    :class="selectedLayerId == layer.id ? 'blue' : ''"
    :containerId="layer.containerId"
    :id="'layer'+layer.id"
    :layerId="layer.id"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    @click.stop="getLayer(layer)"
  >
    <div class="position-head" v-if="positionHead">
      <img src="../../assets/layer_aoi.png" alt="" v-if="!layer.freeze" @click="aoiEvent(layer)">
      <img
        :src="layer.freeze ? require('../../assets/layer_lock.png') : require('../../assets/layer_unlock.png')"
        @click="lockEvent(layer)"
        alt=""
      >
      <!-- <img src="../../assets/layer_tile.png" alt="" v-if="!layer.freeze"> -->
      <img src="../../assets/layer_maximize.png" alt="" v-if="!layer.freeze" @click="fullScreen(layer)">
      <img src="../../assets/layer_delete.png" alt="" v-if="!layer.freeze" @click="deleteLayer(layer)">
    </div>
    <div>信号 {{layer.inputPort + 1}}</div>
    <div>
      <span>x:{{layer.scalePosX}}</span>
      <span>y:{{layer.scalePosY}}</span>
    </div>
    <div>
      <span>w:{{layer.scaleSizeW}}</span>
      <span>h:{{layer.scaleSizeH}}</span>
    </div>
    <!-- <div>Order:{{layer.order}}</div> -->
    <canvas
      v-if="switchVal && switchLayer"
      :inputPort="layer.inputPort"
      :format="layer.format"
    ></canvas>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState } from 'vuex';
export default {
  props: {
    layer: {
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
    },
    switchLayer: {
      type: Boolean,
      default: false,
    },
    switchVal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      positionHead: false,
      aoi: false,
      bckList:  ["#8055aad8", "#805869d8", "#80ab5cd8", "#805a4bd8",
        "#80e5bbd8", "#80a117d8", "#802208d8", "#80764dd8",
        "#80fadad8", "#800326d8", "#80b3a8d8", "#80de7dd8",
        "#805a0dd8", "#80172cd8", "#809850d8", "#80da69d8",
        "#80f744d8", "#805760d8", "#80adc3d8", "#80b3c5d8"],
    }
  },
  mounted() {
  },
  methods: {
    lockEvent(layer) {
      this.$root.bus.$emit('layerActive', layer);
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
      this.$root.bus.$emit('getlayer', layer);
    },
    // setLayerBgk() {
    //   const r = Math.floor(Math.random()*256);
    //   const g = Math.floor(Math.random()*256);
    //   const b = Math.floor(Math.random()*256);
    //   return `rgba(${r},${g},${b},0.6)`;
    // }
  },
  computed: {
    ...mapState([
      'selectedLayerId'
    ]),
    setStyle() {
      return {
        width: this.layer.scaleSizeW / 10+ 'px',
        height: this.layer.scaleSizeH / 10 + 'px',
        left: this.layer.scalePosX / 10 + 'px',
        top: this.layer.scalePosY / 10 + 'px',
        background: this.bckList[(192 - this.layer.index) % 20],
      }
    }
  },
  watch: { }
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
  .blue {
    border: 2px solid blue;
  }
</style>