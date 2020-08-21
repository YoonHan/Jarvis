<template>
  <div class="snack-bar">
    <p class="content">{{ content }}</p>
  </div>
</template>

<script>
export default {
  namd: "SnackBar",
  props: {
    success: {
      default: "true"
    },
    color: {
      default: "#ffffff"
    },
    fontSize: {
      default: "1em"
    },
    content: {
      default: "Hello!"
    }
  },
  mounted: function() {
    const snackBarElem = this.$el;
    const contentElem = snackBarElem.getElementsByClassName("content")[0];

    if (this.success == "true") {
      snackBarElem.style.backgroundColor = "rgb(76, 175, 80)";
    } else {
      snackBarElem.style.backgroundColor = "rgb(255, 82, 82)";
    }
    snackBarElem.style.fontSize = this.fontSize;
    contentElem.innerText = this.content;
  }
};
</script>

<style lang="scss" scoped>
div.snack-bar {
  position: fixed;
  top: 20px;
  left: 50%;
  display: flex;
  transform: translate(-50%, 0);
  border-radius: 5px;
  padding: 10px;
  white-space: nowrap;

  p.content {
    margin: 0;
    flex-grow: 1;
  }
}
</style>