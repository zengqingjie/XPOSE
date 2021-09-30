<template>
  <div class="scene-wrap">
    <div class="scene-cont" :class="!showInfo && nowMenuId == '005' ? 'cancelPadding' : ''">
      <div class="container-view">
        <LayerContainer
          v-for="(item, index) in containerList" :key="index"
          :cItem="item"
          :output="setOutputList(item.containerId)"
          :layerList="setLayerList(item.containerId)"
        />
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
                v-for="(cItem) in containerList"
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
    <div class="right-view" v-if="!showInfo && nowMenuId == '005'">
      <div class="params-type">
        <el-scrollbar>
          <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">切换设置</div>
          <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">保存|加载</div>
          <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">脚本</div>
          <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">容器</div>
          <div :class="typeIndex == 4 ? 'show' : ''" @click="typeSelect(4)">场景名</div>
          <div :class="typeIndex == 5 ? 'show' : ''" @click="typeSelect(5)">热键</div>
        </el-scrollbar>
      </div>
      <div class="params-conts">
        <div v-if="typeIndex == 0">
          <div class="params-style-input">
            <span>切换时间</span>
            <div class="block">
              <el-slider
                v-model="sliderTime"
                :show-tooltip="false"
                :max="10"
              ></el-slider>
            </div>
            <input type="text" v-model="sliderTime" class="slider-time">
            <div>秒</div>
          </div>
          <div class="params-style-input">
            <span>分容器</span>
            <el-switch
              class="switch"
              v-model="copyContainer"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              inactive-text="关闭"
              :width="100"
              @change="sceneParamsChange('display')"
            >
            </el-switch>
          </div>
          <div class="params-style-input">
            <span>黑场</span>
            <el-switch
              class="switch"
              v-model="darkScence"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              inactive-text="关闭"
              :width="100"
              @change="sceneParamsChange('blackOut')"
            >
            </el-switch>
          </div>
          <div class="params-style-input">
            <span>保持|交换</span>
            <el-switch
              class="switch"
              v-model="keepReplace"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="交换"
              inactive-text="保持"
              :width="100"
              :disabled="copyContainer"
              @change="sceneParamsChange('keepSwap')"
            >
            </el-switch>
          </div>
          <!-- <div class="params-style-input">
            <span>预设场景</span>
            <el-switch
              class="switch"
              v-model="presetScene"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              :width="100"
              @change="sceneParamsChange('presetScene')"
            >
            </el-switch>
          </div> -->
          <hr style="border: 1px solid #000;margin:8px auto">
          <div class="params-style-input">
            <span>{{opacityPercent}}%</span>
          </div>
          <div class="opacity-slider">
            <img :src="scenceOpacity == 128 ? require('../../assets/redlight_on.png') : require('../../assets/redlight_off.png')" alt="">
            <div class="block">
              <el-slider
                v-model="scenceOpacity"
                :show-tooltip="false"
                vertical
                :max="128"
                height="150px"
                @change="sliderChange"
              >
              </el-slider>
            </div>
            <img :src="scenceOpacity ? require('../../assets/redlight_off.png') : require('../../assets/redlight_on.png')" alt="">
          </div>
          <div class="switch-view">
            <div :class="((scenceOpacity == 0) || (scenceOpacity == 128)) ? 'show' : ''"  @click="setTakeType(2)">直切</div>
            <div :class="((scenceOpacity == 0) || (scenceOpacity == 128)) ? 'show' : ''"  @click="setTakeType(1)">切换</div>
          </div>
        </div>
        <div v-if="typeIndex == 1">
         <div class="pagesInfo">
           <div :class="pageLoad ? 'show' : ''" @click="loadSave(true)">页加载</div>
           <span>|</span>
           <div :class="pageLoad ? '' : 'show'" @click="loadSave(false)">页保存</div>
         </div>
         <div class="data-cont" v-if="pageLoad">
           <div class="data-item" v-for="(item, index) in pageLoadList" :key="index">{{index + 1}}</div>
         </div>
         <div class="data-cont" v-if="!pageLoad">
           <div
            class="data-item"
            v-for="(item, index) in pageSaveList"
            :key="index"
            :class="item.save ? 'show' : ''"
            @click="saveEvent(item)"
          >{{index + 1}}</div>
         </div>
        </div>
        <div v-if="typeIndex == 2">
          <div class="params-style-input">
            <span>保存脚本</span>
          </div>
          <div class="params-style-input">
            <span>文件路径</span>
            <input type="text" v-model="documentSrc">
          </div>
          <div class="params-style-input">
            <span>文件名</span>
            <input type="text" v-model="documentName">
          </div>
          <div class="params-style-input">
            <div class="save-btn">保存</div>
          </div>
          <div class="params-style-input">
            <span>加载脚本</span>
          </div>
          <div class="script-data">
            <div class="head">
              <div class="script-name">文件名</div>
              <div>载入</div>
              <div>删除</div>
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 3" style="padding-top: 8px">
          <div
            v-for="(item, index) in bankList[bankIndex].containers"
            :key="item.id"
          >
            <div class="container-list-item">
              <div class="container-name">
                <span>{{index + 1}}</span>
                <img src="../../assets/Container.png" alt="">
                <span>{{item.name ? item.name : '容器' + (index + 1)}}</span>
              </div>
              <img
                :src="item.status ? require('../../assets/close_eye.png') : require('../../assets/green_eye.png')"
                alt=""
              >
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 4">
          <div class="params-style-input">
            <span>当前场景名</span>
            <div>xxxxxxx</div>
          </div>
          <div class="params-style-input">
            <span>新场景名</span>
            <input type="text" v-model="sceneName" style="width: 120px">
          </div>
          <div class="params-style-input">
            <span>颜色选择</span>
            <div class="color-view"></div>
          </div>
        </div>
        <div v-if="typeIndex == 5">热键</div>
      </div>
      <div class="params-footer">
        <div v-if="typeIndex == 0" @click="setEvent(typeIndex)">设置</div>
        <div v-if="typeIndex == 4">设置</div>
        <div @click="hideRightView">返回</div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LayerContainer from '@/components/container/LayerContainer';

export default {
  props: ['showInfo', 'nowMenuId'],
  components: {
    LayerContainer
  },
  data() {
    return {
      typeIndex: 0,
      
      containerList: [], // 已创建的容器
      outputList: [], // 已创建输出口
      currentLayerList: [], // 图层列表
      sceneList: [], // 场景列表
      currentSceneId: 0, // 当前场景
      currentPageId: 0, // 当前页

      copyContainer: false,
      sliderTime: 0, // 切换时间
      darkScence: false, // 黑场
      keepReplace: false, // 保持交换
      presetScene: false,
      scenceOpacity: 0,
      takeType: 0,
      pageLoad: true,
      documentSrc: '',
      documentName: '',
      sceneName: '',
      pageLoadList: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
        {
          id: 5,
        },
        {
          id: 6,
        },
        {
          id: 7,
        },
        {
          id: 8,
        },
        {
          id: 9,
        },
        {
          id: 10,
        },
        {
          id: 11,
        },
        {
          id: 12,
        },
        {
          id: 13,
        },
        {
          id: 14,
        },
        {
          id: 15,
        },
        {
          id: 24,
        }
      ],
      pageSaveList: [
        {
          id: 1,
          save: false
        },
        {
          id: 2,
          save: false
        },
        {
          id: 3,
          save: false
        },
        {
          id: 4,
          save: false
        },
        {
          id: 5,
          save: false
        },
        {
          id: 6,
          save: false
        },
        {
          id: 7,
          save: false
        },
        {
          id: 8,
          save: false
        },
        {
          id: 9,
          save: false
        },
        {
          id: 10,
          save: false
        },
        {
          id: 11,
          save: false
        },
        {
          id: 12,
          save: false
        },
        {
          id: 13,
          save: false
        },
        {
          id: 14,
          save: false
        },
        {
          id: 15,
          save: false
        },
        {
          id: 16,
          save: false
        }
      ],
      opacityPercent: 0,
      streamMedia: '',
      clipList: [], // 流媒体切割列表
      sessionId: ''
    }
  },
  created() {

  },
  mounted() {
    
    this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId"));
    this.opacityPercent = this.opacityPercent.toFixed(2);

    this.readContainerMsg(); // 读取容器配置信息
    this.readOutputList(); // 读取输出口列表
    this.readSceneMsg(); // 读取图层列表

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
      }
      // 获取图层列表数据
      if((result.code == 200) && (result.data.eventType == 'readSceneMsg')) {
        that.sceneList = result.data.scene;
        that.currentSceneId = result.data.currentSceneId;
        that.currentPageId = result.data.currentPageId;
        that.currentLayerList = result.data.scene[result.data.currentSceneId].layer;
      }
    }

  },
  methods: {
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
    readSceneMsg() {
      const randoms = this.getcheckKey();
      const params = {
        eventType: "readSceneMsg",
        sessionID: this.sessionId,
        checkKey: randoms
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

    setEvent(typeIndex) {
      if (typeIndex == 0) {
        this.setSwitchTime();
      }
    },
    // 设置切换时间
    setSwitchTime() {
      if(Number(this.sliderTime)) {
        const params = {
          eventType: 'setTakeSetting',
          sceneId: this.$store.state.bankIndex,
          fadeTime: this.sliderTime * 1000,
          checkKey: this.getcheckKey(),
          sessionID: this.sessionId
        }
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      }
    },
    // 场景参数变化
    sceneParamsChange(type) {
      let params = null;
      if(type == 'display') {
        params = {
          eventType: 'setTakeSetting',
          sceneId: this.$store.state.bankIndex,
          display: this.copyContainer,
          keepSwap: this.copyContainer ? false : this.keepReplace,
          checkKey: this.getcheckKey(),
          sessionID: this.sessionId
        }
      }
      if(type == 'blackOut') {
        params = {
          eventType: 'setTakeSetting',
          sceneId: this.$store.state.bankIndex,
          blackOut: this.darkScence,
          checkKey: this.getcheckKey(),
          sessionID: this.sessionId
        }
      }
      if(type == 'keepSwap') {
        params = {
          eventType: 'setTakeSetting',
          sceneId: this.$store.state.bankIndex,
          keepSwap: this.keepReplace,
          checkKey: this.getcheckKey(),
          sessionID: this.sessionId
        }
      }
      if(type == 'presetScene') {
        params = {
          eventType: 'setTakeSetting',
          sceneId: this.$store.state.bankIndex,
          presetScene: this.presetScene,
          checkKey: this.getcheckKey(),
          sessionID: this.sessionId
        }
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    // 操作杆发生滑动
    sliderChange(value) {
      this.opacityPercent = (value / 128 * 100 ).toFixed(2);
      if(value > 0 && value != 128) {
        this.setTakeType(3);
      } else {
        this.setTakeType(4);
      }
    },
    setTakeType(num) {
      this.takeType = num;
      this.setTakeSetting();
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
    typeSelect(num) {
      this.typeIndex = num;
    },
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    // 页保存/加载
    loadSave(boolean) {
      this.pageLoad = boolean;
    },
    saveEvent(obj) {
      this.pageSaveList.some(item => {
        if(item.id == obj.id) {
          item.save = true;
        }
      })
    },
    // 设置bank内显示区域样式
    setContainerStyle(item) {
      return {
        'width': item.sizeW / 100 + 'px',
        'height': item.sizeH / 100 + 'px',
        'top': item.posY / 10 + 'px',
        'left': item.posX / 10 + 'px'
      }
    },
    // 设置bank内显示区域样式
    setSignalStyle(item) {
      return {
        'width': item.scaleSizeW / 100 + 'px',
        'height': item.scaleSizeH / 100 + 'px',
        'top': item.scalePosY / 100 + 'px',
        'left': item.scalePosX / 100 + 'px'
      }
    },
    changeBank (scene, index){
      this.currentSceneId = scene.id;
      this.currentLayerList = scene.layer;
      const params = {
        eventType: 'setTakeSetting',
        sceneId: this.$store.state.bankIndex,
        presetScene: this.presetScene,
        checkKey: this.getcheckKey(),
        sessionID: this.sessionId
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
    setTakeSetting() {
      let containers = [];
      this.containerList.map(item => {
        const sceneC = {
          id: item.containerId,
          takeType: this.takeType,
          alpha: this.scenceOpacity
        }
        containers.push(sceneC);
      })
      const params = {
        eventType: 'setTakeSetting',
        sceneId: this.currentSceneId,
        fadeTime: this.sliderTime * 1000,
        display: this.copyContainer,
        keepSwap: this.copyContainer ? false : this.keepReplace,
        blackOut: this.darkScence,
        presetScene: this.presetScene,
        container: containers,
        count: containers.length,
        pageId: this.currentPageId,
        checkKey: this.getcheckKey(),
        sessionID: this.sessionId,
      }
      if (window.webSocket && window.webSocket.readyState == 1) {
        window.webSocket.send(JSON.stringify(params));
      }
    },
  },
  computed: {
    ...mapState([
      'bankList',
      'bankIndex'
    ]),
  }
}
</script>

<style scoped lang='less'>
  .scene-wrap {
    position: relative;
    display: flex;
    flex: 1;
    background: rgb(27,36,54);
    color: #fff;
    .scene-cont {
      display: flex;
      flex: 1;
      padding: 40px 10%;
      background: #121824;
      .container-view {
        position: relative;
        flex: 1;
        height: calc(100% - 148px - 20px);
        background: #1B2436;
        border: 2px solid #008000;
      }
    }
    .cancelPadding {
      padding: 20px;
    }
    .right-view {
      position: relative;
      width: 320px;
      height: calc(100% - 148px);
      background: rgb(22,28,44);
      border-left: 1px solid #000;
      .params-type {
        position: relative;
        width: 320px;
        height: 32px;
        border-top: 1px solid #000;
        white-space: nowrap;
        /deep/.el-scrollbar {
          height: 100%;
          .el-scrollbar__wrap {
            overflow-x: hidden;
            overflow-y: hidden;
            width: 100%;
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
              background: rgb(22,28,44);
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
      }
      .params-conts {
        padding: 0 12px;
        .params-style-input {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-size: 12px;
          > span {
            width: 80px;
          }
          > input {
            overflow: hidden;
            text-overflow: ellipsis;
            width: 80%;
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
          .block {
            flex: 1;
          }
          .slider-time {
            width: 36px;
            margin-right: 8px;
            margin-left: 16px;
            background: none;
            border: 1px solid #666;
            border-radius: 4px;
            text-align: center;
            color: #fff;
          }
          .save-btn {
            width: 80px;
            height: 24px;
            margin-left: 220px;
            background: #1ABC9C;
            border-radius: 12px;
            text-align: center;
            line-height: 24px;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
          }
          .color-view {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            background: red;
            cursor: pointer;
          }
          /deep/ .el-radio__input.is-checked .el-radio__inner {
            border-color: #1ABC9C;
            background: #1ABC9C;
          }
          /deep/ .el-radio__input.is-checked+.el-radio__label {
            color: #1ABC9C;
          }
          /deep/ .el-slider__bar {
            background-color: #1ABC9C;
          }
          /deep/ .el-slider__button {
            border-color: #1ABC9C;
          }
        }
        .script-data {
          margin-top: 10px;
          .head {
            display: flex;
            align-items: center;
            height: 24px;
            background: #2C384F;
            font-size: 12px;
            .script-name {
              flex: 3;
              padding-left: 10px;
              text-align: left;
            }
            > div {
              flex: 1;
              text-align: center;
            }
          }
        }
        .opacity-slider {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          > img {
            display: block;
            margin: 20px auto;
          }
          /deep/ .el-slider__button-wrapper {
            width: 136px;
            background: url('../../assets/light_on.png') no-repeat;
            background-size: cover;
          }
          /deep/ .el-slider.is-vertical .el-slider__button-wrapper {
            left: -65px
          }
          /deep/ .el-slider__button {
            display: none;
          }
          /deep/ .el-slider__bar {
            background: #1ABC9C;
          }
        }
        .switch-view {
          display: flex;
          justify-content: center;
          align-items: center;
          > div {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 40px;
            background: #8C8C8C;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
          }
          > div:first-child {
            margin-right: 20px;
          }
          > div.show {
            background: #1ABC9C;
          }
        }
        .pagesInfo {
          margin: 10px auto;
          height: 28px;
          background: #2C384F;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          > div {
            flex: 1;
            height: 28px;
            line-height: 28px;
            text-align: center;
            cursor: pointer;
          }
          .show {
            color: #1ABC9C;
          }
          > span {
            color: #000;
          }
        }
        .data-cont {
          display: flex;
          flex-wrap: wrap;
          .data-item {
            width: 69px;
            height: 24px;
            background: #1F2A3B;
            border: 1px solid #34495E;
            border-radius: 4px;
            margin-right: 3px;
            margin-bottom: 3px;
            line-height: 24px;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
          }
          .show {
            background: #174C4E;
          }
        }
        .container-list-item {
          display: flex;
          height: 24px;
          justify-content: space-between;
          align-items: center;
          color: #999;
          font-size: 12px;
          > .container-name {
            display: flex;
            align-items: center;
            img {
              margin: 0 12px;
            }
          }
          > img {
            display: block;
            width: 16px;
            height: 16px;
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
      left: 0;
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