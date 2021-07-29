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
        <div class="params-type" v-dragscroll>
          <div class="flex-box">
            <div style="border-left:none" :class="leftIndex == 0 ? 'show' : ''" @click="paramsEvent(0)">容器</div>
            <div :class="leftIndex == 1 ? 'show' : ''" @click="paramsEvent(1)">图层</div>
            <div :class="leftIndex == 2 ? 'show' : ''" @click="paramsEvent(2)">信号</div>
          </div>
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
          <div v-show="leftIndex == 1"></div>
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
                  v-if="item.format != 127"
                >
                  <span class="order">{{item.inputPort}}</span>
                  <div class="signal-icon">
                    <img src="../../assets/default/HDMI.png" alt="" v-if="(item.inputType == 53 || item.inputType == 11)">
                    <img src="../../assets/default/HDBaseT.png" alt="" v-if="item.inputType == 32">
                    <img src="../../assets/default/SDI_12G.png" alt="" v-if="item.inputType == 25">
                    <img src="../../assets/default/DVI.png" alt="" v-if="(item.inputType == 1) || (item.inputType == 16) || (item.inputType == 21)">
                    <img src="../../assets/default/HDMI1.4.png" alt="" v-if="item.inputType == 22">
                    <img src="../../assets/default/HDMI2.0.png" alt="" v-if="item.inputType == 24">
                    <img src="../../assets/default/DP1.2.png" alt="" v-if="(item.inputType == 23) || (item.inputType == 35)">
                  </div>
                  <span :class="item.format != 127 ? 'green-text' : ''">{{conversationFormate(item.format)}}</span>
                </div>
                <canvas
                  width="192"
                  height="108"
                  class="movie"
                  :format="item.format"
                  :inputPort="item.inputPort"
                  v-if="sryj && h264 && item.format != 127 && index < 8"
                ></canvas>
                <!-- <div
                  class="movie"
                  v-if="h264"
                  :style="signalClipList[index] ? signalClipList[index] : signalClipList[0]"
                ></div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="layer-cont">
        <div class="container-box">
          <!-- <LayerContainer
            v-for="(item, index) in containerList" :key="index"
            :cItem="item"
            :signalLayers="item.signalList"
            :index="index"
            :id="item.id"
            :style="{borderColor: item.id == (selectedContainer && selectedContainer.id) ? 'red' : ''}"
            :signalModelShow="true"
            :clipList="clipList"
          >
            <Aoi
              :aoi="aoiData"
              :cId="item.containerId"
            />
          </LayerContainer> -->
          <LayerContainer
            v-for="(item, index) in containerList" :key="index"
            :cItem="item"
            :output="setOutputList(item.containerId)"
            :layerList="setLayerList(item.containerId)"
          >
          </LayerContainer>
        </div>
      </div>
      <div class="right-view" v-if="!showInfo && nowMenuId == '004'">
        <div class="params-type" v-dragscroll>
          <div class="flex-box">
            <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">缩放</div>
            <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">裁剪</div>
            <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">H264 Demo</div>
            <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">流媒体</div>
          </div>
        </div>
        <div class="params-conts">
          <div v-if="typeIndex == 0">
            <div class="params-obj">
              <span>信号源</span>
              <div>信号 16</div>
            </div>
            <div class="params-obj">
              <span>图层序号</span>
              <div>图层 9</div>
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
              <div>图层 9</div>
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
                  v-for="layer in item.layer"
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
    <!-- <video :src="streamMedia" alt="" v-show="true" /> -->
    
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
      animationList: [],
      sessionId: ''
    }
  },
  components: {
    LayerContainer,
    Aoi,
    BottomParams
  },
  created() {
    // const ip = JSON.parse(window.sessionStorage.getItem("ip"));
    // // this.streamMedia = `http://${ip}:5005/?action=stream`;
    // this.streamMedia = 'http://192.168.0.204:5005/?action=stream';
    // let img = new Image();
    // // img.src = `http://${ip}:5005/?action=stream`;
    // img.src = 'http://192.168.0.204:5005/?action=stream';
    // this.imgObj = img;
    // // 分割流媒体（4行6列）
    // this.clipMedia(2, 2);
    
    // this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId"));
    // this.getSignalList();
    // const bankListData = this.$store.state.bankList;
    // const bankStoreVal = this.$store.state.bankIndex;
    // const instanceData = this.$store.state.showVessels;
    // bankListData.some((item, index) => {
    //   if(item.containers) { // 存在拷贝容器
    //     item.containers.forEach((containerInfo, containerIndex) => {
    //       // 是否存在显示管理已删除容器，如果存在则删除
    //       const havedContainer = instanceData.find(showCitem => showCitem.containerId == containerInfo.containerId);
    //       if(!havedContainer) {
    //         item.containers.splice(containerIndex, 1);
    //       }
    //       // 是否删除容器中的显示器
    //       containerInfo.content.map((disInfo, disIndex) => {
    //         const referContainer = instanceData.find(item => item.containerId == containerInfo.containerId);
    //         if(referContainer) {
    //           const disObj = referContainer.content.find(dItem => dItem.displayId == disInfo.displayId);
    //           if(!disObj) {
    //             containerInfo.content.splice(disIndex, 1);
    //           }
    //         }
    //       });
    //     });
        
    //     // 显示管理可能修改容器数据，重新拷贝
    //     instanceData.forEach((showCitem) => {
    //       const copyObj = item.containers.find(copyCitem => copyCitem.containerId == showCitem.containerId);
    //       if(copyObj) { // 重新拷贝已存在容器信息
    //         copyObj.signalList.forEach(sItem => {
    //           Object.assign(sItem.customFeature, showCitem.customFeature);
    //           sItem.aoi.width = showCitem.customFeature.wBase;
    //           sItem.aoi.height = showCitem.customFeature.hBase;
    //         });
    //         Object.assign(copyObj, {position: showCitem.position}, {customFeature: showCitem.customFeature});
    //         Object.assign(copyObj.content, showCitem.content); // 拷贝显示器数据
    //         copyObj.content.map(dItem => dItem.intersectList = []);
    //       }else { // 拷贝显示管理新添加容器
    //         item.containers.push(this.deepCopy(showCitem))
    //       }
    //     });
    //   } else { // 初次拷贝显示管理容器数据
    //     item.containers = this.deepCopy(instanceData);
    //   }
    // });
    // this.containerList = bankListData[bankStoreVal].containers;
    // this.containerList.map(item => {
    //   if(item.signalList.length > 0) {
    //     item.signalList.map(sItem => {
    //       sItem.aoi.status = false;
    //       item.content.map(dItem => {
    //         if (this.isOverlap(sItem, dItem)) {
    //           dItem.signalNum = dItem.signalNum - 1;
    //           dItem.intersectList.push(sItem);
    //         }
    //       });
    //     });
    //   } else {
    //     item.content.map(dItem => {
    //       dItem.intersectList = [];
    //     });
    //   }
    // })

    // this.$store.dispatch('setBankList', bankListData);

    // this.$nextTick(() => {
    //   this.layerDraggable();
    //   this.layerResize();
    // });
  },
  mounted() {
    this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId"));
    this.init();
    this.readContainerMsg(); // 读取容器配置信息
    this.readOutputList(); // 读取输出口列表
    this.readLayerMsg(); // 读取图层列表
    this.getSignalList();

    this.draggableInit(); // 容器区域拖拽
    this.signalInitDraggable(); // 信号列表拖拽
    this.signalInitDroppable(); // 信号放置
    
    // websocket接收到的消息
    const that = this;
    window.webSocket.onmessage = function(res) {
      const result = JSON.parse(res.data);
      // 获取容器
      if((result.code == 200) && (result.data.eventType == 'readContainerMsg')) {
        if (result.data.count > 0) {
          that.containerList = result.data.container;
        } else {
          that.containerList = [];
        }
      }
      // 获取显示器（输出口）列表
      if((result.code == 200) && (result.data.eventType == 'readOutputList')) {
        that.outputList = result.data.output;
        // 可设置图层id集合
        that.layerIdList();
        that.$nextTick(() => {
          that.signalInitDroppable();
        });
      }
      // 获取图层列表数据
      if((result.code == 200) && (result.data.eventType == 'readLayerMsg')) {
        that.sceneList = result.data.scene;
        that.currentSceneId = result.data.currentSceneId;
        that.currentPageId = result.data.currentPageId;
        that.currentLayerList = result.data.scene[result.data.currentSceneId].layer;
        that.$nextTick(() => {
          that.currentLayerList.map(item => {
            if(!item.freeze) {
              that.layerDraggable(item.id); // 图层拖拽初始化
              that.layerResize(item.id); // 图层缩放初始化
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
        that.readLayerMsg();
      }
      // 删除图层成功回调
      if((result.code == 200) && (result.data.eventType == 'rmLayer')) {
        that.readLayerMsg();
        that.layerObj = null;
      }
      // 图层冻结操作
      if((result.code == 200) && (result.data.eventType == 'setLayerFreeze')) {
        that.readLayerMsg();
      }
    }
    
  },
  computed: {
    ...mapState([
      'bankList',
      'bankIndex',
      'outputModelInfo'
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
        this.outsideLayerObj = layer;
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
            { id: data.id }
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
    readLayerMsg() {
      const randoms = this.getcheckKey();
      const params = {
        eventType: "readLayerMsg",
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
    setLayerList(containerId) {
      const list = this.currentLayerList.filter(item => item.containerId == containerId);
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
          // 设置当前创建图层id
          let usedLayerIds = []; // 使用过的图层id
          let layerId = null;
          that.currentLayerList.map(item => {
            usedLayerIds.push(item.id);
          });
          if(usedLayerIds.length > 0) {
            that.layerIds.some(id => {
              if(!usedLayerIds.includes(id)) {
                layerId = id;
                return true;
              }
            })
          } else {
            layerId = that.layerIds[0];
          }
          // 图层index设置: 
          let layerIndexList = [];
          that.currentLayerList.map(item => {
            layerIndexList.push(item.index);
          });
          const maxOrder = Math.max(...layerIndexList);
          const indexArr = [];
          for(let i = 1; i <= maxOrder; i++) {
            indexArr.push(i);
          }

          let createIndex = null;
          if (maxOrder >= 1) {
            indexArr.some(index => {
              if(index == maxOrder) {
                createIndex = maxOrder + 1;
                return true;
              } else if(!indexArr.includes(index)) {
                createIndex = index;
                return true;
              }
            })
          } else {
            createIndex = 1;
          }

          const dropOutputId = $(this).attr('id'); // 放置输出口id
          const dropContainerId = $(this).attr('containerId'); // 放置容器id
          const dropOutput = that.outputList.find(item => item.id == dropOutputId); // 放置输出口
          
          const params = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: layerId,
                cropPosX: 0,
                cropPosY: 0,
                cropSizeW: dropOutput.sizeW,
                cropSizeH: dropOutput.sizeH,
                scalePosX: dropOutput.posX,
                scalePosY: dropOutput.posY,
                scaleSizeW: dropOutput.sizeW,
                scaleSizeH: dropOutput.sizeH, 
                inputPort:  Number($(ui.draggable[0]).attr('id')),
                containerId: Number(dropContainerId),
                index: createIndex,
                layerAlpha: 128,
                sceneId: that.sceneId,
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
        }
      })
    },
    // 信号图层拖拽
    layerDraggable(layerId) {
      const that = this;
      $('#layer' + layerId).draggable({
        scroll: false,
        zIndex: 100,
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
                scalePosY: ui.position.top * 10,
                scaleSizeW: mvLayer.scaleSizeW,
                scaleSizeH: mvLayer.scaleSizeH, 
                inputPort:  mvLayer.inputPort,
                containerId: mvLayer.containerId,
                layerAlpha: mvLayer.layerAlpha,
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
      const scaleLayer = that.currentLayerList.find(item => item.id == layerId);
      this.layerObj = scaleLayer;
      this.outsideLayerObj = scaleLayer;
      $('#layer' + layerId).resizable({
        minWidth: 32,
        minHeight: 32,
        resize: function(event, ui) {

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
                scaleSizeW: ui.size.width * 10,
                scaleSizeH: ui.size.height * 10, 
                inputPort:  scaleLayer.inputPort,
                containerId: scaleLayer.containerId,
                layerAlpha: scaleLayer.alpha,
                index: scaleLayer.index,
                sceneId: that.sceneId,
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

    // 输入预监
    previewPictureEvent(value) {
      this.animationList.map(item => cancelAnimationFrame(item));
      this.animationList = [];
      this.$nextTick(() => {
        // 信号列表画面显示
        let signalCanvas = []; // 信号列表画布
        let layerCanvas = []; // 图层画布

        // 信号列表画布
        if(value && this.sryj) {
          $('.signal-box canvas').each(function() {
            signalCanvas.push($(this)[0]);
          });
          let img = new Image();
          img.src = this.streamMedia;
          img.onload = () => renderImg();
          let renderImg = () => {
            signalCanvas.forEach((canvas, index) => {
              const context = canvas.getContext('2d');
              const inputPort = Number($(canvas).attr('inputPort'));
              context.drawImage(img, this.clipList[inputPort].left, this.clipList[inputPort].top, 960,540, 0, 0, 192, 108);
            });
            let signalAnimateId = requestAnimationFrame(renderImg);
            this.animationList.push(signalAnimateId);
          }
        }
        // 容器图层画布
        if(value && this.tcyj) {
          $('.signal-layer-item canvas').each(function() {
            layerCanvas.push($(this)[0]);
          });
          let img = new Image();
          img.src = this.streamMedia;
          img.onload = () => renderImg();
          let renderImg = () => {
            layerCanvas.forEach((canvas, index) => {
              const context = canvas.getContext('2d');
              const inputPort = Number($(canvas).attr('inputPort'));
              context.drawImage(img, this.clipList[inputPort].left, this.clipList[inputPort].top, 960,540, 0, 0, 192, 108);
            });
            let layerAnimateId = requestAnimationFrame(renderImg);
            this.animationList.push(layerAnimateId);
          }
        }
      })
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
      let allcrops = [];
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
      allcrops.push(clips);
      allcrops.push(clips);
      this.clipList = allcrops.flat();
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
    conversationFormate(formate) {
      switch (formate) {
        case 0:
          return '720x480@60';
          break;
        case 10:
          return '1920x1080@60';
          break;
        case 76:
          return '3840x2160@60';
          break;
        case 127:
          return 'Not Input';
          break;
      }
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
        'top': item.posX / 10 + 'px',
        'left': item.posY / 10 + 'px'
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
    changeBank (scene, index){
      this.currentSceneId = scene.id;
      this.currentLayerList = scene.layer;
      this.$nextTick(() => {
        this.currentLayerList.map(item => {
          if(!item.freeze) {
            this.layerDraggable(item.id); // 图层拖拽初始化
            this.layerResize(item.id); // 图层缩放初始化
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
        checkKey: this.getcheckKey(),
        sessionID: this.sessionId
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
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
  watch: {
    layerObj: {
      deep: true,
      handler(value) {
        this.outsideLayerObj = value;
      }
    },
    outsideLayerObj: {
      deep: true,
      handler(value) {
        this.layerObj = value;
      }
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
          .flex-box {
            display: flex;
            div {
              display: inline-block;
              width: 33.3%;
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
          overflow: hidden;
          width: 320px;
          height: 32px;
          border-top: 1px solid #000;
          .flex-box {
            position: absolute;
            display: flex;
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
              background: rbg(22,28,44);
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