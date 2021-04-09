<template>
  <div
    class="signal-view"
    :style="setStyle"
    :class="deviceId == dMsg.id ? 'light' : ''"
    :parentId="dMsg.parentId"
    :id="dMsg.id"
    :outInputId="dMsg.displayId"
    :containerId="dMsg.containerId"
    v-if="dMsg"
  >
    <div class="signal-num">
      <span>{{2 - dMsg.intersectList.length}}</span>
      <div>[{{dMsg.displayId}}]</div>
    </div>
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
          width: this.size.width + 'px',
          height: this.size.height + 'px',
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
    clickDisplayer(id) {
      this.$root.bus.$emit("clickDisplayer", id);
    },
  },
};
</script>

<style scoped lang='less'>
.signal-view {
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #666;
  box-sizing: border-box;
  font-size: 12px;
  .signal-num {
    position: absolute;
    display: flex;
    width: 28%;
    padding: 0 8px;
    align-items: center;
    bottom: 6px;
    right: 6px;
    color: #eee;
    background: rgba(62, 77, 68, 0.5);
    z-index: 1000;
    span {
      font-size: 18px;
    }
    div {
      margin-left: 8px;
      font-size: 12px;
    }
  }
}
.light {
  border: 3px solid rgb(0, 252, 255);
}
</style>