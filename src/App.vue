<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
// Custom SCSS variables for dark theme
$body-bg: #121212;
$body-color: #f8f9fa;
$theme-colors: (
  "primary": #375a7f,
  "secondary": #444444,
  "success": #00bc8c,
  "info": #3498DB,
  "warning": #F39C12,
  "danger": #E74C3C,
  "light": #303030,
  "dark": #222222
);

@import 'bootstrap/scss/bootstrap';

// Apply dark theme global styles
body {
  margin: 0;
  padding: 0;
  font-family: $font-family-sans-serif;
  background-color: $body-bg;
  color: $body-color;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style> 