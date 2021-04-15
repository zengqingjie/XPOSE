<template>
  <div class="detail-wrap">
    <div class="device-plan"></div>
    <div class="right-view" v-if="!showInfo && nowMenuId == '002'">
      <div class="params-type" v-dragscroll>
        <div class="flex-box">
          <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">概况</div>
          <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">IP</div>
          <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">风扇控制</div>
          <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">热备份</div>
          <div :class="typeIndex == 4 ? 'show' : ''" @click="typeSelect(4)">延时开机</div>
          <div :class="typeIndex == 5 ? 'show' : ''" @click="typeSelect(5)">系统检测</div>
          <div :class="typeIndex == 6 ? 'show' : ''" @click="typeSelect(6)">出厂设置</div>
        </div>
      </div>
      <div class="params-conts">
        <div v-if="typeIndex == 0">
          <div class="blue-text">设备信息</div>
          <div class="info-view">
            <div class="label">温度</div>
            <div class="green-text">35℃</div>
          </div>
          <div class="info-view">
            <div class="label">物理地址</div>
            <div class="green-text">01:23:45:67:89:AB</div>
          </div>
          <div class="blue-text">主板信息</div>
          <div class="lines-table">
            <div class="head">
              <span>名称</span>
              <span>软件版本</span>
              <span>硬件版本</span>
            </div>
            
          </div>
          <div class="blue-text">输入模块信息</div>
          <div class="blue-text">输出模块信息</div>
        </div>
        <div v-if="typeIndex == 1">
        
        </div>
        <div v-if="typeIndex == 2">
          
        </div>
        <div v-if="typeIndex == 3">
          
        </div>
        <div v-if="typeIndex == 4">
          
        </div>
        <div v-if="typeIndex == 5">
          
        </div>
        <div v-if="typeIndex == 6">
          
        </div>
      </div>
      <div class="params-footer">
        <div>设置</div>
        <div v-if="typeIndex == 0 || typeIndex == 2 || typeIndex == 4">重置</div>
        <div @click="hideRightView">返回</div>
      </div>
    </div>
    <!-- <Settings/> -->
  </div>
</template>

<script>
import Settings from '@/components/settings/Settings';
export default {
  props: ['showInfo', 'nowMenuId'],
  data() {
    return {
      typeIndex: 0
    }
  },
  components: {
    Settings
  },
  mounted() {
    
  },
  methods: {
    // 隐藏右侧功能区
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    // 容器参数类型切换
    typeSelect(num) {
      this.typeIndex = num;
    },
  }
}
</script>

<style scoped lang='less'>
  .detail-wrap {
    position: relative;
    display: flex;
    flex: 1;
    background: rgb(27,36,54);
    color: #fff;
    .device-plan {
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
        > div {
          .blue-text {
            padding: 6px 10px;
            color: rgb(0,180,234);
            font-size: 12px;
          }
          .info-view {
            padding: 0 10px;
            display: flex;
            align-items: center;
            height: 24px;
            font-size: 12px;
            .label {
              width: 30%;
            }
            .green-text {
              color: rgb(25,138,103);
            }
          }
          .lines-table {
            .head {
              display: flex;
              height: 32px;
              background: rgb(44,56,79);
              padding: 0 10px;
              span {
                flex: 1;
                height: 32px;
              }
            }
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
  }
</style>