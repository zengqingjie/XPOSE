import { Widget } from './widget.model';

export class Display extends Widget {
  type = 'display';
  constructor(config) {
    super(config);
    this.name = config.name || '显示器';
    this.displayId = config.displayId;
    this.customFeature = Object.assign({
      wBase: 200,
      hBase: 120
    }, config.customFeature)
  }
}