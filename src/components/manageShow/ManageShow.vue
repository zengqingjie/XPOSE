<template>
  <div class="manageShow-wrap">
    <div class="default-view" v-if="getContainers.length == 0">
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
    <div class="container-view" v-if="getContainers.length > 0"></div>
    <div class="right-view" v-if="!showInfo && nowMenuId == '003'">
      <div class="params-type" v-dragscroll>
        <div class="flex-box">
          <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">模板</div>
          <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">显示器</div>
          <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">显示系统</div>
          <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">参数</div>
        </div>
      </div>
      <div class="params-conts">
        <div v-if="typeIndex == 0">
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
          <div class="data-list">
            <div class="data-item" v-for="(item, index) in templateList" :key="index">
              <span class="index-text">{{index + 1}}</span>
              <div class="icon-view"></div>
              <span>{{item.row}} x {{item.col}} ({{separation == 2 ? (1920 * item.col) : (3840 * item.col)}} x {{separation == 2 ? (1080 * item.row) : (2160 * item.row)}})</span>
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 1">显示器列表</div>
        <div v-if="typeIndex == 2">显示系统信息</div>
        <div v-if="typeIndex == 3">参数</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      containerList: [], // 容器列表
      typeIndex: 0, // 参数类型
      modelList: [ // 模式列表
        { type: 1, label: '演示模式' },
        { type: 2, label: '预监模式' }
      ], 
      modelVal: 1, // 模式
      separationList: [ // 分辨率列表
        { type: 2, label: '2k' },
        { type: 4, label: '4k' }
      ],
      separation: 2, // 分辨率
      devideChecked: true,
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
    }
  },
  props: ['showInfo', 'nowMenuId'],
  computed: {
    getContainers() {
      return this.$store.state.showVessels;
    }
  },
  created() {

  },
  methods: {
    typeSelect(num) {
      this.typeIndex = num;
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
    .default-view {
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
    .right-view {
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
            cursor: pointer;
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
          }
        }
      }
    }
  }
</style>