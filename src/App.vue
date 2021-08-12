<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Api from '@/utils/api';
import globalWs from '@/utils/globalWs';

export default {
  data() {
    return {
      ip: '',
    }
  },
  created() {
    const ip = JSON.parse(sessionStorage.getItem("ip"));
    if(ip) {
      globalWs.connectSocket("ws://"+ip+":8800");
    }
  },
}
</script>

<style>

</style>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
