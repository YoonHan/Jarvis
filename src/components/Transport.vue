<template>
  <div class="transport-box">
    <p class="title">교통정보</p>
    {{ transportData }}
  </div>
</template>

<script>
export default {
  name: "Transport",
  props: {
    transportData: null
  },
  watch: {
    transportData: function(c) {
      console.log(c);
    }
  }
};
</script>

<style lang="scss" scoped>
.transport-box {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin-top: 5px;
  padding: 15px;

  .title {
    font-size: 1.3em;
    margin: 0;
    text-align: left;
  }
}
</style>