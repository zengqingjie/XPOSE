import { Widget } from './widget.model';

export class Display extends Widget {
  type = 'display';
  constructor(config) {
    super(config);
    this.name = config.name || '显示器';
    this.displayId = config.displayId;
    this.position = config.position || null;
    this.customFeature = Object.assign({
      wBase: 200,
      hBase: 120,
      zoom: {
        xRadio: 1,
        yRadio: 1
      },
      col: 1,
      row: 1
    }, config.customFeature)
  }
}