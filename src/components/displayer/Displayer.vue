<template>
  <div class="displayer-view" :parentId="dMsg.parentId" v-if="dMsg">
    <div>显示器{{ dMsg.id }}</div>
    <div>{{dMsg.name}}</div>
    <span
      class="delete-displayer"
      @click="deleteDisplayer(dMsg.id, dMsg.parentId)"
      >x</span
    >
  </div>
</template>

<script>
export default {
  props: {
    dMsg: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    // 删除单个显示器
    deleteDisplayer(dId, cId) {
      const data = {
        dId,
        cId,
      };
      this.$root.bus.$emit("deleteDisplayer", data);
    },
    // 选中单个显示器
    clickDisplayer(dId, cId) {
      const data = { dId, cId };
      this.$root.bus.$emit("clickDisplayer", data);
    },
  },
};
</script>

<style scoped lang='less'>
.displayer-view {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px;
  background: rgb(120, 190, 252);
  box-sizing: border-box;
  font-size: 12px;
  .delete-displayer {
    display: none;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    color: #333;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
}
.light {
  border: 3px solid rgb(0, 252, 255);
}
</style>