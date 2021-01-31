import $ from 'jquery';

export const customActive = {
  Draggable(target, opt, callBack) {
    $(target).draggable({
      helper: "clone", //拖拽时为原dom按钮的clone，而不是直接拖拽原dom按钮
      revert: "invalid", //当未拖入到指定目标区域时，回到原位置
      scroll: false,
      ...opt,
      start: function (event, ui) {
        callBack && callBack.start && callBack.start(event, ui);
      },
      drag: function (event, ui) {
        callBack && callBack.drag && callBack.drag(event, ui);
      },
      stop: function (event, ui) {
        callBack && callBack.stop && callBack.stop(event, ui);
      }
    });
  },

  Droppable(target, opt, callBack) {
    $(target).droppable({
      ...opt,
      activate: function (event, ui) {
        callBack && callBack.activate && callBack.activate(event, ui);
      },
      deactivate: function (event, ui) {
        callBack && callBack.deactivate && callBack.deactivate(event, ui);
      },
      out: function (event, ui) {
        callBack && callBack.out && callBack.out(event, ui);
      },
      over: function (event, ui) {
        callBack && callBack.over && callBack.over(event, ui);
      },
      drop: function (event, ui) {
        callBack && callBack.drop && callBack.drop(event, ui);
      }
    });
  },

  Resizable(target, opt, callBack) {
    $(target).droppable({
      ...opt,
      create: function (event, ui) {
        callBack && callBack.create && callBack.create(event, ui);
      },
      resize: function (event, ui) {
        callBack && callBack.resize && callBack.resize(event, ui);
      },
      start: function (event, ui) {
        callBack && callBack.start && callBack.start(event, ui);
      },
      stop: function (event, ui) {
        callBack && callBack.stop && callBack.stop(event, ui);
      },
    });
  }
}