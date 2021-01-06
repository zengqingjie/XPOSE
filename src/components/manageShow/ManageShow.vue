<template>
  <div class="manageShow-wrap">
    <div
      class="container-view"
    >
      <!-- <div class="box" id="11" style="width:200px;height:200px;background:red"></div>
      <div class="box" id="22" style="width:200px;height:200px;background:red"></div>
      <div class="box" id="33" style="width:200px;height:200px;background:red"></div>
      <div class="box" id="44" style="width:200px;height:200px;background:red"></div> -->
      <!-- <div class="child" id="1" style="width:100px;height:100px;background:blue;z-index:99"></div>
      <div class="child" id="2" style="width:100px;height:100px;background:blue;z-index:99"></div>
      <div class="child" id="3" style="width:100px;height:100px;background:blue;z-index:99"></div>
      <div class="child" id="4" style="width:100px;height:100px;background:blue;z-index:99"></div> -->
      <div
        class="default-view"
        v-if="containerList.length == 0"
      >
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
      <div class="container-box" v-if="containerList.length > 0"> 
        <Container
          v-for="(item, index) in containerList" :key="index"
          :item="item"
          :index="index"
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
            <div class="data-item" v-for="(item, index) in templateList" :key="index">
              <span class="index-text">{{index + 1}}</span>
              <div class="icon-view"></div>
              <span>{{item.row}} x {{item.col}} ({{separation == 2 ? (1920 * item.col) : (3840 * item.col)}} x {{separation == 2 ? (1080 * item.row) : (2160 * item.row)}})</span>
              <span class="create-container" @click="createContainer(item)">创建</span>
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
        <div v-show="typeIndex == 2">显示系统信息</div>
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
// import draggable from "vuedraggable";
// import vdr from 'vue-draggable-resizable-gorkys';
// import Displayer from '@/components/displayer/Displayer';
import Container from '@/components/container/Container';
export default {
  data() {
    return {
      cloneList: [],
      containerList: [], // 容器列表
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
          row: 1,
          col: 1
        },
        {
          row: 1,
          col: 2
        },
        {
          row: 1,
          col: 3
        },
        {
          row: 1,
          col: 4
        },
        {
          row: 2,
          col: 1
        },
        {
          row: 2,
          col: 2
        },
        {
          row: 2,
          col: 3
        },
        {
          row: 2,
          col: 4
        },
        {
          row: 3,
          col: 1
        },
        {
          row: 3,
          col: 2
        },
        {
          row: 3,
          col: 3
        },
        {
          row: 3,
          col: 4
        },
        {
          row: 4,
          col: 1
        },
        {
          row: 4,
          col: 2
        },
        {
          row: 4,
          col: 3
        },
        {
          row: 4,
          col: 4
        }
      ], // 模板列表
      displayerList: [], // 显示器列表
      drageDisplayerList: [],
      clickItemId: '',
      templateItem: null, // 当前所选模板
    }
  },
  components: {
    // draggable,
    // Displayer,
    Container,
    // vdr
  },
  props: ['showInfo', 'nowMenuId'],
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "container",
        disabled: false,
        ghostClass: "ghost"
      }
    },
    options() {
      return {
        group:{name:'container',pull:'clone'},
        sort: false
      }
    }
  },
  created() {
    this.containerList = this.$store.state.showVessels;
    this.displayerList = this.$store.state.displayerList;
  },
  mounted() {
    $(".displayer .displayer-item").draggable({
      connectToSortable : ".displayer-view",  //目标区域列表div的dom
      helper : "clone", //拖拽时为原dom按钮的clone，而不是直接拖拽原dom按钮
      revert : "invalid", //当未拖入到指定目标区域时，回到原位置
    });

    // 监听容器大小，位置变化
    this.$root.bus.$off('setContainerItem');
    this.$root.bus.$on('setContainerItem', (data) => {
      this.containerList.map(item => {
        if(item.id == data.id) {
          item = data;
        }
      })
    });
    // 监听删除容器事件
    this.$root.bus.$off('deleteContainer');
    this.$root.bus.$on('deleteContainer', (container) => {
      const newDataList = this.containerList.filter(item => item.id != container.id);
      this.containerList = newDataList;
      this.$message({
          type: 'success',
          message: '已删除'
        });
    });
  },
  methods: {
    // 初始化放置事件
    inintDragge(){
      const vm = this;
      // jq触发事件
      $(".displayer-view").droppable({
        drop: function(event, ui) {
          const devId = $(this).attr('id');
          const containerId = $(this).attr('parentId');
          const dragId = ui.draggable[0].getAttribute('id');
          console.log(event);
          // 拖拽显示器进行替换
          if (devId) {
            const dragObg = vm.displayerList.filter(item => item.id == dragId)[0];
            console.log(dragObg);
            vm.$set(dragObg, 'baseW', 200);
            vm.$set(dragObg, 'baseH', 120);
            const getDevList = vm.containerList.filter(item => item.id == containerId)[0].displayerList;
            getDevList.map((item, index) => {
              if(item.id == devId) {
                getDevList.splice(index, 1, dragObg);
                vm.containerList.map(item => {
                  if (item.id == containerId) {
                    item.displayerList = getDevList;
                  }
                });
                vm.$store.dispatch('setContainerList', vm.containerList);
              }
            })
          }
        }
      });
    },
    // 容器参数类型切换
    typeSelect(num) {
      this.typeIndex = num;
    },
    // 点击显示器
    displayerClick(obj) {
      if (obj.status == 'disable') return;
      this.clickItemId = obj.id;
    },
    // 创建容器
    createContainer(templateItem) {
      this.$store.dispatch('setDisplayerList', this.displayerList);
      const newContainer = {
        id: Date.parse(new Date()),
        type: this.modelVal,
        displayerChecked: this.devideChecked,
        separation: this.separation,
        templateVal: templateItem,
        displayerList: [],
        wBase: 200,
        hBase: 120 
      }
      if (this.devideChecked) {
        const displayers = this.displayerList.filter(item => item.status == 'usable').filter((sItem, index) => index < templateItem.row * templateItem.col);
        this.displayerList.map(item => {
          displayers.map((dItem) => {
            if (dItem.id == item.id) {
              item.status = 'disable';
            }
            this.$set(dItem, 'baseW', 200);
            this.$set(dItem, 'baseH', 120);
          });
        });
        newContainer.displayerList = displayers;
      }
      const newList = [ ...this.containerList, newContainer];
      this.containerList = newList;
      this.$store.dispatch('setContainerList', [...newList]);
      this.$store.dispatch('setShareContainerList', [...newList]);

      this.$nextTick(() => {
        this.draggableInit();
        this.sortableInit();
        this.droppableInit();
      })
    },
    draggableInit() {
      // $('.container-view .container-component').draggable('destroy');
      $('.container-view .container-component').draggable({
        connectToSortable: '.container-view',
        containment: '.container-view',
        scroll: false,
        handle: '.container-header'
      })
    },
    droppableInit() {
      let vm = this;
      $('.displayer-view').droppable({
        accept: '.displayer-item',
        drop: function(event, ui){
          const id = $(this).attr('id');
          const dataId = $(this).attr('data-id');
          const targetId = $(ui.draggable[0]).attr('id');
          const targetObj = vm.displayerList.find(
            item => item.id == targetId
          );
          Object.assign(targetObj, {
            baseW: 200,
            baseH: 120
          });
          if (id) {
            vm.containerList.some(item => {
              if (item.id == dataId) {
                item.displayerList.some((display, index) => {
                  if (display.id == id) {
                    item.displayerList.splice(index, 1, targetObj);
                    vm.$nextTick(() => {
                      vm.droppableInit();
                    })
                    return true;
                  }
                })
                return true;
              }
            })
            vm.displayerList.forEach(item => {
              if (item.id == id) {
                item.status = 'usable';
              }
              if (item.id == targetId) {
                item.status = 'disable';
              }
            })
            vm.$store.dispatch('setDisplayerList', vm.displayerList);
          } else {
            $(this).attr('id')
          }
        }
      })
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