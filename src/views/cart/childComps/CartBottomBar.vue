<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        id="all"
        :is-checked="isSellectAll"
        class="check-all"
        @click.native="ckeckClick"
      ></check-button>
      <label for="all">全选</label>
    </div>
    <div class="total-price">合计：{{ totalPrice }}</div>
    <div class="calculate">去结算({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    totalPrice() {
      return (
        "￥" +
        this.$store.state.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((prevalue, item) => {
            return (prevalue += item.price * item.count);
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.$store.state.cartList.filter((item) => item.checked).length;
    },
    isSellectAll() {
      // 全选按钮的状态
      //   return !this.$store.state.cartList.filter((item) => !item.checked).length;
      if (this.$store.state.cartList.length == 0) {
        return false;
      } else {
        //   return !this.$store.state.cartList.filter((item) => !item.checked).length;
        return !this.$store.state.cartList.find((item) => !item.checked);
      }
    },
  },
  methods: {
    ckeckClick() {
      //全部选中的情况
      if (this.isSellectAll) {
        this.$store.state.cartList.forEach((item) => {
          item.checked = false;
        });
      } else {
        //部分或全部不选中
        this.$store.state.cartList.forEach((item) => {
          item.checked = true;
        });
      }
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  position: relative;
  background-color: red;
  background-color: #eee;
  display: flex;
}
.check-content {
  display: flex;
  height: 40px;
  align-items: center;
  margin-left: 10px;
}
.check-all {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.total-price {
  /* align-items: center; */
  height: 40px;
  line-height: 40px;
  margin-left: 30px;
}
.calculate {
  width: 100px;
  height: 40px;
  position: absolute;
  right: 0;
  line-height: 40px;
  background-color: orange;
}
</style>