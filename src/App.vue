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
      this.connectSocket(ip);
    }
  },
  methods: {
    connectSocket(ip) {
      let that = this;
      if ("WebSocket" in window) {
          // console.log("您的浏览器支持 WebSocket!");
          // location.host
          that.ws = new WebSocket("ws://"+ip+":8800");
          globalWs.setWs(that.ws);
          that.ws.onopen = function () {
            console.log('连接成功');
            // that.$message.success('连接成功');
          };

          that.ws.onclose = function () {
            // 关闭 websocket
            console.log("连接已关闭...");
            that.$message.error('断开连接, 尝试重连');
            //断线重新连接
            setTimeout(() => {
                that.connectSocket(ip);
            }, 10000);
          };
      } else {
          // 浏览器不支持 WebSocket
          console.log("您的浏览器不支持 WebSocket!");
          this.openNotificationWithIcon('error', '浏览器', '您的浏览器不支持显示消息请更换', 1,1)
      }
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
