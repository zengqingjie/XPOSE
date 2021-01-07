<template>
  <div class="displayer-view" :style="{width:dMsg.baseW+'px', height:dMsg.baseH+'px'}" :parentId="parentId">
    <div>显示器{{dMsg.id}}</div>
    <span class="delete-displayer" @click="deleteDisplayer(dMsg.id, parentId)">x</span>
  </div>
</template>

<script>
export default {
  props: ['dMsg', 'parentId'],
  data() {
    return {

    }
  },
  components: {},
  methods: {
    deleteDisplayer(dId, cId) {
      const data = {
        dId,
        cId
      }
      this.$root.bus.$emit('deleteDisplayer', data);
    }
  }
}
</script>

<style scoped lang='less'>
  .displayer-view {
    position: relative;
    padding: 12px;
    background: rgb(120,190,252);
    border: 1px solid #333;
    box-sizing: border-box;
    font-size: 60%;
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
</style>