<template>
  <div class="layer-wrap">
    <div class="left-view">
      <div class="params-type" v-dragscroll>
        <div class="flex-box">
          <div style="border-left:none" :class="leftIndex == 0 ? 'show' : ''" @click="paramsEvent(0)">容器</div>
          <div :class="leftIndex == 1 ? 'show' : ''" @click="paramsEvent(1)">图层</div>
          <div :class="leftIndex == 2 ? 'show' : ''" @click="paramsEvent(2)">信号</div>
        </div>
      </div>
      <div class="params-cont">
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
              class="signal-item"
              v-for="(item, index) in signalList"
              :key="item.id"
              :class="[index % 2 ? 'deep' : 'shallow', signalId == item.id ? 'show' : '']"
              :id="item.id"
              :type="item.type"
              :index="index"
            >
              <span class="order">{{index + 1}}</span>
              <div class="signal-icon">
                <img src="../../assets/default/H264.png" alt="" v-if="item.type == 'H264'">
                <img src="../../assets/default/HDBaseT.png" alt="" v-if="item.type == 'HDBaseT'">
                <img src="../../assets/default/CVBS.png" alt="" v-if="item.type == 'CVBS'">
                <img src="../../assets/default/SDI_12G.png" alt="" v-if="item.type == 'SDI_12G'">
                <img src="../../assets/default/DVI.png" alt="" v-if="item.type == 'DVI'">
                <img src="../../assets/default/HDMI1.4.png" alt="" v-if="item.type == 'HDMI14'">
                <img src="../../assets/default/HDMI2.0.png" alt="" v-if="item.type == 'HDMI20'">
                <img src="../../assets/default/DP1.2.png" alt="" v-if="item.type == 'DP12'">
                <img src="../../assets/default/HDMI.png" alt="" v-if="item.type == 'HDMI'">
                <img src="../../assets/default/SDI_D.png" alt="" v-if="item.type == 'SDI_D'">
              </div>
              <span>{{item.label}}</span>
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
          :aoiData="aoiData"
        />
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
              :style="setSignalStyle(cItem)"
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
</template>

<script>
import $ from "jquery";
import LayerContainer from '@/components/container/LayerContainer';
import { mapState } from 'vuex';
import { dataFormat } from '../../utils/dataFormat';
export default {
  props: ['showInfo', 'nowMenuId'],
  data() {
    return {
      leftIndex: 2, // 容器、图层、信号参数
      typeIndex: 0, // 右侧菜单参数类型
      containerList: [], // 容器
      layerList: [], // 图层
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
      aoiData: null
    }
  },
  components: {
    LayerContainer
  },
  created() {
    console.log(111);
    const signalList = [
      {
        id: 'XH_001',
        type: 'H264',
        label: '1920*1080@60',
      },
      {
        id: 'XH_002',
        type: 'HDBaseT',
        label: '1920*1080@60',
      },
      {
        id: 'XH_003',
        type: 'CVBS',
        label: '1920*1080@60',
      },
      {
        id: 'XH_004',
        type: 'SDI_12G',
        label: '1920*1080@60',
      },
      {
        id: 'XH_005',
        type: 'DVI',
        label: '1920*1080@60',
      },
      {
        id: 'XH_006',
        type: 'HDMI14',
        label: '1920*1080@60',
      },
      {
        id: 'XH_007',
        type: 'HDMI20',
        label: '1920*1080@60',
      },
      {
        id: 'XH_008',
        type: 'DP12',
        label: '1920*1080@60',
      },
      {
        id: 'XH_009',
        type: 'HDMI',
        label: '1920*1080@60',
      },
      {
        id: 'XH_010',
        type: 'SDI_D',
        label: '1920*1080@60',
      },
    ];
    this.signalList = signalList;

    const bankListData = this.$store.state.bankList;
    const bankStoreVal = this.$store.state.bankIndex;

    const instanceData = this.$store.state.showVessels;
    console.log(instanceData);
    bankListData.some(item => {
      if(item.containers) {
        item.containers.some((cItem, cIndex) => {
          cItem.position = instanceData[cIndex].position;
          cItem.customFeature = instanceData[cIndex].customFeature;
        })
      }else {
        item.containers = this.deepCopy(instanceData);
      }
    });
    this.containerList = bankListData[bankStoreVal].containers;
    this.containerList.some(item => {
      item.signalList.map(sItem => {
        sItem.aoi.status = false;
      })
    })
    this.$store.dispatch('setBankList', bankListData);
    this.$nextTick(() => {
      this.signalLayerDraggable();
      this.signalLayerResize();
    });
  },
  mounted() {
    this.draggableInit();
    this.signalInitDraggable();
    this.signalInitDroppable();
    this.signalLayerDraggable();
    this.signalLayerResize();
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
              console.log(layer);
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
      this.containerList.some(item => {
        if (item.id == data.parentId) {
          item.signalList.some((layer, index) => {
            if (layer.id == data.id) {
              item.signalList.splice(index, 1);
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

    // 图层锁定状态
    this.$root.bus.$off('layerActive');
    this.$root.bus.$on('layerActive', (data) => {
      this.containerList.some(item => {
        if (item.id == data.cId) {
          item.signalList.some((layer, index) => {
            if (layer.id == data.id) {
              layer.layerLock = data.status;
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
      if(data.status) {
        $('#' + data.id).draggable('destroy');
        $('#' + data.id).resizable('destroy');
      }else {
        this.$nextTick(() => {
          this.signalLayerDraggable();
          this.signalLayerResize();
        })
      }
    });

    // 显示aoi事件
    this.$root.bus.$off('aoiEvent');
    this.$root.bus.$on('aoiEvent', (data) => {
      this.containerList.some(item => {
        if (item.id == data.parentId) {
          item.signalList.map((layer, index) => {
            if (layer.id == data.id) {
              layer.aoi.status = layer.aoi.status ? false : true;
              this.aoiData = layer.aoi;
              this.$nextTick(() => {
                this.signalAOIDraggable();
                this.signalAOIResize();
              })
            } else {
              layer.aoi.status = false;
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
    // 关闭aoi
    this.$root.bus.$off('closeAoi');
    this.$root.bus.$on('closeAoi', (data) => {
      this.containerList.some(item => {
        if (item.id == data.parentId) {
          item.signalList.map((layer, index) => {
            if (layer.id == data.id) {
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
    setSignalStyle(item) {
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
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    changeBank (bank, index){
      this.containerList = bank.containers;
      this.$store.commit('setBankIndex', index)
      this.$nextTick(() => {
        this.containerList.map(item => {
          item.signalList.map(sItem => {
            if(!sItem.layerLock) {
              this.signalLayerDraggable();
              this.signalLayerResize();
            }
          })
        })
      })
    },
    // 容器显示与否
    eyeStatus(target) {
      this.containerList.some((item, index) => {
        if(item.id == target.id) {
          console.log(item[index]);
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
          const targetObj = dataFormat.getWidget($(this).attr('id'));
          const r = Math.floor(Math.random()*256);
          const g = Math.floor(Math.random()*256);
          const b = Math.floor(Math.random()*256);
          const aoi = {
            status: false,
            position: targetObj.position,
            parentId: targetObj.parentId,
          };
          const signal = dataFormat.addWidget('signal', {
            parentId: targetObj.parentId,
            signalId: $(ui.draggable[0]).attr('id'),
            position: targetObj.position,
            signalIndex: Number($(ui.draggable[0]).attr('index')),
            bColor: `rgba(${r},${g},${b},0.6)`,
            layerLock: false,
            aoi
          });

          const nowContainer = dataFormat.getWidget(targetObj.parentId);
          signal.customFeature.wBase = nowContainer.customFeature.wBase;
          signal.customFeature.hBase = nowContainer.customFeature.hBase;
          signal.aoi.width = nowContainer.customFeature.wBase;
          signal.aoi.height = nowContainer.customFeature.hBase;
          signal.aoi.id = signal.id;
          dataFormat.setWidget(signal);
          
          vm.bankList[vm.bankIndex].containers.some(item => {
            if(item.id == targetObj.parentId) {
              item.signalList.push(signal);
              return true;
            }
          })
          vm.containerList = vm.bankList[vm.bankIndex].containers;
          vm.$nextTick(() => {
            vm.signalLayerDraggable();
            vm.signalLayerResize();
          })
          vm.$store.dispatch('setBankList', vm.bankList);
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
          const containerId = $(this).attr('containerId');
          const signalId = $(this).attr('signalId');
          const id = $(this).attr('id');
          vm.containerList.some(item => {
            if (item.id == containerId) {
              item.signalList.some((layer, index) => {
                if (layer.id == id) {
                  layer.position = ui.position;
                  layer.aoi.position = ui.position;
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
          const signalId = $(this).attr('signalId');
          const id = $(this).attr('id');
          vm.containerList.some(item => {
            if (item.id == containerId) {
              item.signalList.some((layer, index) => {
                if (layer.id == id) {
                  layer.customFeature.wBase = ui.size.width;
                  layer.customFeature.hBase = ui.size.height;
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
        }
      })
    },
    // aoi图层拖拽初始化
    signalAOIDraggable() {
      const vm = this;
      let aoiData = this.aoiData;
      $(".aoi").draggable({
        scroll: false,
        stop: function(event, ui) {
          aoiData.position = ui.position;
          vm.aoiData = aoiData;
        }
      })
    },
    signalAOIResize() {
      const vm = this;
      let aoiData = this.aoiData;
      $(".aoi").resizable({
        maxWidth: 500,
        maxHeight: 500,
        resize: function(event, ui) {
          aoiData.width = ui.size.width;
          aoiData.height = ui.size.height;
          vm.aoiData = aoiData;
        }
      })
    },
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
    .left-view {
      width: 200px;
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
      overflow: auto;
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
      bottom: 0;
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
</style>