<template>
  <div class="clip-wrap">
    <div v-for="(item, index) in clipList" :key="index">
      <canvas width="192" height="108" :class="'can'+index"></canvas>
    </div>
    <canvas id="canvas" width="100" height="100" style="background: red"></canvas>
    <img :src="img" alt="" id="img">
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      clipList: [],
      img: 'http://192.168.0.122:4080/?action=stream',
      timer: null
    }
  },
  created() {
    for (let row = 0; row < 4; row ++) {
      for (let col = 0; col < 4; col ++) {
        this.clipList.push(
          {
            left: col * ( 1920 / 4),
            top: row * (1080 / 4),
          }
        );
      }
    }
  },
  mounted() {
    this.init();
    // this.timer = se
    // tInterval(() => {
    //   this.init();
    // }, 1000 / 60);
  },
  methods: {
    init() {
      let img = new Image();
      img.src = 'http://192.168.0.122:4080/?action=stream';
      const positionInfo = this.clipList;
      let canvasBoxs = [];
      $('.clip-wrap div').each(function() {
        canvasBoxs.push($(this).children()[0]);
      })
      
      img.onload = () => {
        canvasBoxs.forEach((canvas, index) => {
          const context = canvas.getContext('2d');
          window.setInterval(() => {
          context.drawImage(img, positionInfo[index].left, positionInfo[index].top, 480, 270, 0, 0, 192, 108);
        }, 1000 / 60)
        })
      }

      // if(img.complete) {
      //   canvasBoxs.forEach((canvas, index) => {
      //     const context = canvas.getContext('2d');
      //     setInterval(() => {
      //       console.log(11);
      //       context.drawImage(img, positionInfo[index].left, positionInfo[index].top, 480, 270, 0, 0, 192, 108);
      //     }, 1000 / 60)
      //   })
      // } else {
      //   img.onload = () => {
      //     canvasBoxs.forEach((canvas, index) => {
      //       const context = canvas.getContext('2d');
      //      setInterval(() => {
      //       console.log(22);
      //       context.drawImage(img, positionInfo[index].left, positionInfo[index].top, 480, 270, 0, 0, 192, 108);
      //     }, 1000 / 60)
      //     })
      //   }
      // }
    }
  }
}
</script>

<style scoped lang='less'>
  .clip-wrap {
    width: 768px;
    height: 432px;
    display: flex;
    flex-wrap: wrap;
    > div {
      position: relative;
      width: 192px;
      height: 108px;
      canvas {
        background: skyblue;
        border: 1px solid red;
        box-sizing: border-box;
      }
    }
  }
</style>