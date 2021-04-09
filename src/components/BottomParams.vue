<template>
  <div class="bottom-params">
    <div>
      <div class="show-device">{{devideName}}</div>
      <div class="params-item">
        <span>横坐标</span>
        <input type="text" placeholder="±32767" maxlength="5" :value="hNum" @input="(e) => changInput(e, 'hor')">
      </div>
      <div class="params-item">
        <span>纵坐标</span>
        <input type="text" placeholder="±32767" maxlength="5" :value="vNum" @input="(e) => changInput(e, 'ver')">
      </div>
      <div class="params-item">
        <span>宽</span>
        <input type="text" placeholder="100-65..." maxlength="5" :value="dWidth" @input="(e) => changInput(e, 'wid')">
      </div>
      <div class="params-item">
        <span>高</span>
        <input type="text" placeholder="100-65..." maxlength="5" :value="dHeight" @input="(e) => changInput(e, 'hei')">
      </div>
      <div class="btn-item" @click="setDisplay">确定</div>
      <div class="btn-item">重置</div>
    </div>
  </div>
</template>

<script>
import { Display } from './widget/display.model';
export default {
  props: {
    display: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      devideName: '',
      hNum: '',
      vNum: '',
      dWidth: '',
      dHeight: '',
      displayInfo: null
    }
  },
  mounted() {

  },
  methods: {
    dataChange() {
      console.log(this.display);
      this.displayInfo = this.display;
      this.devideName = '显示器' + this.display.displayId;
      this.dWidth = this.display.sizeW;
      this.dHeight = this.display.sizeH;
      this.hNum = this.display.realPos.left;
      this.vNum = this.display.realPos.top;
    },
    changInput(e, type) {
      let val = e.target.value.trim().replace(/\D/ig, '').replace(/^[0]/, 1);
      console.log(val);
      if(type == 'hor') {
        this.hNum = val;
      }
      if(type == 'ver') {
        this.vNum = val;
      }
      if(type == 'wid') {
        this.dWidth = val;
      }
      if(type == 'hei') {
        this.dHeight = val;
      }
      this.$forceUpdate();
    },
    //点击确定
    setDisplay() {
      let display = this.displayInfo;
      if(display) {
        display.sizeW = this.dWidth ? this.dWidth : display.sizeW;
        display.sizeH = this.dHeight ? this.dHeight : display.sizeH;
        display.realPos.left = this.hNum ? this.hNum : display.realPos.left;
        display.realPos.top = this.vNum ? this.vNum : display.realPos.top;
        display.position.left = this.hNum ? (this.hNum / 10) : display.position.left;
        display.position.top = this.vNum ?  (this.vNum / 10) : display.position.top;
        this.$root.bus.$emit('setDisplayInfo', display);
      }
    }
  },
  watch: {
    display() {
      this.dataChange();
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
      padding-left: 4px;
      height: 24px;
      line-height: 24px;
      background: rgb(52,73,94);
      border-radius: 4px;
      font-size: 12px;
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