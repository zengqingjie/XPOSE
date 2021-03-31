<template>
  <div class="bottom-params">
    <div>
      <div class="show-device">{{devideName}}</div>
      <div class="params-item">
        <span>横坐标</span>
        <input type="text" placeholder="±32767" maxlength="5" :vale="hNum" @input="(e) => changInput(e, 'hor')">
      </div>
      <div class="params-item">
        <span>纵坐标</span>
        <input type="text" placeholder="±32767" maxlength="5" :vale="vNum" @input="(e) => changInput(e, 'ver')">
      </div>
      <div class="params-item">
        <span>宽</span>
        <input type="text" placeholder="100-65..." maxlength="5" :vale="cWidth" @input="(e) => changInput(e, 'wid')">
      </div>
      <div class="params-item">
        <span>高</span>
        <input type="text" placeholder="100-65..." maxlength="5" :vale="cHeight" @input="(e) => changInput(e, 'hei')">
      </div>
      <div class="btn-item">确定</div>
      <div class="btn-item">重置</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      devideName: '',
      hNum: '',
      vNum: '',
      cWidth: '',
      cHeight: ''
    }
  },
  mounted() {
    // 点击显示器
    this.$root.bus.$off('clickDisplayer');
    this.$root.bus.$on('clickDisplayer', (data) => {
      console.log(111);
    });
  },
  methods: {
    changInput(e, type) {
      let val = e.target.value.trim();
      if(type == 'hor') {
        if(/\d/.test(val)) {
          this.hNum = val;
        } else {
          e.target.value = this.hNum;
        }
      }
      if(type == 'ver') {
        if(/\d/.test(val)) {
          this.vNum = val;
        } else {
          e.target.value = this.vNum;
        }
      }
      if(type == 'wid') {
        if(/\d/.test(val)) {
          this.cWidth = val;
        } else {
          e.target.value = this.cWidth;
        }
      }
      if(type == 'hei') {
        if(/\d/.test(val)) {
          this.cHeight = val;
        } else {
          e.target.value = this.cHeight;
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
  .bottom-params {
    height: 48px;
    padding-left: 24px;
    background: rgb(22,28,44);
    border-top: 2px solid rgb(102,255,0);
    > div {
      height: 48px;
      display: flex;
      align-items: center;
    }
    .show-device {
      min-width: 64px;
      height: 24px;
      background: rgb(52,73,94);
      border-radius: 4px;
    }
    .params-item {
      display: flex;
      align-items: center;
      span {
        margin: 0 20px;
        color: #999;
        font-size: 14px;
      }
      input {
        width: 64px;
        height: 22px;
        background: rgb(22,28,44);
        border: 1px solid rgb(52,73,94);
        border-radius: 4px;
        text-indent: 0.5em;
        appearance: none;
        outline: none;
        color: #fff;
        font-size: 12px;
      }
      input:focus {
        border: 1px solid rgb(102,255,0);
      }
    }
    .btn-item {
      width: 56px;
      height: 22px;
      background: rgb(75,224,194);
      border-radius: 11px;
      margin-left: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 12px;
    }
  }
</style>