<template>
  <div
    class="displayer-view"
    :class="deviceId == dMsg.id ? 'border-style' : ''"
    :style="setStyle"
    :parentId="dMsg.parentId"
    :id="dMsg.id"
    :displayerId="dMsg.displayId"
    :containerId="dMsg.containerId"
    v-if="dMsg"
    @click="clickDisplayer(dMsg)"
  >
    <div>显示器{{ dMsg.displayId }}</div>
    <div v-if="pisition && dMsg.realPos"><span>x:{{dMsg.realPos.left}}</span><span>y:{{dMsg.realPos.top}}</span></div>
    <div v-if="dMsg.separation == 10"><span>w:1920</span><span>h:1080</span></div>
    <div v-if="dMsg.separation == 82"><span>w:3840</span><span>h:2160</span></div>
    <div>{{dMsg.name}}</div>
    <span
      class="delete-displayer"
      @click.stop="deleteDisplayer(dMsg.displayId, dMsg.parentId)"
      >x</span
    >
    <div class="border-view" v-if="deviceId == dMsg.id"></div>
  </div>
</template>

<script>
export default {
  props: {
    dMsg: {
      type: Object,
    },
    deviceId: {
      type: Number | String,
      default: ''
    },
    size: {
      type : Object,
    },
    positionZoom: {
      type: Number,
      default: 1
    },
    pisition: {
      type: String | Boolean,
      default: ''
    }
  },
  data() {
    return {};
  },
  mounted() {
  },
  watch: {},
  computed: {
    setStyle() {
      if (this.dMsg.position) {
        return {
          width: this.dMsg.sizeW / 10 + 'px',
          height: this.dMsg.sizeH / 10 + 'px',
          left: this.dMsg.position.left + 'px',
          top: this.dMsg.position.top + 'px',
          position: 'absolute'
        }
      } else {
        return {
          width: this.size.width + 'px',
          height: this.size.height + 'px',
        }
      }
    }
  },
  methods: {
    // 删除单个显示器
    deleteDisplayer(dId, cId) {
      const data = {
        dId,
        cId,
      };
      this.$root.bus.$emit("deleteDisplayer", data);
    },
    // 选中单个显示器
    clickDisplayer(display) {
      this.$root.bus.$emit("clickDisplayer", display);
    },
  },
};
</script>

<style scoped lang='less'>
.displayer-view {
  // position: absolute;
  padding: 12px;
  background: rgb(120, 190, 252);
  border: 1px solid #666;
  box-sizing: border-box;
  font-size: 12px;
  .delete-displayer {
    display: none;
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
  border: none;
}
</style>