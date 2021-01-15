<template>
  <div
    class="container-component"
    v-if="cItem && cItem.templateId"
    :style="setContainerStyle"
    @mousedown="emitSetContainer(cItem)"
    :id="cItem.id"
  >
    <div class="container-header">
      <span
        >{{ index + 1 }}--(W:{{ cItem.customFeature.col * 1920 }} H:{{
          cItem.customFeature.row * 1080
        }})</span
      >
      <div class="right-view">
        <div @click="zoom(cItem, -1)">-</div>
        <div @click="zoom(cItem, 1)">+</div>
        <div
          v-longpress="deleteContainer"
          class="delete-container"
          @click="deleteContainerItem(cItem)"
        >
          x
        </div>
      </div>
    </div>
    <div class="displayer-box" :parentId="cItem.id">
      <Displayer
        v-for="displayer in cItem.content"
        :key="displayer.id"
        :dMsg="displayer"
        :deviceId="deviceId"
        :size="setDisplayerItem"
        :positionZoom="cItem.positionZoom"
      />
      <!-- <div
        class="displayer-box-child"
        v-for="(dItem) in cItem.content"
        :key="dItem.id"
        :id="dItem.id"
        :parentId="dItem.parentId"
        :style="setContainerItem"
      >
      </div> -->
    </div>
  </div>
</template>

<script>
import { dataFormat } from '../../utils/dataFormat';
import Displayer from "@/components/displayer/Displayer";
import $ from "jquery";
export default {
  props: {
    cItem: {
      type: Object,
    },
    index: {
      type: Number | String,
      default: -1,
    },
    deviceId: {
      type: Number | String,
      default: ''
    }
  },
  components: {
    Displayer,
  },
  data() {
    return {
    };
  },
  computed: {
    // 容器尺寸
    setContainerStyle() {
      const { position } = this.cItem;
      const { col, row, wBase, hBase, zoom } = this.cItem.customFeature;
      const width = col * wBase * zoom.xRadio + "px";
      const height = row * hBase * zoom.yRadio + 24 + "px";
      return {
        width: width,
        height: height,
        top: position.top ? position.top + "px" : 0,
        left: position.left ? position.left + "px" : 0,
      };
    },
    setDisplayerItem() {
      const { col, row, wBase, hBase, zoom } = this.cItem.customFeature;
      const width = wBase;
      const height = hBase;
      return {
        width: width * zoom.xRadio,
        height: height * zoom.yRadio,
        zoom: this.cItem.customFeature.zoom
      };
    },
  },
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
      const vm = this;
      vm.$confirm("是否删除该容器?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          vm.$root.bus.$emit("deleteContainer", obj);
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 长按删除容器
    deleteContainer() {

    },
    
  },
  created() {},
  mounted() {
    // const cElement = $('#'+ this.cItem.id);
    // let container = this.cItem; // 当前容器
    // let displayers = [];
    // $(cElement).find(".displayer-view").each(function() {
    //   displayers.push($(this));
    // })
    // displayers.forEach((item, index) => {
    //   const position = {
    //     top: $(item)[0].offsetTop * container.customFeature.zoom.yRadio,
    //     left: $(item)[0].offsetLeft * container.customFeature.zoom.xRadio
    //   }
    //   container.content[index].position = position;
    // })
    // this.$root.bus.$emit('setDisplayPositon', container);
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