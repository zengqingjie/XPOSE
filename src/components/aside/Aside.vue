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
      <img
        class="iconfont"
        :class="[
          item.className,
          item.id == '006' ? 'positon-bottom' : '',
          getDevides > 0 ? 'whiteText' : '',
        ]"
        :src="index == menuIndex ? item.show_icon : item.usable_icon"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asideMenuList: [
        {
          id: "001",
          title: "拓扑图",
          className: "icontree",
          show_icon: require('../../assets/aside_mune/aside_mune_show_1.png'),
          usable_icon: require('../../assets/aside_mune/aside_mune_usable_1.png')
        },
        {
          id: "002",
          title: "",
          className: "iconsearch",
          show_icon: require('../../assets/aside_mune/aside_mune_show_2.png'),
          usable_icon: require('../../assets/aside_mune/aside_mune_usable_2.png')
        },
        {
          id: "003",
          title: "显示管理", 
          className: "icondevice",
          show_icon: require('../../assets/aside_mune/aside_mune_show_3.png'),
          usable_icon: require('../../assets/aside_mune/aside_mune_usable_3.png')
        },
        {
          id: "004",
          title: "图层管理", 
          className: "iconedit",
          show_icon: require('../../assets/aside_mune/aside_mune_show_4.png'),
          usable_icon: require('../../assets/aside_mune/aside_mune_usable_4.png')
        },
        {
          id: "005",
          title: "场景管理", 
          className: "iconmenu",
          show_icon: require('../../assets/aside_mune/aside_mune_show_5.png'),
          usable_icon: require('../../assets/aside_mune/aside_mune_usable_5.png')
        },
        {
          id: "006",
          title: "系统设置", 
          className: "iconsetting",
          show_icon: require('../../assets/aside_mune/aside_set_show.png'),
          usable_icon: require('../../assets/aside_mune/aside_set_usable.png')
        },
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