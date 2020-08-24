<template>
  <div class="snack-bar">
    <p class="content" :class="{ success: isSuccess }">
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  namd: "SnackBar",
  props: {
    isSuccess: {
      default: true,
    },
    color: {
      default: "#ffffff",
    },
  },
};
</script>

<style lang="scss" scoped>
div.snack-bar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  white-space: nowrap;

  p.content {
    margin: 0;
    padding: 10px;
    border-radius: 5px;
    flex-grow: 1;
    background-color: rgb(255, 82, 82);

    &.success {
      background-color: rgb(76, 175, 80);
    }
  }
}
</style>
