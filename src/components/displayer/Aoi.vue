<template>
  <div class="aoi"
    v-if="aoi && aoi.status"
    :style="setStyle"
  >
    <span>AOI Crop</span>
    <img src="../../assets/closeAoi.png" alt="" @click="closeAoi(aoi)">
  </div>
</template>

<script>
export default {
  props: {
    aoi: {
      type: Object,
      default: null
    }
  },
  computed: {
    setStyle() {
      return {
        width: this.aoi.width + 'px',
        height: this.aoi.height + 'px',
        left: this.aoi.position.left + 'px',
        top: this.aoi.position.top + 'px'
      }
    }
  },
  methods: {
    closeAoi(aoi) {
      this.$root.bus.$emit('closeAoi', aoi);
    }
  },
  watch: {
    aoiData(newVal) {
      console.log(newVal);
    }
  }
}
</script>

<style scoped lang='less'>
  .aoi {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    background: rgba(120, 128, 124, 0.8);
    border: 1px dashed #333;
    img {
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      width: 24px;
      height: 24px;
    }
  }
</style>