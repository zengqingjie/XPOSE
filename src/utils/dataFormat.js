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
    let widgetIndex = this.widgetList.findIndex(
      item => item.id === widget.id
    )
    if (widgetIndex >= 0) {
      this.setWidgetMap(widget);
      this.widgetList.splice(widgetIndex, 1, widget);
    } else {
      this.setWidgetMap(widget);
      this.widgetList.push(widget);
    }
  },

  setWidgetMap(widget) {
    this.widgetMap[widget.id] = widget;
  },

  removeWidgetId(widgetId) {
    let index = this.widgetList.findIndex(item => item.id == widgetId);
    if (index >= 0) {
      this.widgetList.splice(index, 1);
    }
    delete this.widgetMap[widgetId];
  },

  /**
   * 创建容器
   * @param {boolean} addDisplay 是否填充显示器
   * @param {object} position 拖拽放置位置
   * @param {object} templateObj 拖拽模板
   */
  addContainer(addDisplay = true, position, templateObj, usableDisplay = []) {
    let content = [];
    const { col, row } = templateObj;
    let addNum = col * row;
    let windows = this.addWidget('windows', {
      position,
      templateId: templateObj.id,
      customFeature: templateObj,
    });
    for (let index = 0; index < addNum; index++) {
      let childWindow = this.addWidget('windows', {
        parentId: windows.id,
      });
      if (addDisplay) {
        let childrenContent = [];
        let display = this.addDisplay({
          parentId: childWindow.id,
          name: usableDisplay[index].name,
          displayId: usableDisplay[index].id,
        });
        childWindow.content = display;
      }
      content.push(childWindow);
    }
    windows.content = content;
    this.curWindow = windows;
    return windows;
  },

  addDisplay(config) {
    let display = this.addWidget('display', {
      ...config,
      content: []
    });
    return display;
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

  getWidgetType(type, isParent = false) {
    if (isParent) {
      return this.widgetList.filter(item => item.type === type && !item.parentId);
    }
    return this.widgetList.filter(item => item.type === type);
  },

  /**
   * 设置组件唯一标识
   */
  _getUnitId() {
    return 'SC_' + parseInt(Math.pow(2, 10) * Math.random() * 1000000000 + 1) + '';
  }
}