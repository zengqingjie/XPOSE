<template>
  <div
    class="displayer-view"
    :style="setStyle"
    :class="deviceId == dMsg.id ? 'light' : ''"
    :parentId="dMsg.parentId"
    :id="dMsg.id"
    v-if="dMsg"
    @click="clickDisplayer(dMsg.id)"
  >
    <div>显示器{{ dMsg.displayId }}</div>
    <div v-if="dMsg.position"><span>x:{{dMsg.position.left}}</span><span>y:{{dMsg.position.top}}</span></div>
    <div>{{dMsg.name}}</div>
    <span
      class="delete-displayer"
      @click.stop="deleteDisplayer(dMsg.id, dMsg.parentId)"
      >x</span
    >
  </div>
</template>

<script>
import { dataFormat } from '../../utils/dataFormat';
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
          left: this.dMsg.position.left * this.dMsg.customFeature.zoom.xRadio + 'px',
          top: this.dMsg.position.top * this.dMsg.customFeature.zoom.yRadio + 'px',
          position: 'absolute'
        }
      } else {
        return {
          width: this.size.width + 'px',
          height: this.size.height + 'px',
        }
      }
    }
    // setPosition() {
    //   if (this.dMsg.position) {
    //     return {
    //       left: this.dMsg.position.left + 'px',
    //       top: this.dMsg.position.top + 'px'
    //     }
    //   }
    // }
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
}
.light {
  border: 3px solid rgb(0, 252, 255);
}
</style>