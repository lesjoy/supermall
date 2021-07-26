<template>
  <div id="home">
    <!-- 导航栏 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabConTrolShow"
      class="tab-control"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullLoadUp="loadMore"
    >
      <!-- 轮播图 -->
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <!-- 推荐栏 -->
      <recommend-view :recommends="recommends"></recommend-view>
      <!-- 本周流行 -->
      <feature-view></feature-view>
      <!-- tab栏控制模块 -->
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <!-- 首页商品展示模块 -->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 返回顶部按钮 -->
    <back-top @click.native="backClick" v-show="isShow"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView.vue";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { itemListenerMixin, backTopMixin } from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      // 此时result是一个空对象
      // result: null,
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabConTrolShow: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  // destroyed() {
  //   console.log("home destroyed");
  // },
  activated() {
    // console.log("activated");
    this.$refs.scroll.scroll.refresh();
    this.$refs.scroll.scroll.scrollTo(0, this.saveY, 0);
  },
  deactivated() {
    // console.log("deactivated");
    //1.保存Y值
    this.saveY = this.$refs.scroll.scroll.y;
    // 2.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },

  // 组件创造完之后就发送网络请求，所以需要一个生命周期函数created()
  created() {
    // 请求多个数据
    this.getHomeMultidata();
    // 请求首页商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {},
  methods: {
    //刷新次数太多的优化，防抖动

    //事件监听相关
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // 点击返回顶部按钮返回顶部
    backClick() {
      this.$refs.scroll.scroll.scrollTo(0, 0);
    },
    //返回顶部按钮，隐藏与显示操作
    contentScroll(position) {
      this.isShow = -position.y > 1000;
      //判断tabControl吸住效果
      if (-position.y > this.tabOffsetTop) {
        this.isTabConTrolShow = true;
      } else {
        this.isTabConTrolShow = false;
      }
    },
    //上拉加载更多
    loadMore() {
      // console.log("上拉加载更多");
      this.getHomeGoods(this.currentType);
      // 解决滚动时出现滚动不动的问题
      // bug产生 可滚动的区域问题 better-scroll创建的时候会先看wrapper的高度，然后计算内容的高度，然后计算出可滚动的区域，但是我们在应用的时候，给的是goodsitem，但这个时候图片是还没有加载出来的，因为图片是异步加载的，这个时候计算goodsitem的时候是不包含图片的高度，因此图片异步加载过来的时候，高度发生变化，所以会出现滑动的时候划不动，因此需要在图片加载的时候，调用refresh()函数
      this.$refs.scroll.scroll.refresh();
    },
    //监听轮播图图片加载完成事件
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    // 网络请求方法
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        // 因为存在作用域的关系，res这个对象在getHomeMultidata()函数执行完毕后会被释放，所有需要外部创建一个data空间保存它，由于箭头函数this指向的是定义时的this对象，而不是执行时的this对象，如果不存在，会向上查找。
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // 这里的page是为了下面调用getHomeGoods传参的时候，传第一页
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // 请求过来的数据保存在res.data.list中，一共有30条数据，因为当getHomeGoods()函数调用完成之后res里面的数据会被直接释放，因此需要将获取过来的数据保存到data里面的goods对象里，这里使用的是push方法，push完一组之后，需要将其page的值增加一
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        //完成上拉加载更多
        this.$refs.scroll.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  /* vh是视口高度 */
  height: 100vh;
  position: relative;
}
.home-nav {
  /* position: fixed; */
  background-color: var(--color-tint);
  color: #fff;
  /* width: 100%;
  height: 44px;
  left: 0;
  right: 0; */
  /* top: 0;
  z-index: 100; */
  /* 被注释掉的属性是在原生的滚动中使用的，因为原生的滚动是网页在滚动，如果不使用fixed属性 则导航栏会随着页面一起滚动，但现在我们使用的是better-Scroll,是设置了滚动区域，因此不需要这个属性 */
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  z-index: 9;
}
</style>
