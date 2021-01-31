<template>
  <div class="login-wrap">
    <div class="login-cont">
      <div class="company-info">
        <div class="company-name">XPOSE</div>
        <div class="company-link">
          <div>RGBlink</div>
          <div>www.rgblink.com</div>
        </div>
      </div>
      <div class="login-info">
        <div class="header">登录</div>
        <div class="login-data-item">
          <span>用户名</span>
          <input type="text" v-model="userName">
        </div>
        <div class="login-data-item">
          <span>密码</span>
          <input type="password" v-model="pwd">
        </div>
        <div class="login-data-item">
          <span>语言</span>
          <el-select v-model="language" placeholder="请选择">
            <el-option
              v-for="item in languageList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="login-btn" @click="loginEvent">现在开始</div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/utils/api';
export default {
  data() {
    return {
      userName: 'Admin',
      pwd: 'Admin',
      languageList: [{ // 语言列表
        id: 1,
        label: '中文'
      }],
      language: 1 // 所选语言
    }
  },
  methods: {
    loginEvent() {
      Api.login({m: '1', n: '22'}).then(res => {
        console.log(res);
      });
      // return;
      this.$router.push({path: '/index'})
    }
  }
}
</script>

<style scoped lang='less'>
  .login-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .login-cont {
      display: flex;
      width: 640px;
      height: 420px;
      padding: 32px 64px;
      background: rgb(18,24,36);
      .company-info {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 24px;
        .company-name {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
        }
        .company-link {
          color: #fff;
          font-size: 14px;
        }
      }
      .login-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: rgb(43,48,66);
        .header {
          height: 42px;
          line-height: 42px;
          text-align: center;
          border-top: 2px solid rgb(26,188,156);
          color: rgb(26,188,156);
        }
        .login-data-item {
          display: flex;
          align-items: center;
          width: 70%;
          height: 42px;
          margin: 0 auto 12px;
          background: #fff;
          padding: 0 12px;
          border-radius: 6px;
          span {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 25%;
            margin-right: 12px;
          }
          input {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            appearance: none;
            padding: 0;
          }
          /deep/ .el-input__inner {
            border: none;
          }
        }
        .login-btn {
          width: 75%;
          height: 42px;
          margin: 20px auto 0;
          background: rgb(26,188,156);
          line-height: 42px;
          border-radius: 6px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }
  }
</style>