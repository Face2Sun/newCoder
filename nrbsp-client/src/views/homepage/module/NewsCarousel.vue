<template>
  <a-carousel :afterChange="onChange" autoplay>
    <div>
      <h3>永清局⻓⾛访慰问阳光扶贫对象</h3>
    </div>
    <div>
      <h3>永清局⻓⾛访慰问阳光扶贫对象</h3>
    </div>
    <div>
      <h3>永清局⻓⾛访慰问阳光扶贫对象</h3>
    </div>
    <div>
      <h3>4</h3>
    </div>
  </a-carousel>
</template>
<script>
import { Carousel } from 'ant-design-vue'

export default {
  components: { ACarousel: Carousel },
  methods: {
    onChange (a, b, c) {
      // console.log(a, b, c)
    }
  }
}
</script>
<style scoped>
.ant-carousel >>> .slick-slide {
  height: 315px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .slick-slide h3 {
  height: 30px;
  margin-top: 285px;
  padding-left: 20px;
  background-color: rgb(109, 105, 105);
  color: #fff;
}
</style>
