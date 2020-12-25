<template>
    <div class="float-view" @click="setParams"><i class="iconfont iconfloat_set"></i></div>
</template>

<script>
export default {
  methods: {
    setParams() {
      this.$root.bus.$emit('setParams');
    }
  }
}
</script>

<style scoped lang='less'>
  .float-view {
    position: absolute;
    right: 32px;
    bottom: 40px;
    width: 64px;
    height: 64px;
    background: rgb(24,31,48);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    cursor: pointer;
    .iconfont {
      font-size: 32px;
    }
  }
  .hegihter {
    bottom: 180px;
  }
  .float-view:hover {
    background: rgb(22,44,55);
  }
</style>