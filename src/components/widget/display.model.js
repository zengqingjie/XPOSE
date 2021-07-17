import { Widget } from './widget.model';

export class Display extends Widget {
  type = 'display';
  constructor(config) {
    super(config);
    this.name = config.name || '显示器';
    this.containerId = config.containerId;
    this.sizeW = config.sizeW || null;
    this.sizeH = config.sizeH || null;
    this.outputTypeEnum = config.outputTypeEnum || null;
    this.displayId = config.displayId;
    this.position = config.position || null;
    this.signalNum = config.signalNum || 2;
    this.realPos = config.realPos || null;
    this.separation = config.separation || null;
    this.intersectList = config.intersect || [];
    this.customFeature = Object.assign({
      wBase: 192,
      hBase: 108,
      zoom: {
        xRadio: 1,
        yRadio: 1
      },
      col: 1,
      row: 1,
      positionZoom: {
        wZoom: 0,
        hZoom: 0,
      }
    }, config.customFeature)
  }

  setPositionZoom(content) {
    let { left, top } = this.position;
    let { w, h } = content;
    Object.assign(this.customFeature.positionZoom, {
      wZoom: (left / w).toFixed(4),
      hZoom: (top / h).toFixed(4)
    })
  }

  resetPosition(content) {
    let { w, h } = content;
    let { wZoom, hZoom } = this.customFeature.positionZoom;
    Object.assign(this.position, {
      left: (w * wZoom).toFixed(4),
      top:(h * hZoom).toFixed(4)
    })
  }
}