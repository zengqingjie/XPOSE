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
      ob: {
        haha: 1
      }
    }
  },
  created() {
    const ip = JSON.parse(sessionStorage.getItem("ip"));

    console.log(this.ob?.haha);

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
  
  /* switch按钮样式 */
  .switch .el-switch__label {
      position: absolute;
      display: none;
      color: #fff !important;
  }
  /*打开时文字位置设置*/
  .switch .el-switch__label--right {
      z-index: 1;
  }
  /* 调整打开时文字的显示位子 */
  .switch .el-switch__label--right span{
      margin-right: 0px;
      font-size: 12px;
  }
  /*关闭时文字位置设置*/
  .switch .el-switch__label--left {
      z-index: 1;
  }
  /* 调整关闭时文字的显示位子 */
  .switch .el-switch__label--left span{
      margin-left: 25px;
      font-size: 12px;
  }
  /*显示文字*/
  .switch .el-switch__label.is-active {
      display: block;
  }
  /* 调整按钮的宽度 */
  .switch.el-switch .el-switch__core,
  .el-switch .el-switch__label {
      width: 100px !important;
      // margin: 0;
  }


</style>
