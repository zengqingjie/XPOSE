<template>
  <div
    class="container-component"
    v-if="cItem && cItem.templateId"
    :style="setContainerStyle"
    :id="cItem.id"
  >
    <div class="container-header">
      <span
        >{{ index + 1 }}--(W:{{ cItem.customFeature.col * 1920 }} H:{{
          cItem.customFeature.row * 1080
        }})</span
      >
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
    </div>
    <div class="signal-model" v-if="signalModelShow">
      <SignalModel
        v-for="displayer in cItem.content"
        :key="displayer.id"
        :dMsg="displayer"
        :deviceId="deviceId"
        :size="setDisplayerItem"
        :positionZoom="cItem.positionZoom"
      />
      <SignalLayer
        v-for="layer in signalLayers"
        :key="layer.id"
        :info="layer"
        :container="cItem"
      />
      <Aoi
        :aoi="aoiData"
      />
    </div>
  </div>
</template>

<script>
import Displayer from "@/components/displayer/Displayer";
import SignalModel from '@/components/displayer/SignalModel';
import SignalLayer from '@/components/displayer/SignalLayer';
import Aoi from '@/components/displayer/Aoi';
import $ from "jquery";
export default {
  props: {
    cItem: {
      type: Object,
    },
    signalLayers: {
      type: Array,
      default: []
    },
    index: {
      type: Number | String,
      default: -1,
    },
    deviceId: {
      type: Number | String,
      default: ''
    },
    signalModelShow: {
      type: Boolean
    },
    aoiData: {
      type: Object,
      default: null
    }
  },
  components: {
    Displayer,
    SignalModel,
    SignalLayer,
    Aoi
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
    emitSetContainer(container) {
      this.$root.bus.$emit('setSelectedContainer', container);
    },
    
    
  },
  created() {},
  mounted() {},
  methods: {
    
  },
  watch: {
    signalLayers() {
      
    },
    aoiData(newVal) {
      console.log(newVal);
    }
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