<template>
  <div class="clip-wrap">
    <div v-for="(item, index) in clipList" :key="index" :style="item">{{item}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clipList: []
    }
  },
  mounted() {
    for (let row = 0; row < 3; row ++) {
      for (let col = 0; col <8; col ++) {
        // const bgPosition = `(-${col * 240}px, -${row * 360}px)`
        this.clipList.push(
          {
            backgroundPositionX: -col * 240 + 'px' ,
            backgroundPositionY: -row * 360 + 'px'
          }
        );
        //this.clipList.push({backgroundPositionX: col * 240 + 'px', backgroundPositionY: row * 360 + 'px'});
        console.log( this.clipList);
      }
    }
  }
}
</script>

<style scoped lang='less'>
  .clip-wrap {
    width: 1920px;
    height: 1080px;
    display: flex;
    flex-wrap: wrap;
    > div {
      // display: none;
      width: 240px;
      height: 360px;
      background: url('../assets/try.jpg') no-repeat;
      background-size: 1920px 1080px;
    }
    > div:first-child {
      // display: block;
    }
  }
</style>