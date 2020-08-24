<template>
  <div>
    <div class="custom-loader"></div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    size: {
      default: 30
    },
    baseColor: {
      default: "#9a9a9a"
    },
    spinColor: {
      default: "#f3f3f3"
    }
  },
  mounted: function() {
    const loader = this.$el.getElementsByClassName("custom-loader")[0];
    // set loader style
    loader.style.width = `${parseInt(this.size)}px`;
    loader.style.height = `${parseInt(this.size)}px`;
    loader.style.border = `${(this.size * 2) / 15}px solid ${this.baseColor}`;
    loader.style.borderTop = `${(this.size * 2) / 15}px solid ${
      this.spinColor
    }`;
  }
};
</script>

<style lang="scss" scoped>
div.custom-loader {
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>