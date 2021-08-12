<template>
  <div class="system-setting">
    <div class="main-info">
      <div class="info-box" v-if="userRightInfo">
        <div class="info-item">
          <div class="title">系统信息</div>
          <div class="mesg">
            <span>软件版本</span>
            <span class="green-text">{{userRightInfo.systemInfo.softwareVersion}}</span>
          </div>
          <div class="mesg" v-if="deviceInfo && deviceInfo.costomInfo">
            <span>webserver版本</span>
            <span class="green-text">{{deviceInfo.costomInfo.mainBoard[0].web}}</span>
          </div>
          <div class="mesg">
            <span>语言</span>
            <el-select v-model="userRightInfo.systemInfo.languageId">
              <el-option
                v-for="item in userRightInfo.systemInfo.languageList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="info-item">
          <div class="title">键盘管理</div>
          <div class="mesg">
            <span>快捷键设置</span>
            <div class="green-btn">键盘管理</div>
          </div>
        </div>
        <div class="info-item">
          <div class="title">权限设置</div>
          <div class="mesg">
            <input type="text" v-model="userRightInfo.rightSet.userName" placeholder="用户名">
          </div>
          <div class="mesg">
            <input type="password" v-model="userRightInfo.rightSet.password" placeholder="密码">
            <div class="green-btn" v-if="loginStatus" @click="logoutEvent">注销</div>
            <div class="green-btn" v-if="!loginStatus" @click="loginEvent">用户登录</div>
          </div>
        </div>
        <div class="info-item">
          <div class="title">通讯设置</div>
          <div class="mesg radio">
            <el-radio-group
              v-model="userRightInfo.communicationId"
              @change="radioChange"
            >
              <el-radio
                v-for="item in userRightInfo.communicationSet"
                :key="item.id"
                :label="item.id"
              >
                {{item.label}}
              </el-radio>
            </el-radio-group>
             <div class="green-btn">设置</div>
          </div>
        </div>
        <div class="info-item">
          <div class="title">提示信息</div>
          <div class="mesg">
            <span>解锁提示</span>
            <el-switch
              v-model="userRightInfo.mesgTips.cancelLockTips"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              inactive-text="关闭"
              @change="mesgTipsChange"
            >
            </el-switch>
          </div>
          <div class="mesg">
            <span>引导提示</span>
            <el-switch
              v-model="userRightInfo.mesgTips.guideTips"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              inactive-text="关闭"
              @change="mesgTipsChange"
            >
            </el-switch>
          </div>
        </div>
        <div class="info-item">
          <div class="title">图层管理</div>
          <div class="mesg">
            <span>自动直切</span>
            <el-switch
              v-model="userRightInfo.layerManage.autoStraightCut"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              inactive-text="关闭"
              @change="manageLayer"
            >
            </el-switch>
          </div>
        </div>
      </div>
      <div class="info-box">
        <div class="info-item">
          <div class="title">搜索设备类型</div>
          <div class="mesg">
            <el-checkbox-group
              v-model="checkedDevice"
              @change="deviceChangeEvent"
            >
              <el-checkbox
                v-for="device in devices"
                :label="device.deviceName"
                :key="device.id"
              >{{device.deviceName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="info-item">
          <div class="title">显示设置</div>
          <div class="mesg">
            <span>扩展状态</span>
            <el-switch
              v-model="extensionStatus"
              active-color="#1ABC9C"
              inactive-color="#2C384F"
              active-text="打开"
              inactive-text="关闭"
            >
            </el-switch>
          </div>
        </div>
      </div>
    </div>
    <div class="right-view" v-if="!showInfo && nowMenuId == '006'">
      <div class="params-type">
        <el-scrollbar>
          <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">多控配置</div>
          <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">管理</div>
        </el-scrollbar>
      </div>
      <div class="params-conts">
        <div v-if="typeIndex == 0">
          <div class="params-style-input">
            <span>设置数量</span>
            <el-input-number
              v-model="deviceNum"
              controls-position="right"
              @change="handleChange"
              :min="0"
              :max="254"
            >
            </el-input-number>
            <div class="green-btn" @click="setNum">设置数目</div>
          </div>
          <div class="device-list">
            <div class="head">
              <span>序号</span>
              <span class="big">设备IP</span>
              <span class="mid">动作</span>
            </div>
            <div
              class="device-item"
              v-for="(item, index) in deviceList"
              :key="index"
            >
              <div>
                <span>{{index + 1}}</span>
                <span class="status" :class="item.connect ? 'light' : ''"></span>
              </div>
              <div class="big">
                <el-select v-model="item.selectIdIndex">
                  <el-option
                    v-for="ditem in deviceIp"
                    :key="ditem.id"
                    :label="ditem.label"
                    :value="ditem.id"
                    :disabled="item.connect"
                    @change="tryEvent"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="mid">
                <el-switch
                  v-model="item.connect"
                  active-color="#1ABC9C"
                  inactive-color="#2C384F"
                  :disabled="item.selectIdIndex ? false : true"
                >
                </el-switch>
              </div>
            </div>
          </div>
        </div>
        <div v-if="typeIndex == 1">
          <div class="online-view">
            <span>用户列表</span>
            <span>在线用户：{{account}}</span>
          </div>
          <div class="add-view">
            <div class="add-btn" @click="addUser">新增</div>
          </div>
          <div class="user-list">
            <div class="head">
              <span>用户名</span>
              <span>密码</span>
              <span>操作</span>
            </div>
            <div
              class="user-item"
              v-for="(item, index) in userList"
              :key="index + '1'"
              :class="userIndex == index ? 'show' : ''"
              @click="userClickEvent(index)"
            >
              <div>{{item.userName}}</div>
              <div>{{item.password}}</div>
              <div class="around">
                <img
                  :src="userIndex == index ? require('../assets/account_edit.png') : require('../assets/account_edit_gray.png')" 
                  alt=""
                  @click="editUserInfo(item)"
                >
                <img
                  :src="userIndex == index ? require('../assets/account_lock.png') : require('../assets/account_lock_gray.png')" 
                  alt=""
                  @click="setUserRight(item)"
                >
                <img
                  :src="userIndex == index ? require('../assets/account_delete.png') : require('../assets/account_delete_gray.png')" 
                  alt=""
                  @click="deleteUser(index)"
                >
              </div>
            </div>
          </div>
          <div class="ask-view" v-if="deleteUserIndex != null">
            <div class="ask-text">确定删除此用户？</div>
            <div>
              <span @click="cancelDelete">否</span>
              <span @click="sureDelete">是</span>
            </div>
          </div>
          <div class="edit-view" v-if="editType == 'add' || editType == 'edit'">
            <div class="blue-text">
              {{editType == 'add' ? '新增' : '编辑'}}
            </div>
            <div class="params-style-input" v-if="editType == 'edit'">
              <span>用户名</span>
              <input
                type="text"
                :value="editObj.userName"
                disabled
              >
            </div>
            <div class="params-style-input" v-if="editType == 'edit'">
              <span>密码</span>
              <input
                type="text"
                :value="editObj.password"
                @input="(e) => changeInput(e, 'changePwd')"
              >
            </div>
            <!-- 新增 -->
            <div class="params-style-input" v-if="editType == 'add'">
              <span>用户名</span>
              <input
                type="text"
                :value="newUserName"
                @input="(e) => changeInput(e, 'userName')"
              >
            </div>
            <div class="params-style-input" v-if="editType == 'add'">
              <span>密码</span>
              <input
                type="text"
                :value="newPwd"
                @input="(e) => changeInput(e, 'newPwd')"
              >
            </div>
            <div class="params-style-input" v-if="editType == 'add'">
              <span>确认密码</span>
              <input
                type="text"
                :value="confirmPwd"
                @input="(e) => changeInput(e, 'confirmPwd')"
              >
            </div>
            <div class="edit-footer">
              <div @click="saveUserInfo">保存</div>
              <div @click="clearUserInfo">清空</div>
              <div @click="returnEdit">返回</div>
            </div>
          </div>
          <div class="set-view" v-if="editType == 'setRight'">
            <div class="check-box">
              <el-tree
                :data="nowUserRight.right"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                @check="handleCheckChange"
                ref="tree"
              >
              </el-tree>
            </div>
            <div class="buttons">
              <div @click="setUserRightAll">全选</div>
              <div @click="cancelUserRightAll">全取消</div>
              <div @click="cancelSetUserRight">返回</div>
            </div>
          </div>

        </div>
      </div>
      <div class="params-footer">
        <div v-if="typeIndex == 0" @click="closeAll">断开所有连接</div>
        <div v-if="typeIndex == 0" @click="connectAll">连接所有网口</div>
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
      typeIndex: 0,
      deviceInfo: null,
      userRightInfo: null,
      // 设置设备数目
      deviceNum: 0,
      checkedDevice: [],
      devices: [
        { id: 0, deviceName: 'newX', isChecked: false },
      ],
      deviceIp: [
        {id: 0, label: '=========='},
        {id: 1, label: '192.168.0.122'},
      ],
      deviceList: [],
      account: '',
      password: '',
      userList: [],
      userIndex: 0,
      // 语言
      languageVal: 0,
      language: [
        {id: 0, label: '中文'},
        {id: 1, label: 'English'}
      ],
      cancelLockTips: true,
      guideTips: true,
      // 通讯
      communicationRadio: 1,
      // 自动直切
      autoCut: true,
      // 扩展状态
      extensionStatus: false,
      loginStatus: false,
      // 删除用户索引
      deleteUserIndex: null,
      editType: '',
      editObj: null,
      // 新增用户信息
      newUserName: '',
      newPwd: '',
      confirmPwd: '',
      rightList: [
        {
          id: 1,
          label: '菜单栏',
          checked: true,
          childs: [
            { id: 8, label: '搜索设备', checked: true },
            { id: 9, label: '显示管理', checked: true },
            { id: 10, label: '图层管理', checked: true },
            { id: 11, label: '场景管理', checked: true },
          ]
        },
        {
          id: 2,
          label: '设备',
          checked: true,
          childs: [
            { id: 12, label: '概况', checked: true },
            { id: 13, label: 'IP设置', checked: true },
            { id: 14, label: '风扇控制', checked: true },
            { id: 15, label: '延时开机', checked: true },
            { id: 16, label: '出场设置', checked: true },
          ]
        },
        {
          id: 3,
          label: '输入',
          checked: true,
          childs: [
            { id: 17, label: '属性设置', checked: true },
            { id: 18, label: '4K设置', checked: true },
            { id: 19, label: 'EDID设置', checked: true },
          ]
        },
        {
          id: 4,
          label: '输出',
          checked: true,
          childs: [
            { id: 20, label: '分辨率设置', checked: true },
          ]
        },
        {
          id: 5,
          label: '显示管理',
          checked: true,
          childs: [
            { id: 21, label: '模板', checked: true },
            { id: 22, label: '显示器', checked: true },
            { id: 23, label: '显示系统', checked: true },
            { id: 24, label: '参数', checked: true },
          ]
        },
        {
          id: 6,
          label: '图层管理',
          checked: true,
          childs: [
            { id: 25, label: '缩放', checked: true },
            { id: 26, label: '裁剪', checked: true },
            { id: 27, label: 'H264', checked: true },
            { id: 28, label: '信号列表', checked: true },
            { id: 29, label: '场景列表', checked: true },
            { id: 30, label: '信号列表', checked: true },
          ]
        },
        {
          id: 7,
          label: '场景管理',
          checked: true,
          childs: [
            { id: 31, label: '切换设置', checked: true },
            { id: 32, label: '页加载/保存', checked: true },
            { id: 33, label: '脚本', checked: true },
            { id: 34, label: '场景列表', checked: true },
            { id: 35, label: '场景名', checked: true },
            { id: 36, label: '自动模式', checked: true },
          ]
        },
      ],
      defaultProps: {
        children: 'childs',
        label: 'label'
      },
      nowUserRight: null,
      sessionId: '',
    }
  },
  mounted() {
    const that = this;
    this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId"));
    this.deviceInfo = JSON.parse(window.sessionStorage.getItem("deviceInfo"));
    const userName = JSON.parse(sessionStorage.getItem("account")) || 'Admin';
    this.account = userName;
    const pwd = JSON.parse(sessionStorage.getItem("passwd")) || 'admin';
    this.password = pwd;

    this.loginStatus = pwd ? true : false;
    let userList = this.userList;
    userList.push({userName: this.account, password: this.password, right: this.deepCopy(this.rightList)});
    userList.push({userName: 'cyx', password: '321', right: this.deepCopy(this.rightList)});
    this.userList = userList;

    this.getUserRight();

    // ws信息处理
    this.websocket.ws.onmessage = function(res) {
      const result = JSON.parse(res.data);
      // 获取管理员权限信息
      if((result.code == 200) && (result.data.eventType == 'getUserRight')) {
        that.userRightInfo = result.data;
      }
      // 设置模块用户登录
      if((result.code == 200) && (result.data.eventType == 'rightSetLogin')) {
        that.$message.success('登录成功');
        that.loginStatus = true;
        that.typeIndex = 1;
        that.getUserRight();
      }
      // 设置模块用户注销
      if((result.code == 200) && (result.data.eventType == 'rightSetLogout')) {
        that.$message.success('注销成功');
        that.loginStatus = false;
        that.password = '';
        sessionStorage.setItem("passwd",JSON.stringify(''));
        that.typeIndex = 0;
      }
      // 通讯设置
      if((result.code == 200) && (result.data.eventType == 'setCommunication')) {
        console.log(result);
      }
      // 提示信息
      if((result.code == 200) && (result.data.eventType == 'setMesgTips')) {
        console.log(result);
      }
      // 图层管理
      if((result.code == 200) && (result.data.eventType == 'manageLayer')) {
        console.log(result);
      }
      // 搜索设备
      if((result.code == 200) && (result.data.eventType == 'setFindDeviceType')) {
        console.log(result);
      }
      // 设置多控数目
      if((result.code == 200) && (result.data.eventType == 'setMoreCtrlNum')) {
        that.deviceList = result.data.moreCtrlList;
      }
      // 编辑用户信息
      if((result.code == 200) && (result.data.eventType == 'editUser')) {
        let userList = that.userList;
        const editObj = that.editObj;
        userList.some((item, index) => {
          if(item.userName == editObj.userName) {
            item.password = editObj.password;
            return true;
          }
        });
        that.$message.success('用户信息已更新');
        that.userList = userList;
        that.editType = '';
      }
      // 设置模块新增用户
      if((result.code == 200) && (result.data.eventType == 'addUser')) {
        that.userList = result.data.userList;
        that.editType = '';
        that.clearUserInfo();
        that.$message.success('用户新增成功');
      }
      // 删除设置模块用户账号
      if((result.code == 200) && (result.data.eventType == 'deleteUser')) {
        let userList = that.userList;
        userList = userList.filter((item, index) => index != that.deleteUserIndex);
        that.userList = userList;
        that.deleteUserIndex = null;
      }
    }
  },
  methods: {
    //获取管理员权限信息
    getUserRight() {
      const params = {
        eventType: "getUserRight",
        userName: this.account,
        passWord: this.password,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (this.websocket.ws && this.websocket.ws.readyState == 1) {
        this.websocket.ws.send(JSON.stringify(params));
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
        default:
          break;
      }
      return parseInt(nonceStr);
    },
    // 克隆
    deepCopy(obj) {
      let _obj = JSON.stringify(obj);
      let obj2 = JSON.parse(_obj);
      return obj2;
    },
    tryEvent(val) {
      console.log(val);
    },
    // 注销
    logoutEvent() {
       const params = {
          eventType: "rightSetLogout",
          userName: this.account,
          password: this.password,
          sessionID: this.sessionId,
          checkKey: this.getcheckKey()
        }
        if (this.websocket.ws && this.websocket.ws.readyState == 1) {
          this.websocket.ws.send(JSON.stringify(params));
        }
    },
    // 用户登录
    loginEvent() {
      if(this.account && this.password) {
        const params = {
          eventType: "rightSetLogin",
          userName: this.account,
          password: this.password,
          sessionID: this.sessionId,
          checkKey: this.getcheckKey()
        }
        if (this.websocket.ws && this.websocket.ws.readyState == 1) {
          this.websocket.ws.send(JSON.stringify(params));
        }
      } else {
        this.$message.error('用户名或密码错误');
      }
    },
    // 通讯设置change事件
    radioChange(value) {
      const params = {
        eventType: "setCommunication",
        communicationId: value,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (this.websocket.ws && this.websocket.ws.readyState == 1) {
        this.websocket.ws.send(JSON.stringify(params));
      }
    },
    // 信息提示change事件
    mesgTipsChange() {
      const params = {
        eventType: "setMesgTips",
        cancelLockTips: this.userRightInfo.mesgTips.cancelLockTips,
        guideTips: this.userRightInfo.mesgTips.guideTips,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (this.websocket.ws && this.websocket.ws.readyState == 1) {
        this.websocket.ws.send(JSON.stringify(params));
      }
    },
    // 图层管理change事件
    manageLayer(status) {
      const params = {
        eventType: "manageLayer",
        autoStraightCut: status,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (this.websocket.ws && this.websocket.ws.readyState == 1) {
        this.websocket.ws.send(JSON.stringify(params));
      }
    },
    // 搜索设备change事件
    deviceChangeEvent(list) {
      this.devices.map(dItem => {
        const isChecked = list.find(item => item == dItem.deviceName);
        if(isChecked) {
          dItem.isChecked = true;
        }
      });
      const params = {
        eventType: "setFindDeviceType",
        checkedDevices: this.devices,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (this.websocket.ws && this.websocket.ws.readyState == 1) {
        this.websocket.ws.send(JSON.stringify(params));
      }
    },
    // 容器参数类型切换
    typeSelect(num) {
      if(this.loginStatus) {
        this.typeIndex = num;
      }
    },
    // 隐藏右侧功能区
    hideRightView() {
      this.$root.bus.$emit('hideRightView');
    },
    handleChange(value) {
       console.log(value);
    },
    // 设置数目
    setNum() {
      const params = {
        eventType: "setMoreCtrlNum",
        moreCtrlNum: this.deviceNum,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (this.websocket.ws && this.websocket.ws.readyState == 1) {
        this.websocket.ws.send(JSON.stringify(params));
      }
    },
    // 断开所有连接
    closeAll() {
      let dataList = this.deviceList;
      if(dataList.length > 0) {
        dataList.map(item => {
          if(item.selectIdIndex > 0) {
            item.connect = false;
          }
        });
        this.deviceList = dataList;
      }
    },
    // 连接所有网口
    connectAll() {
      let dataList = this.deviceList;
      if(dataList.length > 0) {
        dataList.map(item => {
          if(item.selectIdIndex > 0) {
            item.connect = true;
          }
        });
        this.deviceList = dataList;
      }
    },
    userClickEvent(num) {
      this.userIndex = num;
    },
    // 删除账户
    deleteUser(num) {
      this.deleteUserIndex = num;
    },
    // 确认删除
    sureDelete() {
      const params = {
        eventType: "deleteUser",
        userName: this.userList[this.deleteUserIndex].userName,
        password: this.userList[this.deleteUserIndex].password,
        sessionID: this.sessionId,
        checkKey: this.getcheckKey()
      }
      if (this.websocket.ws && this.websocket.ws.readyState == 1) {
        this.websocket.ws.send(JSON.stringify(params));
      }
    },
    // 取消删除
    cancelDelete() {
      this.deleteUserIndex = null;
    },
    // 编辑
    editUserInfo(item) {
      this.editType = 'edit';
      this.editObj = item;
    },
    // 点击权限设置
    setUserRight(item) {
      this.editType = 'setRight';
      this.nowUserRight = item;
      console.log(item.userName);
      this.$nextTick(() => {
        let checkedKeys = [];
        this.nowUserRight.right.map(Ritem => {
          if(Ritem.checked) checkedKeys.push(Ritem.id);
          Ritem.childs.map(cItem => {
            if(cItem.checked) checkedKeys.push(cItem.id);
          })
        })
        this.$refs.tree.setCheckedKeys(checkedKeys);
      })
    },
    // 权限状态改变
    handleCheckChange(nowObj, allNodeKeys) {
      this.nowUserRight.right.map(item => {
        const isChecked = allNodeKeys.checkedKeys.includes(item.id);
        isChecked ? item.checked = true : item.checked = false;
        item.childs.map(cItem => {
          const isChecked = allNodeKeys.checkedKeys.includes(cItem.id);
          isChecked ? cItem.checked = true : cItem.checked = false;
        });
      });
      console.log(this.nowUserRight.userName);
      console.log(this.userList);
      // this.userList.some(item => {
      //   if(item.userName === this.nowUserRight.userName) {
      //     item.right = this.nowUserRight.right;
      //     console.log(1);
      //     return true;
      //   }
      // });
      // console.log(this.userList);
      // console.log(nowObj);
      // console.log(allNodeKeys);
      // console.log(nowObj.$treeNodeId);
    },
    // 新增账号
    addUser() {
      this.editType = 'add';
    },
    // 输入框事件
    changeInput(e, type) {
      const value = e.target.value;
      if(type == 'changePwd') {
        this.editObj.password = value;
      }
      if(type == 'userName') {
        this.newUserName = value;
      }
      if(type == 'newPwd') {
        this.newPwd = value;
      }
      if(type == 'confirmPwd') {
        this.confirmPwd = value;
      }
    },
    // 保存用户信息
    saveUserInfo() {
      if (this.editType == 'edit') {
        let userList = this.userList;
        const editObj = this.editObj;
        userList.some((item, index) => {
          if(item.userName == editObj.userName) {
            const params = {
              eventType: "editUser",
              userId: index,
              userName: editObj.userName,
              password: editObj.password,
              sessionID: this.sessionId,
              checkKey: this.getcheckKey()
            }
            if (this.websocket.ws && this.websocket.ws.readyState == 1) {
              this.websocket.ws.send(JSON.stringify(params));
            }
          }
        });
      } else {
        if (!this.newUserName) {
          this.$message.error('用户名不能为空');
          return;
        }
        if (!this.newPwd || !this.confirmPwd) {
          this.$message.error('密码不能为空');
          return;
        }
        if (this.newUserName && this.newPwd && this.confirmPwd) {
          const there = this.userList.find(item => item.userName == this.newUserName);
          if(there) {
            this.$message.error('用户名已存在');
          } else {
            if(this.newPwd === this.confirmPwd) {
              const params = {
                eventType: "addUser",
                userName: this.newUserName,
                password: this.newPwd,
                confirmPassword: this.confirmPwd,
                sessionID: this.sessionId,
                checkKey: this.getcheckKey()
              }
              if (this.websocket.ws && this.websocket.ws.readyState == 1) {
                this.websocket.ws.send(JSON.stringify(params));
              }
              
            } else {
              this.$message.error('两次输入的密码不一致');
            }
          }
        }
      }
    },
    // 清除用户信息
    clearUserInfo() {
      if(this.editType == 'edit') {
        this.editObj.password = '';
      } else {
        this.newUserName = '';
        this.newPwd = '';
        this.confirmPwd = '';
      }
    },
    // 权限全选
    setUserRightAll() {
      this.nowUserRight.right.map(item => {
        item.checked = true;
        item.childs.map(cItem => {
          cItem.checked = true;
        });
      });
      this.$refs.tree.setCheckedKeys([1, 2, 3, 4, 5, 6 ,7]);
    },
    // 权限全取消
    cancelUserRightAll() {
      this.nowUserRight.right.map(item => {
        item.checked = false;
        item.childs.map(cItem => {
          cItem.checked = false;
        });
      });
      this.$refs.tree.setCheckedKeys([]);
    },
    // 取消设置权限
    cancelSetUserRight() {
      this.editType = '';
    },
    // 退出编辑
    returnEdit() {
      this.editType = '';
    },
  }
}
</script>

<style scoped lang='less'>
  .system-setting {
    position: relative;
    display: flex;
    flex: 1;
    background: rgb(27,36,54);
    color: #fff;
    .main-info {
      flex: 1;
      display: flex;
      .info-box {
        width: 430px;
        height: auto;
        .info-item {
          .title {
            height: 24px;
            padding: 0 10px;
            background: rgb(44,56,79);
            border-right: 1px solid #111;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
          }
          .mesg {
            display: flex;
            height: 32px;
            padding: 0 20px;
            background: rgb(30,37,56);
            border-top: 1px solid #111;
            border-right: 1px solid #111;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            .green-text {
              color: rgb(27,141,109);
            }
            .green-btn {
              width: 108px;
              height: 20px;
              background: rgb(26,188,156);
              line-height: 20px;
              border-radius: 10px;
              text-align: center;
              color: #fff;
              font-size: 12px;
              cursor: pointer;
            }
            input {
              outline: none;
              width: 120px;
              height: 20px;
              background: rgb(31,42,59);
              border: 1px solid #666;
              border-radius: 6px;
              text-indent: 1em;
              color: #999;
              font-size: 12px;
            }
            /deep/ .el-input__inner {
              width: 120px;
              height: 24px;
            }
            /deep/ .el-input__icon {
              line-height: 20px;
            }
            /deep/ .el-checkbox__label {
              color: #fff;
            }
            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
              background-color: rgb(26,188,156);
              border-color: rgb(26,188,156);
            }
          }
          .radio {
            position: relative;
            height: 90px;
            .green-btn {
              position: absolute;
              bottom: 10px;
              right: 20px;
            }
            /deep/ .el-radio-group {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
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
        > div {
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
            .green-btn {
              height: 30px;
              padding: 0 12px;
              margin-left: 16px;
              line-height: 30px;
              border-radius: 15px;
              background: rgb(26,188,156);
              text-align: center;
              color: #fff;
              font-size: 12px;
              cursor: pointer;
            }
            /deep/ .el-input-number {
              width: 130px;
              line-height: 30px;
            }
            /deep/ .el-input-number.is-controls-right .el-input-number__decrease {
              line-height: 15px;
              bottom: 0;
            }
            /deep/ .el-input-number.is-controls-right .el-input-number__increase {
              line-height: 15px;
            }
            /deep/ .el-switch__label.is-active {
              color: rgb(26,188,156);
            }
            /deep/ .el-input__inner {
              width: 90px;
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
          .device-list {
            margin-top: 12px;
            .head {
              display: flex;
              height: 24px;
              background: rgb(44,56,79);
              span {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                font-size: 12px;
              }
              .mid {
                flex: 1.5
              }
              .big {
                flex: 3;
              }
            }
            .device-item {
              display: flex;
              padding: 4px 0;
              > div {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                .status {
                  width: 8px;
                  height: 8px;
                  background: rgb(255,0,0);
                  border-radius: 50%;
                  margin-left: 8px;
                }
                .light {
                  background: rgb(0,255,0);
                }
              }
              .big {
                flex: 3;
                /deep/ .el-select .el-input__inner {
                  height: 30px;
                  padding: 0 12px;
                  font-size: 12px;
                }
                /deep/ .el-input__icon {
                  line-height: 30px;
                }
              }
              .mid {
                flex: 1.5;
              }
            }
          }
          .online-view {
            display: flex;
            height: 24px;
            padding: 0 10px;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
          }
          .add-view {
            padding: 10px;
            height: 20px;
            .add-btn {
              float: right;
              width: 60px;
              height: 20px;
              background: rgb(26,188,156);
              line-height: 20px;
              border-radius: 10px;
              text-align: center;
              color: #fff;
              font-size: 12px;
              cursor: pointer;
            }
          }
          .user-list {
            .head {
              display: flex;
              height: 24px;
              background: rgb(44,56,79);
              span {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
              }
            }
            .user-item {
              display: flex;
              color: #999;
              > div {
                flex: 1;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                > img {
                  display: block;
                  width: 16px;
                  height: 16px;
                  cursor: pointer;
                }
              }
              .around {
                justify-content: space-around;
              }
            }
            .show {
              background: rgb(23,76,78);
              color: #fff;
            }
          }
          .ask-view {
            position: absolute;
            bottom: 60px;
            left: 24px;
            .ask-text {
              margin-bottom: 10px;
              color: rgb(233,3,4);
              font-size: 12px;
            }
            div {
              display: flex;
              span {
                width: 60px;
                height: 20px;
                margin-right: 10px;
                background: rgb(26,188,156);
                border-radius: 10px;
                line-height: 20px;
                text-align: center;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
              }
            }
          }
          .edit-view {
            position: absolute;
            bottom: 0;
            top: 32px;
            width: 100%;
            background: rgb(22,28,44);
            z-index: 99;
            .blue-text {
              padding-left: 10px;
              color: rgb(2,163,211);
              font-size: 12px;
            }
            .edit-footer {
              position: absolute;
              bottom: 0;
              border-top: 1px solid #000;
              display: flex;
              width: 100%;
              height: 40px;
              justify-content: space-around;
              align-items: center;
              > div {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 78px;
                height: 20px;
                background: rgb(26,188,156);
                border-radius: 10px;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
              }
            }
          }
          .set-view {
            position: absolute;
            display: flex;
            flex-direction: column;
            bottom: 0;
            top: 32px;
            width: 100%;
            background: rgb(22,28,44);
            z-index: 99;
            .check-box {
              overflow-y: auto;
              flex: 1;
              /deep/ .el-tree {
                background: rgb(22,28,44);
              }
              /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
                background-color: rgb(26,188,156);
                border-color: rgb(26,188,156);
              }
            }
            .buttons {
              display: flex;
              padding: 10px;
              justify-content: space-around;
              border-top: 1px solid #000;
              div {
                width: 80px;
                height: 20px;
                background: rgb(26,188,156);
                border-radius: 10px;
                line-height: 20px;
                text-align: center;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
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