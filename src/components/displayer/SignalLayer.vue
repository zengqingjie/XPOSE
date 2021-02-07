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
  >
    <div class="position-head" v-if="positionHead">
      <img src="../../assets/layer_aoi.png" alt="" v-if="!layerInfo.layerLock">
      <img :src="layerInfo.layerLock ? require('../../assets/layer_lock.png') : require('../../assets/layer_unlock.png')" @click="lockEvent(layerInfo.parentId, layerInfo.id)" alt="">
      <img src="../../assets/layer_tile.png" alt="" v-if="!layerInfo.layerLock">
      <img src="../../assets/layer_maximize.png" alt="" v-if="!layerInfo.layerLock">
      <img src="../../assets/layer_delete.png" alt="" v-if="!layerInfo.layerLock" @click="deleteLayer(layerInfo)">
    </div>
    <div>信号 {{layerInfo.signalIndex}}</div>
    <div>
      <span>x:{{layerInfo.position.left}}</span>
      <span>y:{{layerInfo.position.top}}</span>
    </div>
    <div>
      <span>w:{{layerInfo.customFeature.wBase}}</span>
      <span>y:{{layerInfo.customFeature.hBase}}</span>
    </div>
    <div>Order:xx</div>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      positionHead: false,
      layerInfo: null,
      aoi: false,
    }
  },
  mounted() {
    this.init();
    console.log(this.container);
  },
  methods: {
    init() {
      this.layerInfo = this.info;
    },
    lockEvent(cId, id) {
      const data = {
        status: !this.layerInfo.layerLock,
        cId,
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
    }
  },
  computed: {
    setStyle() {
      return {
        width: this.layerInfo.customFeature.wBase + 'px',
        height: this.layerInfo.customFeature.hBase + 'px',
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
      img {
        display: block;
        margin-left: 10px;
        width: 16px;
        height: 16px;
      }
    }
  }
</style>