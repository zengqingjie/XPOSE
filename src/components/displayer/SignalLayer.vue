<template>
  <div class="signal-layer" v-if="layerInfo" :style="setStyle">
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
      return {
        width: this.layerInfo.wBase + 'px',
        height: this.layerInfo.hBase + 'px',
        left: this.layerInfo.position.left + 'px',
        top: this.layerInfo.position.top + 'px'
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
</style>