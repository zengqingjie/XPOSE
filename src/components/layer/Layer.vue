<template>
  <div class="layer-wrap">
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
                >
                  <span class="order">{{item.inputPort}}</span>
                  <div class="signal-icon">
                    <img src="../../assets/default/HDBaseT.png" alt="" v-if="item.inputType == 32">
                    <img src="../../assets/default/SDI_12G.png" alt="" v-if="item.inputType == 25">
                    <img src="../../assets/default/DVI.png" alt="" v-if="(item.inputType == 1) || (item.inputType == 16) || (item.inputType == 21)">
                    <img src="../../assets/default/HDMI1.4.png" alt="" v-if="item.inputType == 22">
                    <img src="../../assets/default/HDMI2.0.png" alt="" v-if="item.inputType == 24">
                    <img src="../../assets/default/DP1.2.png" alt="" v-if="(item.inputType == 23) || (item.inputType == 35)">
                  </div>
                  <span>{{conversationFormate(item.format)}}</span>
                </div>
                <div
                  class="movie"
                  v-if="h264"
                  :style="signalClipList[index] ? signalClipList[index] : signalClipList[0]"
                ></div>
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
              <input type="text" v-model="opacityVal">
            </div>
            <hr style="border: 1px solid #000">
            <div class="params-style">位置</div>
            <div class="params-style-input">
              <span>X</span>
              <input type="text" v-model="positionX">
            </div>
            <div class="params-style-input">
              <span>Y</span>
              <input type="text" v-model="positionY">
            </div>
            <div class="params-style-input">
              <span>宽度</span>
              <input type="text" v-model="sourceW">
            </div>
            <div class="params-style-input">
              <span>高度</span>
              <input type="text" v-model="sourceH">
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
              <input type="text" v-model="positionX">
            </div>
            <div class="params-style-input">
              <span>Y</span>
              <input type="text" v-model="positionY">
            </div>
            <div class="params-style-input">
              <span>宽度</span>
              <input type="text" v-model="sourceW">
            </div>
            <div class="params-style-input">
              <span>高度</span>
              <input type="text" v-model="sourceH">
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
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="params-footer">
          <div v-if="typeIndex == 2">保存</div>
          <div v-if="typeIndex == 2">设置</div>
          <div @click="hideRightView">返回</div>
        </div>
      </div>
      <div class="bank-view">
        <div class="bank-box">
          <div class="bank-item"
            v-for="(item, index) in bankList"
            :key="index"
            @click="changeBank(item, index)"
          >
            <div class="bank-head" :style="{background:item && item.headColor}">bank{{index + 1}}</div>
            <div class="bank-cont" :style="{borderColor:item && item.headColor}">
              <div
                class="signalContainer-item"
                v-for="(cItem) in item.containers"
                :key="cItem.id"
                :style="setContainerStyle(cItem)"
              >
                <div
                  class="signal-layer"
                  v-for="layer in cItem.signalList"
                  :key="layer.id"
                  :style="setSignalStyle(layer)"
                ></div>
              </div>
              <div class="sel-model" v-if="index == bankIndex">
                <img src="../../assets/bank_show.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <img :src="streamMedia" alt="" v-show="false" id="hideImg"> -->
    
    <BottomParams/>
  </div>
</template>

<script>
import $ from "jquery";
import LayerContainer from '@/components/container/LayerContainer';
import Aoi from '@/components/displayer/Aoi';
import { mapState } from 'vuex';
import { dataFormat } from '../../utils/dataFormat';
import BottomParams from '@/components/BottomParams';
import { Signal } from '../widget/layer.model';
export default {
  props: ['showInfo', 'nowMenuId'],
  data() {
    return {
      leftIndex: 2, // 容器、图层、信号参数
      typeIndex: 0, // 右侧菜单参数类型
      containerList: [], // 容器
      signalList: [], // 信号
      signalId: '',
      selectedContainer: null,
      positionX: '',
      positionY: '',
      sourceW: '',
      sourceH: '',
      opacityVal: '',
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
      sessionId: '', // 会话列表
      readInputSignalListCheckKey: null,// 获取信号列表随机key
      setLayerCheckKey: null,//设置图层随机key
      rmLayerCheckKey: null, //删除图层随机key
      setLayerFreezeCheckKey: null, // 冻结图层随机key
      streamMedia: '',
      layerIds: [], // 创建图层可以用id
      clipList: [], // 流媒体切割列表
      imgObj: null
    }
  },
  components: {
    LayerContainer,
    Aoi,
    BottomParams
  },
  created() {
    const ip = JSON.parse(window.sessionStorage.getItem("ip"));
    this.streamMedia = `http://${ip}:4080/?action=stream`;
    let img = new Image();
    img.src = `http://${ip}:4080/?action=stream`;
    this.imgObj = img;
    // 分割流媒体（3行8列）
    this.clipMedia(4, 4);
    
    this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId"));
    this.getSignalList();
    const bankListData = this.$store.state.bankList;
    const bankStoreVal = this.$store.state.bankIndex;
    const instanceData = this.$store.state.showVessels;
    bankListData.some((item, index) => {
      if(item.containers) { // 存在拷贝容器
        item.containers.forEach((containerInfo, containerIndex) => {
          // 是否存在显示管理已删除容器，如果存在则删除
          const havedContainer = instanceData.find(showCitem => showCitem.containerId == containerInfo.containerId);
          if(!havedContainer) {
            item.containers.splice(containerIndex, 1);
          }
          // 是否删除容器中的显示器
          containerInfo.content.map((disInfo, disIndex) => {
            const referContainer = instanceData.find(item => item.containerId == containerInfo.containerId);
            if(referContainer) {
              const disObj = referContainer.content.find(dItem => dItem.displayId == disInfo.displayId);
              if(!disObj) {
                containerInfo.content.splice(disIndex, 1);
              }
            }
          });
        });
        
        // 显示管理可能修改容器数据，重新拷贝
        instanceData.forEach((showCitem) => {
          const copyObj = item.containers.find(copyCitem => copyCitem.containerId == showCitem.containerId);
          if(copyObj) { // 重新拷贝已存在容器信息
            copyObj.signalList.forEach(sItem => {
              Object.assign(sItem.customFeature, showCitem.customFeature);
              sItem.aoi.width = showCitem.customFeature.wBase;
              sItem.aoi.height = showCitem.customFeature.hBase;
            });
            Object.assign(copyObj, {position: showCitem.position}, {customFeature: showCitem.customFeature});
            Object.assign(copyObj.content, showCitem.content); // 拷贝显示器数据
            copyObj.content.map(dItem => dItem.intersectList = []);
          }else { // 拷贝显示管理新添加容器
            item.containers.push(this.deepCopy(showCitem))
          }
        });
      } else { // 初次拷贝显示管理容器数据
        item.containers = this.deepCopy(instanceData);
      }
    });
    this.containerList = bankListData[bankStoreVal].containers;
    this.containerList.map(item => {
      if(item.signalList.length > 0) {
        item.signalList.map(sItem => {
          sItem.aoi.status = false;
          item.content.map(dItem => {
            if (this.isOverlap(sItem, dItem)) {
              dItem.signalNum = dItem.signalNum - 1;
              dItem.intersectList.push(sItem);
            }
          });
        });
      } else {
        item.content.map(dItem => {
          dItem.intersectList = [];
        });
      }
    })

    this.$store.dispatch('setBankList', bankListData);
    this.$nextTick(() => {
      this.signalLayerDraggable();
      this.signalLayerResize();
      // 初始化绘制流媒体画面
      let img = new Image();
      img.src = this.streamMedia;
      let canvasBoxs = [];
      $('.signal-layer-item canvas').each(function() {
        canvasBoxs.push($(this)[0]);
      });
      img.onload = () => {
        canvasBoxs.forEach((canvas, index) => {
          const context = canvas.getContext('2d');
          const inputPort = Number($(canvas).attr('inputPort'));
          window.setInterval(() => {
          context.drawImage(img, this.clipList[inputPort-1].left, this.clipList[inputPort-1].top, 480, 270, 0, 0, 192, 108);
        }, 1000 / 60)
        })
      }
    });
  },
  mounted() {
    this.draggableInit();
    this.signalInitDraggable();
    this.signalInitDroppable();
    this.signalLayerDraggable();
    this.signalLayerResize();
    // 可设置图层id集合
    this.layerIdList();
    // 标识当前操作的容器
    this.$root.bus.$off('setSelectedContainer');
    this.$root.bus.$on('setSelectedContainer', (data) => {
      this.selectedContainer = data;
    });
    // 信号全屏
    this.$root.bus.$off('fullScreen');
    this.$root.bus.$on('fullScreen', (data) => {
      const container = dataFormat.getWidget(data.parentId);
      const { col, row, wBase, hBase, zoom } = container.customFeature;
      this.containerList.some(item => {
        if (item.id == data.parentId) {
          item.signalList.some((layer, index) => {
            if (layer.signalId == data.signalId) {
              if(layer.full) {
                layer.customFeature.wBase = layer.fullBeforeWbase;
                layer.customFeature.hBase = layer.fullBeforeHbase;
                layer.position.top = layer.fullBeforeTop;
                layer.position.left = layer.fullBeforeLeft;
                layer.full = false;
              } else {
                this.$set(layer, 'fullBeforeWbase', layer.customFeature.wBase);
                this.$set(layer, 'fullBeforeHbase', layer.customFeature.hBase);
                this.$set(layer, 'fullBeforeTop', layer.position.top);
                this.$set(layer, 'fullBeforeLeft', layer.position.left);
                layer.customFeature.wBase = col * wBase * zoom.xRadio;
                layer.customFeature.hBase = row * hBase * zoom.yRadio;
                layer.position.top = 0;
                layer.position.left = 0;
                layer.full = true;
              }
              return true;
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
    // 信号图层删除
    this.$root.bus.$off('deleteLayer');
    this.$root.bus.$on('deleteLayer', (data) => {
      const vm = this;
      const rmLayerParams = {
        eventType: "rmLayer",
        count: 1,
        layer: [
          { id: data.signalId }
        ],
        sessionID: this.sessionId,
        checkKey: this.getcheckKey('rmLayer')
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(rmLayerParams));
      }
      window.webSocket.onmessage = function(res) {
        const result = JSON.parse(res.data);
        if(result.code == 200 && result.data.eventType == 'rmLayer' && result.checkKey == vm.rmLayerCheckKey) {
          
          // 所删图层所属容器
          const moveBelongContainer = vm.containerList.find(cItem => cItem.containerId == data.parentId); 
          // 被删除的图层
          const moveLayer = moveBelongContainer.signalList.find(layer => layer.signalId == data.signalId); 
          const moveLayerIndex = moveBelongContainer.signalList.findIndex(layer => layer.signalId == data.signalId); 
          moveBelongContainer.signalList.splice(moveLayerIndex, 1);

          moveBelongContainer.content.map(display => {
            display.intersectList = display.intersectList.filter(iItem => iItem.signalId != data.signalId);
          });

         
          vm.bankList.some((item, index) => {
            if(index == vm.bankIndex) {
              item.containers = vm.containerList;
              return true;
            }
          })
          vm.$store.dispatch('setBankList', vm.bankList);
        }
      }

    });

    // 图层锁定状态
    this.$root.bus.$off('layerActive');
    this.$root.bus.$on('layerActive', (data) => {

      const vm = this;
      const rmLayerParams = {
        eventType: "setLayerFreeze",
        count: 1,
        layer: [
          { 
            id: data.sId,
            freeze: data.status ? 1 : 0
          }
        ],
        sessionID: this.sessionId,
        checkKey: this.getcheckKey('setLayerFreeze')
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(rmLayerParams));
      }
      window.webSocket.onmessage = function(res) {
        const result = JSON.parse(res.data);
        if(result.code == 200 && result.data.eventType == 'setLayerFreeze' && result.checkKey == vm.setLayerFreezeCheckKey) {
          vm.containerList.some(item => {
            if (item.containerId == data.cId) {
              item.signalList.some((layer, index) => {
                if (layer.signalId == data.sId) {
                  layer.layerLock = data.status;
                  return true;
                }
              })
              return true;
            }
          });
          vm.bankList.some((item, index) => {
            if(index == vm.bankIndex) {
              item.containers = vm.containerList;
              return true;
            }
          })
          vm.$store.dispatch('setBankList', vm.bankList);
          if(data.status) {
            $('#' + data.id).draggable('destroy');
            $('#' + data.id).resizable('destroy');
          }else {
            vm.$nextTick(() => {
              vm.signalLayerDraggable();
              vm.signalLayerResize();
            })
          }
        }
      }

    });

    // 显示aoi事件
    this.$root.bus.$off('aoiEvent');
    this.$root.bus.$on('aoiEvent', (data) => {
      this.containerList.some(item => {
        if (item.containerId == data.parentId) {
          item.signalList.forEach(single => {
            if (single.signalId === data.signalId) {
              single.aoi.status = true;
              this.aoiData = single.aoi;
            } else {
              single.aoi.status = false;
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
  },
  computed: {
    ...mapState([
      'shareVessels',
      'editContainer',
      'bankList',
      'bankIndex'
    ]),
  },
  methods: {
    canvasDraw() {
      const canvas = document.querySelectorAll('.signal-layer-item')
    },
    // 可设置图层id
    layerIdList() {
      let existDisplays = [];
      const existContainers = this.$store.state.showVessels;
      existContainers.map(cItem => {
        if(cItem.content) {
          cItem.content.map(dItem => {
            existDisplays.push(dItem);
          })
        }
      });
      for (let i = 1; i <= existDisplays.length * 8; i++) {
        this.layerIds.push(i);
      }
    },
    // 分割流媒体
    clipMedia(row, col) {
      let clips = [];
      let signalClipList = [];
      for (let i = 0; i < row; i ++) {
        for (let j = 0; j < col; j ++) {
          clips.push(
            {
              left: j * ( 1920 / col),
              top: i * (1080 / row),
            }
          );
          signalClipList.push(
            {
              backgroundPositionX: -j * (1920 / col) + 'px' ,
              backgroundPositionY: -i * (1080 / row) + 'px',
              width: (1920 / col) + 'px',
              height: (1080 / row) + 'px',
              zoom: 192 / (1920 / col),
            }
          )
        }
      }
      this.clipList = clips;
      this.signalClipList = signalClipList;
    },
    // 读取左侧信号列表
    getSignalList() {
      const that = this;
      const readInputSignalListParams = {
        eventType: "readInputSignalList",
        sessionID: this.sessionId,
        checkKey: this.getcheckKey('readInputSignalList')
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(readInputSignalListParams));
      }
      window.webSocket.onmessage = function(res) {
        const result = JSON.parse(res.data);
        if((result.code == 200) && (result.data.eventType == 'readInputSignalList') && (result.checkKey == that.readInputSignalListCheckKey)) {
          that.signalList = result.data.inputSignal;
          that.$nextTick(() => {
            that.signalInitDraggable();
          });
        }
      }
    },
    // 生成随机随机checkKey
    getcheckKey(type) {
      let arr = new Array;
      const arr1 = new Array("0","1","2","3","4","5","6","7","8","9");
      let nonceStr=''
      for(var i=0; i<8; i++){
        var n = Math.floor(Math.random()*10);
        arr[i] = arr1[n] ;
        nonceStr += arr1[n];
      }
      switch (type) {
        case 'readInputSignalList': // 创建容器
          this.readInputSignalListCheckKey = parseInt(nonceStr);
          break;
        case 'setLayer':
          this.setLayerCheckKey = parseInt(nonceStr);
          break;
        case 'rmLayer':
          this.rmLayerCheckKey = parseInt(nonceStr);
          break;
        case 'setLayerFreeze':
          this.setLayerFreezeCheckKey = parseInt(nonceStr);
          break;
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
    // 设置bank内显示区域样式
    setContainerStyle(item) {
      const { row, col, wBase, hBase } = item.customFeature;
      const { left, top } = item.position;
      const width = col * wBase / 10;
      const height = row * hBase / 10;
      return {
        'width': width + 'px',
        'height': height + 'px',
        'top': top / 10 + 'px',
        'left': left / 10 + 'px'
      }
    },
    setSignalStyle(item) {
      const { row, col, wBase, hBase } = item.customFeature;
      const { left, top } = item.position;
      const width = wBase / 10;
      const height = hBase / 10;
      return {
        'width': width + 'px',
        'height': height + 'px',
        'top': top / 10 + 'px',
        'left': left / 10 + 'px'
      }
    },
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    changeBank (bank, index){
      this.$store.commit('setBankIndex', index);
      bank.containers.forEach(cItem => {
        cItem.content.forEach(display => {
          display.intersectList = []
        });
      });

      bank.containers.forEach(cItem => {
        if(cItem.signalList.length > 0) {
          cItem.signalList.forEach(sItem => {
            sItem.aoi.status = false;
            cItem.content.map(display => {
              if (this.isOverlap(sItem, display)) {
                display.intersectList.push(sItem);
              }
            });
          });
        }
      })
      this.containerList = bank.containers;
      this.aoiData = null;
      this.$nextTick(() => {
        this.containerList.map(item => {
          item.signalList.map(sItem => {
            if(!sItem.layerLock) {
              this.signalLayerDraggable();
              this.signalLayerResize();
            }
          })
        });
        // 初始化绘制流媒体画面
        let img = new Image();
        img.src = this.streamMedia;
        let canvasBoxs = [];
        $('.signal-layer-item canvas').each(function() {
          canvasBoxs.push($(this)[0]);
        });
        img.onload = () => {
          canvasBoxs.forEach((canvas, index) => {
            const context = canvas.getContext('2d');
            const inputPort = Number($(canvas).attr('inputPort'));
            window.setInterval(() => {
            context.drawImage(img, this.clipList[inputPort-1].left, this.clipList[inputPort-1].top, 480, 270, 0, 0, 192, 108);
          }, 1000 / 60)
          })
        }
      })
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
      const vm = this;
      $('.layer-cont .container-box').draggable({
        containment: [-Infinity,-Infinity,Infinity,Infinity],
        scroll: false,
        stop: function(event, ui) {
         
        }
      });
    },
    // 左侧信号拖拽
    signalInitDraggable() {
      const vm = this;
      $('.signal-item').draggable({
        helper: 'clone',
      });
    },
    // 信号放置
    signalInitDroppable() {
      const vm = this;
      $(".signal-model .signal-view").droppable({
        accept: '.signal-item',
        drop: function(event, ui) {
          // 设置当前创建图层id
          let usedLayerIds = []; // 使用过的图层id
          let layerId = null;
          vm.containerList.map(item => {
            item.signalList.map(sItem => {
              usedLayerIds.push(sItem.signalId);
            });
          });
          if(usedLayerIds.length > 0) {
            vm.layerIds.some(id => {
              if(!usedLayerIds.includes(id)) {
                layerId = id;
                return true;
              }
            })
          } else {
            layerId = 0;
          }

          let targetObj = null;
          const targetOutInputId = $(this).attr('outInputId');
          const targetContainerId = $(this).attr('containerId');
          vm.containerList.some(cItem => {
            if(cItem.containerId == targetContainerId) {
              cItem.content.map(dItem => {
                if(dItem.displayId == targetOutInputId) {
                  targetObj = dItem;
                }
              })
              return true;
            }
          });
          const setLayerParams = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: layerId,
                cropPosX: targetObj.realPos.left,
                cropPosY: targetObj.realPos.top,
                cropSizeW: targetObj.sizeW,
                cropSizeH: targetObj.sizeH,
                scalePosX: targetObj.realPos.left,
                scalePosY: targetObj.realPos.left,
                scaleSizeW: targetObj.sizeW,
                scaleSizeH: targetObj.sizeH, 
                inputPort:  $(ui.draggable[0]).attr('id'),
                containerId: targetContainerId
              }
            ],
            sessionID: vm.sessionId,
            checkKey: vm.getcheckKey('setLayer')
          }
          // websocket 准备
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(setLayerParams));
          }
          window.webSocket.onmessage = function(res) {
            const resData = JSON.parse(res.data);
            if(resData.code == 200 && resData.data.eventType == 'setLayer' && resData.checkKey == vm.setLayerCheckKey) {
              const r = Math.floor(Math.random()*256);
              const g = Math.floor(Math.random()*256);
              const b = Math.floor(Math.random()*256);
              const aoi = {
                status: false,
                position: targetObj.position,
                parentId: targetContainerId,
              };
              const signal = dataFormat.addWidget('signal', {
                parentId: targetContainerId,
                signalId: layerId,
                position: targetObj.position,
                signalIndex: Number($(ui.draggable[0]).attr('index')),
                bColor: `rgba(${r},${g},${b},0.6)`,
                layerLock: false,
                aoi,
                realPos: targetObj.realPos,
                sizeW: targetObj.sizeW,
                sizeH: targetObj.sizeH,
                inputPort: $(ui.draggable[0]).attr('id')
              });

              const nowContainer = vm.$store.state.showVessels.find(cItem => cItem.containerId == targetContainerId);
              signal.customFeature.wBase = nowContainer.customFeature.wBase;
              signal.customFeature.hBase = nowContainer.customFeature.hBase;
              signal.aoi.width = nowContainer.customFeature.wBase;
              signal.aoi.height = nowContainer.customFeature.hBase;
              signal.aoi.id = signal.signalId;
              dataFormat.setWidget(signal);
              vm.bankList[vm.bankIndex].containers.some(item => {
                if(item.containerId == targetObj.containerId) {
                  item.signalList.push(signal);
                  return true;
                }
              });
              vm.bankList[vm.bankIndex].containers.some(item => {
                if(item.containerId == targetObj.containerId) {
                  item.content.forEach(dItem => {
                    if (vm.isOverlap(signal, dItem)) {
                      dItem.signalNum = dItem.signalNum - 1;
                      dItem.intersectList.push(signal);
                    }
                  });
                  return true;
                }
              });
              vm.containerList = vm.bankList[vm.bankIndex].containers;
    
              vm.$nextTick(() => {
                vm.signalLayerDraggable();
                vm.signalLayerResize();
                // 初始化绘制流媒体画面
                
                const canvas = $('#'+signal.id).find('canvas')[0];

                const context = canvas.getContext('2d');
                window.setInterval(() => {
                  context.drawImage(vm.imgObj, vm.clipList[signal.inputPort - 1].left, vm.clipList[signal.inputPort - 1].top, 480, 270, 0, 0, 192, 108);
                }, 1000 / 60);
              })
              vm.$store.dispatch('setBankList', vm.bankList);
            }
          }
        }
      })
    },
    // 信号图层拖拽
    signalLayerDraggable() {
      const vm = this;
      $('.signal-layer-item').draggable({
        scroll: false,
        zIndex: 100,
        stop: function(event, ui) {
          // 被移动的图层
          const containerId = $(this).attr('containerId');
          const id = $(this).attr('id');
          const signalId = $(this).attr('signalId');
          let movedLayer = null;
          vm.containerList.some(cItem => {
            if(cItem.containerId == containerId) {
              movedLayer = cItem.signalList.find(sItem => sItem.signalId == signalId);
              return true;
            }
          })
          // websocket 准备
          const setLayerParams = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: movedLayer.signalId,
                cropPosX: movedLayer.realPos.left,
                cropPosY: movedLayer.realPos.top,
                cropSizeW: movedLayer.sizeW,
                cropSizeH: movedLayer.sizeH,
                scalePosX: Math.round(ui.position.left * 10),
                scalePosY: ui.position.top * 10,
                scaleSizeW: movedLayer.sizeW,
                scaleSizeH: movedLayer.sizeH, 
                inputPort:  movedLayer.inputPort,
                containerId: containerId
              }
            ],
            sessionID: vm.sessionId,
            checkKey: vm.getcheckKey('setLayer')
          } 
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(setLayerParams));
          }
          window.webSocket.onmessage = function(res) {
            const resData = JSON.parse(res.data);
            if(resData.code == 200 && resData.data.eventType == 'setLayer' && resData.checkKey == vm.setLayerCheckKey) {
              // 移动图层所属容器
              const moveBelongContainer = vm.containerList.find(cItem => cItem.containerId == containerId); 
              // 被移动的图层
              const moveLayer = moveBelongContainer.signalList.find(layer => layer.signalId == signalId); 
              // 改变图层位置信息
              moveLayer.position = ui.position;
              moveLayer.aoi.position = ui.position;
              moveLayer.realPos = {
                left: Math.round(ui.position.left * 10),
                top: ui.position.top * 10
              }
              // 重新判断图层相交显示器
              moveBelongContainer.content.map(display => {
                if(vm.isOverlap(moveLayer, display)) { // 判断是否相交
                  const isBelong = display.intersectList.find(iItem => iItem.signalId == moveLayer.signalId);
                  if(!isBelong) { // 移动前是否已相交
                    display.signalNum = display.signalNum - 1;
                    display.intersectList.push(moveLayer);
                  }
                } else {
                  const isBelong = display.intersectList.find(iItem => iItem.signalId == moveLayer.signalId);
                  if(isBelong) {
                    display.signalNum = display.signalNum + 1;
                    display.intersectList = display.intersectList.filter(iItem => iItem.signalId != moveLayer.signalId);
                  }
                }
              });
              vm.bankList.some((item, index) => {
                if(index == vm.bankIndex) {
                  item.containers = vm.containerList;
                  return true;
                }
              })
              vm.$store.dispatch('setBankList', vm.bankList);
            }
          }
         
        }
      })
    },
    // 信号图层缩放
    signalLayerResize() {
      const vm = this;
      $('.signal-layer-item').resizable({
        minWidth: 32,
        minHeight: 32,
        resize: function(event, ui) {
          const containerId = $(this).attr('containerId');
          const id = $(this).attr('id');
          const signalId = $(this).attr('signalId');
          vm.containerList.some(item => {
            if (item.containerId == containerId) {
              item.signalList.some((layer, index) => {
                if (layer.id == id) {
                  layer.customFeature.wBase = ui.size.width;
                  layer.customFeature.hBase = ui.size.height;
                  layer.sizeW = Math.floor(ui.size.width * 10);
                  layer.sizeH = ui.size.height * 10;
                  item.content.forEach(dItem => {
                    if (vm.isOverlap(layer, dItem)) {
                      const isBelong = dItem.intersectList.find(iItem => iItem === layer);
                      if(!isBelong) {
                        dItem.signalNum = dItem.signalNum - 1;
                        dItem.intersectList.push(layer);
                      }
                    } else {
                      const isBelong = dItem.intersectList.find(iItem => iItem === layer);
                      if(isBelong) {
                        dItem.signalNum = dItem.signalNum + 1;
                        const iItemIndex = dItem.intersectList.findIndex(iItem => iItem !== layer);
                        dItem.intersectList.splice(iItemIndex, 1);
                      }
                    }
                  })
                  return true;
                }
              })
              return true;
            }
          });
          vm.bankList.some((item, index) => {
            if(index == vm.bankIndex) {
              item.containers = vm.containerList;
              return true;
            }
          })
          vm.$store.dispatch('setBankList', vm.bankList);
        },
        stop: function(event, ui) {
          const containerId = $(this).attr('containerId');
          const id = $(this).attr('id');
          const signalId = $(this).attr('signalId');
          let movedLayer = null;
          vm.containerList.some(cItem => {
            if(cItem.containerId == containerId) {
              movedLayer = cItem.signalList.find(sItem => sItem.signalId == signalId);
              return true;
            }
          })
          // websocket 准备
          const setLayerParams = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: movedLayer.signalId,
                cropPosX: movedLayer.realPos.left,
                cropPosY: movedLayer.realPos.top,
                cropSizeW: movedLayer.sizeW,
                cropSizeH: movedLayer.sizeH,
                scalePosX: movedLayer.realPos.left,
                scalePosY: movedLayer.realPos.top,
                scaleSizeW: ui.size.width * 10,
                scaleSizeH: ui.size.height * 10, 
                inputPort:  movedLayer.inputPort,
                containerId: containerId
              }
            ],
            sessionID: vm.sessionId,
            checkKey: vm.getcheckKey('setLayer')
          } 
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(setLayerParams));
          }
          window.webSocket.onmessage = function(res) {
            const resData = JSON.parse(res.data);
            if(resData.code == 200 && resData.data.eventType == 'setLayer' && resData.checkKey == vm.setLayerCheckKey) {
              
              
              // 缩放图层所属容器
              const moveBelongContainer = vm.containerList.find(cItem => cItem.containerId == containerId); 
              // 被缩放的图层
              const moveLayer = moveBelongContainer.signalList.find(layer => layer.signalId == signalId); 
              // 改变图层信息
              moveLayer.customFeature.wBase = ui.size.width;
              moveLayer.customFeature.hBase = ui.size.height;
              moveLayer.sizeW = Math.floor(ui.size.width * 10);
              moveLayer.sizeH = ui.size.height * 10;
              // 重新判断图层相交显示器
              moveBelongContainer.content.map(display => {
                if(vm.isOverlap(moveLayer, display)) { // 判断是否相交
                  const isBelong = display.intersectList.find(iItem => iItem.signalId == moveLayer.signalId);
                  if(!isBelong) { // 移动前是否已相交
                    display.signalNum = display.signalNum - 1;
                    display.intersectList.push(moveLayer);
                  }
                } else {
                  const isBelong = display.intersectList.find(iItem => iItem.signalId == moveLayer.signalId);
                  if(isBelong) {
                    display.signalNum = display.signalNum + 1;
                    display.intersectList = display.intersectList.filter(iItem => iItem.signalId != moveLayer.signalId);
                  }
                }
              });

              vm.bankList.some((item, index) => {
                if(index == vm.bankIndex) {
                  item.containers = vm.containerList;
                  return true;
                }
              })
              vm.$store.dispatch('setBankList', vm.bankList);
            }
          }
        }
      })
    },
    // aoi图层拖拽初始化
    signalAOIDraggable() {
      const vm = this;
      $(".aoi").draggable({
        scroll: false,
        stop: function(event, ui) {
          const cid = $(this).attr('cId');
          const sid = $(this).attr('sId');
          const changeCitem = vm.containerList.find(item => item.containerId == cid);
          let changeSitem = changeCitem.signalList.find(item => item.signalId == sid);

          const setLayerParams = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: changeSitem.signalId,
                cropPosX: Math.round(ui.position.left * 10),
                cropPosY: ui.position.top * 10,
                cropSizeW: changeSitem.aoi.width * 10, 
                cropSizeH: changeSitem.aoi.height * 10,
                scalePosX: changeSitem.realPos.left,
                scalePosY: changeSitem.realPos.left,
                scaleSizeW: changeSitem.sizeW,
                scaleSizeH: changeSitem.sizeH, 
                inputPort:  changeSitem.inputPort,
                containerId: Number(changeSitem.parentId)
              }
            ],
            sessionID: vm.sessionId,
            checkKey: vm.getcheckKey('setLayer')
          }
          // websocket 准备
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(setLayerParams));
          }
          window.webSocket.onmessage = function(res) {
            const resData = JSON.parse(res.data);
            if(resData.code == 200 && resData.data.eventType == 'setLayer' && resData.checkKey == vm.setLayerCheckKey) {
              changeSitem.aoi.position = ui.position;
              vm.$nextTick(() => {
                vm.signalAOIDraggable();
                vm.signalAOIResize();
              });
            }
          }
        }
      })
    },
    signalAOIResize() {
      const vm = this;
      $(".aoi").resizable({
        maxWidth: 500,
        maxHeight: 500,
        resize: function(event, ui) {
          const cid = $(this).attr('cId');
          const sid = $(this).attr('sId');
          const changeCitem = vm.containerList.find(item => item.containerId == cid);
          let changeSitem = changeCitem.signalList.find(item => item.signalId == sid);
          changeSitem.aoi.width = ui.size.width;
          changeSitem.aoi.height = ui.size.height;
          vm.$nextTick(() => {
            vm.signalAOIDraggable();
            vm.signalAOIResize();
          });
        },
        stop: function(event, ui) {
          const cid = $(this).attr('cId');
          const sid = $(this).attr('sId');
          const changeCitem = vm.containerList.find(item => item.containerId == cid);
          let changeSitem = changeCitem.signalList.find(item => item.signalId == sid);
          const setLayerParams = {
            eventType: "setLayer",
            count: 1,
            layer: [
              {
                id: changeSitem.signalId,
                cropPosX: Math.round(changeSitem.position.left * 10),
                cropPosY: changeSitem.position.top * 10,
                cropSizeW: ui.size.width * 10, 
                cropSizeH: Math.floor(ui.size.height * 10),
                scalePosX: changeSitem.realPos.left,
                scalePosY: changeSitem.realPos.left,
                scaleSizeW: changeSitem.sizeW,
                scaleSizeH: changeSitem.sizeH, 
                inputPort:  changeSitem.inputPort,
                containerId: Number(changeSitem.parentId)
              }
            ],
            sessionID: vm.sessionId,
            checkKey: vm.getcheckKey('setLayer')
          }
          // websocket 准备
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(setLayerParams));
          }
          window.webSocket.onmessage = function(res) {
            const resData = JSON.parse(res.data);
            if(resData.code == 200 && resData.data.eventType == 'setLayer' && resData.checkKey == vm.setLayerCheckKey) {
              changeSitem.aoi.width = ui.size.width;
              changeSitem.aoi.height = ui.size.height;
              vm.$nextTick(() => {
                vm.signalAOIDraggable();
                vm.signalAOIResize();
              });
            }
          }

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
          width: 200px;
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
        }
        .movie {
          width: 100%;
          height: 108px;
          background: url('http://192.168.0.122:4080/?action=stream') no-repeat;
          background-size: 1920px 1080px;
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