<template>
  <div class="topology-wrap">
    <Settings/>
  </div>
</template>

<script>
import Settings from '@/components/settings/Settings';
export default {
  components: {
    Settings
  }
}
</script>

<style scoped lang='less'>
  .topology-wrap {
    position: relative;
    flex: 1;
    background: rgb(27,36,54);
    color: #fff;
  }
</style>