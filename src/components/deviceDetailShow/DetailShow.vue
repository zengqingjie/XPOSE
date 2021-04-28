<template>
  <div class="detail-wrap">
    <div class="device-plan">
      <div class="plan-cont">
        <div class="input-section">
          <div
            class="slot"
            v-for="(item, index) in inputList"
            :key="index"
          >
            <img
              src="@/assets/input_HDMI2.png"
              alt=""
              v-for="(citem, cIndex) in item"
              :key="cIndex"
              @click="clickPort('inputPort')"
            >
          </div>
        </div>
        <div class="output-section">
          <div
            class="slot"
            v-for="(item, index) in outputList"
            :key="index"
          >
            <img
              src="@/assets/output_HDMI2.png"
              alt=""
              v-for="(citem, cIndex) in item"
              :key="cIndex"
              @click="clickPort('outputPort')"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="right-view" v-if="!showInfo && nowMenuId == '002'">
      <div class="params-type" v-dragscroll>
        <div class="flex-box" v-if="rightView == 'device'">
          <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">概况</div>
          <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">IP</div>
          <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">风扇控制</div>
          <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">热备份</div>
          <div :class="typeIndex == 4 ? 'show' : ''" @click="typeSelect(4)">延时开机</div>
          <div :class="typeIndex == 5 ? 'show' : ''" @click="typeSelect(5)">系统检测</div>
          <div :class="typeIndex == 6 ? 'show' : ''" @click="typeSelect(6)">出厂设置</div>
        </div>
        <div class="flex-box" v-if="rightView == 'port'">
          <div v-if="rightView == 'port' && port == 'inputPort'" :class="typeIndex == 7 ? 'show' : ''" @click="typeSelect(7)">属性</div>
          <div v-if="rightView == 'port' && port == 'inputPort'" :class="typeIndex == 8 ? 'show' : ''" @click="typeSelect(8)">4K</div>
          <div v-if="rightView == 'port' && port == 'inputPort'" :class="typeIndex == 9 ? 'show' : ''" @click="typeSelect(9)">EDID</div>
          <div v-if="rightView == 'port' && port == 'outputPort'" :class="typeIndex == 10 ? 'show' : ''" @click="typeSelect(10)">分辨率</div>
        </div>
      </div>
      <div class="params-conts">
        <div v-if="typeIndex == 0 && rightView == 'device'">
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
              <span class="xl">名称</span>
              <span class="xl">软件版本</span>
              <span>硬件版本</span>
            </div>
            <div
              class="tr-item"
              v-for="(item, index) in mainBoardInfo"
              :key="index"
              :class="index % 2 ? '' : 'deep'"
            >
              <span class="xl">{{item.name}}</span>
              <span class="xl">{{item.software}}</span>
              <span>{{item.hardware}}</span>
            </div>
          </div>
          <div class="blue-text">输入模块信息</div>
          <div class="lines-table bottom">
            <div class="head">
              <span class="xl">名称</span>
              <span class="xl">软件版本</span>
              <span>硬件版本</span>
            </div>
            <div
              class="tr-item"
              v-for="(item, index) in inputInfo"
              :key="index"
              :class="index % 2 ? '' : 'deep'"
            >
              <span class="xl">{{item.name}}</span>
              <span class="xl">{{item.software}}</span>
              <span>{{item.hardware}}</span>
            </div>
          </div>
          <div class="blue-text">输出模块信息</div>
          <div class="lines-table">
            <div class="head">
              <span class="xl">名称</span>
              <span class="xl">软件版本</span>
              <span>硬件版本</span>
            </div>
            <div
              class="tr-item"
              v-for="(item, index) in outputInfo"
              :key="index"
              :class="index % 2 ? '' : 'deep'"
            >
              <span class="xl">{{item.name}}</span>
              <span class="xl">{{item.software}}</span>
              <span>{{item.hardware}}</span>
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 1 && rightView == 'device'">
          <div class="check-view">
            <el-checkbox v-model="autoGetIp" disabled>自动获取ip地址</el-checkbox>
          </div>
          <div class="params-style-input">
            <span>ip地址</span>
            <div class="input-group">
              <input type="text">
              <span>-</span>
              <input type="text">
              <span>-</span>
              <input type="text">
              <span>-</span>
              <input type="text">
            </div>
          </div>
          <div class="params-style-input">
            <span>子网掩码</span>
            <div class="input-group">
              <input type="text">
              <span>-</span>
              <input type="text">
              <span>-</span>
              <input type="text">
              <span>-</span>
              <input type="text">
            </div>
          </div>
          <div class="params-style-input">
            <span>网关</span>
            <div class="input-group">
              <input type="text">
              <span>-</span>
              <input type="text">
              <span>-</span>
              <input type="text">
              <span>-</span>
              <input type="text">
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 2 && rightView == 'device'">
          <div class="params-style-input">
            <span>自动调速</span>
            <el-switch
              v-model="autoSpeed"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              :width="100"
            >
            </el-switch>
          </div>
          <div class="params-style-input">
            <span>风扇转速</span>
            <input type="text" v-model="fanSpeed">
          </div>
        </div>
        <div v-if="typeIndex == 3 && rightView == 'device'">
          <div class="params-style-input">
            <span>热备份</span>
            <el-switch
              v-model="hotBackUp"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              :width="100"
            >
            </el-switch>
          </div>
          <div class="params-style-input">
            <span>热备份模式</span>
            <div class="input-select">
              <el-select v-model="hotBackUpVal">
                <el-option
                  v-for="item in hotBackUpList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="backup-table">
            <div class="t-head">
              <span class="small">序号</span>
              <span>备份源</span>
              <span>热备份1</span>
              <span>热备份2</span>
              <span>热备份3</span>
            </div>
            <div class="t-body">
              <div
                class="t-row"
                v-for="(item, index) in backupTable"
                :key="index + '1'"
                @click="clickRowEvent(index)"
                :class="selectedBackupIndex == index ? 'selected' : ''"
              >
                <div class="small">{{index + 1}}</div>
                <div>
                  <el-select v-model="item.backupSource" placeholder="">
                    <el-option
                      v-for="bItem in backupData"
                      :key="bItem.id"
                      :label="bItem.label"
                      :value="bItem.id">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-select v-model="item.backupOne" placeholder="">
                    <el-option
                      v-for="bItem in backupData"
                      :key="bItem.id"
                      :label="bItem.label"
                      :value="bItem.id">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-select v-model="item.backupSec" placeholder="">
                    <el-option
                      v-for="bItem in backupData"
                      :key="bItem.id"
                      :label="bItem.label"
                      :value="bItem.id">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-select v-model="item.backupThir" placeholder="">
                    <el-option
                      v-for="bItem in backupData"
                      :key="bItem.id"
                      :label="bItem.label"
                      :value="bItem.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 4 && rightView == 'device'">
          <div class="params-style-input">
            <span>延时开机时间</span>
            <input type="text" v-model="fanSpeed">
            <em>秒</em>
          </div>
          <div class="params-style-input">
            <span>前面板灯</span>
            <div class="input-select">
              <el-select v-model="boardLightVal">
                <el-option
                  v-for="item in boardLight"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 5 && rightView == 'device'">
          <div class="params-style-input">
            <span>开始检测</span>
            <div class="test-btn" @click="detectionEvent">检测</div>
          </div>
        </div>
        <div v-if="typeIndex == 6 && rightView == 'device'">
          <div class="blue-text">请选择需要复位的功能</div>
          <div class="check-view">
            <el-checkbox v-model="rmLogo">移除LOGO</el-checkbox>
          </div>
          <div class="check-view">
            <el-checkbox v-model="rmEdid">移除EDID</el-checkbox>
          </div>
        </div>
        <div v-if="typeIndex == 7 && rightView == 'port' && port == 'inputPort'">
          <div class="params-style-input">
            <span>输入口</span>
            <div class="input-select">
              <el-select v-model="inputPortSelectVal">
                <el-option
                  v-for="item in inputPortSelectList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <hr style="border: 1px solid #000"/>
          <div class="blue-text">缩放</div>
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
            <input type="text" v-model="scaleW">
          </div>
          <div class="params-style-input">
            <span>高度</span>
            <input type="text" v-model="scaleH">
          </div>
          <hr style="border: 1px solid #000"/>
          <div class="blue-text">裁剪</div>
          <div class="params-style-input">
            <span>横坐标</span>
            <input type="text" v-model="clipX">
          </div>
          <div class="params-style-input">
            <span>纵坐标</span>
            <input type="text" v-model="clipY">
          </div>
          <div class="params-style-input">
            <span>宽度</span>
            <input type="text" v-model="clipW">
          </div>
          <div class="params-style-input">
            <span>高度</span>
            <input type="text" v-model="clipH">
          </div>
          <hr style="border: 1px solid #000"/>
          <div class="blue-text">画面调节</div>
          <div class="params-style-input">
            <span>亮度</span>
            <div class="block">
              <el-slider
                v-model="brightness"
                show-input
                :max="100"
              >
              </el-slider>
            </div>
          </div>
          <div class="params-style-input">
            <span>锐度</span>
            <div class="block">
              <el-slider
                v-model="sharpness"
                show-input
                :max="100"
                disabled
              >
              </el-slider>
            </div>
          </div>
          <div class="params-style-input">
            <span>对比度</span>
            <div class="block">
              <el-slider
                v-model="constrast"
                show-input
                :max="100"
              >
              </el-slider>
            </div>
          </div>
          <hr style="border: 1px solid #000"/>
          <div class="blue-text">色温</div>
          <div class="params-style-input">
            <span>模式</span>
            <div class="input-select">
              <el-select v-model="colorTemperatureModelVal">
                <el-option
                  v-for="item in colorTemperatureModel"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="params-style-input">
            <span>红</span>
            <div class="block">
              <el-slider
                v-model="colorTemperatureModel[colorTemperatureModelVal].rgb.r"
                show-input
                :max="100"
                :disabled="colorTemperatureModel[colorTemperatureModelVal].label != 'USER'"
              >
              </el-slider>
            </div>
          </div>
          <div class="params-style-input">
            <span>绿</span>
            <div class="block">
              <el-slider
                v-model="colorTemperatureModel[colorTemperatureModelVal].rgb.g"
                show-input
                :max="100"
                :disabled="colorTemperatureModel[colorTemperatureModelVal].label != 'USER'"
              >
              </el-slider>
            </div>
          </div>
          <div class="params-style-input">
            <span>蓝</span>
            <div class="block">
              <el-slider
                v-model="colorTemperatureModel[colorTemperatureModelVal].rgb.b"
                show-input
                :max="100"
                :disabled="colorTemperatureModel[colorTemperatureModelVal].label != 'USER'"
              >
              </el-slider>
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 8 && rightView == 'port' && port == 'inputPort'">
          <div class="info-view">
            <div class="label">输入模块</div>
            <div class="green-text">输入板卡5</div>
          </div>
          <hr style="border: 1px solid #000"/>
          <div class="blue-text">基本参数</div>
          <div class="params-style-input">
            <span>工作模式</span>
            <div class="input-select">
              <el-select v-model="workModelVal">
                <el-option
                  v-for="item in workModel"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="params-style-input">
            <span>输入口类型</span>
            <div class="input-select">
              <el-select v-model="inputTypeVal">
                <el-option
                  v-for="item in inputType"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="params-style-input">
            <span>拼接高度</span>
            <input type="text" v-model="jointH">
          </div>
        </div>
        <div v-if="typeIndex == 9 && rightView == 'port' && port == 'inputPort'">
          <div class="info-view">
            <div class="label">输入口</div>
            <div class="green-text">端口18；输入源1</div>
          </div>
          <hr style="border: 1px solid #000"/>
          <div class="blue-text">基本参数</div>
          <div class="params-style-input">
            <span>宽</span>
            <input type="text" v-model="EDIDw">
          </div>
          <div class="params-style-input">
            <span>高</span>
            <input type="text" v-model="EDIDh">
          </div>
          <div class="params-style-input">
            <span>频率</span>
            <input type="text" v-model="EDIDFrequency">
          </div>
        </div>
        <div v-if="typeIndex == 10 && rightView == 'port' && port == 'outputPort'">
          <div class="params-style-input">
            <span>输出开关</span>
            <el-switch
              v-model="outputSwitch"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              inactive-text="关闭"
              active-text="打开"
              :width="100"
            >
            </el-switch>
          </div>
          <div class="params-style-input">
            <span>分辨率范围</span>
            <el-switch
              v-model="frequencyRange"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              inactive-text="板卡"
              active-text="全局"
              :width="100"
            >
            </el-switch>
          </div>
          <div class="params-style-input">
            <span>分辨率类型</span>
            <el-switch
              v-model="frequencyType"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              inactive-text="自定义"
              active-text="标准"
              :width="100"
            >
            </el-switch>
          </div>
          <div class="params-style-input" v-if="frequencyType">
            <span>HDMI2.0</span>
            <div class="input-select">
              <el-select v-model="HDMIListVal">
                <el-option
                  v-for="item in HDMIList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="params-style-input" v-if="!frequencyType">
            <span>分辨率级别</span>
            <div class="input-select">
              <el-select v-model="frequencyGradeVal">
                <el-option
                  v-for="item in frequencyGrade"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="params-style-input" v-if="!frequencyType">
            <span>宽</span>
            <input type="text" v-model="frequencyW">
          </div>
          <div class="params-style-input" v-if="!frequencyType">
            <span>高</span>
            <input type="text" v-model="frequencyH">
          </div>
          <div class="params-style-input" v-if="!frequencyType">
            <span>频率</span>
            <input type="text" v-model="frequencyUser">
          </div>
          <hr style="border: 1px solid #000"/>
          <div class="blue-text">外同步设置</div>
          <div class="params-style-input">
            <span>状态</span>
            <el-switch
              v-model="outAsyncStatus"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              inactive-text="关闭"
              active-text="打开"
              :width="100"
            >
            </el-switch>
          </div>
          <div class="params-style-input">
            <span>输入格式</span>
            <input type="text" v-model="outAsyncInputFormat" disabled>
          </div>
          <div class="params-style-input">
            <span>输出格式</span>
            <input type="text" v-model="outAsyncOutputFormat" disabled>
          </div>
          <div class="params-style-input">
            <span>输入源</span>
            <el-switch
              v-model="outAsyncInputSource"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              inactive-text="HDMI"
              active-text="BNC"
              :width="100"
            >
            </el-switch>
          </div>
        </div>
      </div>
      <div class="params-footer" v-if="rightView == 'device'">
        <div v-if="typeIndex == 3" @click="addBackup">增加</div>
        <div v-if="typeIndex == 3" @click="deleteBackup">删除</div>
        <div v-if="typeIndex == 1 || typeIndex == 2 || typeIndex == 3 || typeIndex == 4">设置</div>
        <div v-if="typeIndex == 3 || typeIndex == 6">重置</div>
        <div @click="hideRightView">返回</div>
      </div>
      <div class="params-footer" v-if="rightView == 'port'">
        <div v-if="typeIndex == 7 || typeIndex == 8 || typeIndex == 9 || typeIndex == 10">设置</div>
        <div v-if="typeIndex == 7 || typeIndex == 9">重置</div>
        <div @click="returnDeviceView">返回</div>
      </div>
    </div>
    <!-- <Settings/> -->
    <Detection v-if="detection" />
  </div>
</template>

<script>
import Settings from '@/components/settings/Settings';
import Detection from '@/components/dialog/Detection';
export default {
  props: ['showInfo', 'nowMenuId'],
  data() {
    return {
      rightView: 'device',
      port: '',
      typeIndex: 0,
      detection: false,
      mainBoardInfo: [
        { name: '通讯板', software: 'V1.10', hardware: 'V1.10' },
        { name: '背板', software: 'V1.10', hardware: 'V1.10' },
        { name: '矩阵板', software: 'V1.10', hardware: 'V1.10' }
      ],
      inputInfo: [
        { name: 'H264', software: 'V1.14', hardware: 'V1.14' },
        { name: 'HDBaseT', software: 'V1.14', hardware: 'V1.14' },
        { name: 'SDI', software: 'V1.14', hardware: 'V1.14' },
        { name: '12G-SDI', software: 'V1.14', hardware: 'V1.14' },
        { name: '4K60', software: 'V1.14', hardware: 'V1.14' },
        { name: 'HDMI', software: 'V1.14', hardware: 'V1.14' },
        { name: 'D-SDI', software: 'V1.14', hardware: 'V1.14' },
        { name: 'DVI', software: 'V1.14', hardware: 'V1.14' }
      ],
      outputInfo: [
        { name: 'DVI', software: 'V1.15', hardware: 'V1.15' },
        { name: 'DVI', software: 'V1.15', hardware: 'V1.15' },
        { name: 'HDMI', software: 'V1.15', hardware: 'V1.15' },
        { name: 'SDI', software: 'V1.15', hardware: 'V1.15' },
        { name: 'HDMI 2.0', software: 'V1.15', hardware: 'V1.15' },
        { name: 'RS1', software: 'V1.15', hardware: 'V1.15' },
        { name: 'HDBaseT', software: 'V1.15', hardware: 'V1.15' },
        { name: 'H264', software: 'V1.15', hardware: 'V1.15' },
      ],
      autoGetIp: false,
      autoSpeed: false,
      fanSpeed: 50,
      boardLightVal: 1,
      boardLight: [
        { value: 1, label: '全部关闭' },
        { value: 2, label: '逐组亮度递减' },
        { value: 3, label: '两组一起向右' },
        { value: 4, label: '从亮到暗' },
        { value: 5, label: '开机流水灯' },
        { value: 6, label: '全部关闭' },
        { value: 7, label: '逐渐从暗到亮' },
        { value: 8, label: '进度条1' },
        { value: 9, label: '进度条2' },
        { value: 10, label: '进度条3' },
        { value: 11, label: '进度条4' },
        { value: 12, label: '伸缩' },
        { value: 13, label: '进度条5' },
        { value: 14, label: '进度条6' },
        { value: 15, label: '全部最亮' },
      ],
      rmLogo: false,
      rmEdid: false,
      hotBackUp: false,
      hotBackUpVal: 1,
      hotBackUpList: [
        { id: 1, label: '信号源备份' },
        { id: 2, label: '场景备份' },
      ],
      backupData: [
        { id: 0, label: 'N/A' },
        { id: 1, label: 'Source1' },
        { id: 2, label: 'Source2' },
        { id: 3, label: 'Source3' },
        { id: 4, label: 'Source4' },
        { id: 5, label: 'Source5' },
        { id: 6, label: 'Source6' },
        { id: 7, label: 'Source7' },
        { id: 8, label: 'Source8' },
        { id: 9, label: 'Source9' },
        { id: 10, label: 'Source10' },
        { id: 11, label: 'Source11' },
        { id: 12, label: 'Source12' },
        { id: 13, label: 'Source13' },
        { id: 14, label: 'Source14' },
        { id: 15, label: 'Source15' },
        { id: 16, label: 'Source16' },
        { id: 17, label: 'Source17' },
        { id: 18, label: 'Source18' },
        { id: 19, label: 'Source19' },
        { id: 20, label: 'Source20' },
        { id: 21, label: 'Source21' },
        { id: 22, label: 'Source22' },
        { id: 23, label: 'Source23' },
        { id: 24, label: 'Source24' },
        { id: 25, label: 'Source25' },
        { id: 26, label: 'Source26' },
        { id: 27, label: 'Source27' },
        { id: 28, label: 'Source28' },
        { id: 29, label: 'Source29' },
        { id: 30, label: 'Source30' },
        { id: 31, label: 'Source31' },
        { id: 32, label: 'Source32' },
      ],
      backupTable: [],
      selectedBackupIndex: 0,
      inputList: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
        [17, 18, 19, 20],
        [21, 22, 23, 24]
      ],
      outputList: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
        [17, 18, 19, 20],
        [21, 22, 23, 24]
      ],
      inputPortSelectVal: 0,
      inputPortSelectList: [
        { id: 0, label: '输入源1-HDMI2.0' }
      ],
      startX: 0,
      startY: 0,
      scaleW: 1920,
      scaleH: 1080,
      clipX: 0,
      clipY: 0,
      clipW: 1920,
      clipH: 1080,
      brightness: 50,// 亮度
      sharpness: 50,//锐度
      constrast: 50,//对比度
      // 色温
      colorTemperatureModelVal: 0,
      colorTemperatureModel: [
        {id: 0, label: '9300', rgb: {r: 38, g:40, b:43}},
        {id: 1, label: '7500', rgb: {r: 40, g:41, b:41}},
        {id: 2, label: '6500', rgb: {r: 44, g:43, b:38}},
        {id: 3, label: '5800', rgb: {r: 47, g:46, b:41}},
        {id: 4, label: 'SRGB', rgb: {r: 50, g:50, b:50}},
        {id: 5, label: 'USER', rgb: {r: 50, g:50, b:50}},
      ],
      workModelVal: 1,
      workModel: [
        {id: 1, label: '4K x 2K'},
        {id: 2, label: '4K x 1K'},
        {id: 3, label: '2K x 1K'},
        {id: 4, label: 'PIP'},
      ],
      inputTypeVal: 1,
      inputType: [
        {id:1, label: 'DVI'},
        {id:2, label: 'HDMI'},
        {id:3, label: 'DP'},
      ],
      jointH: 1,
      EDIDw: 1920,
      EDIDh: 1080,
      EDIDFrequency: 60,

      outputSwitch: false,
      frequencyRange: false,
      frequencyType: true,
      HDMIListVal: 1,
      HDMIList: [
        { id:1, label: "720x480@60p" },
        { id:2, label: "720x576@50p" },

        { id:3, label: "1024x1280@60"},
        { id:4, label: "1152x864@75" },

        { id:5, label: "1280x720@25"},
        { id:6, label: "1280x720@29.97"},
        { id:7, label: "1280x720@30"},
        { id:8, label: "1280x720@50"},
        { id:9, label: "1280x720@59.94"},
        { id:10, label: "1280x720@60" },
        { id:11, label: "1280x768@60"},
        { id:12, label: "1280x800@60"},
        { id:13, label: "1280x960@85" },
        { id:14, label: "1280x1024@60" },
        { id:15, label: "1280x1024@75" },
        { id:16, label: "1280x1024@85" },

        { id:17, label: "1360x768@60" },
        { id:18, label: "1366x768@60" },
        { id:19, label: "1400x1050@60"  },
        { id:20, label: "1440x900@60" },
        { id:21, label: "1680x1050@60" },

        { id:22, label: "1920x1080@23.98" },
        { id:23, label: "1920x1080@24" },
        { id:24, label: "1920x1080@25" },
        { id:25, label: "1920x1080@29.97" },
        { id:26, label: "1920x1080@30" },
        { id:27, label: "1920x1080@59.94" },
        { id:28, label: "1920x1080@50" },
        { id:29, label: "1920x1080@60" },
        { id:30, label: "1920x1200@60" },

        { id:31, label: "2048x1152@60" },

        { id:32, label: "2560x812@60" },

        { id:33, label: "3840x2160@23.98" },
        { id:34, label: "3840x2160@24" },
        { id:35, label: "3840x2160@25" },
        { id:36, label: "3840x2160@29.97" },
        { id:37, label: "3840x2160@30" },
        { id:38, label: "3840x2160@50" },
        { id:39, label: "3840x2160@59.94" },
        { id:40, label: "3840x2160@60" },
        
        { id:41, label: "4096x2160@23.98" },
        { id:42, label: "4096x2160@24" },
        { id:43, label: "4096x2160@25" },
        { id:44, label: "4096x2160@29.97" },
        { id:45, label: "4096x2160@30" },
        { id:46, label: "4096x2160@50" },
        { id:47, label: "4096x2160@59.94" },
        { id:48, label: "4096x2160@60" },

        { id:49, label: "7680x1080@60" },

        { id:50, label: "Custom" },
        { id:51, label: "N / A" }
      ],
        outAsyncStatus: false,
      outAsyncInputFormat: '',
      outAsyncOutputFormat: '',
      outAsyncInputSource: false,

      frequencyGradeVal: 1,
      frequencyGrade: [
        {id: 1, label: '2K1K'},
        {id: 2, label: '4K2K'},
        {id: 3, label: '8K1K'},
      ],
      frequencyW: 1920,
      frequencyH: 1080,
      frequencyUser: 60
    }
  },
  components: {
    Settings,
    Detection
  },
  mounted() {
    this.$root.bus.$off('cancelDetection');
    this.$root.bus.$on('cancelDetection', () => {
      this.detection = false;
    });
  },
  methods: {
    // 隐藏右侧功能区
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    // 返回设备设置区
    returnDeviceView() {
      this.rightView = 'device',
      this.typeIndex = 0;
    },
    // 容器参数类型切换
    typeSelect(num) {
      this.typeIndex = num;
    },
    // 点击端口
    clickPort(type) {
      this.rightView = 'port';
      this.port = type;
      type == 'inputPort' ? this.typeIndex = 7 : this.typeIndex = 10;
    },
    // 增加备份
    addBackup() {
      let tableData = this.backupTable;
      const newBackup = {
        backupSource: 0,
        backupOne: 0,
        backupSec: 0,
        backupThir: 0
      }
      tableData.push(newBackup);
      this.backupTable = tableData;
    },
    // 点击备份数据项
    clickRowEvent(index) {
      this.selectedBackupIndex = index;
    },
    // 删除备份
    deleteBackup() {
      const nowIndex = this.selectedBackupIndex;
      const backupTableData = this.backupTable;
      if(nowIndex == 0) {
        this.backupTable = backupTableData.filter((item, index) => index != nowIndex);
      } else{
        this.backupTable = backupTableData.filter((item, index) => index != nowIndex);
        this.selectedBackupIndex = nowIndex - 1;
      }
    },
    // 检测
    detectionEvent() {
      this.detection = true;
    }
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
      display: flex;
      justify-content: center;
      align-items: center;
      .plan-cont {
        display: flex;
        justify-content: space-between;
        width: 1098px;
        height: 706px;
        padding: 146px 68px 132px 140px ;
        border-radius: 10px;
        background: url(../../assets/newx.png) no-repeat;
        background-size: 100% 100%;
        box-sizing: border-box;
        .input-section {
          width: 408px;
          display: flex;
          .slot {
            flex: 1;
            padding: 36px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            img {
              display: block;
              width: 15px;
              height: 38px;
              cursor: pointer;
            }
          }
        }
        .output-section {
          width: 408px;
          display: flex;
          .slot {
            flex: 1;
            padding: 36px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            img {
              display: block;
              width: 15px;
              height: 38px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .right-view {
      position: relative;
      width: 320px;
      height: 100%;
      background: rgb(22,28,44);
      border-left: 1px solid #000;
      .check-view {
        padding-left: 10px;
        padding-top: 10px;
        /deep/ .el-checkbox__label {
          color: #fff;
        }
      }
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
              height: 24px;
              background: rgb(44,56,79);
              padding: 0 10px;
              font-size: 12px;
              span {
                display: flex;
                flex: 1;
                height: 24px;
                align-items: center;
              }
              .xl {
                flex: 2;
              }
            }
            .tr-item {
              display: flex;
              height: 24px;
              background: rgb(22,28,44);
              padding: 0 10px;
              font-size: 12px;
              span {
                display: flex;
                flex: 1;
                height: 24px;
                align-items: center;
              }
              .xl {
                flex: 2;
              }
            }
            .deep {
              background: rgb(26,34,55);
            }
          }
          .bottom {
            margin-bottom: 40px;
          }
          // ip
          .params-style-input {
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-top: 5px;
            padding: 0 10px;
            > span {
              width: 80px;
            }
            >em {
              font-style: normal;
            }
            > input {
              width: 120px;
              margin-right: 20px;
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
            input:focus {
              border: 1px solid rgb(26,188,156)
            }
            .test-btn {
              width: 100px;
              height: 24px;
              background: rgb(26,188,156);
              border-radius: 12px;
              line-height: 24px;
              text-align: center;
              color: #fff;
              font-size: 12px;
              cursor: pointer;
            }
            .block {
              flex: 1;
              /deep/ .el-slider__input {
                width: auto;
              }
              /deep/ .el-input-number__decrease,
              /deep/ .el-input-number__increase {
                width: 20px;
                top: 0;
              }
              /deep/ .el-slider__runway.show-input {
                margin-right: 100px;
              }
              /deep/ .el-input__inner {
                width: 80px;
                padding: 0 12px;
                font-size: 12px;
              }
            }
            /deep/ .el-switch__label.is-active {
              color: rgb(26,188,156);
            }
            /deep/ .el-input__inner {
              width: 140px;
              height: 30px;
              padding: 0 12px;
              font-size: 12px;
            }
            /deep/ .el-input__icon {
              line-height: 30px;
            }
            /deep/ .el-select .el-input.is-focus .el-input__inner {
              border-color: rgb(26,188,156);
            }
          }
          /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            border-color: #1ABC9C;
            background: #1ABC9C;
          }
          // 热备份
          .backup-table {
            margin-top: 16px;
            .t-head {
              display: flex;
              height: 24px;
              background: rgb(44,56,79);
              span {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 2;
                color: rgb(130,133,138);
                font-size: 12px;
              }
              .small {
                flex: 1
              }
            }
            .t-body {
              border-top: 1px solid rgb(81,87,113);
              border-left: 1px solid rgb(81,87,113);
              .t-row {
                display: flex;
                > div {
                  flex: 2;
                  border-right: 1px solid rgb(81,87,113);
                  border-bottom: 1px solid rgb(81,87,113);
                  /deep/ .el-select .el-input__inner {
                    padding-left: 5px;
                    padding-right: 16px;
                    height: 24px;
                    background: rgb(22,28,44);
                    border: 1px solid rgb(81,87,113);
                    color: #fff;
                    font-size: 12px;
                  }
                  /deep/ .el-input__suffix {
                    right: 5px;
                  }
                  /deep/ .el-input__icon {
                    width: auto;
                    line-height: 24px;
                  }
                  /deep/ .el-select .el-input .el-select__caret {
                    font-size: 12px;
                  }
                }
                .small {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                }
              }
              .selected {
                background: rgb(0,196,172);
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
        padding: 10px 0 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        > div {
          width: 90px;
          height: 24px;
          margin-bottom: 10px;
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