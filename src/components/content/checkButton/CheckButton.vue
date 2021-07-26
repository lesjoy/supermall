<template>
  <div class="check-button" :class="{ check: isChecked }">
    <img src="~assets/img/cart/tick.svg" alt="" />
  </div>
</template>

<script>
export default {
  name: "CheckButton",
  props: {
    isChecked: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {},
};
</script>

<style scoped>
.check-button {
  /* background-color: red; */
  border-radius: 50%;
  border: 2px solid #999;
}
.check {
  background-color: red;
  /* border-color: red; */
  border: 2px solid red;
}
</style>