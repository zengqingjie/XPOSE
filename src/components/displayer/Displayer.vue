<template>
  <div
    class="displayer-view"
    :class="deviceId === outputItem.id ? 'border-style' : ''"
    :style="setStyle"
    :id="outputItem.id"
    :containerId="outputItem.containerId"
    v-if="outputItem"
    @mouseover="mouseEvent(true)"
    @mouseout="mouseEvent(false)"
    @click="clickDisplayer(outputItem)"
  >
    <div>显示器{{ outputItem.id + 1}}</div>
    <div><span>x:{{outputItem.posX}}</span><span>y:{{outputItem.posY}}</span></div>
    <div><span>w:{{outputItem.sizeW}}</span><span>h:{{outputItem.sizeH}}</span></div>
    <div>{{outputItem.outputType}}</div>
    <span
      v-show="!slotName && deleteIcon"
      class="delete-displayer"
      @click.stop="deleteDisplayer(outputItem.id, outputItem.containerId)"
      >x</span
    >
    <div class="layer-num" v-if="slotName">
      <slot name="layerNumber"></slot>
    </div>
    <!-- <div class="border-view" v-if="deviceId == outputItem.id"></div> -->
  </div>
</template>

<script>
export default {
  props: {
    outputItem: {
      type: Object,
    },
    deviceId: {
      type: Number | String,
      default: ''
    },
    slotName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      deleteIcon: false
    };
  },
  mounted() {
    
  },
  watch: {},
  computed: {
    setStyle() {
      return {
        width: this.outputItem.sizeW / 10 + 'px',
        height: this.outputItem.sizeH / 10 + 'px',
        left: this.outputItem.posX / 10 + 'px',
        top: this.outputItem.posY / 10 + 'px',
      }
    }
  },
  methods: {
    mouseEvent(boolean) {
      this.deleteIcon = boolean;
    },
    // 删除单个显示器
    deleteDisplayer(outputId, cId) {
      const data = {
        outputId,
        cId,
      };
      this.$root.bus.$emit("deleteDisplayer", data);
    },
    // 选中单个显示器
    clickDisplayer(output) {
      this.$root.bus.$emit("clickDisplayer", output);
    },
  },
};
</script>

<style scoped lang='less'>
.displayer-view {
  position: absolute;
  padding: 12px;
  background: rgb(120, 190, 252);
  border: 1px solid #666;
  box-sizing: border-box;
  font-size: 12px;
  .delete-displayer {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    color: #333;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .layer-num {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 48px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 14px;
  }
  .border-view {
    position: absolute;
    border: 3px solid rgb(0, 252, 255);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
  }
}
.border-style {
  border: 3px solid rgb(0, 252, 255);
}
</style>