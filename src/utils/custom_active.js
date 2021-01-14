import $ from 'jquery';

export const customActive = {
  Draggable(target, opt, callBack) {
    $(target).draggable({
      helper: "clone", //拖拽时为原dom按钮的clone，而不是直接拖拽原dom按钮
      revert: "invalid", //当未拖入到指定目标区域时，回到原位置
      scroll: false,
      ...opt,
      start: function (event, ui) {
        callBack && callBack.start && callBack.start.call(this, event, ui);
      },
      drag: function (event, ui) {
        callBack && callBack.drag && callBack.drag.call(this, event, ui);
      },
      stop: function (event, ui) {
        callBack && callBack.stop && callBack.stop.call(this, event, ui);
      }
    });
  },

  Droppable(target, opt, callBack) {
    $(target).droppable({
      ...opt,
      activate: function (event, ui) {
        callBack && callBack.activate && callBack.activate.call(this, event, ui);
      },
      deactivate: function (event, ui) {
        callBack && callBack.deactivate && callBack.deactivate.call(this, event, ui);
      },
      out: function (event, ui) {
        callBack && callBack.out && callBack.out.call(this, event, ui);
      },
      over: function (event, ui) {
        callBack && callBack.over && callBack.over.call(this, event, ui);
      },
      drop: function (event, ui) {
        callBack && callBack.drop && callBack.drop.call(this, event, ui);
      }
    });
  },

  Resizable(target, opt, callBack) {
    $(target).droppable({
      ...opt,
      create: function (event, ui) {
        callBack && callBack.create && callBack.create.call(this, event, ui);
      },
      resize: function (event, ui) {
        callBack && callBack.resize && callBack.resize.call(this, event, ui);
      },
      start: function (event, ui) {
        callBack && callBack.start && callBack.start.call(this, event, ui);
      },
      stop: function (event, ui) {
        callBack && callBack.stop && callBack.stop.call(this, event, ui);
      },
    });
  }
}