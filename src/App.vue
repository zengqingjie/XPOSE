<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { dataFormat } from './utils/dataFormat';
import globalWs from '@/utils/globalWs';

export default {
  created () {
    const ip = JSON.parse(window.sessionStorage.getItem("ip"));
    if(ip) {
      globalWs.connectSocket("ws://"+ip+":8800");
    }     
  }
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
