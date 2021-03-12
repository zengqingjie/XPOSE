<template>
  <div class="manageShow-wrap">
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
            class="data-list"
          >
            <div class="data-item" v-for="(item, index) in templateList" :key="index" :id="item.id">
              <span class="index-text">{{index + 1}}</span>
              <div class="icon-view"></div>
              <span>{{item.row}} x {{item.col}} ({{separation == 2 ? (1920 * item.col) : (3840 * item.col)}} x {{separation == 2 ? (1080 * item.row) : (2160 * item.row)}})</span>
              <!-- <span class="create-container" @click="createContainer(item)">创建</span> -->
            </div>
          </div>
        </div>
        <div v-show="typeIndex == 1" class="box">
          <div class="displayer">
            <div
              class="displayer-item"
              :class="[index % 2 ? 'deep' :'shallow', item.status == false ? 'disable' : '', clickItemId === item.id ? 'show' : '']"
              :key = item.id
              v-for="(item, index) in displayerList"
              :id="item.id"
              @click="displayerClick(item)"
            >
              <div class="item-left">
                <span class="id-text">{{item.id}}</span>
                <div class="icon-view"></div>
                <span>{{item.outputType}}</span>
              </div>
              <div class="item-right">
                <span>W:{{item.sizeW}}</span>
                <span>H:{{item.sizeH}}</span>
              </div>

            </div>
          </div>
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
            <input type="text" v-model="startX">
          </div>
          <div class="params-style-input">
            <span>起始点Y</span>
            <input type="text" v-model="startY">
          </div>
          <div class="params-style-input">
            <span>宽度</span>
            <input type="text" v-model="displayerWidth">
          </div>
          <div class="params-style-input">
            <span>高度</span>
            <input type="text" v-model="displayerHeight">
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
        <div v-if="typeIndex == 3">设置</div>
        <div @click="hideRightView">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Container from '@/components/container/Container';
import { mapState } from 'vuex';
import { dataFormat } from '../../utils/dataFormat';
import { customActive } from '../../utils/custom_active';
import globalWs from '@/utils/globalWs';

export default {
  data() {
    return {
      containerList: [],
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
      drageDisplayerList: [],
      clickItemId: '',
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
      sessionId: ''
    }
  },
  components: {
    Container,
  },
  props: ['showInfo', 'nowMenuId'],
  computed: {
    ...mapState([
      'editContainer',
      'showVessels',
      'displayerList'
    ]),
    getCurContainer() {
      return dataFormat.curWindow || {};
    }
  },
  created() {
    if(!window.webSocket) {
      const ip = JSON.parse(window.sessionStorage.getItem("ip"));
      globalWs.connectSocket("ws://"+ip+":8800");
    }
  },
  mounted() {
    this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId"));
    console.log(JSON.parse(window.sessionStorage.getItem("sessionId")));
    this.readOutputList();
    // 处理ws接收到的数据
    
    const vm = this;
    this.draggableInit();
    this.sortableInit();
    this.droppableInit();
    // this.resizableInit();
    this.toggleInit();
    
    customActive.Draggable('.displayer .displayer-item', {
      connectToSortable : ".displayer-view",
      handle: '.icon-view',
      refreshPositions: true
    });
    
    customActive.Draggable('.data-list .data-item', {
      connectToSortable: '.container-view',
    });
    customActive.Droppable('.container-view', {
      accept: '.data-item',
    }, {
      drop: function(event, ui) {
        let item = vm.templateList.find(
          value => value.id === $(ui.draggable[0]).attr('id')
        )
        if (item) {
          let hasUse = dataFormat.getHasUseDisplayIds(); // 使用过的显示器
          let dList = vm.displayerList.filter(item => !hasUse.includes(item.id)); // 过滤出可用的显示器
          const offset = {
            top: event.clientY - 66,
            left: event.clientX - 88
          }
          // 向ws发送添加容器信息
          let separationW = 0;
          let separationH = 0;
          console.log(11);
          // 根据分辨率设置基础宽高
          switch(vm.separation) {
            case 10:
              separationW = 1920;
              separationH = 1080;
              break;
            case 82:
              separationW = 3840;
              separationH = 2160;
              break;
          }
          const containerW = item.col * separationW;
          const containerH = item.row * separationH;
          let modeType = '';
          vm.modelList.some(item => {
            if (item.id === vm.modelVal) {
              modeType = item.type;
            }
          });
          // 创建容器所需参数集合
          const containerMsg = {
            eventType: "createContainer", // 设置1个或多个容器
            count: 1, // 容器数量，最大不超过输出口数量，
            container: [ 
              {
                id: vm.$store.state.contaienrId, // 容器索引
                posX: offset.left, // 容器左上角横坐标
                posY: offset.top, // 容器左上角纵坐标
                sizeW: containerW, // 容器总宽
                sizeH: containerH, // 容器总高
                mode: modeType, // 容器类型
                modeEnum: 1, // 容器类型id
              }
            ],
            sessionID: vm.sessionId
          }
          console.log(containerMsg);
          //websocket 准备
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(containerMsg));
          }
          window.webSocket.onmessage = function(res) {
            const result = JSON.parse(res.data);
            console.log(result);
            if(result.code == 200 && result.data.eventType == 'createContainer') {
              // 创建完成更新视图
              let windows = dataFormat.addContainer(vm.devideChecked, offset, item, dList);
              vm.selectedContainer = dataFormat.curWindow;
              vm.$store.commit('setContainerList', [...vm.showVessels, windows]);
              vm.$store.commit('setContainerId', vm.$store.state.contaienrId + 1);
    
              vm.displayerList.map(item => {
                if(dataFormat.getHasUseDisplayIds().includes(item.id)) {
                  item.status = false
                }
              }); // 生成容器后改变显示器是否可用状态
              vm.$store.commit('setDisplayerList', vm.displayerList);
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
      }
    })

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
        item.position.left = item.position.left == 0 ? 0 : item.position.left + (20 * (positionList[index].left / 200)) * data.zoom;
        item.position.top = item.position.top == 0 ? 0 : item.position.top + (12 * (positionList[index].top / 120)) * data.zoom;
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
    this.$root.bus.$on('deleteContainer', (container) => {
      dataFormat.removeWidgetId(container.id);
      this.$store.dispatch('setContainerList', dataFormat.getWidgetType('windows', true));
      this.$message({
          type: 'success',
          message: '已删除'
        });
    });
    // 删除显示器
    this.$root.bus.$off('deleteDisplayer');
    this.$root.bus.$on('deleteDisplayer', (data) => {
      let contaienr = dataFormat.getWidget(data.cId);
      contaienr.content.some((item, index) => {
        if(item.id == data.dId) {
          contaienr.content.splice(index, 1);
          return true;
        }
      })
      dataFormat.setWidget(contaienr);
      dataFormat.replaceDisplay(data.dId);
      console.log(dataFormat.getHasUseDisplayIds());
      this.displayerList.forEach(item => {
        if (dataFormat.getHasUseDisplayIds().includes(item.id)) {
          item.status = 'disable'
        } else if(item.orChange != 0) {
          item.status = 'useable'
        }
      })
      this.$store.dispatch('setDisplayerList', this.displayerList);
    });

    // 标识当前操作的容器
    this.$root.bus.$off('setSelectedContainer');
    this.$root.bus.$on('setSelectedContainer', (data) => {
      this.selectedContainer = data;
    });

    // 点击显示器
    this.$root.bus.$off('clickDisplayer');
    this.$root.bus.$on('clickDisplayer', (data) => {
      this.selectedDisplayerId = data;
    });
  },
  methods: {
    // 获取显示器列表
    readOutputList() {
      const _this = this;
      const readOutputListParams = {
        eventType: "readOutputList",
        sessionID: this.sessionId
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(readOutputListParams));
      }
      window.webSocket.onmessage = function(res) {
        const result = JSON.parse(res.data);
        if(result.code == 200 && result.data.eventType == 'readOutputList') {
          _this.$store.commit('setDisplayerList', result.data.output);
          _this.$nextTick(() => {
            customActive.Draggable('.displayer .displayer-item', {
              connectToSortable : ".displayer-view",
              handle: '.icon-view',
              refreshPositions: true
            });
          });
        }
      }
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
      if (obj.status == false) return;
      this.clickItemId = obj.id;
    },
    
    resizableInit() {
      let vm = this;
      $('.container-component').resizable({
        minWidth: 200,
        minHeight: 144,
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
          let container = dataFormat.widgetMap[$(this).attr('id')];
          container.position = ui.position;
          dataFormat.setWidget(container);
          vm.$store.dispatch('setContainerList', dataFormat.getWidgetType('windows', true));
        }
      })
    },
    droppableInit() {
      const vm = this;
      $('.displayer-box, .displayer-view').droppable({
        accept: '.displayer-item',
        greedy: true,
        over: function() {},
        drop: function(event, ui){
          const id = $(this).attr('id');
          const parentId = $(this).attr('parentId');
          const targetId = $(ui.draggable[0]).attr('id');
          // 目标显示器
          let targetObj = vm.displayerList.find(
            item => item.id == targetId
          );
          // 放置在显示器容器上新增显示器
          if ($(this).hasClass('displayer-box')) {
            let main = dataFormat.widgetMap[parentId]; // 最外层容器
            // 创建新的显示器
            let display = dataFormat.addWidget('display', {
              parentId: parentId,
              displayId: targetObj.id,
              name: targetObj.outputType,
            });
            display.position = {
              top: event.clientY - 64 - main.position.top - $(this)[0].offsetTop,
              left: event.clientX - 88 - main.position.left - $(this)[0].offsetLeft
            }
            main.content.push(display);
            dataFormat.setWidget(main);
            vm.$store.dispatch('setContainerList', dataFormat.getWidgetType('windows', true));
            vm.displayerList.forEach(item => {
              if (dataFormat.getHasUseDisplayIds().includes(item.id)) {
                item.status = false;
              } else {
                item.status = true;
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
          if ($(this).hasClass('displayer-view')) {
            // 被放置的显示器
            const displayer = dataFormat.getWidget(id);
           
            let main = dataFormat.widgetMap[parentId]; // 最外层容器
            const { wBase, hBase, zoom, col, row } = main.customFeature;
            const maxX = main.position.left + col * wBase * zoom.xRadio;
            const maxY = main.position.top + 24 + row * hBase * zoom.yRadio;
            const safeAreaX = [main.position.left, maxX];
            const safeAreaY = [main.position.top, maxY];
            const droppleX = event.clientX - 88;
            const droppleY = event.clientY - 66;
            if((droppleX >= safeAreaX[0] && droppleX <= safeAreaX[1]) && (droppleY >= safeAreaY[0] && droppleY <= safeAreaY[1])) {
              // 创建新的显示器
              let display = dataFormat.addWidget('display', {
                parentId: displayer.parentId,
                displayId: targetObj.id,
                name: targetObj.outputType,
              });
              display.position = displayer.position;
              main.content.forEach((item, index) => {
                if(item.id == displayer.id) {
                  main.content.splice(index, 1, display);
                }
              });
              dataFormat.setWidget(main);
              dataFormat.replaceDisplay(displayer.id);
              vm.displayerList.forEach(item => {
                if (dataFormat.getHasUseDisplayIds().includes(item.id)) {
                  item.status = false;
                } else if(item.orChange != 0) {
                  item.status = true;
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
        snapTolerance: 15,
        scroll: false,
        zIndex: 100,
        stop: function(event, ui) {
          let displayer = dataFormat.widgetMap[$(this).attr('id')];
          let container = dataFormat.getWidget([$(this).attr('parentId')]);
          displayer.position = ui.position;
          dataFormat.setWidget(displayer);
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
          })
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
        .data-list {
          padding-top: 16px;
          .data-item {
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
</style>