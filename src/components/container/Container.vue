<template>
  <div class="container-component" v-if="item && item.templateVal">
    <div class="container-header">
      <span>{{index + 1}}--(W:{{item.templateVal.col * 1920}} H:{{item.templateVal.row * 1080}})</span>
      <div class="right-view">
        <div>-</div>
        <div>+</div>
        <div>x</div>
      </div>
    </div>
    <draggable
      v-model="displayerList"
      group="displayers"
      animation="1000"
      forceFallback="true"
    >
      <div class="displayer-item" v-for="item in displayerList" :key="item.id">显示器xxx</div>
      <!-- <transition-group>
      </transition-group> -->
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  props: ["item", "index"],
  components: {
    draggable
  },
  data() {
    return {
      displayerList: [],
    }
  },
  mounted() {
    console.log('走过生命周期');
    if(this.item.displayerChecked) {
      const row = this.item.templateVal.row;
      const col = this.item.templateVal.col;
      for(let i = 0; i < row * col; i++) {
        const displayerInfo = {
          x: i < col ? i * 1920 : 0,
          y: i < row ? 0 : i * 1080,
          w: this.item.separation == 2 ? 1920 : 3840,
          h: this.item.separation == 2 ? 1080 : 2160,
        }
        this.displayerList.push(displayerInfo);
      }
    }
  }
}
</script>

<style scoped lang="less">
  .container-component {
    border: 2px solid rgb(0,196,172);
    border-top: none;
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
          flex: 1;
          flex-shrink: 0;
        }
      }
    }
  }
</style>