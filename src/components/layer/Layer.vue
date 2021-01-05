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
        <div v-if="leftIndex == 0"></div>
        <div v-if="leftIndex == 1"></div>
        <div v-if="leftIndex == 2"></div>
      </div>
    </div>
    <div class="layer-cont"></div>
    <div class="right-view" v-if="!showInfo && nowMenuId == '004'">
      <div class="params-type" v-dragscroll>
        <div class="flex-box">
          <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">缩放</div>
          <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">裁剪</div>
          <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">H264 Demo</div>
          <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">流媒体</div>
          <div :class="typeIndex == 4 ? 'show' : ''" @click="typeSelect(4)">热键</div>

        </div>
      </div>
      <div class="params-conts">
        <div v-if="typeIndex == 0">
          
        </div>
        <div v-if="typeIndex == 1">
         
        </div>
        <div v-if="typeIndex == 2">H264 Demo</div>
        <div v-if="typeIndex == 3">流媒体</div>
        <div v-if="typeIndex == 4">热键</div>
      </div>
      <div class="params-footer">
        <div v-if="typeIndex == 2">保存</div>
        <div v-if="typeIndex == 2">设置</div>
        <div @click="hideRightView">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['showInfo', 'nowMenuId'],
  data() {
    return {
      leftIndex: 0, // 容器、图层、信号参数
      typeIndex: 0, // 右侧菜单参数类型
      containerList: [], // 容器
      layerList: [], // 图层
      sourceList: [], // 信号
    }
  },
  methods: {
    paramsEvent(num) {
      this.leftIndex = num;
    },
    // 容器参数类型切换
    typeSelect(num) {
      this.typeIndex = num;
    },
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
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
      width: 180px;
      height: 100%;
      background: rgb(22,28,44);
      border-left: 1px solid #000;
      .params-type {
        position: relative;
        overflow: hidden;
        width: 180px;
        height: 24px;
        border-top: 1px solid #000;
        .flex-box {
          display: flex;
          div {
            display: inline-block;
            width: 60px;
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
    .layer-cont {
      flex: 1;
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
  }
</style>