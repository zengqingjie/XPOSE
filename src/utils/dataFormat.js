import { Windows } from "../components/widget/window.model";
import { Display } from "../components/widget/display.model";

export const dataFormat = {

  appData: {},

  _curWindows: {},   // 当前选择窗口

  widgetMap: {},    //  所有组件列表

  widgetList: [],   //  所有的组件列表

  addWidget(widgetType, congfig = {}) {
    let widget = null;
    switch (widgetType) {
      case "windows":
        widget = new Windows(congfig);
        break;
      case "display":
        widget = new Display(congfig);
        break;
      default:
        break;
    }
    if (!congfig.id) {
      widget.id = this._getUnitId();
    }
    this.setWidget(widget);
    return widget;
  },

  get curWindow() {
    return this._curWindows;
  },

  set curWindow(windows) {
    this._curWindows = windows;
  },

  getWidget(id) {
    return this.widgetMap[id];
  },

  setWidget(widget) {
    let widgetItem = this.widgetList.find(
      item => item.id === widget.id
    )
    if (!widgetItem) {
      this.setWidgetMap(widget);
      this.widgetList.push(widget);
    }
  },

  setWidgetMap(widget) {
    this.widgetMap[widget.id] = widget;
  },

  _removeWidgetMap(widgetId) {
    delete this.widgetMap[widgetId];
  },

  /**
   * 创建容器
   * @param {boolean} addDisplay 是否填充显示器
   * @param {object} position 拖拽放置位置
   * @param {object} templateObj 拖拽模板
   */
  addContainer(addDisplay = true, position, templateObj, usableDisplay = []) {
    let windows = this.addWidget('windows', {
      position,
      templateId: templateObj.id,
      customFeature: templateObj,
    })
    // 需要过滤出显示器id放置
    if (addDisplay) {
      let content = [];
      let addNum = templateObj.col * templateObj.row;
      for (let index = 0; index < addNum; index++) {
        let display = this.addWidget('display', {
          parentId: windows.id,
          name: usableDisplay[index].name,
          displayId: usableDisplay[index].id,
        });
        content.push(display);
      }
      windows.content = content;
    };

    this.curWindow = windows;
    return windows;
  },

  getHasUseDisplayIds() {
    let hasUseDisplay = [];
    this.widgetList.forEach(item => {
      if (item.type === 'display') hasUseDisplay.push(item);
    })

    return hasUseDisplay.map(
      item => item.displayId
    )
  },

  /**
   * 设置组件唯一标识
   */
  _getUnitId() {
    return 'SC_' + parseInt(Math.pow(2, 10) * Math.random() * 1000000000 + 1) + '';
  }
}