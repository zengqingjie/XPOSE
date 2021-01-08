<template>
  <div 
      class="displayer-view" 
      :style="{width:dMsg.baseW * zooms.xRadio +'px', height:dMsg.baseH * zooms.yRadio +'px'}" 
      :parentId="parentId"
    >
    <div>显示器{{dMsg.id}}</div>
    <span class="delete-displayer" @click="deleteDisplayer(dMsg.id, parentId)">x</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    dMsg: {
      type: Object,
    },
    parentId: {
      type: String | Number,
      default: -1
    },
    zooms: {
      type: Object,
      default() {
        return {
          xRadio: 1,
          yRadio: 1
        }
      }
    }
  },
  data() {
    return {

    }
  },
  watch: {
    zooms(n, o) {
      console.log(n);
    }
  },
  computed: {
    ...mapState([
      'editContainer'
    ])
  },
  methods: {
    deleteDisplayer(dId, cId) {
      console.log(this.zooms)
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