<template>
  <div class="register-wrap">
    <div class="register-cont">
      <div class="company-info">
        <div class="company-name">XPOSE</div>
        <div class="company-link">
          <div>RGBlink</div>
          <div>www.rgblink.com</div>
        </div>
      </div>
      <div class="register-info">
        <div class="header">
          <div :class="tabIndex == 0 ? 'show' : ''">注册</div>
          <div :class="tabIndex == 1 ? 'show' : ''">激活</div>
        </div>
        <div class="register-view" v-if="tabIndex == 0">
          <div class="register-data-item">
            <div class="label">
              <span>名字</span>
              <span class="need">*</span>
            </div>
            <input type="text" v-model="name">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>姓</span>
              <span class="need">*</span>
            </div>
            <input type="text" v-model="surname">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>邮箱</span>
              <span class="need">*</span>
            </div>
            <input type="text" v-model="email">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>公司</span>
            </div>
            <input type="text" v-model="company">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>国家</span>
              <span class="need">*</span>
            </div>
            <el-select v-model="country" placeholder="请选择">
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="register-btn" @click="register">开始注册</div>
        </div>
        <div class="activate-view" v-if="tabIndex == 1">
          <div class="activate-tips">
            <div class="some-words">
              <div>感谢您的注册！</div>
              <div>您的注册码将通过电子邮箱提供。</div>
              <div>这台计算机没有网络连接？只需扫描右边的二维码。</div>
              <div>请检查您的{{email}}电子邮箱账户以获得注册码，并在下面输入激活。</div>
              <div>没有收到邮件？请检查您的垃圾邮件文件夹，或返回更正您的电子邮箱地址。</div>
            </div>
            <img src="" alt="二维码">
          </div>
          <input type="text" v-model="activeCode" class="code-input">
          <div class="btns-view">
            <div class="show" @click="preEvent">上一步</div>
            <div :class="activeCode.length >= 8 ? 'show' : ''" @click="activateEvent">开始激活</div>
          </div>
        </div>
      </div>
      
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: 0, // 处于注册||激活
      name: '',
      surname: '',
      email: '',
      company: '',
      activeCode: '', // 激活码
      countryList: [{ // 国家列表
        id: 1,
        label: '中国'
      }, {
        id: 2,
        label: '巴基斯坦'
      }],
      country: '' // 所选国家
    }
  },
  created() {},
  methods: {
    // 开始注册
    register() {
      if (!this.name) {
        this.$message.error('名字不能为空');
        return;
      } 
      if (!this.surname) {
        this.$message.error('姓不能为空');
        return;
      }
      if (!this.email) {
        this.$message.error('邮箱不能为空');
        return;
      } else {
        const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
        if(!reg.test(this.email)) {
          this.$message.error('邮箱格式错误');
        return;
        }
      }
      if (!this.country) {
        this.$message.error('国家不能为空');
        return;
      }
      console.log(this.country);
      this.tabIndex = 1;
    },
    // 上一步
    preEvent() {
      this.tabIndex = 0;
      this.activeCode = '';
    },
    // 开始激活
    activateEvent() {
      const codeLen = this.activeCode.length;
      if (codeLen == 8) {
        this.$router.push({name: 'Login'});
        return;
      }
      this.$message.error('请确保激活码输入正确');
    }
  }
}
</script>

<style scoped lang='less'>
  .register-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .register-cont {
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
      .register-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: rgb(43,48,66);
        .header {
          height: 42px;
          display: flex;
          div {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            background: rgb(24,30,44);
            font-size: 18px;
          }
          .show {
            position: relative;
            background: rgb(43,48,66);
            color: rgb(26,188,156);
          }
          .show::after {
            display: block;
            content: "";
            position: absolute;
            height: 2px;
            top: 0;
            width: 100%;
            background: rgb(26,188,156);
          }
        }
        .register-view {
          flex: 1;
          padding: 20px 64px 0;
          .register-data-item {
            display: flex;
            align-items: center;
            height: 42px;
            margin-bottom: 12px;
            background: #fff;
            padding: 0 12px;
            border-radius: 6px;
            .label {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 25%;
              margin-right: 12px;
              .need {
                padding-top: 6px;
                color: red;
              }
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
          .register-btn {
            height: 42px;
            margin-top: 32px;
            background: rgb(26,188,156);
            line-height: 42px;
            border-radius: 6px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
          }
        }
        .activate-view {
          padding: 36px 36px 0;
          background: rgb(43,48,66);
          .activate-tips {
            display: flex;
            align-items: center;
            .some-words {
              flex: 1;
              text-align: left;
              margin-right: 16px;
              color: #fff;
              font-size: 14px;
              div {
                margin-bottom: 12px;
              }
            }
            img {
              display: block;
              width: 120px;
              height: 120px;
            }
          }
          .code-input {
            display: block;
            width: 80%;
            height: 36px;
            margin: 12px auto 0;
            border-radius: 6px;
            border: none;
            outline: none;
            appearance: none;
            text-indent: 2em;
          }
          .btns-view {
            width: 80%;
            display: flex;
            margin: 20px auto 0;
            justify-content: space-between;
            div {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 45%;
              height: 42px;
              background: rgb(140,140,140);
              border-radius: 6px;
              color: #fff;
              cursor: pointer;
            }
            .show {
              background: rgb(26,188,156);
            }
          }
        }
      }
    }
  }
</style>