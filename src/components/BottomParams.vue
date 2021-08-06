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
    </div>
  </div>
</template>

<script>
export default {
  props: {
    display: {
      type: Object | Array,
      default: null
    },
    layer: {
      type: Object | Array,
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
    }
  },
  mounted() {

  },
  methods: {
    dataChange() {
      if (this.display) {
        this.devideName = '显示器' + (this.display.id + 1);
        this.dWidth = this.display.sizeW;
        this.dHeight = this.display.sizeH;
        this.hNum = this.display.posX;
        this.vNum = this.display.posY;
      } else if (this.layer) {
        this.devideName = '信号' + (this.layer.inputPort + 1);
        this.dWidth = this.layer.scaleSizeW;
        this.dHeight = this.layer.scaleSizeH;
        this.hNum = this.layer.scalePosX;
        this.vNum = this.layer.scalePosY;
      } else {
        this.devideName = '';
        this.dWidth = '';
        this.dHeight = '';
        this.hNum = '';
        this.vNum = '';
      }
    },
    changInput(e, type) {
      // let val = e.target.value.trim().replace(/\D/ig, '').replace(/^[0]/, 1);
      let val = e.target.value.trim().replace(/\D/ig, '');
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
      let display = this.display;
      let layer = this.layer;
      if(display) {
        display.sizeW = this.dWidth ? this.dWidth : display.sizeW;
        display.sizeH = this.dHeight ? this.dHeight : display.sizeH;
        display.posX = this.hNum ? this.hNum : display.posX;
        display.posY = this.vNum ? this.vNum : display.posY;
        this.$root.bus.$emit('setDisplayInfo', display);
      }
      if (layer) {
        layer.scaleSizeW = this.dWidth ? this.dWidth : layer.scaleSizeW;
        layer.scaleSizeH = this.dHeight ? this.dHeight : layer.scaleSizeH;
        layer.scalePosX = this.hNum ? this.hNum : layer.scalePosX;
        layer.scalePosY = this.vNum ? this.vNum : layer.scalePosY;
        this.$root.bus.$emit('setLayerInfo', layer);
      }
    }
  },
  watch: {
    display: {
      deep: true,
      handler() {
        this.dataChange();
      },
    },
    layer: {
      deep: true,
      handler() {
        this.dataChange();
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