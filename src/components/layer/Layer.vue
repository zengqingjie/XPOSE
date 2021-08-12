<template>
  <div class="layer-wrap">
    <!-- 图层移动操作区 -->
    <!-- <div class="position-top">
      <span @click="layerOrderEvent('after')">置后</span>
      <span @click="layerOrderEvent('before')">置前</span>
      <span @click="layerOrderEvent('bottom')">置底</span>
      <span @click="layerOrderEvent('top')">置顶</span>
    </div> -->
    <div class="section">
      <div class="left-view">
        <div class="params-type">
          <el-scrollbar>
            <div style="border-left:none" :class="leftIndex == 0 ? 'show' : ''" @click="paramsEvent(0)">容器</div>
            <div :class="leftIndex == 1 ? 'show' : ''" @click="paramsEvent(1)">图层</div>
            <div :class="leftIndex == 2 ? 'show' : ''" @click="paramsEvent(2)">信号</div>
          </el-scrollbar>
        </div>
        <div class="params-conts">
          <div v-show="leftIndex == 0">
            <div
              v-for="(item, index) in containerList"
              :key="item.id"
            >
              <div class="container-list-item">
                <div class="container-name">
                  <img src="../../assets/Container.png" alt="">
                  <span>{{item.name ? item.name : '容器' + (index + 1)}}</span>
                </div>
                <img
                  :src="item.status ? require('../../assets/close_eye.png') : require('../../assets/green_eye.png')"
                  alt=""
                  @click="eyeStatus(item)"
                >
              </div>
            </div>
          </div>
          <div v-show="leftIndex == 1">
            <template
              v-for="(item, index) in currentLayerList"
            >
              <div
                :key="item.id"
                class="layer-list-item"
              >
                <span><img src="../../assets/layer_icon.png" alt="">{{index + 1}}</span>
                <span>序号{{96 - item.index}}</span>
                <span>信号{{item.inputPort + 1}}</span>
              </div>
            </template>
          </div>
          <div v-show="leftIndex == 2">
            <div class="signal-box">
              <div
                v-for="(item, index) in signalList"
                :key="item.inputPort"
                :class="[index % 2 ? 'deep' : 'shallow', signalId == item.id ? 'show' : '']"
              > 
                <div
                  class="signal-item"
                  :id="item.inputPort"
                  :type="item.inputType"
                  :index="index"
                  :format="item.format"
                  v-if="item.inputType != 0"
                >
                  <span class="order">{{item.inputPort + 1}}</span>
                  <div class="signal-icon" v-if="item.format == 127">
                    <img src="../../assets/default/HDMI2.0.png" alt="" v-if="(item.inputType == 53 || item.inputType == 11)">
                    <img src="../../assets/default/HDBaseT.png" alt="" v-if="item.inputType == 32">
                    <img src="../../assets/default/SDI_12G.png" alt="" v-if="item.inputType == 25">
                    <img src="../../assets/default/DVI.png" alt="" v-if="(item.inputType == 1) || (item.inputType == 16) || (item.inputType == 21)">
                    <img src="../../assets/default/HDMI1.4.png" alt="" v-if="item.inputType == 22">
                    <img src="../../assets/default/HDMI2.0.png" alt="" v-if="item.inputType == 24">
                    <img src="../../assets/default/DP1.2.png" alt="" v-if="(item.inputType == 23) || (item.inputType == 35)">
                  </div>
                  <div class="signal-icon" v-if="item.format != 127">
                    <img src="../../assets/green/greenHDMI2.0.png" alt="" v-if="(item.inputType == 53 || item.inputType == 11)">
                    <img src="../../assets/green/greenHDBaseT.png" alt="" v-if="item.inputType == 32">
                    <img src="../../assets/green/greenSDI_12G.png" alt="" v-if="item.inputType == 25">
                    <img src="../../assets/green/greenDVI.png" alt="" v-if="(item.inputType == 1) || (item.inputType == 16) || (item.inputType == 21)">
                    <img src="../../assets/green/greenHDMI1.4.png" alt="" v-if="item.inputType == 22">
                    <img src="../../assets/green/greenHDMI2.0.png" alt="" v-if="item.inputType == 24">
                    <img src="../../assets/green/greenDP1.2.png" alt="" v-if="(item.inputType == 23) || (item.inputType == 35)">
                  </div>
                  <span :class="item.format != 127 ? 'green-text' : ''">{{conversationFormate(item.format)}}</span>
                </div>
                <canvas
                  width="192"
                  height="108"
                  class="movie"
                  :format="item.format"
                  :inputPort="item.inputPort"
                  v-if="sryj && h264 && item.format != 0"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="layer-cont">
        <div class="container-box">
          <LayerContainer
            v-for="(item, index) in containerList" :key="index"
            :cItem="item"
            :output="setOutputList(item.containerId)"
            :layerList="setLayerList(currentLayerList, item.containerId)"
            :switchLayer="tcyj"
            :switchVal="h264"
          >
          </LayerContainer>
        </div>
      </div>
      <div class="right-view" v-if="!showInfo && nowMenuId == '004'">
        <div class="params-type">
          <el-scrollbar>
            <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">缩放</div>
            <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">裁剪</div>
            <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">H264 Demo</div>
            <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">流媒体</div>
          </el-scrollbar>
        </div>
        <div class="params-conts">
          <div v-if="typeIndex == 0">
            <div class="params-obj">
              <span>信号源</span>
              <div>信号 {{layerObj ? (layerObj.inputPort + 1) : ''}}</div>
            </div>
            <div class="params-obj">
              <span>图层序号</span>
              <div>图层 {{layerObj ? (96 - layerObj.index) : ''}}</div>
            </div>
            <div class="params-style-input">
              <span>透明度</span>
              <input type="text" v-model="outsideLayerObj.alpha">
            </div>
            <hr style="border: 1px solid #000">
            <div class="params-style">位置</div>
            <div class="params-style-input">
              <span>X</span>
              <input type="text" v-model="outsideLayerObj.scalePosX">
            </div>
            <div class="params-style-input">
              <span>Y</span>
              <input type="text" v-model="outsideLayerObj.scalePosY">
            </div>
            <div class="params-style-input">
              <span>宽度</span>
              <input type="text" v-model="outsideLayerObj.scaleSizeW">
            </div>
            <div class="params-style-input">
              <span>高度</span>
              <input type="text" v-model="outsideLayerObj.scaleSizeH">
            </div>
          </div>
          <div v-if="typeIndex == 1">
            <div class="params-obj">
              <span>图层序号</span>
              <div>图层 {{layerObj ? (96 - layerObj.index) : ''}}</div>
            </div>
            <hr style="border: 1px solid #000;margin:0 0 8px 0">
            <div class="params-style">显示</div>
            <div class="params-style-input">
              <span>显示模式</span>
              <el-switch
                v-model="showModel"
                active-color="#1ABC9C"
                inactive-color="#2C384F">
              </el-switch>
            </div>
            <div class="params-style-input">
              <span>镜像</span>
              <el-switch
                v-model="mirrorVal"
                active-color="#1ABC9C"
                inactive-color="#2C384F">
              </el-switch>
            </div>
            <hr style="border: 1px solid #000;">
            <div class="params-style">位置</div>
            <div class="params-style-input">
              <span>X</span>
              <input type="text" v-model="outsideLayerObj.cropPosX">
            </div>
            <div class="params-style-input">
              <span>Y</span>
              <input type="text" v-model="outsideLayerObj.cropPosY">
            </div>
            <div class="params-style-input">
              <span>宽度</span>
              <input type="text" v-model="outsideLayerObj.cropSizeW">
            </div>
            <div class="params-style-input">
              <span>高度</span>
              <input type="text" v-model="outsideLayerObj.cropSizeH">
            </div>
          </div>
          <div v-if="typeIndex == 2">
            <div class="params-obj">
              <span>Input Port</span>
            </div>
            <hr style="border: 1px solid #000;margin:0 0 8px 0">
            <div class="params-style-input">
              <el-radio v-model="radio" label="1">IP设置</el-radio>
            </div>
            <div class="params-style-input">
              <span>ip地址</span>
              <div class="input-group">
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
              </div>
            </div>
            <div class="params-style-input">
              <span>子网掩码</span>
              <div class="input-group">
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
              </div>
            </div>
            <div class="params-style-input">
              <span>网关</span>
              <div class="input-group">
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
              </div>
            </div>
            <div class="params-style-input">
              <span>DNS</span>
              <div class="input-group">
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
              </div>
            </div>
            <div class="params-style-input">
              <span>Mac</span>
              <div class="input-group-mac">
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
                <span>-</span>
                <input type="text" :disabled="radio=='1' ? false : true">
              </div>
            </div>
            <div class="params-style-input">
              <el-radio v-model="radio" label="2">网络URL设置</el-radio>
            </div>
            <div class="params-style-input">
              <span>Picture</span>
              <div class="input-select">
                <el-select v-model="picValue" placeholder="请选择" :disabled="radio=='2' ? false : true">
                  <el-option
                    v-for="item in picture"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue) ? 'net-set' : 'default'">设置</div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue == '4' || picValue == '8') ? 'net-set' : 'default'">设置</div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue == '4' || picValue == '8') ? 'net-set' : 'default'">设置</div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue == '4' || picValue == '8') ? 'net-set' : 'default'">设置</div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue == '8') ? 'net-set' : 'default'">设置</div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue == '8') ? 'net-set' : 'default'">设置</div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue == '8') ? 'net-set' : 'default'">设置</div>
            </div>
            <div class="params-style-input">
              <span>网络URL</span>
              <input type="text" class="network-url" :disabled="radio=='2' ? false : true">
              <div :class="(radio== '2' && picValue == '8') ? 'net-set' : 'default'">设置</div>
            </div>
          </div>
          <div v-if="typeIndex == 3">
            <div class="params-obj">
              <span>板块位置</span>
              <div>H264</div>
            </div>
            <hr style="border: 1px solid #000;margin:0 0 8px 0">
            <div class="params-style-input">
              <span>画质</span>
              <div class="input-select">
                <el-select v-model="imgQuality" placeholder="请选择">
                  <el-option
                    v-for="item in imgQualityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="params-style-input">
              <span>图层预监</span>
              <el-switch
                v-model="tcyj"
                active-color="#1ABC9C"
                inactive-color="#2C384F"
                :width="100"
                :disabled="h264"
              >
              </el-switch>
            </div>
            <div class="params-style-input">
              <span>输入预监</span>
              <el-switch
                v-model="sryj"
                active-color="#1ABC9C"
                inactive-color="#2C384F"
                :width="100"
                :disabled="h264"
              >
              </el-switch>
            </div>
            <div class="params-style-input">
              <span>场景预监</span>
              <el-switch
                v-model="cjyj"
                active-color="#1ABC9C"
                inactive-color="#2C384F"
                :width="100"
                :disabled="h264"
              >
              </el-switch>
            </div>
            <div class="params-style-input">
              <span>扩展预监</span>
              <el-switch
                v-model="kzyj"
                active-color="#1ABC9C"
                inactive-color="#2C384F"
                :width="100"
                :disabled="h264"
              >
              </el-switch>
            </div>
            <div class="params-style-input">
              <span>H.264</span>
              <el-switch
                v-model="h264"
                active-color="#1ABC9C"
                inactive-color="#2C384F"
                :width="100"
                @change="previewPictureEvent"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="params-footer">
          <div v-if="typeIndex == 2">保存</div>
          <div v-if="typeIndex != 3" @click="setData">设置</div>
          <div @click="hideRightView">返回</div>
        </div>
      </div>
      <div class="bank-view">
        <div class="bank-box">
          <div class="bank-item"
            v-for="(item, index) in sceneList"
            :key="index"
            @click="changeBank(item, index)"
          >
            <div class="bank-head" :style="{background: bankList[index].headColor}">bank{{index + 1}}</div>
            <div class="bank-cont" :style="{borderColor: bankList[index].headColor}">
              <div
                class="signalContainer-item"
                v-for="cItem in containerList"
                :key="cItem.containerId"
                :style="setContainerStyle(cItem)"
              >
                <div
                  class="signal-layer"
                  v-for="layer in setLayerList(item.layer, cItem.containerId)"
                  :key="layer.id"
                  :style="setSignalStyle(layer)"
                ></div>
              </div>
              <div class="sel-model" v-if="item.id == currentSceneId">
                <img src="../../assets/bank_show.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <img src="../../assets/china.gif" alt="" v-show="true" /> -->
    
    <BottomParams
      :layer="layerObj"
    />
  </div>
</template>

<script>
import $ from "jquery";
import LayerContainer from '@/components/container/LayerContainer';
import Aoi from '@/components/displayer/Aoi';
import { mapState } from 'vuex';
import BottomParams from '@/components/BottomParams';
import format from '@/utils/formatList';
export default {
  props: ['showInfo', 'nowMenuId'],
  data() {
    return {
      leftIndex: 2, // 容器、图层、信号参数
      typeIndex: 0, // 右侧菜单参数类型
      containerList: [], // 已创建的容器
      outputList: [], // 已创建输出口
      currentLayerList: [], // 图层列表
      sceneList: [], // 场景列表
      currentSceneId: 0, // 当前场景
      currentPageId: 0, // 当前页

      signalList: [], // 信号列表

      signalId: '',
      selectedContainer: null,
      // 缩放、裁剪数据
      outsideLayerObj: {
        cropPosX: 0,
        cropPosY: 0,
        cropSizeW: '',
        cropSizeH: '',
        scalePosX: '',
        scalePosY: '',
        scaleSizeW: '',
        scaleSizeH: '',
        alpha: 128,
      },

      // 裁剪数据
      showModel: false,
      mirrorVal: false,

      radio: '1',
      picture: [{
        value: '1',
        label: '单画面'
      }, {
        value: '4',
        label: '四画面'
      }, {
        value: '8',
        label: '八画面'
      }],
      picValue: '1',
      imgQualityList: [{
        value: '1',
        label: '流畅'
      }, {
        value: '2',
        label: '正常'
      }, {
        value: '3',
        label: '高画质'
      }],
      imgQuality: '1',
      tcyj: false,
      sryj: false,
      cjyj: false,
      kzyj: false,
      h264: false,
      aoiData: null,
      streamMedia: '',
      layerIds: [], // 创建图层可以用id
      clipList: [], // 流媒体切割列表
      imgObj: null,
      layerObj: null,
      layerOrders: [],
      animationSignal: [], // 信号动画id集合
      animationLayer: [], // 图层动画id集合
      animationScene: [], // 场景动画集合
      sessionId: ''
    }
  },
  components: {
    LayerContainer,
    Aoi,
    BottomParams
  },
  created() {
   
  },
  mounted() {
    this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId"));
    this.sryj = this.$store.state.signalSwitch;
    this.tcyj = this.$store.state.layerSwitch;
    this.cjyj = this.$store.state.sceneSwitch;
    this.h264 = this.$store.state.ctrolSwitch;


    this.init();
    this.readContainerMsg(); // 读取容器配置信息
    this.getSignalList();

    // this.draggableInit(); // 容器区域拖拽
    this.signalInitDraggable(); // 信号列表拖拽
    this.signalInitDroppable(); // 信号放置
    
    // websocket接收到的消息
    const that = this;
    window.webSocket.onmessage = function(res) {
      const result = JSON.parse(res.data);
      // 获取容器
      if((result.code == 200) && (result.data.eventType == 'readContainerMsg')) {
        that.readOutputList(); // 读取输出口列表
        if (result.data.count > 0) {
          that.containerList = result.data.container;
        } else {
          that.containerList = [];
        }
      }
      // 获取显示器（输出口）列表
      if((result.code == 200) && (result.data.eventType == 'readOutputList')) {
        that.outputList = result.data.output;
        that.readSceneMsg(); // 读取图层列表
        // 可设置图层id集合
        that.layerIdList();
        that.$nextTick(() => {
          that.signalInitDroppable();
        });
      }
      // 获取图层列表数据
      if((result.code == 200) && (result.data.eventType == 'readSceneMsg')) {
        that.sceneList = result.data.scene;
        that.currentSceneId = result.data.currentSceneId;
        that.currentPageId = result.data.currentPageId;
        that.currentLayerList = result.data.scene[result.data.currentSceneId].layer;
        if(that.selectedLayerId) {
          const layer = result.data.scene[result.data.currentSceneId].layer.find(item => item.id == that.selectedLayerId);
          that.layerObj = layer;
          that.outsideLayerObj = Object.assign(that.outsideLayerObj, layer);
        }
        that.$nextTick(() => {
          that.currentLayerList.map(item => {
            if(!item.freeze) {
              that.layerDraggable(item.id); // 图层拖拽初始化
              that.layerResize(item.id); // 图层缩放初始化
            }
            let layerCanvas = [];
            if(that.tcyj && that.h264) {
              $('.signal-layer-item canvas').each(function() {
                layerCanvas.push($(this)[0]);
              });
              that.animationLayer.map(fram => cancelAnimationFrame(fram));
              that.animationLayer = [];
              that.renderImg(layerCanvas, 'layer');
            }
          })
        })
      }
      // 获取输入信号列表数据
      if((result.code == 200) && (result.data.eventType == 'readInputSignalList')) {
        that.signalList = result.data.inputSignal;
        that.$nextTick(() => {
          that.signalInitDraggable(); // 信号拖拽初始化
        });
      }
      // 设置图层成功回调
      if((result.code == 200) && (result.data.eventType == 'setLayer')) {
        new Promise(resolve => {
          setTimeout(() => {
            resolve(that.readSceneMsg());
          }, 500);
        })
      }
      // 删除图层成功回调
      if((result.code == 200) && (result.data.eventType == 'rmLayer')) {
        new Promise(resolve => {
          setTimeout(() => {
            resolve(that.readSceneMsg());
          }, 500);
        })
        that.layerObj = null;
      }
      // 图层冻结操作
      if((result.code == 200) && (result.data.eventType == 'setLayerFreeze')) {
        new Promise(resolve => {
          setTimeout(() => {
            resolve(that.readSceneMsg());
          }, 500);
        })
      }
    }
    
  },
  computed: {
    ...mapState([
      'bankList',
      'bankIndex',
      'outputModelInfo',
      'selectedLayerId'
    ]),
  },
  methods: {
    init() {
      // 标识当前操作的容器
      this.$root.bus.$off('setSelectedContainer');
      this.$root.bus.$on('setSelectedContainer', (data) => {
        this.selectedContainer = data;
      });
      // 点击图层获取图层数据
      this.$root.bus.$off('getlayer');
      this.$root.bus.$on('getlayer', (layer) => {
        this.layerObj = layer;
        this.$store.commit('setSelectedLayerId', layer.id);
        this.outsideLayerObj = Object.assign(this.outsideLayerObj, layer);
      });
      // 信号全屏
      this.$root.bus.$off('fullScreen');
      this.$root.bus.$on('fullScreen', (data) => {
        const container = this.containerList.find(item => item.containerId == data.containerId);
        const params = {
          eventType: "setLayer",
          count: 1,
          layer: [
            {
              id: data.id,
              cropPosX: data.cropPosX,
              cropPosY: data.cropPosY,
              cropSizeW: data.cropSizeW,
              cropSizeH: data.cropSizeH,
              scalePosX: 0,
              scalePosY: 0,
              scaleSizeW: container.sizeW,
              scaleSizeH: container.sizeH, 
              inputPort:  data.inputPort,
              containerId: data.contaienrId,
              layerAlpha: data.alpha,
              index: data.index,
              sceneId: data.sceneId,
              pageId: this.currentPageId
            }
          ],
          sessionID: this.sessionId,
          checkKey: this.getcheckKey()
        } 
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      });
      // 信号图层删除
      this.$root.bus.$off('deleteLayer');
      this.$root.bus.$on('deleteLayer', (data) => {
        const params = {
          eventType: "rmLayer",
          count: 1,
          layer: [
            { id: data.id, sceneId: data.sceneId, pageId: this.currentPageId,}
          ],
          sessionID: this.sessionId,
          checkKey: this.getcheckKey()
        }
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      });

      // 图层锁定状态
      this.$root.bus.$off('layerActive');
      this.$root.bus.$on('layerActive', (data) => {
        if(!data.freeze) {
          $('#layer'+data.id).draggable('destroy');
          $('#layer'+data.id).resizable('destroy');
        }
        const params = {
          eventType: "setLayerFreeze",
          count: 1,
          layer: [
            { 
              id: data.id,
              freeze: data.freeze ? 0 : 1
            }
          ],
          sceneId: data.sceneId,
          pageId: this.currentPageId,
          sessionID: this.sessionId,
          checkKey: this.getcheckKey()
        }
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      });

      // 显示aoi事件
      this.$root.bus.$off('aoiEvent');
      this.$root.bus.$on('aoiEvent', (data) => {
        this.containerList.some(item => {
          if (item.containerId == data.parentId) {
            item.signalList.forEach(signal => {
              if (signal.signalId === data.signalId) {
                signal.aoi.status = true;
                this.aoiData = signal.aoi;
              } else {
                signal.aoi.status = false;
              }
            });
            this.$nextTick(() => {
              this.signalAOIDraggable();
              this.signalAOIResize();
            })
          }
        });
        this.bankList.some((item, index) => {
          if(index == this.bankIndex) {
            item.containers = this.containerList;
            return true;
          }
        })
        this.$store.dispatch('setBankList', this.bankList);
      });
      // 关闭aoi
      this.$root.bus.$off('closeAoi');
      this.$root.bus.$on('closeAoi', (data) => {
        this.containerList.some(item => {
          if (item.containerId == data.parentId) {
            item.signalList.map((layer, index) => {
              if (layer.signalId == data.id) {
                layer.aoi.status = false;
                this.aoiData = layer.aoi;
              }
            })
            return true;
          }
        });
        this.bankList.some((item, index) => {
          if(index == this.bankIndex) {
            item.containers = this.containerList;
            return true;
          }
        })
        this.$store.dispatch('setBankList', this.bankList);
      });
      // 底部设置图层信息
      this.$root.bus.$off('setLayerInfo');
      this.$root.bus.$on('setLayerInfo', (data) => {
        // websocket 准备
        const params = {
          eventType: "setLayer",
          count: 1,
          layer: [
            {
              id: data.id,
              cropPosX: data.cropPosX,
              cropPosY: data.cropPosY,
              cropSizeW: data.cropSizeW,
              cropSizeH: data.cropSizeH,
              scalePosX: Number(data.scalePosX),
              scalePosY: Number(data.scalePosY),
              scaleSizeW: Number(data.scaleSizeW),
              scaleSizeH: Number(data.scaleSizeH), 
              inputPort:  data.inputPort,
              containerId: data.contaienrId,
              layerAlpha: Number(data.alpha),
              index: data.index,
              sceneId: data.sceneId,
              pageId: this.currentPageId
            }
          ],
          sessionID: this.sessionId,
          checkKey: this.getcheckKey()
        } 
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      });
    },

    // 读取容器配置信息
    readContainerMsg() {
      const params = {
        eventType: "readContainerMsg",
        checkKey: this.getcheckKey(),
        sessionID: this.sessionId
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    // 获取显示器列表
    readOutputList() {
      const randoms = this.getcheckKey();
      const params = {
        eventType: "readOutputList",
        sessionID: this.sessionId,
        checkKey: randoms
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    // 读取图层列表
    readSceneMsg() {
      const randoms = this.getcheckKey();
      const params = {
        eventType: "readSceneMsg",
        sessionID: this.sessionId,
        checkKey: randoms
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    // 读取左侧信号列表
    getSignalList() {
      const params = {
        eventType: "readInputSignalList",
        sessionID: this.sessionId,
        checkKey: this.getcheckKey('readInputSignalList')
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    // 容器中所填充显示器
    setOutputList(containerId) {
      const list = this.outputList.filter(item => item.status == true && item.containerId == containerId);
      return list;
    },
    // 容器中对应的图层
    setLayerList(layerList, containerId) {
      const list = layerList.filter(item => item.containerId == containerId);
      return list;
    },
    // 可设置图层id
    layerIdList() {
      let existDisplays = []; // 已创建显示器
      const existContainers = this.containerList; // 已创建容器
      existContainers.map(cItem => {
        existDisplays.push(this.setOutputList(cItem.containerId));
      });
      existDisplays = existDisplays.flat(Infinity);
      // 已存在显示器
      existDisplays.map(dItem => {
        for(let i = Number(dItem.id)*4; i < (Number(dItem.id) + 1)*4; i++) {
          this.layerIds.push(i);
        }
      });
    },
    // 信号放置
    signalInitDroppable() {
      const that = this;
      $(".displayer-view").droppable({
        accept: '.signal-item',
        drop: function(event, ui) {
          
          // 图层index设置: 
          let layerIndexList = [];
          that.currentLayerList.map(item => {
            layerIndexList.push(item.index);
          });
          const minIndex = Math.min(...layerIndexList);
          let indexArr = [];
          for(let i = 0; i <= 95; i++) {
            indexArr.push(i);
          }
          indexArr.reverse();

          let createIndex = null;
          if (minIndex <= 95 && minIndex >= 0 ) {
            indexArr.some(index => {
              if(index == minIndex) {
                createIndex = minIndex - 1;
                return true;
              } else if(!indexArr.includes(index)) {
                createIndex = index;
                return true;
              }
            })
          } else {
            createIndex = 95;
          }

          // 设置当前创建图层id
          let usedLayerIds = []; // 使用过的图层id
          that.currentLayerList.map(item => {
            usedLayerIds.push(item.id);
          });

          const dropOutputId = $(this).attr('id'); // 放置输出口id
          const dropContainerId = $(this).attr('containerId'); // 放置容器id
          const dropOutput = that.outputList.find(item => item.id == dropOutputId); // 放置输出口
          const dropContainerOutputs = that.outputList.filter(item => item.status == true && item.containerId == dropContainerId);// 放置容器输出口集合
          const signalFormat = $(ui.draggable[0]).attr('format');
          // 根据输出口id设置图层id
          let dropContainerLayerIds = []; // 放置容器可设置图层id集合
          dropContainerOutputs.map(item => {
            let cLayerId = (item.id + 1) * 4;
            for(let i = cLayerId - 4; i < cLayerId; i++) {
              dropContainerLayerIds.push(i);
            }
          });
          
          dropContainerLayerIds.some(item => {
            if(!usedLayerIds.includes(item)){
              const cropW = that.layerCropConversation(Number(signalFormat)).cropW;
              const cropH = that.layerCropConversation(Number(signalFormat)).cropH;
              const params = {
                eventType: "setLayer",
                count: 1,
                layer: [
                  {
                    id: item,
                    cropPosX: 0,
                    cropPosY: 0,
                    cropSizeW: cropW,
                    cropSizeH: cropH,
                    scalePosX: dropOutput.posX,
                    scalePosY: dropOutput.posY,
                    scaleSizeW: dropOutput.sizeW,
                    scaleSizeH: dropOutput.sizeH, 
                    inputPort:  Number($(ui.draggable[0]).attr('id')),
                    containerId: Number(dropContainerId),
                    index: createIndex,
                    layerAlpha: 128,
                    sceneId: that.currentSceneId,
                    pageId: that.currentPageId
                  }
                ],
                sessionID: that.sessionId,
                checkKey: that.getcheckKey()
              }
              // websocket 准备
              if (window.webSocket && window.webSocket.readyState == 1) {
                window.webSocket.send(JSON.stringify(params));
              }
              return true;
            }
          });
        }
      })
    },
    // 信号图层拖拽
    layerDraggable(layerId) {
      const that = this;
      $('#layer' + layerId).draggable({
        scroll: false,
        zIndex: 100,
        drag: function(event, ui) {
          // console.log($(this).attr('layerId'));
          // if(that.layerObj) {
          //   that.layerObj.scalePosX = Math.round(ui.position.left * 10);
          //   that.layerObj.scalePosY = Math.round(ui.position.top * 10);
          // }
          // that.outsideLayerObj.scalePosX = Math.round(ui.position.left * 10);
          // that.outsideLayerObj.scalePosY = Math.round(ui.position.top * 10);
        },
        stop: function(event, ui) {
          // 被移动的图层
          const layerId = $(this).attr('layerId');
          const mvLayer = that.currentLayerList.find(item => item.id == layerId);
          
          // websocket 准备
          const params = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: mvLayer.id,
                cropPosX: mvLayer.cropPosX,
                cropPosY: mvLayer.cropPosY,
                cropSizeW: mvLayer.cropSizeW,
                cropSizeH: mvLayer.cropSizeH,
                scalePosX: Math.round(ui.position.left * 10),
                scalePosY: Math.round(ui.position.top * 10),
                scaleSizeW: mvLayer.scaleSizeW,
                scaleSizeH: mvLayer.scaleSizeH, 
                inputPort:  mvLayer.inputPort,
                containerId: mvLayer.containerId,
                layerAlpha: mvLayer.alpha,
                index: mvLayer.index,
                sceneId: that.currentSceneId,
                pageId: that.currentPageId
              }
            ],
            sessionID: that.sessionId,
            checkKey: that.getcheckKey()
          } 
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
          }
        }
      });
      
    },
    // 信号图层缩放
    layerResize(layerId) {
      const that = this;
      $('#layer' + layerId).resizable({
        minWidth: 32,
        minHeight: 32,
        start: function(event, ui) {
          console.log('???');
          const id = $(this).attr('layerId');
          const scaleLayer = that.currentLayerList.find(item => item.id == id);
          that.layerObj = scaleLayer;
          that.$store.commit('setSelectedLayerId', scaleLayer.id);
        },
        resize: function(event, ui) {
          that.layerObj.scaleSizeW = Math.round(ui.size.width * 10);
          that.layerObj.scaleSizeH = Math.round(ui.size.height * 10);
          that.outsideLayerObj.scaleSizeW = Math.round(ui.size.width * 10);
          that.outsideLayerObj.scaleSizeH = Math.round(ui.size.height * 10);
        },
        stop: function(event, ui) {
          const id = $(this).attr('layerId');
          const scaleLayer = that.currentLayerList.find(item => item.id == id);
         
          // websocket 准备
          const params = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: scaleLayer.id,
                cropPosX: scaleLayer.cropPosX,
                cropPosY: scaleLayer.cropPosY,
                cropSizeW: scaleLayer.cropSizeW,
                cropSizeH: scaleLayer.cropSizeH,
                scalePosX: scaleLayer.scalePosX,
                scalePosY: scaleLayer.scalePosY,
                scaleSizeW: Math.round(ui.size.width * 10),
                scaleSizeH: Math.round(ui.size.height * 10), 
                inputPort:  scaleLayer.inputPort,
                containerId: scaleLayer.containerId,
                layerAlpha: scaleLayer.alpha,
                index: scaleLayer.index,
                sceneId: that.currentSceneId,
                pageId: that.currentPageId
              }
            ],
            sessionID: that.sessionId,
            checkKey: that.getcheckKey()
          }
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
          }
        }
      })
    },
    changeInput(e, type) {
      let val = e.target.value.trim().replace(/\D/ig, '');
      if(type == 'layerPosX') {
        this.outsideLayerObj.scalePosX = val; 
      }
      if(type == 'layerPosY') {
        this.outsideLayerObj.scalePosY = val; 
      }
      if(type == 'layerWidth') {
        this.outsideLayerObj.scaleSizeW = val; 
      }
      if(type == 'layerHeight') {
        this.outsideLayerObj.scaleSizeH = val; 
      }
      if(type == 'layerCropX') {
        this.outsideLayerObj.cropPosX = val; 
      }
      if(type == 'layerCropY') {
        this.outsideLayerObj.cropPosY = val; 
      }
      if(type == 'layerCropW') {
        this.outsideLayerObj.cropSizeW = val; 
      }
      if(type == 'layerCropH') {
        this.outsideLayerObj.cropSizeH = val; 
      }
    },
     // 右侧设置按钮事件
    setData() {
      const index = this.typeIndex;
      const layerObj = this.layerObj;
      if(layerObj) {
        if(index == 0 || index == 1) {
          const params = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: layerObj.id,
                cropPosX: Number(this.outsideLayerObj.cropPosX),
                cropPosY: Number(this.outsideLayerObj.cropPosY),
                cropSizeW: Number(this.outsideLayerObj.cropSizeW),
                cropSizeH: Number(this.outsideLayerObj.cropSizeH),
                scalePosX: Number(this.outsideLayerObj.scalePosX),
                scalePosY: Number(this.outsideLayerObj.scalePosY),
                scaleSizeW: Number(this.outsideLayerObj.scaleSizeW),
                scaleSizeH: Number(this.outsideLayerObj.scaleSizeH), 
                inputPort:  layerObj.inputPort,
                containerId: layerObj.containerId,
                layerAlpha: Number(this.outsideLayerObj.alpha),
                index: layerObj.index,
                sceneId: this.layerObj.sceneId,
                pageId: this.currentPageId
              }
            ],
            sessionID: this.sessionId,
            checkKey: this.getcheckKey()
          } 
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
          }
        }
      }
    },
    // 图层crop值映射
    layerCropConversation(format) {
      switch(format) {
        case 0:
        case 1:
          return { cropW: 720, cropH: 480 };
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          return { cropW: 1280, cropH: 720 };
          break;
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 38:
        case 39:
          return { cropW: 1920, cropH: 1080 };
          break;
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 85:
        case 86:
        case 91:
          return { cropW: 3840, cropH: 2160 };
          break;
        case 127:
          return { cropW: 0, cropH: 0 };
          break;
      }
    },

    // 输入预监
    previewPictureEvent(value) {
      if(value) {
        this.clipMedia(4, 6);
        this.$nextTick(() => {
          // 信号列表画面显示
          let signalCanvas = []; // 信号列表画布
          let layerCanvas = []; // 图层画布
  
          // 信号列表画布
          if(this.sryj) {
            $('.signal-box canvas').each(function() {
              signalCanvas.push($(this)[0]);
            });
            this.renderImg(signalCanvas, 'signal');
          }
          // 容器图层画布
          if(this.tcyj) {
            $('.signal-layer-item canvas').each(function() {
              layerCanvas.push($(this)[0]);
            });
            this.renderImg(layerCanvas, 'layer');
          }
        })
      } else {
        this.animationSignal.map(item => {
          cancelAnimationFrame(item);
        });
        this.animationLayer.map(item => {
          cancelAnimationFrame(item);
        });
        this.animationScene.map(item => {
          cancelAnimationFrame(item);
        });
        this.animationSignal = [];
        this.animationLayer = [];
        this.animationScene = [];
      }
    },
    // 画面绘制函数
    renderImg(data, type) {
      let img = new Image();
      img.src = 'http://192.168.0.117:5005/?action=stream';
      img.onload = () => renderUi();
      let renderUi = () => {
        let animationFrameId = -1;
        data.forEach((canvas, index) => {
          const context = canvas.getContext('2d');
          const inputPort = Number($(canvas).attr('inputPort'));
          animationFrameId = inputPort;

          if(this.clipList[inputPort]) {
            context.drawImage(img, this.clipList[inputPort].left, this.clipList[inputPort].top, 320, 270, 0, 0, canvas.width, canvas.height);
          }
        });
        if(type == 'signal') {
          this.animationSignal[animationFrameId] = requestAnimationFrame(renderUi);
        }
        if(type == 'layer') {
          this.animationLayer[animationFrameId] = requestAnimationFrame(renderUi);
        }
        if(type == 'scene') {
          this.animationScene[animationFrameId] = requestAnimationFrame(renderUi);
        }
      }
    },
    // 场景切换
    changeBank (scene, index){
      this.currentSceneId = scene.id;
      this.currentLayerList = scene.layer;
      this.animationLayer.map(item => cancelAnimationFrame(item));
      this.animationLayer = [];
      this.$nextTick(() => {
        this.currentLayerList.map(item => {
          if(!item.freeze) {
            this.layerDraggable(item.id); // 图层拖拽初始化
            this.layerResize(item.id); // 图层缩放初始化
          }
          let layerCanvas = [];
          if(this.tcyj && this.h264) {
            $('.signal-layer-item canvas').each(function() {
              layerCanvas.push($(this)[0]);
            });
            this.renderImg(layerCanvas, 'layer');
          }
        })
      });
      // 直切场景
      let containers = [];
      this.containerList.map(item => {
        const sceneC = {
          id: item.containerId,
          takeType: 2,
          alpha: 128
        }
        containers.push(sceneC);
      })
      const params = {
        eventType: 'setTakeSetting',
        sceneId: scene.id,
        container: containers,
        count: containers.length,
        pageId: this.currentPageId,
        checkKey: this.getcheckKey(),
        sessionID: this.sessionId
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    // 顶部图层移动操作
    layerOrderEvent(type) {
      // 置前
      if(type == 'before') {}
      // 置后
      if(type == 'after') {}
      // 置顶
      if(type == 'top') {}
      // 置底
      if(type == 'bottom') {}
    },
   
    // 分割流媒体
    clipMedia(row, col) {
      let clips = [];
      for (let i = 0; i < row; i ++) {
        for (let j = 0; j < col; j ++) {
          clips.push(
            {
              left: j * ( 1920 / col),
              top: i * (1080 / row),
            }
          );
        }
      }
      this.clipList = clips;
    },
    
    // 生成随机随机checkKey
    getcheckKey() {
      let arr = new Array;
      const arr1 = new Array("0","1","2","3","4","5","6","7","8","9");
      let nonceStr=''
      for(var i=0; i<8; i++){
        var n = Math.floor(Math.random()*10);
        arr[i] = arr1[n] ;
        nonceStr += arr1[n];
      }
      return parseInt(nonceStr);
    },
    // 分辨率转换
    conversationFormate(id) {
      const list = format.formatList;
      const formatObj = list.find(item => item.id == id);
      return formatObj.label;
    },
    // 克隆
    deepCopy(obj) {
      let _obj = JSON.stringify(obj);
      let obj2 = JSON.parse(_obj);
      return obj2;
    },
    paramsEvent(num) {
      this.leftIndex = num;
    },
    // 容器参数类型切换
    typeSelect(num) {
      this.typeIndex = num;
    },
    // 设置bank内容器样式
    setContainerStyle(item) {
      return {
        'width': item.sizeW / 100 + 'px',
        'height': item.sizeH / 100 + 'px',
        'top': item.posY / 10 + 'px',
        'left': item.posX / 10 + 'px'
      }
    },
    setSignalStyle(item) {
      return {
        'width': item.scaleSizeW / 100 + 'px',
        'height': item.scaleSizeH / 100 + 'px',
        'top': item.scalePosY / 100 + 'px',
        'left': item.scalePosX / 100 + 'px'
      }
    },
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    // 容器显示与否
    eyeStatus(target) {
      this.containerList.some((item, index) => {
        if(item.id == target.id) {
          this.$set(item, 'status', item.status ? false : true);
          return true;
        }
      })
    },
    // 容器区域拖拽
    draggableInit() {
      const that = this;
      $('.layer-cont .container-box').draggable({
        containment: [-Infinity,-Infinity,Infinity,Infinity],
        scroll: false,
        stop: function(event, ui) {
         
        }
      });
    },
    // 左侧信号拖拽
    signalInitDraggable() {
      const that = this;
      $('.signal-item').draggable({
        helper: 'clone',
      });
    },
    
    // aoi图层拖拽初始化
    signalAOIDraggable() {
      const that = this;
      $(".aoi").draggable({
        scroll: false,
        stop: function(event, ui) {
          let changeSitem = changeCitem.signalList.find(item => item.signalId == sid);
          const cid = $(this).attr('cId');
          const sid = $(this).attr('sId');
          const changeCitem = that.containerList.find(item => item.containerId == cid);
          changeSitem.aoi.position = ui.position;
          that.$nextTick(() => {
            that.signalAOIDraggable();
            that.signalAOIResize();
          });

        //   const setLayerParams = {
        //     eventType: "setLayer",
        //     count: 1,
        //     layer: [
        //       {
        //         id: changeSitem.signalId,
        //         cropPosX: changeSitem.cropX,
        //         cropPosY: changeSitem.cropY,
        //         cropSizeW: changeSitem.aoi.width * 20, 
        //         cropSizeH: changeSitem.aoi.height * 20,
        //         scalePosX: changeSitem.realPos.left,
        //         scalePosY: changeSitem.realPos.left,
        //         scaleSizeW: changeSitem.sizeW,
        //         scaleSizeH: changeSitem.sizeH, 
        //         inputPort:  changeSitem.inputPort,
        //         containerId: Number(changeSitem.parentId),
        //         layerAlpha: changeSitem.layerAlpha,
        //         index: changeSitem.order
        //       }
        //     ],
        //     sessionID: that.sessionId,
        //     checkKey: that.getcheckKey('setLayer')
        //   }
        //   // websocket 准备
        //   if (window.webSocket && window.webSocket.readyState == 1) {
        //     window.webSocket.send(JSON.stringify(setLayerParams));
        //   }
        //   window.webSocket.onmessage = function(res) {
        //     const resData = JSON.parse(res.data);
        //     if(resData.code == 200 && resData.data.eventType == 'setLayer' && resData.checkKey == that.setLayerCheckKey) {
        //       that.$nextTick(() => {
        //         that.signalAOIDraggable();
        //         that.signalAOIResize();
        //       });
        //     }
        //   }
        }
      })
    },
    signalAOIResize() {
      const that = this;
      $(".aoi").resizable({
        maxWidth: 500,
        maxHeight: 500,
        resize: function(event, ui) {
          const cid = $(this).attr('cId');
          const sid = $(this).attr('sId');
          const changeCitem = that.containerList.find(item => item.containerId == cid);
          let changeSitem = changeCitem.signalList.find(item => item.signalId == sid);
          changeSitem.aoi.width = ui.size.width;
          changeSitem.aoi.height = ui.size.height;
          that.$nextTick(() => {
            that.signalAOIDraggable();
            that.signalAOIResize();
          });
        },
        stop: function(event, ui) {
          const cid = $(this).attr('cId');
          const sid = $(this).attr('sId');
          const changeCitem = that.containerList.find(item => item.containerId == cid);
          let changeSitem = changeCitem.signalList.find(item => item.signalId == sid);
          changeSitem.aoi.width = ui.size.width;
          changeSitem.aoi.height = ui.size.height;
          that.$nextTick(() => {
            that.signalAOIDraggable();
            that.signalAOIResize();
          });
          // const setLayerParams = {
          //   eventType: "setLayer",
          //   count: 1,
          //   layer: [
          //     {
          //       id: changeSitem.signalId,
          //       cropPosX: Math.round(changeSitem.position.left * 20),
          //       cropPosY: changeSitem.position.top * 20,
          //       cropSizeW: ui.size.width * 20, 
          //       cropSizeH: Math.floor(ui.size.height * 20),
          //       scalePosX: changeSitem.realPos.left,
          //       scalePosY: changeSitem.realPos.left,
          //       scaleSizeW: changeSitem.sizeW,
          //       scaleSizeH: changeSitem.sizeH, 
          //       inputPort:  changeSitem.inputPort,
          //       containerId: Number(changeSitem.parentId),
          //       layerAlpha: changeSitem.layerAlpha,
          //       index: changeSitem.order
          //     }
          //   ],
          //   sessionID: that.sessionId,
          //   checkKey: that.getcheckKey('setLayer')
          // }
          // // websocket 准备
          // if (window.webSocket && window.webSocket.readyState == 1) {
          //   window.webSocket.send(JSON.stringify(setLayerParams));
          // }
          // window.webSocket.onmessage = function(res) {
          //   const resData = JSON.parse(res.data);
          //   if(resData.code == 200 && resData.data.eventType == 'setLayer' && resData.checkKey == that.setLayerCheckKey) {
              
          //     that.$nextTick(() => {
          //       that.signalAOIDraggable();
          //       that.signalAOIResize();
          //     });
          //   }
          // }

        }
      })
    },
    // 显示器可放置信号数
    isOverlap(signal, display) {
      const signalX = signal.position.left;
      const signalY = signal.position.top;
      const signalW = signal.customFeature.wBase;
      const signalH = signal.customFeature.hBase;
      const displayX = display.position.left;
      const displayY = display.position.top;
      const displayW = display.customFeature.wBase;
      const displayH = display.customFeature.hBase;
      if (
          ( Math.round(signalX + signalW) <= Math.round(displayX) )
          || ( Math.round( signalY + signalH) <= Math.round(displayY) )
          || ( Math.round(signalX) >= Math.round(displayX + displayW) )
          || ( Math.round(signalY) >= Math.round(displayY + displayH) ) 
        ) {
            return false;
          }
        return true;
    }
  },
  destroyed() {
    this.animationSignal.map(item => {
      cancelAnimationFrame(item);
    });
    this.animationLayer.map(item => {
      cancelAnimationFrame(item);
    });
    this.animationScene.map(item => {
      cancelAnimationFrame(item);
    });
    this.animationSignal = [];
    this.animationLayer = [];
    this.animationScene = [];
  },
  watch: {
    layerObj: {
      deep: true,
      handler(value) {
        this.layerObj = value;
      }
    },
    // outsideLayerObj: {
    //   deep: true,
    //   handler(value) {
    //     this.layerObj = value;
    //   }
    // },
    h264(val) {
      this.$store.commit('setCtrolSwitch', val);
    },
    sryj(val) {
      this.$store.commit('setSignalSwitch', val);
    },
    tcyj(val) {
      this.$store.commit('setLayerSwitch', val);
    },
    cjyj(val) {
      this.$store.commit('setSceneSwitch', val);
    }
  }
}
</script>

<style scoped lang='less'>
  .layer-wrap {
    position: relative;
    display: flex;
    flex: 1;
    background: rgb(27,36,54);
    color: #fff;
    flex-direction: column;
    .position-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      border-radius: 4px;
      position: absolute;
      top: 8px;
      left: 40%;
      width: 200px;
      height: 32px;
      background: rgb(22,28,44);
      z-index: 101;
      span {
        cursor: pointer;
      }
    }
    .section {
      display: flex;
      flex: 1;
      .left-view {
        width: 192px;
        height: 100%;
        background: rgb(22,28,44);
        border-left: 1px solid #000;
        z-index: 99;
        .params-type {
          position: relative;
          overflow: hidden;
          width: 192px;
          height: 24px;
          border-top: 1px solid #000;
          white-space: nowrap;
          /deep/.el-scrollbar {
            height: 100%;
            .el-scrollbar__wrap {
              overflow-x: hidden;
              overflow-y: hidden;
              width: 100%;
              div {
                display: inline-block;
                width: 64px;
                height: 24px;
                line-height: 24px;
                flex-shrink: 0;
                border-left: 1px solid #000;
                border-bottom: 1px solid #000;
                text-align: center;
                color: #999;
                font-size: 12px;
                box-sizing: border-box;
                background: rgb(24,30,44);
              }
              .show {
                position: relative;
                background: rbg(22,28,44);
                color: #fff;
                border-bottom: none;
              }
              .show::before {
                display: block;
                content: '';
                position: absolute;
                width: 100%;
                height: 1px;
                top: 0;
                background: rgb(26,188,156);
              }
            }
          }
        }
        .params-conts {
          overflow: auto;
          height: calc(100vh - 120px);
        }
        .params-conts::-webkit-scrollbar {
          display: none;
        }
        .container-list-item {
          display: flex;
          height: 24px;
          padding: 0 12px;
          justify-content: space-between;
          align-items: center;
          color: #999;
          font-size: 12px;
          > .container-name {
            display: flex;
            align-items: center;
            img {
              margin-right: 12px;
            }
          }
          > img {
            display: block;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        }
        .layer-list-item {
          display: flex;
          height: 24px;
          align-items: center;
          span {
            display: flex;
            align-items: center;
            flex: 1;
            padding-left: 8px;
            color: rgb(153,153,153);
            font-size: 12px;
            img {
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
          }
        }
        
        .signal-item {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          color: #999;
          font-size: 12px;
          cursor: move;
          .order {
            width: 16px;
          }
          .signal-icon {
            width: 50px;
            margin-right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .green-text {
            color: rgb(26,188,156);
          }
        }
        .signal-item:hover {
          color: #fff;
          background: #162C37;
        }
        .deep {
          background: #161C2C;
        }
        .shallow {
          background: #181F30;
        }
      }
      .layer-cont {
        display: flex;
        overflow: hidden;
        position: relative;
        flex: 1;
        .container-box {
          // position: relative;
          flex: 1;
          background: rgb(18, 24 36);
        }
      }
      .right-view {
        position: relative;
        width: 320px;
        height: calc(100% - 148px);
        background: rgb(22,28,44);
        border-left: 1px solid #000;
        .params-type {
          position: relative;
          width: 320px;
          height: 32px;
          border-top: 1px solid #000;
          white-space: nowrap;
          /deep/.el-scrollbar {
            height: 100%;
            .el-scrollbar__wrap {
              overflow-x: hidden;
              overflow-y: hidden;
              width: 100%;
              div {
                display: inline-block;
                width: 100px;
                height: 32px;
                line-height: 32px;
                flex-shrink: 0;
                border-right: 1px solid #000;
                border-bottom: 1px solid #000;
                text-align: center;
                color: #999;
                font-size: 12px;
                box-sizing: border-box;
                background: rgb(24,30,44);
              }
              .show {
                position: relative;
                background: rgb(22,28,44);
                color: #fff;
                border-bottom: none;
              }
              .show::before {
                display: block;
                content: '';
                position: absolute;
                width: 100px;
                height: 1px;
                top: 0;
                background: rgb(26,188,156);
              }
            }
          }
        }
        .params-conts {
          padding: 0 12px;
          .params-obj,
          .params-style,
          .params-style-input {
            display: flex;
            align-items: center;
            font-size: 12px;
            /deep/ .el-radio__input.is-checked .el-radio__inner {
              border-color: #1ABC9C;
              background: #1ABC9C;
            }
            /deep/ .el-radio__input.is-checked+.el-radio__label {
              color: #1ABC9C;
            }
          }
          .params-obj {
            height: 36px;
            span {
              width: 80px;
            }
            div {
              color: rgb(26,169,143);
            }
          }
          .params-style {
            height: 28px;
            color: rgb(8,159,186);
          }
          .params-style-input {
            margin-top: 10px;
            > span {
              width: 80px;
            }
            > input {
              width: 120px;
              border: 1px solid rgb(52,73,94);
              border-radius: 4px;
              background: rgb(22,28,44);
              padding: 6px 8px;
              color: #fff;
              font-size: 12px;
              outline: none;
              appearance: none;
            }
            > .input-group {
              display: flex;
              align-items: center;
              input {
                width: 32px;
                padding: 5px;
                border-radius: 4px;
                border: 1px solid rgb(52,73,94);
                background: rgb(22,28,44);
                outline: none;
                appearance: none;
                color: #fff;
                font-size: 12px;
              }
              span {
                margin: 0 4px;
              }
            }
            .input-group-mac {
              display: flex;
              align-items: center;
              input {
                width: 20px;
                padding: 5px;
                border-radius: 4px;
                border: 1px solid rgb(52,73,94);
                background: rgb(22,28,44);
                outline: none;
                appearance: none;
                color: #fff;
                font-size: 12px;
              }
            }
            input:focus {
              border: 1px solid rgb(26,188,156)
            }
            /deep/ .el-input__inner {
              height: 30px;
            }
            /deep/ .el-input__icon {
              line-height: 30px;
            }
            > .network-url {
              flex: 1;
            }
            > .net-set {
              width: 48px;
              height: 24px;
              background: #1ABC9C;
              margin-left: 8px;
              border-radius: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              font-size: 12px;
              cursor: pointer;
            }
            > .default {
              width: 48px;
              height: 24px;
              background: #ccc;
              margin-left: 8px;
              border-radius: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              font-size: 12px;
              cursor: pointer;
            }
          }
        }
        .params-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-top: 1px solid #333;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          > div {
            width: 90px;
            height: 24px;
            margin-right: 12px;
            border-radius: 12px;
            line-height: 24px;
            text-align: center;
            background: rgb(26,188,156);
            color: #fff;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
      .bank-view {
        overflow-x: auto;
        position: absolute;
        height: 148px;
        bottom: 54px;
        left: 200px;
        right: 0;
        background: rgb(22,28,44);
        z-index: 99;
        .bank-box {
          display: flex;
          .bank-item {
            width: 182px;
            .bank-head {
              height: 24px;
              line-height: 24px;
              text-align: center;
              color: #fff;
              font-size: 12px;
            }
            .bank-cont {
              position: relative;
              width: 178px;
              height: 102px;
              border-width: 2px;
              border-style: solid;
              .signalContainer-item {
                position: absolute;
                background: #3F455E;
                .signal-layer {
                  position: absolute;
                  background: rgba(255, 255, 255, 0.5);
                }
              }
              .sel-model {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(23, 76, 78, 0.4);
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                  display: block;
                  width: 32px;
                  height: 32px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>