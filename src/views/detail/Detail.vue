<template>
  <div id="detail">
    <!-- 详情页导航栏 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav">
    </detail-nav-bar>
    <!-- 详情页轮播图 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages"></detail-swiper>
      <!-- 详情页商品信息 -->
      <detail-base-info :goods="goods"></detail-base-info>
      <!-- 商家信息展示 -->
      <detail-shop-info :shop="shop"></detail-shop-info>
      <!-- 商品详情展示 -->
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>

      <!-- 参数模块 -->
      <detail-param-info
        :param-info="paramInfo"
        ref="params"
      ></detail-param-info>
      <!-- 评论模块 -->
      <detail-comment-info
        :comment-info="commentInfo"
        ref="commentInfo"
      ></detail-comment-info>

      <!-- 推荐模块 -->
      <goods-list :goods="recommends" ref="recommends"></goods-list>
    </scroll>

    <!-- 底部导航栏 -->
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <!-- 返回顶部按钮是用混入实现的 -->
    <back-top @click.native="backClick" v-show="isShow"></back-top>
    <!-- 加入购物车成功的弹窗 -->
    <!-- <toast></toast> -->
  </div>
</template>

<script>
//导入组件
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import { itemListenerMixin, backTopMixin } from "common/mixin.js";

//请求数据
import {
  getDetail,
  Goods,
  Shop,
  GoodsParams,
  getRecommend,
} from "network/detail";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    // Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],

  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      // index: 0,
      currentIndex: 0,
      // //是否显示添加商品成功后的弹窗
      // show: false,
      // //添加到购物车成功后的弹窗信息
      // message: "",
    };
  },
  created() {
    //   1.保存传入的iid
    // console.log(this.$route.params.iid);
    this.iid = this.$route.params.iid;
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;
      //   1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;
      //   2.从Goods类里面获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      //   3.创建店铺信息
      this.shop = new Shop(data.shopInfo);
      //  4显示商品详情页
      this.detailInfo = data.detailInfo;
      //5.参数信息
      this.paramInfo = new GoodsParams(
        data.itemParams.info,
        data.itemParams.rule
      );
      //   6.获取评论信息 有些商品可能没有评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      // this.$nextTick(() => {
      // 这里是根据最新的数据，对应的DOM是已经被渲染出来，但是图片依然没有加载完
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.commentInfo.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });
    // 请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });
  },
  mounted() {
    // mixins: [itemListenerMixin];
  },
  updated() {},
  methods: {
    imageLoad() {
      this.$refs.scroll.scroll.refresh();
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.commentInfo.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    },
    //根据index滚动到对应的主题
    titleClick(index) {
      //这里拿到相应模块距离顶部的距离
      // this.themeTopYs = [];
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.commentInfo.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      // console.log(this.themeTopYs);
      // console.log(index);
      // this.index = index;
      this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    //监听页面滚动事件，实现滚动到某个位置时，会跳转到响应的主题
    contentScroll(position) {
      const positionY = -position.y;
      // if (0 <= positionY && positionY < this.themeTopYs[1]) {
      //   this.currentIndex = 0;
      // } else if (
      //   this.themeTopYs[1] <= positionY &&
      //   positionY < this.themeTopYs[2]
      // ) {
      //   this.currentIndex = 1;
      // } else if (
      //   this.themeTopYs[2] <= positionY &&
      //   positionY < this.themeTopYs[3]
      // ) {
      //   this.currentIndex = 2;
      // } else {
      //   this.currentIndex = 3;
      // }
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = i;
        }
      }
      // 是否显示回到顶部
      this.isShow = -position.y > 1000;
      // console.log(position);
      // this.$refs.nav.currentIndex = this.currentIndex;
    },
    // 点击按钮，将商品添加到购物车
    addToCart() {
      //获取购物车需要展示的数据
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // console.log(product);
      //商品添加到购物车中
      this.$store.dispatch("addCart", product).then((res) => {
        // console.log(res);
        // this.message = res;
        // this.show = true;
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = "";
        // }, 1500);
        this.$toast.show(res, 1500);
      });
    },
  },
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
</script>

<style scoped >
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 49px);
}
.detail-nav {
  position: relative;
  z-index: 10;
  background-color: #fff;
}
.active {
  color: var(--color-high-text);
}
</style>