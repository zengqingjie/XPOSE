<template>
  <div
    class="signal-layer"
    v-if="layerInfo"
    :style="setStyle"
    :class="layerInfo.signalType ? layerInfo.signalType : ''"
  >
    {{layerInfo && layerInfo.id}}
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      layerInfo: null
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.layerInfo = this.info;
    }
  },
  computed: {
    setStyle() {
      console.log(this.layerInfo);
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
  .signal-layer {
    position: absolute;
    z-index: 99;
  }
  .H264 {
    background: rgba(96, 127, 109, 0.4);
  }
</style>