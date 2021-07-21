<template>
  <div class="manageShow-wrap">
    <div class="section">
      <div class="container-view">
        <div class="default-view" v-if="showVessels.length == 0">
          <div class="title">创建一个容器</div>
          <div class="tips-box">
            <div class="tips-item">
              <div>*<span>打开设置界面，选择模板设置选项</span></div>
              <em>-<span>选择容器模式</span></em>
              <em>-<span>选择容器分辨率</span> </em>
              <em>-<span>选择自动创建显示器</span> </em>
              <em>-<span>选择容器的行和列数</span> </em>
            </div>
            <div class="tips-item">
              <div>*<span>拖拉出容器列表到此处</span></div>
            </div>
            <div class="tips-item">
              <div>*<span>移动、配置这些显示器参数</span></div>
            </div>
          </div>
        </div>
        <div class="container-box" v-if="showVessels.length > 0">
          <Container
            v-for="(item, index) in showVessels" :key="index"
            :cItem="item"
            :index="index"
            :id="item.id"
            :style="{borderColor: item.id == (selectedContainer && selectedContainer.id) ? 'red' : ''}"
            :deviceId="selectedDisplayerId"
          />
        </div>

      </div>
      <div class="right-view" v-show="!showInfo && nowMenuId == '003'">
        <div class="params-type" v-dragscroll>
          <div class="flex-box">
            <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">模板</div>
            <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">显示器</div>
            <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">显示系统</div>
            <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">参数</div>
          </div>
        </div>
        <div class="params-conts">
          <div v-show="typeIndex == 0">
            <div class="input-view">
              <span>模式</span>
              <el-select v-model="modelVal" placeholder="请选择">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="input-view">
              <span>分辨率</span>
              <el-select v-model="separation" placeholder="请选择">
                <el-option
                  v-for="item in separationList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
              <div class="mar-left"><el-checkbox v-model="devideChecked">显示器</el-checkbox></div>
            </div>
            <div
              class="template-list"
            >
              <div class="template-item" v-for="(item, index) in templateList" :key="index" :id="item.id">
                <span class="index-text">{{index + 1}}</span>
                <div class="icon-view"></div>
                <span>{{item.row}} x {{item.col}} ({{separation == 10 ? (1920 * item.col) : (3840 * item.col)}} x {{separation == 10 ? (1080 * item.row) : (2160 * item.row)}})</span>
              </div>
            </div>
          </div>
          <div v-show="typeIndex == 1" class="box">
            <div class="displayer">
              <div
                class="displayer-item"
                :class="[index % 2 ? 'deep' :'shallow', item.status == true ? 'disable' : '', clickItemId == item.id ? 'show' : '']"
                :key = item.id
                v-for="(item, index) in displayerList"
                :id="item.id"
                @click="displayerClick(item)"
              >
                <div class="item-left">
                  <span class="id-text">{{item.id + 1}}</span>
                  <div class="icon-view"></div>
                  <span>{{item.outputType}}</span>
                </div>
                <div class="item-right">
                  <span>W:{{item.sizeW}}</span>
                  <span>H:{{item.sizeH}}</span>
                </div>

              </div>
            </div>
            <div v-if="displayerList.length == 0">无可用显示器</div>
          </div>
          <div v-show="typeIndex == 2">
            <template v-if="showVessels.length > 0">
              <div
                class="system-info"
                v-for="(item, index) in showVessels"
                :key="item.id"
              >
                <div class="sys-name">
                  <div class="left-view">
                    <span>{{index + 1}}</span>
                    <span class="text-view">{{item.name ? item.name : '显示容器'+ (index + 1)}}</span>
                    <input type="text" v-model="containerName" class="name-input">
                  </div>
                  <div class="right-view" @click="clickEdit"><i class="iconfont iconedit_name_icon" /></div>
                  <div class="right-view-sure" @click="(e) => sureEdit(e, item)"><i class="iconfont iconsure_edit" /></div>
                </div>
                <div class="info-box">
                  <span>X:{{item.position.left}}</span>
                  <span>Y:{{item.position.top}}</span>
                  <span>W:{{item.customFeature.col*1920}}</span>
                  <span>H:{{item.customFeature.row*1080}}</span>
                </div>
              </div>
            </template>
            <template v-if="showVessels.length == 0">
              <div class="empty-box">无已用容器</div>
            </template>
          </div>
          <div v-show="typeIndex == 3" style="padding: 0 12px">
            <div class="params-obj">
              <span>序号</span>
              <div>显示器xxxx</div>
            </div>
            <div class="params-style">缩放</div>
            <div class="params-style-input">
              <span>起始点X</span>
              <input type="text" v-model="startX" @input="(e) => changInput(e, 'startX')">
            </div>
            <div class="params-style-input">
              <span>起始点Y</span>
              <input type="text" :value="startY" @input="(e) => changInput(e, 'startY')">
            </div>
            <div class="params-style-input">
              <span>宽度</span>
              <input type="text" :value="displayerWidth" @input="(e) => changInput(e, 'dWidth')">
            </div>
            <div class="params-style-input">
              <span>高度</span>
              <input type="text" :value="displayerHeight" @input="(e) => changInput(e, 'dHeight')">
            </div>
            <div class="params-style">边框</div>
            <div class="params-style-input">
              <span>顶边框</span>
              <input type="text" v-model="vBorder">
            </div>
            <div class="params-style-input">
              <span>底边框</span>
              <input type="text" v-model="vBorder">
            </div>
            <div class="params-style-input">
              <span>左边框</span>
              <input type="text" v-model="hBorder">
            </div>
            <div class="params-style-input">
              <span>右边框</span>
              <input type="text" v-model="hBorder">
            </div>
          </div>
        </div>
        <div class="params-footer">
          <div v-if="typeIndex == 0">自定义</div>
          <div v-if="typeIndex == 2">清空全部</div>
          <div v-if="typeIndex == 3" @click="setDisplayProp">设置</div>
          <div @click="hideRightView">返回</div>
        </div>
      </div>
    </div>
    <BottomParams
      :display="displayObj"
    />
  </div>
</template>

<script>
import $ from "jquery";
import Container from '@/components/container/Container';
import { mapState } from 'vuex';
import { dataFormat } from '../../utils/dataFormat';
import { customActive } from '../../utils/custom_active';
import BottomParams from '@/components/BottomParams';
import globalWs from '@/utils/globalWs';
import Api from '../../utils/api';

export default {
  data() {
    return {
      containerList: [], // 容器列表
      typeIndex: 0, // 参数类型
      modelList: [
        { id: 0, label: '演示模式' , type: 'Presentation'},
        { id: 1, label: '预监模式' , type: 'Preview'},
        { id: 2, label: '矩阵模式' , type: 'Matrix'},
        { id: 3, label: '旋转模式' , type: 'Rotation'},
        { id: 4, label: '投影模式' , type: 'Blending'},
      ],  // 模式列表
      modelVal: 0, // 模式
      separationList: [
        { id: 10, label: '2k' },
        { id: 82, label: '4k' }
      ], // 分辨率列表
      separation: 10, // 分辨率
      devideChecked: true, // 容器是否创建显示器
      templateList: [
        { 
          id: '11',
          name: '显示容器1',
          row: 1,
          col: 1
        },
        {
          id: '12',
          name: '显示容器2',
          row: 1,
          col: 2
        },
        {
          id: '13',
          name: '显示容器3',
          row: 1,
          col: 3
        },
        {
          id: '14',
          name: '显示容器4',
          row: 1,
          col: 4
        },
        {
          id: '21',
          name: '显示容器5',
          row: 2,
          col: 1
        },
        {
          id: '22',
          name: '显示容器6',
          row: 2,
          col: 2
        },
        {
          id: '23',
          name: '显示容器7',
          row: 2,
          col: 3
        },
        {
          id: '24',
          name: '显示容器8',
          row: 2,
          col: 4
        },
        {
          id: '31',
          name: '显示容器9',
          row: 3,
          col: 1
        },
        {
          id: '32',
          name: '显示容器10',
          row: 3,
          col: 2
        },
        {
          id: '33',
          name: '显示容器11',
          row: 3,
          col: 3
        },
        {
          id: '34',
          name: '显示容器12',
          row: 3,
          col: 4
        },
        {
          id: '41',
          name: '显示容器13',
          row: 4,
          col: 1
        },
        {
          id: '42',
          name: '显示容器14',
          row: 4,
          col: 2
        },
        {
          id: '43',
          name: '显示容器15',
          row: 4,
          col: 3
        },
        {
          id: '44',
          name: '显示容器16',
          row: 4,
          col: 4
        }
      ], // 模板列表
      clickItemId: null,
      templateItem: null, // 当前所选模板
      selectedContainer: null,
      selectedDisplayerId: '',
      containerName: '',
      areaEle: [], // 显示器放置区域判断条件

      startX: '',
      startY: '',
      displayerWidth: '',
      displayerHeight: '',
      vBorder: '',
      hBorder: '',
      inintPositionList: [],
      sessionId: '',
      readOutputListCheckKey: '', // 获取显示器列表随机key
      createContainerCheckKey: '', // 创建容器随机key
      setOutputMsgCheckKey: '', // 设置显示器随机key
      rmContainerCheckKey: '', // 删除容器随机key
      rmOutputFromContainerCheckKey: '', // 删除容器中的显示器随机key
      displayObj: null, // 点击显示器传递的显示器对象
    }
  },
  components: {
    Container,
    BottomParams
  },
  props: ['showInfo', 'nowMenuId'],
  computed: {
    ...mapState([
      'showVessels',
      'displayerList',
      'outputModelInfo'
    ]),
    getCurContainer() {
      return dataFormat.curWindow || {};
    }
  },
  created() {
  },
  mounted() {
    this.init(); // 初始化
    this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId")); // 会话id
    this.readOutputList(); // 读取输出口列表
    this.readContainerMsg(); // 读取容器配置信息

    // websocket 接收到的消息
    const that = this;
    window.webSocket.onmessage = function(res) {
      const result = JSON.parse(res.data);
      // 获取显示器（输出口）列表
      if((result.code == 200) && (result.data.eventType == 'readOutputList')) {
        // x8设备处理
        let dataList = [];
        for (let i = 0; i < 6; i++) {
          dataList.push(result.data.output.slice(4*i , 4*(i+1)));
        }
        let outputPorts = dataList.filter((item, index) => that.outputModelInfo[index].hasOutputBoard);
        outputPorts.map((item) => {
          item.splice(2, 2)
        });

        that.$store.dispatch('setDisplayerList', outputPorts.flat());
        that.$nextTick(() => {
          customActive.Draggable('.displayer .displayer-item', {
            connectToSortable : ".displayer-view",
            handle: '.icon-view',
            refreshPositions: true
          });
        });
      }
      // 获取容器
      if((result.code == 200) && (result.data.eventType == 'readContainerMsg')) {
        console.log('容器列表',result);
      }
      // 创建容器成功
      if((result.code == 200) && (result.data.eventType == 'createContainer')) {
        that.$store.commit('setContainerId', that.$store.state.containerId + 1); // 创建成功，容器id修改成下个容器可用id
        console.log('容器创建成功',result);
      }
    }
  },
  methods: {
    init() {
      // 拉出输出口
      customActive.Draggable('.displayer .displayer-item', {
        connectToSortable : ".displayer-view",
        handle: '.icon-view',
        refreshPositions: true
      });
      // 拉出容器模板
      customActive.Draggable('.template-list .template-item', {
        connectToSortable: '.container-view',
      });
      
      // 创建容器
      const that = this;
      customActive.Droppable('.container-view', {
        accept: '.template-item',
      }, {
        drop: function(event, ui) {
          const templateId = $(ui.draggable[0]).attr('id');
          let templateObj = that.templateList.find( value => value.id == templateId ); // 拉出的模板信息
          // 容器id插空处理
          let containerIdArr = [];
          that.containerList.map(cItem => containerIdArr.push(cItem.id)); // 已创建容器id集合
          const maxId = Math.max(...containerIdArr);
          
          let sortIdList = [];
          for(let i = 0; i <= maxId; i++) {
            sortIdList.push(i);
          }
          if(maxId >= 0) {
            sortIdList.some(item => {
              if(item == maxId) {
                that.$store.commit('setContainerId', maxId + 1);
                return true;
              } else if(!containerIdArr.includes(item)) {
                that.$store.commit('setContainerId', item);
                return true;
              }
            });
          } else {
            that.$store.commit('setContainerId', 0);
          }
          // 拉出容器所放位置
          const offset = {
            top: event.clientY - 66,
            left: event.clientX - 88
          }
          // 根据分辨率设置基础宽高
          let separationW = 0;
          let separationH = 0;
          switch(that.separation) {
            case 10:
              separationW = 1920;
              separationH = 1080;
              break;
            case 82:
              separationW = 3840;
              separationH = 2160;
              break;
          }
          const containerW = templateObj.col * separationW;
          const containerH = templateObj.row * separationH;

          let mode = '';
          that.modelList.some(item => {
            if (item.id === that.modelVal) {
              mode = item.type;
            }
          });

          const params = {
            eventType: "createContainer", // 设置1个或多个容器
            count: 1, // 容器数量，最大不超过输出口数量，
            container: [ 
              {
                id: that.$store.state.containerId, // 容器id
                posX: offset.left, // 容器左上角横坐标
                posY: offset.top, // 容器左上角纵坐标
                sizeW: containerW, // 容器总宽
                sizeH: containerH, // 容器总高
                mode, // 容器类型
                modeEnum: that.modelVal, // 容器类型id
              }
            ],
            sessionID: that.sessionId,
            checkKey: that.getcheckKey()
          }
          //websocket 准备
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
          }

          // if (item) {
          //   let dList = vm.displayerList.filter(ditem => ditem.status == false); // 过滤出可用的显示器
          //   // 向ws发送添加容器信息
            
            
            
           

            
          //   window.webSocket.onmessage = function(res) {
          //     const result = JSON.parse(res.data);
          //     if(result.code == 200 && result.data.eventType == 'createContainer' && result.checkKey == vm.createContainerCheckKey) {
          //       // 创建完成更新视图
          //       if(vm.devideChecked) {
          //         const createNum = item.row * item.col;
          //         let posArr = [];
          //         let outputList = [];
          //         for (let i = 1; i <= item.row; i++) {
          //           for (let j = 1; j <= item.col; j++) {
          //             let position = { left: (j - 1) * separationW, top: (i - 1) * separationH };
          //             posArr.push(position);
          //           }
          //         }
          //         for (let index = 0; index < (createNum <= dList.length ? createNum : dList.length); index++) {
          //           let display = {
          //             id: dList[index].id,
          //             posX: posArr[index].left,
          //             posY: posArr[index].top,
          //             sizeW: 1920,
          //             sizeH: 1080,
          //             containerId: vm.$store.state.containerId,
          //             outputType: dList[index].outputType,
          //             outputTypeEnum: dList[index].outputTypeEnum
          //           };
          //           outputList.push(display);
          //         }

          //         const outputMsg = {
          //           eventType: "setOutputMsg",
          //           count: createNum <= dList.length ? createNum : dList.length,
          //           output: outputList,
          //           sessionID: vm.sessionId,
          //           checkKey: vm.getcheckKey('setOutputMsg')
          //         }
          //         window.webSocket.send(JSON.stringify(outputMsg));
          //         window.webSocket.onmessage = function(res) {
          //           const outputRes = JSON.parse(res.data);
          //           if((outputRes.code == 200 && outputRes.data.eventType == 'setOutputMsg' && outputRes.checkKey == vm.setOutputMsgCheckKey) || outputRes.code == 6) {
          //             let windows = dataFormat.addContainer(vm.$store.state.containerId, vm.devideChecked, offset, item, dList, posArr, vm.separation, containerW, containerH);
          //             vm.selectedContainer = dataFormat.curWindow;
          //             vm.$store.commit('setContainerList', [...vm.showVessels, windows]);
          //             vm.$store.commit('setContainerId', vm.$store.state.containerId + 1);
          //             vm.displayerList.map(item => {
          //               if(dataFormat.getHasUseDisplayIds().includes(item.id)) {
          //                 item.status = true;
          //               }
          //             }); // 生成容器后改变显示器是否可用状态
          //             vm.$store.commit('setDisplayerList', vm.displayerList);
          //             vm.$nextTick(() => {
          //               vm.draggableInit();
          //               vm.sortableInit();
          //               vm.droppableInit();
          //               // vm.resizableInit();
          //               vm.toggleInit();
          //             });
          //           }
          //         }
          //       }
          //       else {
          //         let windows = dataFormat.addContainer(vm.$store.state.containerId, vm.devideChecked, offset, item, dList);
          //         vm.selectedContainer = dataFormat.curWindow;
          //         vm.$store.commit('setContainerList', [...vm.showVessels, windows]);
          //         vm.$store.commit('setContainerId', vm.$store.state.containerId + 1);
        
          //         vm.displayerList.map(item => {
          //           if(dataFormat.getHasUseDisplayIds().includes(item.id)) {
          //             item.status = true;
          //           }
          //         }); // 生成容器后改变显示器是否可用状态
          //         vm.$store.commit('setDisplayerList', vm.displayerList);
          //         vm.$nextTick(() => {
          //           vm.draggableInit();
          //           vm.sortableInit();
          //           vm.droppableInit();
          //           // vm.resizableInit();
          //           vm.toggleInit();
          //         });
          //       }
          //     }
          //   }
          // }
        }
      });
      this.draggableInit(); // 容器拖拽
      this.sortableInit(); // 显示器在容器内拖拽
      this.droppableInit(); // 容器放置
      // this.resizableInit();
      this.toggleInit();

      // 生成容器后给显示器设置定位
      this.$root.bus.$off('setDisplayPositon');
      this.$root.bus.$on('setDisplayPositon', (data) => {
        this.showVessels.some((item, index) => {
          if(item.id == data.id) {
            this.showVessels.splice(index, 1, data);
          }
        });
        
        dataFormat.setWidget(data);
        this.$store.dispatch('setContainerList', this.showVessels);
      });
      // 容器缩放
      this.$root.bus.$off('setZoom');
      this.$root.bus.$on('setZoom', (data) => {
        let container = data.container;
        const {col, row, wBase, hBase, zoom} = container.customFeature;
      
        const scaleValW = 20;
        const scaleValH = 12;
        container.customFeature.wBase = wBase + scaleValW * data.zoom;
        container.customFeature.hBase = hBase + scaleValH * data.zoom;
        let positionList = this.inintPositionList || [];
        if(positionList.length == 0) {
          container.content.map(item => {
            positionList.push({left: item.position.left, top: item.position.top});
            this.inintPositionList = positionList;
          })
        }
        container.content.map((item, index) => {
          item.position.left = item.position.left == 0 ? 0 : item.position.left + (20 * (positionList[index].left / 192)) * data.zoom;
          item.position.top = item.position.top == 0 ? 0 : item.position.top + (12 * (positionList[index].top / 108)) * data.zoom;
          item.sizeW = item.sizeW + scaleValW * 10 * data.zoom;
          item.sizeH = item.sizeH + scaleValH * 10 * data.zoom;
          dataFormat.setWidget(item);
        })
      
        dataFormat.setWidget(container);
        let list = this.showVessels;
        list.some(item => {
          if (item.id === container.id) {
            Object.assign(item, container);
            return true;
          }
        });
        this.$store.commit('setContainerList',list);
      });
      // 监听删除容器事件
      this.$root.bus.$off('deleteContainer');
      this.$root.bus.$on('deleteContainer', (containerData) => {
        const that = this;
        const rmContainerParams = {
          eventType: "rmContainer",
          count: 1,
          container: [
            { id: containerData.containerId }
          ],
          sessionID: this.sessionId,
          checkKey: this.getcheckKey('rmContainer')
        }
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(rmContainerParams));
        }
        window.webSocket.onmessage = function(res) {
          const rmContainerRes = JSON.parse(res.data);
          if(rmContainerRes.code == 200 && rmContainerRes.data.eventType == 'rmContainer' && rmContainerRes.checkKey == that.rmContainerCheckKey) {
            dataFormat.removeWidgetId(containerData.id);
            containerData.content.map(Iitem => {
              dataFormat.removeWidgetId(Iitem.id);
            });
            that.showVessels.map((cItem, cIndex) => {
              if(cItem.containerId == containerData.containerId) {
                cItem.content.map(Iitem => {
                  dataFormat.removeWidgetId(Iitem.id);
                });
                cItem.content = [];
                that.showVessels.splice(cIndex, 1);
                that.$store.dispatch('setContainerList', that.showVessels);
                if(that.showVessels.length == 0) {
                  const bankList = that.$store.state.bankList;
                  bankList.map(bItem => {
                    if(bItem.containers) {
                      delete bItem.containers;
                    }
                  });
                  that.$store.dispatch('setBankList', bankList);
                }

                that.$message({
                  type: 'success',
                  message: '已删除'
                });
              }
            })
          }
          if(rmContainerRes.eventType == 'reportOutputList') {
            that.$store.dispatch('setDisplayerList', rmContainerRes.output);
            that.$nextTick(() => {
              customActive.Draggable('.displayer .displayer-item', {
                connectToSortable : ".displayer-view",
                handle: '.icon-view',
                refreshPositions: true
              });
            });
          }
        }
      });
      // 删除显示器
      this.$root.bus.$off('deleteDisplayer');
      this.$root.bus.$on('deleteDisplayer', (data) => {
        const that = this;
        const rmOutputFromContainerParams = {
          eventType: "rmOutputFromContainer",
          count: 1,
          output: [
            { id: data.dId }
          ],
          sessionID: this.sessionId,
          checkKey: this.getcheckKey('rmOutputFromContainer')
        }
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(rmOutputFromContainerParams));
        }
        window.webSocket.onmessage = function(res) {
          const result = JSON.parse(res.data);
          console.log(result);
          if((result.code == 200) && (result.data.eventType == 'rmOutputFromContainer') && (result.checkKey == that.rmOutputFromContainerCheckKey)) {
            vm.showVessels.some(cItem => {
              if(cItem.containerId == data.cId) {//找到容器
                cItem.content.map((dItem, dIndex) => {
                  if(dItem.displayId == data.dId) {
                    cItem.content.splice(dIndex, 1);
                  }
                })
                return true;
              }
            });
            dataFormat.replaceDisplay(data.dId);
            that.$store.dispatch('setContainerList', vm.showVessels);
          }
          if(result.eventType == 'reportOutputList') {
            let dataList = [];
            for (let i = 0; i < 6; i++) {
              dataList.push(result.output.slice(4*i , 4*(i+1)));
            }
            let outputPorts = dataList.filter((item, index) => that.outputModelInfo[index].hasOutputBoard );
            outputPorts.map((item) => {
              item.splice(2, 2)
            });
            that.$store.dispatch('setDisplayerList', outputPorts.flat());
            that.$nextTick(() => {
              customActive.Draggable('.displayer .displayer-item', {
                connectToSortable : ".displayer-view",
                handle: '.icon-view',
                refreshPositions: true
              });
            });
          }
        }
      });

      // 标识当前操作的容器
      this.$root.bus.$off('setSelectedContainer');
      this.$root.bus.$on('setSelectedContainer', (data) => {
        this.selectedContainer = data;
      });

      // 点击显示器
      this.$root.bus.$off('clickDisplayer');
      this.$root.bus.$on('clickDisplayer', (data) => {
        this.selectedDisplayerId = data.id;
        this.displayObj = data;
        this.startX = data.realPos.left;
        this.startY = data.realPos.top;
        this.displayerWidth = data.separation == 10 ? data.sizeW : data.sizeW * 2;
        this.displayerHeight = data.separation == 10 ?  data.sizeH : data.sizeH * 2;
      });

      // 底部参数设置显示器数据
      this.$root.bus.$off('setDisplayInfo');
      this.$root.bus.$on('setDisplayInfo', (data) => {
        const vm = this;
        const separationBase = data.separation == 10 ? 1 : 2; // 2k || 4k
        const display = {
          id: data.displayId,
          posX: Number(data.realPos.left),
          posY: Number(data.realPos.top),
          sizeW: data.sizeW * separationBase,
          sizeH: data.sizeH * separationBase,
          containerId: data.containerId,
          outputType: data.outputType,
          outputTypeEnum: data.outputTypeEnum
        };
        const outputMsg = {
          eventType: "setOutputMsg",
          count: 1,
          output: [display],
          sessionID: vm.sessionId,
          checkKey: vm.getcheckKey('setOutputMsg')
        }
        window.webSocket.send(JSON.stringify(outputMsg));
        
        window.webSocket.onmessage = function(res) {
          const outputRes = JSON.parse(res.data);
          if(outputRes.code == 200 && outputRes.data.eventType == 'setOutputMsg' && outputRes.checkKey == vm.setOutputMsgCheckKey) {
            let container = vm.showVessels.find(cItem => cItem.containerId == data.containerId); // 点击显示器所在容器
            let displayIndex = container.content.findIndex(dItem => dItem.displayId == data.displayId); // 点击的显示器
            container.content.splice(displayIndex, 1, data);
            vm.showVessels.some(cItem => {
              if(cItem.containerId == data.containerId) {
                Object.assign(cItem, container);
                return true;
              }
            });
            // 显示器信息同步到右侧
            vm.startX = data.realPos.left;
            vm.startY = data.realPos.top;
            vm.displayerWidth = data.sizeW * separationBase;
            vm.displayerHeight = data.sizeH * separationBase;
            vm.$store.dispatch('setContainerList', vm.showVessels);
          }
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
    // 点击设置，修改显示数据
    setDisplayProp() {
      let display = this.displayObj;
      const separationBase = display.separation == 10 ? 1 : 2; // 2k || 4k
      if(display) {
        display.sizeW = this.displayerWidth ? this.displayerWidth / separationBase : display.sizeW;
        display.sizeH = this.displayerHeight ? this.displayerHeight / separationBase : display.sizeH;
        display.realPos.left = this.startX ? this.startX : display.realPos.left;
        display.realPos.top = this.startY ? this.startY : display.realPos.top;
        display.position.left = this.startX ? this.startX / 10 / separationBase : display.position.left;
        display.position.top = this.startY ? this.startY / 10 / separationBase : display.position.top;
  
        const vm = this;
        const displayParams = {
          id: display.displayId,
          posX: Number(display.realPos.left),
          posY: Number(display.realPos.top),
          sizeW: display.sizeW * separationBase,
          sizeH: display.sizeH * separationBase,
          containerId: display.containerId,
          outputType: display.outputType,
          outputTypeEnum: display.outputTypeEnum
        };
        const outputMsg = {
          eventType: "setOutputMsg",
          count: 1,
          output: [displayParams],
          sessionID: vm.sessionId,
          checkKey: vm.getcheckKey('setOutputMsg')
        }
        window.webSocket.send(JSON.stringify(outputMsg));
        
        window.webSocket.onmessage = function(res) {
          const outputRes = JSON.parse(res.data);
          if(outputRes.code == 200 && outputRes.data.eventType == 'setOutputMsg' && outputRes.checkKey == vm.setOutputMsgCheckKey) {
            let container = vm.showVessels.find(cItem => cItem.containerId == display.containerId); // 点击显示器所在容器
            let displayIndex = container.content.findIndex(dItem => dItem.displayId == display.displayId); // 点击的显示器
            container.content.splice(displayIndex, 1, display);
            vm.showVessels.some(cItem => {
              if(cItem.containerId == display.containerId) {
                Object.assign(cItem, container);
                return true;
              }
            })
            vm.$store.dispatch('setContainerList', vm.showVessels);
          }
        }
      }
    },
    // 输入框事件
    changInput(e, type) {
      let val = e.target.value.trim().replace(/\D/ig, '').replace(/^[0]/, 1);
      if(type == 'startX') {
        this.startX = val;
      }
      if(type == 'startY') {
        this.startY = val;
      }
      if(type == 'dWidth') {
        this.displayerWidth = val;
      }
      if(type == 'dHeight') {
        this.displayerHeight =val;
      }
      this.$forceUpdate();
    },
    // 获取显示器列表
    readOutputList() {
      const _this = this;
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
        case 'createContainer': // 创建容器
          this.createContainerCheckKey =  parseInt(nonceStr);
          break;
        case 'readOutputList':
          this.readOutputListCheckKey = parseInt(nonceStr);
          break;
        case 'setOutputMsg':
          this.setOutputMsgCheckKey = parseInt(nonceStr);
          break;
        case 'rmContainer':
          this.rmContainerCheckKey = parseInt(nonceStr);
          break;
        case 'rmOutputFromContainer':
          this.rmOutputFromContainerCheckKey = parseInt(nonceStr);
          break;
      }
      return parseInt(nonceStr);
    },
    toggleInit() {
      $(".displayer-view").hover(function() {
        $(this).find('.delete-displayer').show();
      }, function() {
        $(this).find('.delete-displayer').hide();
      });
    },
    // 容器参数类型切换
    typeSelect(num) {
      this.typeIndex = num;
    },
    
    // 点击显示系统编辑图标
    clickEdit(e) {
      $(e.target).parents('.system-info').find('.name-input').show();
      $(e.target).parents('.system-info').find('.text-view').hide();
      $(e.target).parents('.system-info').find('.right-view-sure').show();
      $(e.target).parents('.system-info').find('.right-view').hide();
    },
    // 点击显示系统确认编辑图标
    sureEdit(e, cObj) {
      $(e.target).parents('.system-info').find('.name-input').hide();
      $(e.target).parents('.system-info').find('.text-view').show();
      $(e.target).parents('.system-info').find('.right-view-sure').hide();
      $(e.target).parents('.system-info').find('.right-view').show();
      if (this.containerName) {
        let container = dataFormat.getWidget(cObj.id);
        container.name = this.containerName;
        dataFormat.setWidget(container);
        this.$store.dispatch('setContainerList', dataFormat.getWidgetType('windows', true));
      }
    },
    // 点击显示器
    displayerClick(obj) {
      if (obj.status == true) return;
      this.clickItemId = obj.id;
    },
    
    resizableInit() {
      let vm = this;
      $('.container-component').resizable({
        minWidth: 192,
        minHeight: 108,
        aspectRatio: true,
        start: function(event, ui) {
          let container = dataFormat.getWidget($(this).attr('id'));
          let displayList = container.content || [];
          console.log($(this).width(),$(this).height());
          let resizeWidth = $(this).width();
          let resizeHeight = $(this).height();
          displayList.forEach(item => {
            item.setPositionZoom({
              w: resizeWidth,
              h: resizeHeight
            })
          })
        },
        resize: function(event, ui) {
          const { size } = ui;
          let container = dataFormat.getWidget($(this).attr('id'));
          let displayList = container.content || [];
          let resizeWidth = $(this).width();
          let resizeHeight = $(this).height();
          displayList.forEach(item => {
            item.resetPosition({
              w: resizeWidth,
              h: resizeHeight
            })
          })
          const { wBase, hBase, templateVal, zoom, col, row } = container.customFeature;
          zoom.xRadio = size.width / (wBase * col);
          zoom.yRadio = (size.height - 24) / (hBase * row);
          container.content.some(item => {
            item.customFeature.zoom.xRadio = zoom.xRadio;
            item.customFeature.zoom.yRadio = zoom.yRadio;
            dataFormat.setWidget(item);
          })
          dataFormat.setWidget(container);
          let list = vm.showVessels;
          list.some(item => {
            if (item.id === container.id) {
              Object.assign(item, container);
              return true;
            }
          });
          vm.$store.commit('setContainerList',list);
        },
        stop: function(event, ui) {
          const { size } = ui;
          let container = dataFormat.getWidget($(this).attr('id'));
          let displayList = container.content || [];
          let resizeWidth = $(this).width();
          let resizeHeight = $(this).height();
          displayList.forEach(item => {
            item.resetPosition({
              w: resizeWidth,
              h: resizeHeight
            })
          })
          const { wBase, hBase, templateVal, zoom, col, row } = container.customFeature;
          zoom.xRadio = size.width / (wBase * col);
          zoom.yRadio = (size.height - 24) / (hBase * row);
          container.content.some(item => {
            item.customFeature.zoom.xRadio = zoom.xRadio;
            item.customFeature.zoom.yRadio = zoom.yRadio;
            dataFormat.setWidget(item);
          })
          dataFormat.setWidget(container);
          let list = vm.showVessels;
          list.some(item => {
            if (item.id === container.id) {
              Object.assign(item, container);
              return true;
            }
          });
          vm.$store.commit('setContainerList',list);
        }
      });
    },
    draggableInit() {
      const vm = this;
      $('.container-view .container-component').draggable({
        connectToSortable: '.container-view',
        containment: [88,66,Infinity,Infinity],
        scroll: false,
        handle: '.container-header',
        zIndex: 100,
        stop: function(event, ui) {
          const cId = $(this).attr('containerId');
          let container = vm.showVessels.find(item => item.containerId == cId);
          console.log(container);
          // let container = dataFormat.widgetMap[$(this).attr('id')];
          container.position = ui.position;
          dataFormat.setWidget(container);
          vm.$store.dispatch('setContainerList', dataFormat.getWidgetType('windows', true));
        }
      })
    },
    // 容器放置
    droppableInit() {
      const vm = this;
      $('.displayer-box, .displayer-view').droppable({
        accept: '.displayer-item',
        greedy: true,
        over: function() {},
        drop: function(event, ui){
          const id = $(this).attr('id');
          const containerId = $(this).attr('containerId');
          const targetId = $(ui.draggable[0]).attr('id');
          let container = vm.showVessels.find(cItem => cItem.containerId == containerId);
          const separationBase = vm.separation == 10 ? 1 : 2;
          // 目标显示器
          let targetObj = vm.displayerList.find(
            item => item.id == targetId
          );
          // 放置在显示器容器上新增显示器
          if ($(this).hasClass('displayer-box')) {
            const uiLeft = event.clientX - 88 - container.position.left - $(this)[0].offsetLeft;
            const uiTop = event.clientY - 64 - container.position.top - $(this)[0].offsetTop;
            const display = {
              id: targetObj.id,
              posX: Math.round(uiLeft * 10) * separationBase,
              posY: uiTop * 10 * separationBase,
              sizeW: 1920,
              sizeH: 1080,
              containerId: container.containerId,
              outputType: targetObj.outputType,
              outputTypeEnum: targetObj.outputTypeEnum
            };
            const outputMsg = {
              eventType: "setOutputMsg",
              count: 1,
              output: [display],
              sessionID: vm.sessionId,
              checkKey: vm.getcheckKey('setOutputMsg')
            }
            window.webSocket.send(JSON.stringify(outputMsg));
            
            window.webSocket.onmessage = function(res) {
              const outputRes = JSON.parse(res.data);
              if(outputRes.code == 200 && outputRes.data.eventType == 'setOutputMsg' && outputRes.checkKey == vm.setOutputMsgCheckKey) {
                console.log('添加显示器');
                // 创建新的显示器
                let newDisplay = dataFormat.addWidget('display', {
                  parentId: container.containerId,
                  displayId: targetObj.id,
                  name: targetObj.outputType,
                  separation: vm.separation,
                  signalNum: 2,
                  sizeW: 1920,
                  sizeH: 1080,
                  containerId: container.containerId,
                });
                newDisplay.position = {
                  top: uiTop,
                  left: uiLeft
                }
                newDisplay.realPos = {
                  left: Math.round(newDisplay.position.left * 10),
                  top: newDisplay.position.top * 10
                }
                container.content.push(newDisplay);
                vm.showVessels.map(cItem => {
                  if(cItem.id == containerId) {
                    Object.assign(cItem, container);
                  }
                })
                vm.$store.dispatch('setContainerList', vm.showVessels);
                vm.displayerList.forEach(item => {
                  if (dataFormat.getHasUseDisplayIds().includes(item.id)) {
                    item.status = true;
                  } else {
                    item.status = false;
                  }
                });
                vm.$store.dispatch('setDisplayerList', vm.displayerList);
                vm.$forceUpdate();
                vm.$nextTick(() => {
                  vm.draggableInit();
                  vm.sortableInit();
                  vm.droppableInit();
                  // vm.resizableInit();
                  vm.toggleInit();
                })
              }
            }

          }
          if ($(this).hasClass('displayer-view')) {
            let container = vm.showVessels.find(cItem => cItem.containerId == containerId);
            // 被放置的显示器
            const displayer = container.content.find(dItem => dItem.displayId == $(this).attr('displayerId'));
            console.log(displayer);
            const { wBase, hBase, zoom, col, row } = container.customFeature;
            const maxX = container.position.left + col * wBase * zoom.xRadio;
            const maxY = container.position.top + 24 + row * hBase * zoom.yRadio;
            const safeAreaX = [container.position.left, maxX];
            const safeAreaY = [container.position.top, maxY];
            const droppleX = event.clientX - 88;
            const droppleY = event.clientY - 66;
            if((droppleX >= safeAreaX[0] && droppleX <= safeAreaX[1]) && (droppleY >= safeAreaY[0] && droppleY <= safeAreaY[1])) {
              
              const display = {
                id: targetObj.id,
                posX: displayer.realPos.left,
                posY: displayer.realPos.top,
                sizeW: 1920,
                sizeH: 1080,
                containerId: container.containerId,
                outputType: targetObj.outputType,
                outputTypeEnum: targetObj.outputTypeEnum
              };
              const deleteDisp = {
                id: displayer.displayId,
                posX: displayer.realPos.left,
                posY: displayer.realPos.top,
                sizeW: displayer.sizeW,
                sizeH: displayer.sizeH,
                containerId: 0xff,
                outputType: displayer.outputType,
                outputTypeEnum: displayer.outputTypeEnum
              }
              const outputMsg = {
                eventType: "setOutputMsg",
                count: 2,
                output: [display, deleteDisp],
                sessionID: vm.sessionId,
                checkKey: vm.getcheckKey('setOutputMsg')
              }
              window.webSocket.send(JSON.stringify(outputMsg));
              
              window.webSocket.onmessage = function(res) {
                const outputRes = JSON.parse(res.data);
                if(outputRes.code == 200 && outputRes.data.eventType == 'setOutputMsg' && outputRes.checkKey == vm.setOutputMsgCheckKey) {
                  // 创建新的显示器
                  let newDisplay = dataFormat.addWidget('display', {
                    parentId: displayer.containerId,
                    displayId: targetObj.id,
                    name: targetObj.outputType,
                    separation: vm.separation,
                    sizeW: 1920,
                    sizeH: 1080,
                    containerId: container.containerId,
                  });
                  newDisplay.position = displayer.position;
                  newDisplay.realPos = displayer.realPos;
                  container.content.forEach((item, index) => {
                    if(item.id == displayer.id) {
                      container.content.splice(index, 1, newDisplay);
                    }
                  });
                  dataFormat.replaceDisplay(displayer.id);
                  vm.showVessels.some(cItem => {
                    if(cItem.containerId == container.containerId) {
                      Object.assign(cItem, container);
                    }
                  })
                  vm.displayerList.forEach(item => {
                    if (dataFormat.getHasUseDisplayIds().includes(item.id)) {
                      item.status = true;
                    } else {
                      item.status = false;
                    }
                  })
                  vm.$store.dispatch('setDisplayerList', vm.displayerList);
                  vm.$nextTick(() => {
                    vm.draggableInit();
                    vm.sortableInit();
                    vm.droppableInit();
                    // vm.resizableInit();
                    vm.toggleInit();
                  })
                }
              }
            } else {
              console.log('范围外');
            }
          }
        }
      });
    },
    // 显示器在容器内拖拽
    sortableInit() {
      const vm = this;
      $('.displayer-box .displayer-view').draggable({
        delay: 100,
        snap: ".displayer-box",
        snapMode: 'inner',
        snapTolerance: 10,
        scroll: false,
        zIndex: 100,
        stop: function(event, ui) {
          let container = vm.showVessels.find(cItem => cItem.containerId == $(this).attr('containerId'));// 被拖拽显示器所属容器
          const targetDid = $(this).attr('displayerId'); // 被拖拽显示器id
          let Display = container.content.find(dItem => dItem.displayId == targetDid);
          const separationBase = Display.separation == 10 ? 1 : 2;
          Display.position = ui.position;
          Display.realPos = {
            left: Math.round(Display.position.left * 10 * separationBase),
            top: Display.position.top * 10 * separationBase
          }
          
          // 下发显示器参数
          const display = {
            id: Display.displayId,
            posX: Display.realPos.left,
            posY: Display.realPos.top,
            sizeW: Display.sizeW,
            sizeH: Display.sizeH,
            containerId: container.containerId,
            outputType: Display.name,
            outputTypeEnum: Display.outputTypeEnum
          };

          const outputMsg = {
            eventType: "setOutputMsg",
            count: 1,
            output: [display],
            sessionID: vm.sessionId,
            checkKey: vm.getcheckKey('setOutputMsg')
          }
          window.webSocket.send(JSON.stringify(outputMsg));

          window.webSocket.onmessage = function(res) {
            const outputRes = JSON.parse(res.data);
            if(outputRes.code == 200 && outputRes.data.eventType == 'setOutputMsg' && outputRes.checkKey == vm.setOutputMsgCheckKey) {
              dataFormat.setWidget(container);
              vm.showVessels.some(item => {
                if (item.id === container.id) {
                  Object.assign(item, container);
                  return true;
                }
              })
              vm.$store.dispatch('setContainerList', vm.showVessels);
              vm.$nextTick(() => {
                vm.draggableInit();
                vm.sortableInit();
                vm.droppableInit();
                // vm.resizableInit();
                vm.toggleInit();
              });
            }
          }
        }
      })
    },
    setSelectedContainer(container) {
      this.selectedContainer = container;
    },
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    
  },
  watch: {
    getCurContainer(oVal) {
      console.log(oVal);
    }
  }
}
</script>

<style scoped lang='less'>
  .el-select-dropdown__item.selected {
    color: rgb(26,188,156);
  }
  .manageShow-wrap {
    position: relative;
    flex: 1;
    display: flex;
    background: rgb(27,36,54);
    color: #fff;
    height: calc(100% - 96px);
    flex-direction: column;
    .section {
      display: flex;
      flex: 1;
      .container-view {
        position: relative;
        padding: 24px;
        overflow: auto;
        flex: 1;
        > .ghost {
          display: none !important;
        }
        > .default-view {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #999;
          .title {
            width: 320px;
            text-align: center;
            margin-bottom: 20px;
          }
          .tips-box {
            padding-top: 12px;
            border-top: 1px solid #999;
            .tips-item {
              display: flex;
              flex-direction: column;
              margin-top: 12px;
              div {
                span {
                  margin-left: 20px;
                }
              }
              em {
                padding-left: 28px;
                font-style: normal;
                margin-top: 8px;
                span {
                  margin-left: 16px;
                }
              }
            }
          }
        }
        > .container-box {
          position: relative;
          box-sizing: border-box;
        }
      }
      .right-view {
        position: relative;
        width: 320px;
        height: 100%;
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
          > div {
            padding-top: 16px;
            .input-view {
              display: flex;
              align-items: center;
              padding: 0 32px;
              margin-bottom: 16px;
              span {
                width: 80px;
                color: #ccc;
                flex-shrink: 0;
                font-size: 12px;
              }
              /deep/ .el-input__inner {
                width: 108px;
                height: 24px;
              }
              /deep/ .el-input__icon {
                line-height: 24px;
              }
              .mar-left {
                margin-left: 12px;
                /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
                  background: rgb(26,188,156);
                  border-color: rgb(26,188,156);
                }
                /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
                  color: rgb(26,188,156);
                }
              }
            }
          }
          .template-list {
            padding-top: 16px;
            .template-item {
              display: flex;
              align-items: center;
              padding: 0 16px;
              color: #999;
              font-size: 12px;
              margin-bottom: 12px;
              cursor: move;
              .index-text {
                width: 16px;
              }
              .icon-view {
                width: 24px;
                height: 24px;
                background: #999;
                border-radius: 4px;
                margin-left: 24px;
                margin-right: 48px;
              }
              .create-container {
                margin-left: 16px;
                padding: 2px 12px;
                border-radius: 4px;
                background: rgb(26,188,156);
                color: #fff;
                cursor: pointer;
              }
            }
          }
          .displayer-item {
            padding: 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 24px;
            color: #999;
            font-size: 12px;
            > div {
              display: flex;
              align-items: center;
              .id-text {
                width: 20px;
              }
              .icon-view {
                width: 42px;
                height: 16px;
                border-radius: 4px;
                background: #999;
                margin: 0 16px;
                cursor: pointer;
              }
            }
          }
          .deep {
            background: rgb(22,28,44);
          }
          .shallow {
            background: rgb(24,31,48);
          }
          .disable {
            color: rgb(40,42,49);
            background: rgb(16,21,35);
            > div {
              .icon-view {
                background: rgb(40,42,49);
              }
            }
          }
          .show {
            color: #fff;
            background: rgb(23,76,78);
          }
          .displayer-item:hover {
            color: #fff;
            background: rgb(22,48,58);
          }
          .disable:hover {
            color: #999;
            background: rgb(16,21,35);
          }
          .show:hover {
            background: rgb(23,76,78);
          }
          .empty-box {
            padding: 8px;
            color: #fff;
            font-size: 12px;
          }
          .system-info {
            padding: 10px 0;
            font-size: 12px;
            color: #999;
            background: rgb(24,31,48);
            > div {
              display: flex;
              align-items: center;
            }
            .sys-name {
              justify-content: space-between;
              padding: 0 12px;
              margin-bottom: 8px;
              height: 24px;
              .left-view {
                flex: 1;
                display: flex;
                align-items: center;
                span {
                  margin-right: 10px;
                }
                input {
                  display: none;
                  width: 106px;
                  padding: 4px 0;
                  border: 1px solid springgreen;
                  background: rgb(22,28,44);
                  border-radius: 4px;
                  appearance: none;
                  outline: none;
                  color: #fff;
                  text-indent: 1em;
                  font-size: 12px;
                }
              }
              .right-view,
              .right-view-sure {
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                background: rgb(0,196,172);
                border-radius: 4px;
                cursor: pointer;
                i {
                  color: #fff;
                  font-size: 12px;
                }
              }
              .right-view-sure {
                display: none;
              }
            }
            .info-box {
              span {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
              }
            }
          }
          .system-info:hover {
            background: rgb(22,48,58);
            color: #fff;
          }
          .params-obj,
          .params-style,
          .params-style-input {
            display: flex;
            align-items: center;
            font-size: 12px;
          }
          .params-obj {
            height: 36px;
            border-bottom: 1px solid #000;
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
            span {
              width: 80px;
            }
            input {
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
            input:focus {
              border: 1px solid rgb(26,188,156)
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
            width: 100px;
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
    }
  }
</style>