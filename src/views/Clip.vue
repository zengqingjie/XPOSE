<template>
  <div class="clip-wrap">
    <div v-for="(item, index) in clipList" :key="index">
      <canvas width="100%" height="100%" :class="'can'+index"></canvas>
    </div>
    <canvas id="canvas" width="300" height="300"></canvas>
    <img :src="img" alt="" id="img">
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      clipList: [],
      img: require('../assets/111.jpg')
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
    
    // let dataList = this.clipList;
    // dataList.map((item, index) => item.id == 'canvas' + index);
    // this.clipList = dataList;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let img = new Image();
      img.src = require('../assets/111.jpg');
      const positionInfo = this.clipList;
      let canvasBoxs = [];
      $('.clip-wrap div').each(function() {
        canvasBoxs.push($(this).children()[0]);
      })
      img.onload = () => {
        canvasBoxs.forEach((canvas, index) => {
          console.log(canvas);
          const context = canvas.getContext('2d');
          context.drawImage(img, positionInfo[0].left, positionInfo[0].top, 480, 270);
        })
      }

      // let img = new Image();
      // img.src = require('../assets/111.jpg');
      // let canvas = document.createElement("canvas");
      // canvas.width = '100%';
      // canvas.height = '100%';
      // console.log(canvas);
      // let context = canvas.getContext("2d");
      // img.onload = () => {
      //   context.drawImage(img, 10, 1);
      // }

      // let orig_src = new Image();
      // orig_src.src = require('../assets/111.jpg');
      // let crop_canvas;
      // console.log(document);
      // if(document) {
      //   crop_canvas = document.createElement('canvas');
      //   crop_canvas.width = 480;
      //   crop_canvas.height = 270;
  
      //   crop_canvas.getContext('2d').drawImage(orig_src, 0, 0, 1920, 1080, 0, 0, 480, 270);
  
      //   //window.open(crop_canvas.toDataURL("image/png")); 
      //   //Noted by iefreer 2019.03, above line of code doesn't work now as Chrome has removed top frame navigation, replaced with codes below instead.
      //   var iframe = "<iframe width='100%' height='100%' src='" + crop_canvas.toDataURL("image/png") + "'></iframe>"
      //   var x = window.open();
      //   x.document.open();
      //   x.document.write(iframe);
      //   x.document.close();
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
      border: 1px solid red;
      box-sizing: border-box;
      canvas {
        width: 100%;
        height: 100%;
        background: skyblue;
      }
    }
  }
</style>