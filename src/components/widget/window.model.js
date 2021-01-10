import { Widget } from './widget.model';

export class Windows extends Widget {
  name = '容器';
  type = 'windows';
  constructor(config) {
    super(config);
    this.templateId = config.templateId;
    this.position = config.position || {
      top: 0,
      left: 0,
    };
    this.customFeature = Object.assign({
      wBase: 200,
      hBase: 120,
      zoom: {
        wRadio: 1,
        yRadio: 1
      },
      col: 1,
      row: 1
    }, config.customFeature)
  }
}