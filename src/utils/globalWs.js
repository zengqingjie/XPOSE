export default {
  connectSocket(host) {
    window.webSocket = new WebSocket(host);
    /*建立连接*/
    webSocket.onopen = evt => {
      console.log("webSocket连接成功");
      // let data = {type: 'bind'};
      // let json = JSON.stringify(data);
      // webSocket.send(json);
    };
    /*连接关闭*/
    webSocket.onclose = evt => {
      console.log("webSocket连接关闭");
    };
    // /*接收服务器推送消息*/
    // webSocket.onmessage = evt => {
    //   let data = JSON.parse(evt.data);
    //   console.log(data)
    // };
    /*连接发生错误时*/
    webSocket.onerror = (evt,e) => {
      console.log(evt);
    }
  }
}