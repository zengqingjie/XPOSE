export class Widget {
  name = '';
  type = '';
  constructor(config) {
    this.id = config.id;
    this.content = config.content;  //  放置子元素（例如：容器内的显示器）
    this.customFeature = config.customFeature || {};
  }

  get getId() {
    return this.id;
  }

  set setId(id) {
    this.id = id;
  }

  setCustomFeature(key, value) {
    if (!key || !value) return;
    this.customFeature[key] = value;
  }

  getContent() {
    return this.content || [];
  }
  
  /**
   * 重置或替换content, 传入的是数组整个替换，对象替换单个
   * @param {Object | Array} childWidget 
   */
  setContent(childWidget) {
    let isArray = Array.isArray(childWidget);
    if (isArray) {
      this.content = childWidget;
    } else {
      let index = this.content.findIndex(
        item => item.id === childWidget.id
      )
      this.content.splice(index, 1, childWidget);
    }
  }
}