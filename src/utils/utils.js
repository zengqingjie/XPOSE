const utils = {
  // 设置cookie
  setCookie(name, value, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = "expires="+d.toUTCString();
      document.cookie = name + "=" + value + "; " + expires;
  },
  // 获取对应name的cookie
  getCookie(name) {
      if (document.cookie.length > 0) {
          let c_start = document.cookie.indexOf(name + "=");
          if (c_start != -1) {
              c_start = c_start + name.length + 1;
              let c_end = document.cookie.indexOf(";", c_start);
              if (c_end == -1) c_end = document.cookie.length;
              return unescape(document.cookie.substring(c_start, c_end));
          }
      }
      return "";
  },
  
  /*
  * @name 获取当前时间
  * @params {withtime} 是否返回带时分秒的时间格式
  * */
  getToday(){
      let now = new Date();
      let year = now.getFullYear(); //得到年份
      let month = now.getMonth(); //得到月份
      let date = now.getDate(); //得到日期
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      hour = hour <= 9 ? '0' + hour : hour;
      minute = minute <= 9 ? '0' + minute : minute;
      second = second <= 9 ? '0' + second : second;
      return `${year}-${month}-${date}|${hour}:${minute}:${second}`;
  },
  // 获取页面参数
  getQuery(name) {
      let href = window.location.href,
          querys = href.split('?')[1];
      if(querys){
          let querysArr = querys.split('&'),item = null;
          for(let i=0;i<querysArr.length;i++){
              item = querysArr[i].split('=');
              if(item[0] == name){
                  return item[1];
              }
          }
          return '';
      }else{
          return '';
      }
  },
};
export default utils;
