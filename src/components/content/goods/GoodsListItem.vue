<template>
  <div class="goodsitem" @click="itemClick">
    <img v-lazy="showImage" alt="" @load="imageLoad" />
    <div class="goodsInfo">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    showImage() {
      return (
        this.goodsItem.image ||
        this.goodsItem.show.img ||
        this.goodsItem.show.img
      );
    },
  },
  methods: {
    // 可以根据路由判断跳转到的是哪个页面，然后使哪个页面监听事件即可
    imageLoad() {
      this.$bus.$emit("itemImageLoad");
    },
    // 实现点击图片跳转到详情页的路由
    itemClick() {
      this.$router.push("/detail/" + this.goodsItem.iid);
    },
  },
};
</script>

<style scoped>
.goodsitem {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}
.goodsitem img {
  width: 100%;
  border-radius: 8px;
}
.goodsInfo {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}
.goodsInfo p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}
.goodsInfo .price {
  color: var(--color-high-text);
  margin-right: 20px;
}
.goodsInfo .collect {
  position: relative;
}
.goodsInfo .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>