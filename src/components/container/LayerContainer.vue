<template>
  <div
    class="container-component"
    v-if="cItem"
    :style="setContainerStyle"
    :containerId="cItem.containerId"
  >
    <div class="container-header">
      <span
        >{{ cItem.containerId + 1 }}--(W:{{ cItem.sizeW }} H:{{ cItem.sizeH }})</span
      >
    </div>
    <div
      class="content-view" 
      :containerId="cItem.containerId"
    >
      <Displayer
        v-for="outputItem in output"
        :key="outputItem.id"
        :outputItem="outputItem"
        :slotName="'layerNumber'"
      >
        <template v-slot:layerNumber>
          <span>4</span>
        </template>
      </Displayer>
      <SignalLayer
        v-for="layer in layerList"
        :key="'layer' + layer.id"
        :layer="layer"
        :switchLayer="switchLayer"
        :switchVal="switchVal"
      >
      </SignalLayer>
    </div>
    <!-- <div class="signal-model" v-if="signalModelShow">
      <SignalModel
        v-for="displayer in cItem.content"
        :key="displayer.id"
        :dMsg="displayer"
        :deviceId="deviceId"
        :size="setDisplayerItem"
        :positionZoom="cItem.positionZoom"
        pisition="true"
      />
      <slot></slot>
    </div> -->
  </div>
</template>

<script>
import Displayer from "@/components/displayer/Displayer";
import SignalModel from '@/components/displayer/SignalModel';
import SignalLayer from '@/components/displayer/SignalLayer';
import $ from "jquery";
export default {
  props: {
    cItem: {
      type: Object,
    },
    output: {
      type: Array,
      default: () => []
    },
    layerList: {
      type: Array,
      default: () => []
    },
    switchLayer: {
      type: Boolean,
      default: false,
    },
    switchVal: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Displayer,
    SignalModel,
    SignalLayer,
  },
  data() {
    return {
     
    };
  },
  computed: {
    // 容器尺寸
    setContainerStyle() {
      return {
        width: this.cItem.sizeW / 10 + 'px',
        height: this.cItem.sizeH / 10 + 24 + 'px',
        top: this.cItem.posY + 'px',
        left: this.cItem.posX + 'px'
      };
    },
  },
  methods: {
    emitSetContainer(container) {
      this.$root.bus.$emit('setSelectedContainer', container);
    },
    
  },
  created() {},
  mounted() {},
  watch: {},
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
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      font-weight: bold;
    }
  }
  > .displayer-view {
    flex: 1;
    background: rgb(63, 69, 94);
  }
  .content-view {
    position: relative;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .content-view-child {
      position: relative;
      box-sizing: border-box;
    }
  }
  .signal-model {
    position: absolute;
    background: rgba(23, 78, 80, 0.2);
    left: 0;
    right: 0;
    bottom: 0;
    top: 24px;
    z-index: 99;
  }
  .signal-box {
    position: absolute;
    background: rgba(255, 255, 255, 0);
    left: 0;
    right: 0;
    bottom: 0;
    top: 24px;
    z-index: 99;
  }
}
</style>