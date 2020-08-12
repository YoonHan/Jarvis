<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "./common/common.scss";

html,
body {
  width: 100vw;
  height: 100vh;
}

body {
  margin: 0;
  padding: 15px;
  box-sizing: border-box;
  background: rgb(238, 174, 202);
  background: radial-gradient(
    circle at top right,
    rgba(238, 174, 202, 1) 0%,
    rgba(148, 187, 233, 1) 100%
  );
  font-family: "Do Hyeon", sans-serif !important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow: auto;
}
</style>
