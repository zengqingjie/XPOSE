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
          :style="{borderColor: item.id == getCurContainer.id ? 'red' : ''}"
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
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </el-select>
          </div>
          <div class="input-view">
            <span>分辨率</span>
            <el-select v-model="separation" placeholder="请选择">
              <el-option
                v-for="item in separationList"
                :key="item.type"
                :label="item.label"
                :value="item.type">
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
              :class="[index % 2 ? 'deep' :'shallow', item.status == 'disable' ? 'disable' : '', clickItemId == item.id ? 'show' : '']"
              :key = item.id
              v-for="(item, index) in displayerList"
              :id="item.id"
              @click="displayerClick(item)"
            >
              <div class="item-left">
                <span class="id-text">{{item.id}}</span>
                <div class="icon-view"></div>
                <span>{{item.name}}</span>
              </div>
              <div class="item-right">
                <span>W:{{item.width}}</span>
                <span>H:{{item.height}}</span>
              </div>

            </div>
          </div>
        </div>
        <div v-show="typeIndex == 2">
          <div
            class="system-info"
            v-for="(item, index) in containerList"
            :key="item.id"
          >
            <div class="sys-name">
              <div class="left-view">
                <span>{{index + 1}}</span>
                <span class="text-view">{{item.templateVal.name}}</span>
                <input type="text" :value="item.templateVal.name" @change="editSysName" class="name-input">
              </div>
              <div class="right-view" @click="clickEdit"><i class="iconfont iconedit_name_icon" /></div>
              <div class="right-view-sure" @click="(e) => sureEdit(e, item)"><i class="iconfont iconsure_edit" /></div>
            </div>
            <div class="info-box">
              <span>X:{{item.left}}</span>
              <span>Y:{{item.top}}</span>
              <span>W:{{item.templateVal.col*1920}}</span>
              <span>H:{{item.templateVal.row*1080}}</span>
            </div>
          </div>
        </div>
        <div v-show="typeIndex == 3">参数</div>
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

export default {
  data() {
    return {
      containerList: [],
      typeIndex: 0, // 参数类型
      modelList: [
        { type: 1, label: '演示模式' },
        { type: 2, label: '预监模式' }
      ],  // 模式列表
      modelVal: 1, // 模式
      separationList: [
        { type: 2, label: '2k' },
        { type: 4, label: '4k' }
      ], // 分辨率列表
      separation: 2, // 分辨率
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
  mounted() {
    const vm = this;
    this.draggableInit();
    this.sortableInit();
    this.droppableInit();
    this.resizableInit();
    this.toggleInit();

    customActive.Draggable('.displayer .displayer-item', {
      connectToSortable : ".displayer-view",
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
          let dList = vm.displayerList.filter(item => !hasUse.includes(item.id));
          let windows = dataFormat.addContainer(vm.devideChecked, ui.offset, item, dList);
          vm.$store.commit('setContainerList', [...vm.showVessels, windows]);
          vm.displayerList.map(item => {
            if(dataFormat.getHasUseDisplayIds().includes(item.id)) {
              item.status = 'disable'
            }
          }); // 生成容器后改变显示器是否可用状态
          vm.$store.commit('setDisplayerList', vm.displayerList);
          vm.$nextTick(() => {
            vm.draggableInit();
            vm.sortableInit();
            vm.droppableInit();
            vm.resizableInit();
            vm.toggleInit();
          })
        }
      }
    })

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
      console.log(data);
      this.containerList.some(item => {
        if (item.id == data.cId) {
          item.displayerList.some((display, index) => {
            if (display.id == data.dId) {
              item.displayerList.splice(index, 1);
              return true;
            }
          })
          return true;
        }
      });
      this.displayerList.some(item => {
        if (item.id == data.dId) {
          item.status = 'usable';
        }
      });
      this.$store.dispatch('setDisplayerList', this.displayerList);
    });
    // 点击显示器
    this.$root.bus.$off('clickDisplayer');
    this.$root.bus.$on('clickDisplayer', (data) => {
      this.containerList.some(item => {
        if (item.id == data.cId) {
          item.displayerList.map((display, index) => {
            if (display.id == data.dId) {
              this.$set(display, 'selected', true);
            } else {
              this.$set(display, 'selected', false);
            }
          });
        } else {
          item.displayerList.forEach(display => {
            this.$set(display, 'selected', false);
          })
        }
        this.$store.dispatch('setContainerList', this.containerList);
      });
    });
  },
  methods: {
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
      console.log();
    },
    // 点击显示器
    displayerClick(obj) {
      if (obj.status == 'disable') return;
      this.clickItemId = obj.id;
    },
    
    resizableInit() {
      let vm = this;
      $('.container-component').resizable({
        minWidth: 200,
        minHeight: 144,
        aspectRatio: true,
        resize: function(event, ui) {
          console.log(ui);
          const { size } = ui;
          const container = dataFormat.getWidget($(this).attr('id'));
          const { wBase, hBase, templateVal, zoom, col, row } = container.customFeature;
          zoom.xRadio = size.width / (wBase * col);
          zoom.yRadio = (size.height - 24) / (hBase * row);
          console.log(container);
          const list = vm.showVessels;
          list.some(item => {
            if (item.id === container.id) {
              Object.assign(item, container);
              return true;
            }
          });
          vm.$store.dispatch('setContainerList', list);
        },
        stop: function(event, ui) {
          const { size } = ui;
          const container = dataFormat.getWidget($(this).attr('id'));
          const { wBase, hBase, templateVal, zoom, col, row } = container.customFeature;
          zoom.xRadio = size.width / (wBase * col);
          zoom.yRadio = (size.height - 24) / (hBase * row);
          const list = vm.showVessels;
          list.some(item => {
            if (item.id === container.id) {
              Object.assign(item, container);
              return true;
            }
          });
          vm.$store.dispatch('setContainerList', list);
        }
      });
    },
    draggableInit() {
      const vm = this;
      $('.container-view .container-component').draggable({
        connectToSortable: '.container-view',
        containment: [0,0,Infinity,Infinity],
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
      $('.displayer-box-child').droppable({
        accept: '.displayer-item',
        drop: function(event, ui){
          const id = $(this).attr('id');
          const parentId = $(this).attr('parentId');
          const targetId = $(ui.draggable[0]).attr('id');
          // 整个容器实例
          let container = dataFormat.getWidget(id);
          let targetObj = vm.displayerList.find(
            item => item.id == targetId
          );
          const oldWidgetId = container.content && container.content.displayId;
          // 满足条件则替换显示器
          if (oldWidgetId) {
            dataFormat.replaceDisplay(container.content.id);
          }
          let display = dataFormat.addWidget('display', {
            parentId: id,
            displayId: targetObj.id,
            name: targetObj.name,
          });
          container.content = display;
          let main = dataFormat.widgetMap[parentId];
          main.setContent(container);
          vm.$store.dispatch('setContainerList', dataFormat.getWidgetType('windows', true));
          vm.displayerList.forEach(item => {
            if (dataFormat.getHasUseDisplayIds().includes(item.id)) {
              item.status = 'disable'
            } else if(item.orChange != 0) {
              item.status = 'useable'
            }
          });
          vm.$store.dispatch('setDisplayerList', vm.displayerList);
        }
      });
    },
    sortableInit() {
      $('.displayer-box').sortable({
        cursor: "move",
        scroll: false,
      })
    },
    
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    // 编辑容器名字
    editSysName(e) {
      console.log(e.target.value);
    }
  },
  watch: {
    
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
        .data-list {
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