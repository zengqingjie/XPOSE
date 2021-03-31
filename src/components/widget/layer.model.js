import { Widget } from './widget.model';

export class Signal extends Widget {
  type = 'signal';
  constructor(config) {
    super(config);
    this.name = config.name || '信号';
    this.signal = config.signal;
    this.position = config.position || null;
    this.signalIndex = config.signalIndex || '',
    this.signalId = config.signalId,
    this.bColor = config.bColor || '',
    this.layerLock = config.layerLock || false,
    this.full = config.full || false,
    this.aoi = config.aoi || null;
    this.realPos = config.realPos || null;
    this.sizeW = config.sizeW || null;
    this.sizeH = config.sizeH || null;
    this.inputPort = config.inputPort;
    this.customFeature = Object.assign({
      wBase: 200,
      hBase: 120,
      zoom: {
        xRadio: 1,
        yRadio: 1
      },
      col: 1,
      row: 1,
      positionZoom: {
        wZoom: 0,
        hZoom: 0,
      },
      resize: {
        width: 200,
        height: 120
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
      top: (h * hZoom).toFixed(4)
    })
  }
}