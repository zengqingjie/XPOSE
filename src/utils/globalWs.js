import { Message } from "element-ui";
export default {
  connectSocket(host) {
    window.webSocket = new WebSocket(host);
    /*建立连接*/
    webSocket.onopen = evt => {
      console.log("连接成功");
      Message({
        message: "连接成功",
        type: "success"
      });
    };
    /*连接关闭*/
    webSocket.onclose = evt => {
      console.log("服务关闭");
      Message({
        message: "服务关闭",
        type: "error"
      });
      // setTimeout(() => {
      //     this.connectSocket(host);
      // }, 10000);
    };
    webSocket.onerror = (evt,e) => {
      console.log(evt);
    }
  }
}
