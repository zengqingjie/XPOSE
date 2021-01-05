<template>
  <div class="container-component" v-if="item && item.templateVal" :style="setContainerStyle">
    <div class="container-header">
      <span>{{index + 1}}--(W:{{item.templateVal.col * 1920}} H:{{item.templateVal.row * 1080}})</span>
      <div class="right-view">
        <div>-</div>
        <div>+</div>
        <div>x</div>
      </div>
    </div>
    <draggable
      class="displayerBox"
      group="displayers"
      animation="1000"
      forceFallback="true"
    >
      <div class="displayer-item" v-for="dItem in item.displayerList" :key="dItem.id" :style="setDisplayerStyle">
        <div>显示器{{dItem.id}}</div>
        <div>x:{{dItem.x}} y:{{dItem.y}}</div>
        <div>w:{{dItem.width}} h:{{dItem.height}}</div>
        <div>r:0</div>
        <div>{{dItem.name}}</div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
// import vdr from 'vue-draggable-resizable-gorkys';
export default {
  props: ["item", "index"],
  components: {
    draggable,
    // vdr,
  },
  data() {
    return {
      wBase: 240,
      hBase: 120
    }
  },
  computed: {
    // 容器尺寸
    setContainerStyle() {
      const itemInfo = this.item;
      const width = (itemInfo.templateVal.col * this.wBase) + 'px';
      const height = (itemInfo.templateVal.row * this.hBase + 24) + 'px';
      return {
        width: width,
        height: height
      }
    },
    // 显示器尺寸
    setDisplayerStyle() {
      const width = this.wBase + 'px';
      const height = this.hBase + 'px';
      return {
        width,
        height
      }
    }
  },
  methods: {
    
  },
  mounted() {
    
  },
  watch: {
    
  }
}
</script>

<style scoped lang="less">
  .container-component {
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
        width: 100px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        div {
          text-align: center;
          flex: 1;
          flex-shrink: 10;
        }
      }
    }
    .displayerBox {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .displayer-item {
        padding: 12px;
        background: rgb(120,190,252);
        border: 1px solid #333;
        box-sizing: border-box;
        font-size: 12px;
      }
    }
  }
</style>