import { Widget } from './widget.model';

export class Windows extends Widget {
  name = '';
  type = 'windows';
  constructor(config) {
    super(config);
    this.templateId = config.templateId;
    this.containerId = config.containerId;
    this.signalList = [];
    this.sizeW = config.sizeW;
    this.sizeH = config.sizeH;
    this.position = config.position || {
      top: 0,
      left: 0,
    };
    this.positionZoom = 1;
    this.customFeature = Object.assign({
      wBase: 192,
      hBase: 108,
      zoom: {
        xRadio: 1,
        yRadio: 1
      },
      col: 1,
      row: 1
    }, config.customFeature)
  }
}