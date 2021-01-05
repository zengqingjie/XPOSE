<template>
  <div class="displayer-view" :style="{width:dMsg.baseW+'px', height:dMsg.baseH+'px'}">
    <div>显示器{{dMsg.id}}</div>
  </div>
</template>

<script>
export default {
  props: ['dMsg'],
  data() {
    return {

    }
  },
  components: {}
}
</script>

<style scoped lang='less'>
  .displayer-view {
    padding: 12px;
    background: rgb(120,190,252);
    border: 1px solid #333;
    box-sizing: border-box;
    font-size: 60%;
  }
</style>