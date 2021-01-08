<template>
  <div
    class="container-component" 
    v-if="cItem && cItem.templateVal"
    :style="setContainerStyle"
  >
    <div class="container-header">
      <span>{{index + 1}}--(W:{{cItem.templateVal.col * 1920}} H:{{cItem.templateVal.row * 1080}})</span>
      <div class="right-view">
        <div>-</div>
        <div>+</div>
        <div v-longpress="deleteContainer" class="delete-container" @click="deleteContainerItem(cItem)">x</div>
      </div>
    </div>
    <div class="displayer-box" :parentId="cItem.id">
      <Displayer
        v-for="dItem in cItem.displayerList"
        :key="dItem.id"
        :dMsg="dItem"
        :id="dItem.id"
        :parentId="cItem.id"
        :zooms="cItem.zoom"
      />
    </div>
  </div>
</template>

<script>
import Displayer from '@/components/displayer/Displayer';
import $ from 'jquery';
export default {
  props: ["cItem", "index"],
  components: {
    Displayer,
  },
  data() {
    return {
      zoom: {
        xRadio: 1,
        yRadio: 1
      }
    }
  },
  computed: {
    // 容器尺寸
    setContainerStyle() {
      const width = (this.cItem.templateVal.col * this.cItem.wBase * this.cItem.zoom.xRadio) + 'px';
      const height = (this.cItem.templateVal.row * this.cItem.hBase * this.cItem.zoom.yRadio + 24) + 'px';
      const top = this.cItem.top ? this.cItem.top + 'px' : 0;
      const left = this.cItem.left ? this.cItem.left + 'px' : 0;
      return {
        width: width,
        height: height,
        top,
        left
      }
    },
  },
  methods: {
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
    
  },
  mounted() {
    
  },
  watch: {
    
  }
}
</script>

<style scoped lang="less">
  .container-component {
    display: inline-flex;
    position: absolute;
    border: 2px solid rgb(0,196,172);
    border-top: none;
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