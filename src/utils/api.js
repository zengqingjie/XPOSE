import axios from '@/utils/require.js';
let loginAPI = process.env.NODE_ENV !== 'production' ? "http://192.168.0.122" : "https://192.168.0.122"; // 登录服务
const Api = {
  login(data) {
    return axios({
      url: '/api/cgi-bin/mult.cgi',
      method: 'GET',
      params: data
    })
  }
}

export default Api;