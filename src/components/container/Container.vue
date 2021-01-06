<template>
  <div class="container-component" v-if="item && item.templateVal" :style="setContainerStyle">
    <div class="container-header">
      <span>{{index + 1}}--(W:{{item.templateVal.col * 1920}} H:{{item.templateVal.row * 1080}})</span>
      <div class="right-view">
        <div>-</div>
        <div>+</div>
        <div v-longpress="deleteContainer" class="delete-container" @click="deleteContainerItem(item)">x</div>
      </div>
    </div>
    <div class="displayer-box" :data-id="item.id">
      <Displayer
        v-for="dItem in item.displayerList"
        :key="dItem.id"
        :dMsg="dItem"
        :id="dItem.id"
        :data-id="item.id"
      />
    </div>
  </div>
</template>

<script>
import Displayer from '@/components/displayer/Displayer';
import $ from 'jquery';
export default {
  props: ["item", "index"],
  components: {
    Displayer,
  },
  data() {
    return {
      sizeW: 0,
      sizeH: 0,
      positionX: 0,
      positionY: 0,
      displayerBoxStyle: {
        width: 0
      },
      mouseDownTime: 0, // 鼠标按下时长
    }
  },
  computed: {
    // 容器尺寸
    setContainerStyle() {
      const itemInfo = this.item;
      const width = (itemInfo.templateVal.col * itemInfo.wBase) + 'px';
      const height = (itemInfo.templateVal.row * itemInfo.hBase + 24) + 'px';
      return {
        width: width,
        height: height
      }
    },
  },
  methods: {
    // 初始化容器，显示器
    init() {
      this.sizeW = this.item.sizeW ? (this.item.sizeW) : (this.item.templateVal.col * this.item.wBase + 6);
      this.sizeH = this.item.sizeH ? (this.item.sizeH) : (this.item.templateVal.row * this.item.hBase + 28);
      this.positionX = this.item.positionX || 200;
      this.positionY = this.item.positionY || 300;
      this.displayerBoxStyle.width = this.item.sizeW ? this.item.sizeW + 'px' : this.item.templateVal.col * this.item.wBase + 'px';
      this.$set(this.item, 'sizeW', this.sizeW);
      this.$set(this.item, 'sizeH', this.sizeH);
      this.$set(this.item, 'positionX', this.positionX);
      this.$set(this.item, 'positionY', this.positionY);
      this.$root.bus.$emit('setContainerItem', this.item);
    },
    // 容器伸缩
    onResize: function (x, y, width, height) {
      if(width - 6 <= 75 || height - 28 <= 75) {
        return;
      }
      this.positionX = x;
      this.positionY = y;
      this.sizeW = width;
      this.sizeH = height;
      this.displayerBoxStyle.transform = 'translate('+ (x + 3) +'px,'+ (y + 25) +'px)';
      this.displayerBoxStyle.width = width + 'px';
      this.item.displayerList.map(item => {
        item.baseW = (width-6) / this.item.templateVal.col;
        item.baseH = (height-28) / this.item.templateVal.row;
      });
      this.item.wBase = (width-6) / this.item.templateVal.col;
      this.item.hBase = (height-28) / this.item.templateVal.row;
      this.$set(this.item, 'sizeW', width);
      this.$set(this.item, 'sizeH', height);
      this.$set(this.item, 'positionX', x);
      this.$set(this.item, 'positionY', y);
      this.$root.bus.$emit('setContainerItem', this.item);
    },
    // 容器拖拽
    onDrag: function (x, y) {
      if(x <= 0 || y <= 0) {
        this.positionX = x <= 0 ? 0 : x;
        this.positionY = y <= 0 ? 0 : y;
        return false;
      }
      this.positionX = x;
      this.positionY = y;
      this.displayerBoxStyle.transform = 'translate('+ (x + 3) +'px,'+ (y + 25) +'px)';
      this.$set(this.item, 'positionX', x);
      this.$set(this.item, 'positionY', y);
      this.$root.bus.$emit('setContainerItem', this.item);
    },
    // 点击删除容器
    deleteContainerItem(obj) {
      const vm = this;
      vm.$confirm('是否删除该容器?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.$root.bus.$emit('deleteContainer', obj);
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 长按删除容器
    deleteContainer() {
      
    }
  },
  created() {
    this.init();
  },
  mounted() {
   $('.container-el')
  },
  watch: {
    
  }
}
</script>

<style scoped lang="less">
  .container-component {
    position: relative;
    border: 2px solid rgb(0,196,172);
    border-top: none;
    display: flex;
    flex-direction: column;
    .container-header {
      height: 24px;
      background: rgb(0,196,172);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      cursor: move;
      span {
        font-size: 12px;
        font-weight: bold;
      }
      .right-view {
        width: 72px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        div {
          text-align: center;
          flex: 1;
          cursor: pointer;
        }
      }
    }
    > .displayer-view {
      flex: 1;
      background: rgb(63,69,94)
    }
    .displayerBox {
      position: absolute;
      top: 24px;
      left: 0;
      right: 0;
      display: flex;
      flex-wrap: wrap;
      z-index: 99;
      .displayer-item {
        padding: 12px;
        background: rgb(120,190,252);
        border: 1px solid #333;
        box-sizing: border-box;
        font-size: 12px;
      }
    }
    .displayer-box {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>