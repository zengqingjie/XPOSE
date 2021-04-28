<template>
  <div class="detection-wrap" @click="cancelDetection">
    <div class="img-view">
      <img src="../../assets/detection.png" alt="">
    </div>
    <div>正在检测中</div>
    <div>点击以取消检测</div>
  </div>
</template>

<script>
export default {
  methods: {
    cancelDetection() {
      this.$root.bus.$emit('cancelDetection');
    }
  }
}
</script>

<style scoped lang="less">
  .detection-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img-view {
      display: flex;
      width: 108px;
      height: 108px;
      background: rgb(21,90,84);
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      img {
        display: block;
        width: 48px;
        height: 48px;
      }
    }
    div {
      margin-top: 20px;
      color: #fff;
      font-size: 16px;
    }
  }
</style>