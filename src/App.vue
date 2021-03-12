<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { dataFormat } from './utils/dataFormat';
export default {
  created () {
    
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))));
      dataFormat.widgetList = JSON.parse(sessionStorage.getItem("widgetList"));
    } 

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("widgetList",JSON.stringify(dataFormat.widgetList));
      sessionStorage.setItem("store",JSON.stringify(this.$store.state));

    })
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
