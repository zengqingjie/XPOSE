<template>
  <div class="container-el">
    <vdr
      :w="sizeW"
      :h="sizeH"
      :x="positionX"
      :y="positionY"
      :min-width="75"
      :min-height="75"
      v-on:dragging="onDrag"
      v-on:resizing="onResize"
    >
      <div class="container-component" v-if="itemObj && itemObj.templateVal" :style="setContainerStyle">
        <div class="container-header">
          <span>{{index + 1}}--(W:{{itemObj.templateVal.col * 1920}} H:{{itemObj.templateVal.row * 1080}})</span>
          <div class="right-view">
            <div>-</div>
            <div>+</div>
            <div v-longpress="deleteContainer" class="delete-container" @click="deleteContainerItem(itemObj)">x</div>
          </div>
        </div>
      </div>
    </vdr>

    <div
      class="displayer-box"
      :style="displayerBoxStyle"
      v-if="itemObj.displayerList"
    > 
      <Displayer
        v-for="dItem in itemObj.displayerList"
        :key="dItem.id"
        :dMsg="dItem"
        v-dragging="{list: itemObj.displayerList, item: dItem, group: 'displayerList'}"
      />
    </div>
  </div>
</template>

<script>
// import draggable from "vuedraggable";
import Displayer from '@/components/displayer/Displayer';
import vdr from 'vue-draggable-resizable-gorkys';
export default {
  props: ["item", "index"],
  components: {
    // draggable,
    Displayer,
    vdr,
  },
  data() {
    return {
      itemObj: null,
      sizeW: 0,
      sizeH: 0,
      positionX: 0,
      positionY: 0,
      displayerBoxStyle: {
        transform: 'tanslate(0, 0)',
        width: 0,
        height: 0
      },
      mouseDownTime: 0, // 鼠标按下时长
    }
  },
  computed: {
    // 容器尺寸
    setContainerStyle() {
      const itemInfo = this.itemObj;
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
      this.itemObj = this.item;
      this.sizeW = this.itemObj.sizeW ? (this.itemObj.sizeW) : (this.itemObj.templateVal.col * this.itemObj.wBase + 6);
      this.sizeH = this.itemObj.sizeH ? (this.itemObj.sizeH) : (this.itemObj.templateVal.row * this.itemObj.hBase + 28);
      this.positionX = this.itemObj.positionX || 200;
      this.positionY = this.itemObj.positionY || 300;
      this.displayerBoxStyle.transform = this.itemObj.positionX ? 'translate('+ (this.itemObj.positionX + 3) +'px,'+ (this.itemObj.positionY + 25) +'px)' : 'translate(203px, 325px)';
      this.displayerBoxStyle.width = this.itemObj.sizeW ? this.itemObj.sizeW + 'px' : this.itemObj.templateVal.col * this.itemObj.wBase + 'px';
      this.$set(this.itemObj, 'sizeW', this.sizeW);
      this.$set(this.itemObj, 'sizeH', this.sizeH);
      this.$set(this.itemObj, 'positionX', this.positionX);
      this.$set(this.itemObj, 'positionY', this.positionY);
      this.$root.bus.$emit('setContainerItem', this.itemObj);
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
      this.itemObj.displayerList.map(item => {
        item.baseW = (width-6) / this.itemObj.templateVal.col;
        item.baseH = (height-28) / this.itemObj.templateVal.row;
      });
      this.itemObj.wBase = (width-6) / this.itemObj.templateVal.col;
      this.itemObj.hBase = (height-28) / this.itemObj.templateVal.row;
      this.$set(this.itemObj, 'sizeW', width);
      this.$set(this.itemObj, 'sizeH', height);
      this.$set(this.itemObj, 'positionX', x);
      this.$set(this.itemObj, 'positionY', y);
      this.$root.bus.$emit('setContainerItem', this.itemObj);
    },
    // 容器拖拽
    onDrag: function (x, y) {
      if(x <= 0 || y <= 0) {
        this.positionX = x <= 0 ? 0 : x;
        this.positionY = y <= 0 ? 0 : y;
        return;
      }
      this.positionX = x;
      this.positionY = y;
      this.displayerBoxStyle.transform = 'translate('+ (x + 3) +'px,'+ (y + 25) +'px)';
      this.$set(this.itemObj, 'positionX', x);
      this.$set(this.itemObj, 'positionY', y);
      this.$root.bus.$emit('setContainerItem', this.itemObj);
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
    this.$dragging.$on('dragged', (value) => {
      console.log(value);
    });
    this.$dragging.$on('dragend', () => {

    });
  },
  watch: {
    item(){
      this.init();
    }
  }
}
</script>

<style scoped lang="less">
  .container-el {
    position: relative;
    .container-component {
      position: relative;
      border: 2px solid rgb(0,196,172);
      border-top: none;
      margin-bottom: 24px;
      .container-header {
        height: 24px;
        background: rgb(0,196,172);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
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
    }
    .displayer-box {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>