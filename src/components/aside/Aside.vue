<template>
  <div class="aside-wrap">
    <img src="../../assets/xpose_icon.png" alt="" />
    <div
      class="menus-item"
      v-for="(item, index) in asideMenuList"
      :key="item.id"
      :class="item.id == '006' ? 'positon-bottom' : ''"
      @click="muneSelect(item, index)"
    >
      <i
        class="iconfont"
        :class="[
          item.className,
          item.id == '006' ? 'positon-bottom' : '',
          getDevides > 0 ? 'whiteText' : '',
          index == menuIndex ? 'show' : '',
        ]"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asideMenuList: [
        { id: "001", title: "拓扑图", className: "icontree" },
        { id: "002", title: "", className: "iconsearch" },
        { id: "003", title: "显示管理", className: "icondevice" },
        { id: "004", title: "图层管理", className: "iconedit" },
        { id: "005", title: "场景管理", className: "iconmenu" },
        { id: "006", title: "设置", className: "iconsetting" },
      ],
      menuIndex: 0,
    };
  },
  computed: {
    // 是否有可操作设备
    getDevides() {
      return this.$store.state.containers.length;
    },
  },
  mounted() {
    this.$root.bus.$emit("titleInfo", this.asideMenuList[0]);
  },
  methods: {
    muneSelect(item, index) {
      if (this.getDevides == 0) return;
      if (index == this.menuIndex) return;
      this.menuIndex = index;
      this.$root.bus.$emit("titleInfo", item);
    },
  },
};
</script>

<style scoped lang='less'>
.aside-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
  min-height: 100vh;
  padding-top: 32px;
  background: rgb(22, 28, 44);
  box-sizing: border-box;
  position: relative;
  img {
    display: block;
    width: 28px;
    height: 28px;
  }
  .menus-item {
    width: 64px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    cursor: pointer;
    .iconfont {
      color: #666;
      font-size: 28px;
    }
    .whiteText {
      color: #fff;
    }
    .show {
      color: rgb(26, 188, 156);
    }
  }
  .positon-bottom {
    position: absolute;
    bottom: 10px;
  }
}
</style>