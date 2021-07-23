<template>
  <div
    class="container-component"
    v-if="cItem"
    @mousedown="emitSetContainer(cItem)"
    :containerId="cItem.containerId"
    :style="setContainerStyle"
  >
    <div class="container-header">
      <span>{{ cItem.containerId + 1 }}--(W:{{ cItem.sizeW }} H:{{ cItem.sizeH }})</span>
      <div class="right-view">
        <!-- <div @click="zoom(cItem, -1)">-</div>
        <div @click="zoom(cItem, 1)">+</div> -->
        <div
          class="delete-container"
          @click="deleteContainerItem(cItem)"
        >
          x
        </div>
      </div>
    </div>
    <div
      class="displayer-box" 
      :containerId="cItem.containerId"
    >
      <Displayer
        v-for="outputItem in output"
        :key="outputItem.id"
        :outputItem="outputItem"
        :deviceId="deviceId"
      />
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Displayer from "@/components/displayer/Displayer";
export default {
  props: {
    cItem: {
      type: Object,
    },
    deviceId: {
      type: Number | String,
      default: ''
    },
    output: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Displayer,
  },
  data() {
    return {
      outputList: [],
    };
  },
  computed: {
    // 容器尺寸
    setContainerStyle() {
      return {
        width: this.cItem.sizeW / 10 + 'px',
        height: this.cItem.sizeH / 10 + 24 + 'px',
        top: this.cItem.posY + "px",
        left: this.cItem.posX + "px",
      };
    },
  },
  created() {},
  mounted() {},
  methods: {
    
    // 容器缩放
    zoom(container, zoom) {
      this.$root.bus.$emit('setZoom', {container, zoom});
    },
    emitSetContainer(container) {
      this.$root.bus.$emit('setSelectedContainer', container);
    },
    // 点击删除容器
    deleteContainerItem(obj) {
      const that = this;
      that.$confirm("是否删除该容器?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that.$root.bus.$emit("deleteContainer", obj);
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  watch: {
    
  },
  
};
</script>

<style scoped lang="less">
.container-component {
  display: inline-flex;
  position: absolute;
  border: 2px solid rgb(0, 196, 172);
  flex-direction: column;
  transform: scale(1);
  .container-header {
    height: 24px;
    background: rgb(0, 196, 172);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    cursor: move;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    background: rgb(63, 69, 94);
  }
  .displayer-box {
    position: relative;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .displayer-box-child {
      position: relative;
      box-sizing: border-box;
    }
  }
}
</style>