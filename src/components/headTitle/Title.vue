<template>
  <div class="title-wrap">{{msg && msg.title}}</div>
</template>

<script>
export default {
  props: ['msg'],
}
</script>

<style scoped lang='less'>
  .title-wrap {
    height: 42px;
    background: rgb(21,29,44);
    line-height: 42px;
    text-align: center;
    color: #fff;
    font-size: 16px;
  }
</style>